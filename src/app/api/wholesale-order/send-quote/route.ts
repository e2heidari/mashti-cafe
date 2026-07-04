import { NextRequest, NextResponse } from "next/server";

import { buildCustomerQuoteEmail } from "@/lib/wholesale/emails";
import {
  calculateFinalizedTotal,
  isValidFinalizedItems,
  normalizeFinalizedItems,
} from "@/lib/wholesale/orders";
import type { WholesaleOrderCustomer } from "@/lib/wholesale/types";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

const BLOCKED_SEND_STATUSES = new Set([
  "quote_sent",
  "sending_quote",
  "cancelled",
]);

type WholesaleOrderDocument = {
  _id: string;
  _rev: string;
  orderNumber: string;
  status: string;
  customer?: Partial<WholesaleOrderCustomer>;
  finalizedItems?: unknown;
  sellerNote?: string | null;
  finalEmailSentAt?: string | null;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const headerSecret = request.headers.get("x-wholesale-send-quote-secret")?.trim();
  const authHeader = request.headers.get("authorization")?.trim();
  const bearerSecret = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();

  return headerSecret === secret || bearerSecret === secret;
}

function isResendConfigured(apiKey: string | undefined): apiKey is string {
  return (
    typeof apiKey === "string" &&
    apiKey.length >= 10 &&
    apiKey !== "your_resend_api_key_here"
  );
}

function blockedStatusMessage(status: string): string {
  switch (status) {
    case "cancelled":
      return "Cannot send a quote for a cancelled order.";
    case "quote_sent":
      return "A quote has already been sent for this order.";
    case "sending_quote":
      return "A quote send is already in progress for this order.";
    default:
      return "This order cannot be sent in its current state.";
  }
}

async function patchOrderStatus(
  writeClient: ReturnType<typeof getSanityWriteClient>,
  orderId: string,
  status: string
): Promise<void> {
  await writeClient.patch(orderId).set({ status }).commit();
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.WHOLESALE_SEND_QUOTE_SECRET?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Send quote is not configured. Set WHOLESALE_SEND_QUOTE_SECRET.",
        },
        { status: 503 }
      );
    }

    if (!isAuthorized(request)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = body as { orderId?: unknown };

    if (!isNonEmptyString(orderId)) {
      return NextResponse.json(
        { success: false, message: "A valid orderId is required." },
        { status: 400 }
      );
    }

    const writeClient = getSanityWriteClient();
    const order = await writeClient.fetch<WholesaleOrderDocument | null>(
      `*[_type == "wholesaleOrder" && _id == $orderId][0]{
        _id,
        _rev,
        orderNumber,
        status,
        customer,
        finalizedItems,
        sellerNote,
        finalEmailSentAt
      }`,
      { orderId: orderId.trim() }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Wholesale order not found." },
        { status: 404 }
      );
    }

    if (BLOCKED_SEND_STATUSES.has(order.status)) {
      return NextResponse.json(
        {
          success: false,
          message: blockedStatusMessage(order.status),
        },
        { status: order.status === "sending_quote" ? 409 : 400 }
      );
    }

    if (order.finalEmailSentAt) {
      return NextResponse.json(
        {
          success: false,
          message: "A quote email has already been sent for this order.",
        },
        { status: 409 }
      );
    }

    const customerEmail = order.customer?.email?.trim();
    if (!customerEmail || !isValidEmail(customerEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer email is missing or invalid.",
        },
        { status: 400 }
      );
    }

    if (!isValidFinalizedItems(order.finalizedItems)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Finalized items are missing or invalid. Review quantity and unit price for each line.",
        },
        { status: 400 }
      );
    }

    const finalizedItems = normalizeFinalizedItems(order.finalizedItems);
    const finalizedTotalAmount = calculateFinalizedTotal(finalizedItems);

    const customer: WholesaleOrderCustomer = {
      businessName: order.customer?.businessName?.trim() || "",
      contactName: order.customer?.contactName?.trim() || "",
      email: customerEmail,
      phone: order.customer?.phone?.trim() || "",
      deliveryAddress: order.customer?.deliveryAddress?.trim() || "",
      message: order.customer?.message?.trim() || "",
    };

    if (
      !isNonEmptyString(customer.businessName) ||
      !isNonEmptyString(customer.contactName)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer business or contact name is missing.",
        },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!isResendConfigured(resendApiKey)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email service is not configured. Set a valid RESEND_API_KEY.",
        },
        { status: 503 }
      );
    }

    try {
      await writeClient
        .patch(order._id)
        .ifRevisionId(order._rev)
        .set({ status: "sending_quote" })
        .commit();
    } catch (lockError) {
      console.error("Failed to lock wholesale order for quote send:", lockError);
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not start quote send. Another send may be in progress or the order was updated.",
        },
        { status: 409 }
      );
    }

    const fromEmail =
      process.env.WHOLESALE_FROM_EMAIL ||
      "Mashti Wholesale <onboarding@resend.dev>";
    const subjectPrefix =
      process.env.WHOLESALE_SUBJECT_PREFIX || "Mashti Wholesale";

    const emailContent = buildCustomerQuoteEmail({
      orderNumber: order.orderNumber,
      customer,
      items: finalizedItems,
      finalizedTotalAmount,
      sellerNote: order.sellerNote,
      subjectPrefix,
    });

    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [customerEmail],
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    if (error) {
      console.error("Failed to send wholesale quote email:", error);

      try {
        await patchOrderStatus(writeClient, order._id, "quote_send_failed");
      } catch (statusError) {
        console.error(
          "Failed to mark wholesale order as quote_send_failed:",
          statusError
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send quote email. Order was not marked as sent.",
        },
        { status: 502 }
      );
    }

    const now = new Date().toISOString();

    try {
      await writeClient
        .patch(order._id)
        .set({
          finalizedItems,
          finalizedTotalAmount,
          finalizedAt: now,
          finalEmailSentAt: now,
          finalEmailSentTo: customerEmail,
          status: "quote_sent",
        })
        .commit();
    } catch (patchError) {
      console.error(
        "Quote email sent but failed to finalize wholesale order:",
        patchError
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "Quote email was sent, but the order could not be finalized. Status remains sending_quote — contact support before retrying.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      message: "Quote email sent successfully.",
      finalEmailSentTo: customerEmail,
    });
  } catch (error) {
    console.error("Wholesale send quote API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send wholesale quote." },
      { status: 500 }
    );
  }
}
