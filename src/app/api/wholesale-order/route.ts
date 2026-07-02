import { NextRequest, NextResponse } from "next/server";

import { buildAdminOrderRequestEmail } from "@/lib/wholesale/emails";
import {
  calculateRequestedTotal,
  generateOrderNumber,
  normalizeOrderItems,
  parseWholesaleAdminEmails,
} from "@/lib/wholesale/orders";
import type {
  WholesaleOrderCustomer,
  WholesaleOrderLineItemInput,
} from "@/lib/wholesale/types";
import { getSanityWriteClient } from "@/sanity/lib/writeClient";

function isValidCustomer(
  customer: Partial<WholesaleOrderCustomer> | undefined
): customer is WholesaleOrderCustomer {
  return Boolean(
    customer?.businessName?.trim() &&
      customer?.contactName?.trim() &&
      customer?.email?.trim() &&
      customer?.phone?.trim() &&
      customer?.deliveryAddress?.trim()
  );
}

function isValidItems(
  items: WholesaleOrderLineItemInput[] | undefined
): items is WholesaleOrderLineItemInput[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item.productId?.trim() &&
        item.productName?.trim() &&
        item.unitType?.trim() &&
        typeof item.unitValue === "number" &&
        item.unitValue > 0 &&
        item.unitLabel?.trim() &&
        typeof item.unitPrice === "number" &&
        item.unitPrice >= 0 &&
        typeof item.requestedQuantity === "number" &&
        item.requestedQuantity >= 1
    )
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items } = body as {
      customer?: Partial<WholesaleOrderCustomer>;
      items?: WholesaleOrderLineItemInput[];
    };

    if (!isValidCustomer(customer)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required business/contact fields. Please complete the order request form.",
        },
        { status: 400 }
      );
    }

    if (!isValidItems(items)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your order request must include at least one valid product with quantity.",
        },
        { status: 400 }
      );
    }

    const normalizedCustomer: WholesaleOrderCustomer = {
      businessName: customer.businessName.trim(),
      contactName: customer.contactName.trim(),
      email: customer.email.trim(),
      phone: customer.phone.trim(),
      deliveryAddress: customer.deliveryAddress.trim(),
      message: customer.message?.trim() || "",
    };

    const requestedItems = normalizeOrderItems(items);
    const requestedTotalAmount = calculateRequestedTotal(requestedItems);
    const orderNumber = generateOrderNumber();
    const submittedAt = new Date().toISOString();

    try {
      const writeClient = getSanityWriteClient();
      await writeClient.create({
        _type: "wholesaleOrder",
        orderNumber,
        status: "submitted",
        customer: normalizedCustomer,
        requestedItems,
        requestedTotalAmount,
        finalizedItems: [],
        submittedAt,
      });
    } catch (error) {
      console.error("Failed to persist wholesale order in Sanity:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to save your order request. Please try again or contact us directly.",
        },
        { status: 500 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.WHOLESALE_FROM_EMAIL ||
      "Mashti Wholesale <onboarding@resend.dev>";
    const subjectPrefix =
      process.env.WHOLESALE_SUBJECT_PREFIX || "Mashti Wholesale";
    const adminEmails = parseWholesaleAdminEmails();

    const emailContent = buildAdminOrderRequestEmail({
      orderNumber,
      customer: normalizedCustomer,
      items: requestedItems,
      requestedTotalAmount,
      subjectPrefix,
    });

    const successResponse = (emailWarning: boolean) =>
      NextResponse.json({
        success: true,
        orderNumber,
        message: "Wholesale order request submitted successfully.",
        ...(emailWarning ? { emailWarning: true } : {}),
      });

    if (
      !resendApiKey ||
      resendApiKey === "your_resend_api_key_here" ||
      resendApiKey.length < 10
    ) {
      console.warn(
        "Wholesale order request saved. Admin notification email not sent (RESEND_API_KEY missing or invalid)."
      );
      console.log("Order Number:", orderNumber);
      console.log("Admin recipients:", adminEmails.join(", "));
      console.log(emailContent.text);

      return successResponse(true);
    }

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);

      const { error } = await resend.emails.send({
        from: fromEmail,
        to: adminEmails,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      if (error) {
        console.error(
          "Wholesale order request saved, but admin notification email failed:",
          error
        );
        console.log("Order Number:", orderNumber);
        console.log("Admin recipients:", adminEmails.join(", "));

        return successResponse(true);
      }

      return successResponse(false);
    } catch (error) {
      console.error(
        "Wholesale order request saved, but admin notification email failed:",
        error
      );
      console.log("Order Number:", orderNumber);
      console.log("Admin recipients:", adminEmails.join(", "));

      return successResponse(true);
    }
  } catch (error) {
    console.error("Wholesale Order API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit wholesale order request" },
      { status: 500 }
    );
  }
}
