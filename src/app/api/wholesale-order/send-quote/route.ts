import { NextRequest, NextResponse } from "next/server";

import { buildAdminFinalOrderCopyEmail, buildCustomerQuoteEmail } from "@/lib/wholesale/emails";
import {
  calculateFinalizedTotal,
  isValidFinalizedItems,
  normalizeFinalizedItems,
  parseWholesaleAdminEmails,
} from "@/lib/wholesale/orders";
import type {
  WholesaleOrderCustomer,
  WholesaleOrderFinalizedLineItem,
} from "@/lib/wholesale/types";
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

type PreparedQuote = {
  customer: WholesaleOrderCustomer;
  customerEmail: string;
  finalizedItems: WholesaleOrderFinalizedLineItem[];
  finalizedTotalAmount: number;
};

type WriteClient = ReturnType<typeof getSanityWriteClient>;

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

const ORDER_PROJECTION = `{
  _id,
  _rev,
  orderNumber,
  status,
  customer,
  finalizedItems,
  sellerNote,
  finalEmailSentAt
}`;

async function fetchOrder(
  writeClient: WriteClient,
  orderId: string
): Promise<WholesaleOrderDocument | null> {
  return writeClient.fetch<WholesaleOrderDocument | null>(
    `*[_type == "wholesaleOrder" && _id == $orderId][0]${ORDER_PROJECTION}`,
    { orderId }
  );
}

function prepareQuote(order: WholesaleOrderDocument):
  | { ok: true; quote: PreparedQuote }
  | { ok: false; message: string } {
  const customerEmail = order.customer?.email?.trim();
  if (!customerEmail || !isValidEmail(customerEmail)) {
    return {
      ok: false,
      message: "Customer email is missing or invalid.",
    };
  }

  if (!isValidFinalizedItems(order.finalizedItems)) {
    return {
      ok: false,
      message:
        "Finalized items are missing or invalid. Review quantity and unit price for each line.",
    };
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
    return {
      ok: false,
      message: "Customer business or contact name is missing.",
    };
  }

  return {
    ok: true,
    quote: {
      customer,
      customerEmail,
      finalizedItems,
      finalizedTotalAmount,
    },
  };
}

async function patchOrderStatusAtRevision(
  writeClient: WriteClient,
  orderId: string,
  revision: string,
  status: string
): Promise<void> {
  await writeClient
    .patch(orderId)
    .ifRevisionId(revision)
    .set({ status })
    .commit();
}

function describeEmailSendError(sendError: unknown): string {
  if (!sendError) {
    return "unknown email provider error";
  }

  if (typeof sendError === "string") {
    return sendError;
  }

  if (sendError instanceof Error) {
    return `${sendError.name}: ${sendError.message}`;
  }

  if (typeof sendError === "object") {
    const candidate = sendError as {
      message?: unknown;
      name?: unknown;
      statusCode?: unknown;
    };
    const parts = [
      typeof candidate.name === "string" ? candidate.name : null,
      typeof candidate.message === "string" ? candidate.message : null,
      typeof candidate.statusCode === "number"
        ? `statusCode=${candidate.statusCode}`
        : null,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(" — ");
    }
  }

  return String(sendError);
}

async function handleQuoteEmailSendFailure(
  writeClient: WriteClient,
  orderId: string,
  lockRev: string,
  sendError: unknown
): Promise<NextResponse> {
  const emailError = describeEmailSendError(sendError);
  console.error("Failed to send wholesale quote email:", {
    emailError,
    sendError,
    fromEmailConfigured: Boolean(process.env.WHOLESALE_FROM_EMAIL?.trim()),
    resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
  });

  try {
    await patchOrderStatusAtRevision(
      writeClient,
      orderId,
      lockRev,
      "quote_send_failed"
    );
  } catch (statusError) {
    console.error(
      "Failed to mark wholesale order as quote_send_failed:",
      statusError
    );
  }

  return NextResponse.json(
    {
      success: false,
      message:
        "Failed to send quote email. Order was not marked as sent. Check RESEND_API_KEY, WHOLESALE_FROM_EMAIL, and email provider logs.",
    },
    { status: 502 }
  );
}

type ResendEmailClient = {
  emails: {
    send: (payload: {
      from: string;
      to: string[];
      subject: string;
      text: string;
      html: string;
    }) => Promise<{ error?: unknown }>;
  };
};

async function trySendAdminFinalOrderCopy({
  resend,
  fromEmail,
  subjectPrefix,
  orderNumber,
  customer,
  customerEmail,
  finalizedItems,
  finalizedTotalAmount,
  sellerNote,
}: {
  resend: ResendEmailClient;
  fromEmail: string;
  subjectPrefix: string;
  orderNumber: string;
  customer: WholesaleOrderCustomer;
  customerEmail: string;
  finalizedItems: WholesaleOrderFinalizedLineItem[];
  finalizedTotalAmount: number;
  sellerNote?: string | null;
}): Promise<boolean> {
  const customerEmailLower = customerEmail.toLowerCase();
  const adminEmails = parseWholesaleAdminEmails().filter(
    (email) => email.toLowerCase() !== customerEmailLower
  );

  if (adminEmails.length === 0) {
    return false;
  }

  const adminEmailContent = buildAdminFinalOrderCopyEmail({
    orderNumber,
    customer,
    customerEmail,
    items: finalizedItems,
    finalizedTotalAmount,
    sellerNote,
    subjectPrefix,
  });

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: adminEmailContent.subject,
      text: adminEmailContent.text,
      html: adminEmailContent.html,
    });

    if (error) {
      console.error(
        "Customer quote email sent, but admin final order copy failed:",
        error
      );
      console.log("Order Number:", orderNumber);
      console.log("Admin recipients:", adminEmails.join(", "));
      return true;
    }
  } catch (adminSendError) {
    console.error(
      "Customer quote email sent, but admin final order copy failed:",
      adminSendError
    );
    console.log("Order Number:", orderNumber);
    console.log("Admin recipients:", adminEmails.join(", "));
    return true;
  }

  return false;
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

    const trimmedOrderId = orderId.trim();
    const writeClient = getSanityWriteClient();
    const order = await fetchOrder(writeClient, trimmedOrderId);

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

    const initialQuote = prepareQuote(order);
    if (!initialQuote.ok) {
      return NextResponse.json(
        { success: false, message: initialQuote.message },
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

    const lockedOrder = await fetchOrder(writeClient, trimmedOrderId);
    if (!lockedOrder || lockedOrder.status !== "sending_quote") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Quote send lock could not be verified. Refresh the order and try again.",
        },
        { status: 409 }
      );
    }

    const lockRev = lockedOrder._rev;
    const lockedQuote = prepareQuote(lockedOrder);
    if (!lockedQuote.ok) {
      try {
        await patchOrderStatusAtRevision(
          writeClient,
          order._id,
          lockRev,
          "quote_send_failed"
        );
      } catch (statusError) {
        console.error(
          "Failed to mark wholesale order as quote_send_failed after lock validation:",
          statusError
        );
      }

      return NextResponse.json(
        { success: false, message: lockedQuote.message },
        { status: 400 }
      );
    }

    const {
      customer,
      customerEmail,
      finalizedItems,
      finalizedTotalAmount,
    } = lockedQuote.quote;

    const fromEmail =
      process.env.WHOLESALE_FROM_EMAIL ||
      "Mashti Wholesale <onboarding@resend.dev>";
    const subjectPrefix =
      process.env.WHOLESALE_SUBJECT_PREFIX || "Mashti Wholesale";

    const emailContent = buildCustomerQuoteEmail({
      orderNumber: lockedOrder.orderNumber,
      customer,
      items: finalizedItems,
      finalizedTotalAmount,
      sellerNote: lockedOrder.sellerNote,
      subjectPrefix,
    });

    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: [customerEmail],
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      if (error) {
        return handleQuoteEmailSendFailure(
          writeClient,
          order._id,
          lockRev,
          error
        );
      }
    } catch (sendError) {
      return handleQuoteEmailSendFailure(
        writeClient,
        order._id,
        lockRev,
        sendError
      );
    }

    const adminCopyWarning = await trySendAdminFinalOrderCopy({
      resend,
      fromEmail,
      subjectPrefix,
      orderNumber: lockedOrder.orderNumber,
      customer,
      customerEmail,
      finalizedItems,
      finalizedTotalAmount,
      sellerNote: lockedOrder.sellerNote,
    });

    const now = new Date().toISOString();

    try {
      await writeClient
        .patch(order._id)
        .ifRevisionId(lockRev)
        .set({
          finalizedTotalAmount,
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
            "Quote email was sent, but the order was changed before it could be finalized. Status remains sending_quote — review the order in Sanity before retrying.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: lockedOrder.orderNumber,
      message: adminCopyWarning
        ? "Quote email sent successfully. Admin copy could not be delivered — check server logs."
        : "Quote email sent successfully.",
      finalEmailSentTo: customerEmail,
      ...(adminCopyWarning ? { adminCopyWarning: true } : {}),
    });
  } catch (error) {
    console.error("Wholesale send quote API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send wholesale quote." },
      { status: 500 }
    );
  }
}
