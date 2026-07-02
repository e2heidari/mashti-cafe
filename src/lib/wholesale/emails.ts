import type {
  WholesaleOrderCustomer,
  WholesaleOrderLineItem,
} from "./types";

type AdminOrderRequestEmailInput = {
  orderNumber: string;
  customer: WholesaleOrderCustomer;
  items: WholesaleOrderLineItem[];
  requestedTotalAmount: number;
  subjectPrefix: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildAdminOrderRequestEmail({
  orderNumber,
  customer,
  items,
  requestedTotalAmount,
  subjectPrefix,
}: AdminOrderRequestEmailInput) {
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeBusinessName = escapeHtml(customer.businessName);
  const safeContactName = escapeHtml(customer.contactName);
  const safeEmail = escapeHtml(customer.email);
  const safePhone = escapeHtml(customer.phone);
  const safeDeliveryAddress = escapeHtml(customer.deliveryAddress);
  const safeMessage = customer.message?.trim()
    ? escapeHtml(customer.message.trim())
    : "";

  const itemsText = items
    .map(
      (item) =>
        `• ${item.sku ? `[${item.sku}] ` : ""}${item.productName}${item.category ? ` (${item.category})` : ""} — ${item.unitLabel} — Qty: ${item.requestedQuantity} — $${item.unitPrice.toFixed(2)} each — Line total: $${item.lineTotal.toFixed(2)}`
    )
    .join("\n");

  const text = `
New Wholesale Order Request

Order Number: ${orderNumber}

Business Information:
Business Name: ${customer.businessName}
Contact Name: ${customer.contactName}
Email: ${customer.email}
Phone: ${customer.phone}
Delivery Address: ${customer.deliveryAddress}

Requested Items:
${itemsText}

Estimated Total: $${requestedTotalAmount.toFixed(2)}

Notes: ${customer.message?.trim() || "No additional notes provided"}

This is an order request. Availability and final quantities will be confirmed by the seller.
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
      <h2 style="color: #e80812; margin-bottom: 20px;">New Wholesale Order Request</h2>

      <div style="background-color: #e80812; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
        <strong>Order Number:</strong> ${safeOrderNumber}
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Business Information</h3>
        <p><strong>Business Name:</strong> ${safeBusinessName}</p>
        <p><strong>Contact Name:</strong> ${safeContactName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>Delivery Address:</strong> ${safeDeliveryAddress}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Requested Items</h3>
        ${items
          .map((item) => {
            const safeSku = item.sku?.trim() ? escapeHtml(item.sku.trim()) : "";
            const safeProductName = escapeHtml(item.productName);
            const safeCategory = item.category?.trim()
              ? escapeHtml(item.category.trim())
              : "";
            const safeUnitLabel = escapeHtml(item.unitLabel);

            return `
          <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
            <p style="margin: 0 0 6px;"><strong>${safeSku ? `${safeSku} — ` : ""}${safeProductName}</strong>${safeCategory ? ` <span style="color:#666;">(${safeCategory})</span>` : ""}</p>
            <p style="margin: 0; color: #555;">${safeUnitLabel} • Qty: ${item.requestedQuantity} • $${item.unitPrice.toFixed(2)} each • Line total: $${item.lineTotal.toFixed(2)}</p>
          </div>
        `;
          })
          .join("")}
        <p style="margin: 16px 0 0; font-size: 18px; font-weight: bold; color: #e80812;">
          Estimated Total: $${requestedTotalAmount.toFixed(2)}
        </p>
      </div>

      ${
        safeMessage
          ? `
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Notes</h3>
        <p style="margin: 0;">${safeMessage}</p>
      </div>
      `
          : ""
      }

      <p style="color: #666; font-size: 14px;">
        This is an order request. Availability and final quantities will be confirmed by the seller.
      </p>
    </div>
  `.trim();

  return {
    subject: `${subjectPrefix}: ${customer.businessName} (${orderNumber})`,
    text,
    html,
  };
}
