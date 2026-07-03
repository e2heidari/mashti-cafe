import type {
  WholesaleOrderCustomer,
  WholesaleOrderFinalizedLineItem,
  WholesaleOrderLineItem,
} from "./types";

type AdminOrderRequestEmailInput = {
  orderNumber: string;
  customer: WholesaleOrderCustomer;
  items: WholesaleOrderLineItem[];
  requestedTotalAmount: number;
  subjectPrefix: string;
};

type CustomerQuoteEmailInput = {
  orderNumber: string;
  customer: WholesaleOrderCustomer;
  items: WholesaleOrderFinalizedLineItem[];
  finalizedTotalAmount: number;
  sellerNote?: string | null;
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

  const itemsText = [
    "Item | SKU | Category | Unit | Qty | Unit Price | Line Total",
    ...items.map((item) => {
      const sku = item.sku?.trim() || "—";
      const category = item.category?.trim() || "—";

      return [
        item.productName,
        sku,
        category,
        item.unitLabel,
        String(item.requestedQuantity),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.lineTotal.toFixed(2)}`,
      ].join(" | ");
    }),
  ].join("\n");

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

      <div style="margin-bottom: 20px;">
        <h3 style="color: #333; margin: 0 0 12px;">Requested Items</h3>
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="border-collapse: collapse; border: 1px solid #e0e0e0; background-color: #ffffff;"
        >
          <thead>
            <tr style="background-color: #333333;">
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Item</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">SKU</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Category</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Unit</th>
              <th align="center" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Qty</th>
              <th align="right" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Unit Price</th>
              <th align="right" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((item, index) => {
                const safeSku = item.sku?.trim()
                  ? escapeHtml(item.sku.trim())
                  : "—";
                const safeProductName = escapeHtml(item.productName);
                const safeCategory = item.category?.trim()
                  ? escapeHtml(item.category.trim())
                  : "—";
                const safeUnitLabel = escapeHtml(item.unitLabel);
                const rowBackground = index % 2 === 0 ? "#ffffff" : "#f9f9f9";

                return `
            <tr style="background-color: ${rowBackground};">
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top;"><strong>${safeProductName}</strong></td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 12px; color: #555555; vertical-align: top; font-family: Consolas, Monaco, 'Courier New', monospace; white-space: nowrap;">${safeSku}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top;">${safeCategory}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top; white-space: nowrap;">${safeUnitLabel}</td>
              <td align="center" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top; font-weight: 600;">${item.requestedQuantity}</td>
              <td align="right" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top; white-space: nowrap;">$${item.unitPrice.toFixed(2)}</td>
              <td align="right" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top; font-weight: 600; white-space: nowrap;">$${item.lineTotal.toFixed(2)}</td>
            </tr>
          `;
              })
              .join("")}
          </tbody>
          <tfoot>
            <tr style="background-color: #fff5f5;">
              <td colspan="6" align="right" style="padding: 14px 10px; font-size: 15px; font-weight: 700; color: #333333; border-top: 2px solid #e80812;">Estimated Total</td>
              <td align="right" style="padding: 14px 10px; font-size: 18px; font-weight: 700; color: #e80812; border-top: 2px solid #e80812; white-space: nowrap;">$${requestedTotalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
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

export function buildCustomerQuoteEmail({
  orderNumber,
  customer,
  items,
  finalizedTotalAmount,
  sellerNote,
  subjectPrefix,
}: CustomerQuoteEmailInput) {
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeBusinessName = escapeHtml(customer.businessName);
  const safeContactName = escapeHtml(customer.contactName);
  const trimmedSellerNote = sellerNote?.trim() || "";
  const safeSellerNote = trimmedSellerNote
    ? escapeHtml(trimmedSellerNote)
    : "";

  const itemsText = [
    "Item | SKU | Category | Unit | Qty | Unit Price | Line Total",
    ...items.map((item) => {
      const sku = item.sku?.trim() || "—";
      const category = item.category?.trim() || "—";

      return [
        item.productName,
        sku,
        category,
        item.unitLabel,
        String(item.finalizedQuantity),
        `$${item.unitPrice.toFixed(2)}`,
        `$${item.lineTotal.toFixed(2)}`,
      ].join(" | ");
    }),
  ].join("\n");

  const sellerNoteText = trimmedSellerNote
    ? `\n\nNote from Mashti:\n${trimmedSellerNote}`
    : "";

  const text = `
Mashti Wholesale — Your Quote

Hello ${customer.contactName},

Thank you for your wholesale order request. We have reviewed your request and prepared the quote below.

Order Number: ${orderNumber}
Business: ${customer.businessName}

Quote Items:
${itemsText}

Quote Total: $${finalizedTotalAmount.toFixed(2)}${sellerNoteText}

If you have any questions, please contact us.

Thank you,
Mashti Wholesale
`.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto;">
      <h2 style="color: #e80812; margin: 0 0 4px;">Mashti Wholesale</h2>
      <p style="color: #333333; font-size: 16px; font-weight: 600; margin: 0 0 20px;">Your Quote</p>

      <p style="color: #333333; font-size: 15px; margin: 0 0 16px;">Hello ${safeContactName},</p>

      <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
        Thank you for your wholesale order request. We have reviewed your request and prepared the quote below.
      </p>

      <div style="background-color: #e80812; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px;"><strong>Order Number:</strong> ${safeOrderNumber}</p>
        <p style="margin: 0;"><strong>Business:</strong> ${safeBusinessName}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #333; margin: 0 0 12px;">Quote Items</h3>
        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          width="100%"
          style="border-collapse: collapse; border: 1px solid #e0e0e0; background-color: #ffffff;"
        >
          <thead>
            <tr style="background-color: #333333;">
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Item</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">SKU</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Category</th>
              <th align="left" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Unit</th>
              <th align="center" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Qty</th>
              <th align="right" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Unit Price</th>
              <th align="right" style="padding: 12px 10px; font-size: 12px; font-weight: 700; color: #ffffff; border-bottom: 2px solid #e80812; text-transform: uppercase; letter-spacing: 0.03em;">Line Total</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map((item, index) => {
                const safeSku = item.sku?.trim()
                  ? escapeHtml(item.sku.trim())
                  : "—";
                const safeProductName = escapeHtml(item.productName);
                const safeCategory = item.category?.trim()
                  ? escapeHtml(item.category.trim())
                  : "—";
                const safeUnitLabel = escapeHtml(item.unitLabel);
                const rowBackground = index % 2 === 0 ? "#ffffff" : "#f9f9f9";

                return `
            <tr style="background-color: ${rowBackground};">
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top;"><strong>${safeProductName}</strong></td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 12px; color: #555555; vertical-align: top; font-family: Consolas, Monaco, 'Courier New', monospace; white-space: nowrap;">${safeSku}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top;">${safeCategory}</td>
              <td style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top; white-space: nowrap;">${safeUnitLabel}</td>
              <td align="center" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top; font-weight: 600;">${item.finalizedQuantity}</td>
              <td align="right" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 13px; color: #555555; vertical-align: top; white-space: nowrap;">$${item.unitPrice.toFixed(2)}</td>
              <td align="right" style="padding: 12px 10px; border-bottom: 1px solid #ececec; font-size: 14px; color: #222222; vertical-align: top; font-weight: 600; white-space: nowrap;">$${item.lineTotal.toFixed(2)}</td>
            </tr>
          `;
              })
              .join("")}
          </tbody>
          <tfoot>
            <tr style="background-color: #fff5f5;">
              <td colspan="6" align="right" style="padding: 14px 10px; font-size: 15px; font-weight: 700; color: #333333; border-top: 2px solid #e80812;">Quote Total</td>
              <td align="right" style="padding: 14px 10px; font-size: 18px; font-weight: 700; color: #e80812; border-top: 2px solid #e80812; white-space: nowrap;">$${finalizedTotalAmount.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      ${
        safeSellerNote
          ? `
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #333; margin-top: 0;">Note from Mashti</h3>
        <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${safeSellerNote}</p>
      </div>
      `
          : ""
      }

      <p style="color: #555555; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
        If you have any questions, please contact us.
      </p>

      <p style="color: #333333; font-size: 14px; margin: 0 0 4px;">Thank you,</p>
      <p style="color: #333333; font-size: 14px; font-weight: 600; margin: 0 0 24px;">Mashti Wholesale</p>

      <p style="color: #999999; font-size: 12px; margin: 0;">Mashti Cafe — Wholesale</p>
    </div>
  `.trim();

  return {
    subject: `${subjectPrefix}: Your quote for ${customer.businessName} (${orderNumber})`,
    text,
    html,
  };
}
