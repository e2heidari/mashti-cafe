import type {
  WholesaleOrderFinalizedLineItem,
  WholesaleOrderLineItem,
  WholesaleOrderLineItemInput,
} from "./types";

export function generateOrderNumber(now = new Date()): string {
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `WH-${datePart}-${randomPart}`;
}

export function calculateLineTotal(
  unitPrice: number,
  quantity: number
): number {
  return Number((unitPrice * quantity).toFixed(2));
}

export function normalizeOrderItems(
  items: WholesaleOrderLineItemInput[]
): WholesaleOrderLineItem[] {
  return items.map((item) => ({
    ...item,
    sku: item.sku?.trim() || "",
    category: item.category?.trim() || "",
    lineTotal: calculateLineTotal(item.unitPrice, item.requestedQuantity),
  }));
}

export function calculateRequestedTotal(
  items: WholesaleOrderLineItem[]
): number {
  return Number(
    items
      .reduce((total, item) => total + item.lineTotal, 0)
      .toFixed(2)
  );
}

export function seedFinalizedItemsFromRequested(
  requestedItems: WholesaleOrderLineItem[]
): WholesaleOrderFinalizedLineItem[] {
  return requestedItems.map((item) => {
    const finalizedQuantity = item.requestedQuantity;

    return {
      productId: item.productId,
      sku: item.sku?.trim() || "",
      category: item.category?.trim() || "",
      productName: item.productName,
      unitType: item.unitType,
      unitValue: item.unitValue,
      unitLabel: item.unitLabel,
      unitPrice: item.unitPrice,
      finalizedQuantity,
      lineTotal: calculateLineTotal(item.unitPrice, finalizedQuantity),
    };
  });
}

export function parseWholesaleAdminEmails(): string[] {
  const multi = process.env.WHOLESALE_TO_EMAILS?.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (multi && multi.length > 0) {
    return multi;
  }

  const single = process.env.WHOLESALE_TO_EMAIL?.trim();
  if (single) {
    return [single];
  }

  return ["mashticafevancouver@gmail.com"];
}
