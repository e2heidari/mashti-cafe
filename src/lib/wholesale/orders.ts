import type {
  WholesaleOrderFinalizedLineItem,
  WholesaleOrderFinalizedLineItemInput,
  WholesaleOrderLineItem,
  WholesaleOrderLineItemInput,
} from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

/** Sanity array item key — unique within one array on a document. */
export function generateArrayItemKey(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

function resolveArrayItemKey(existingKey: unknown): string {
  if (typeof existingKey === "string" && existingKey.trim().length > 0) {
    return existingKey.trim();
  }

  return generateArrayItemKey();
}

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
    _key: generateArrayItemKey(),
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
  return requestedItems.map((item) =>
    recalculateFinalizedLineItem({
      productId: item.productId,
      sku: item.sku,
      category: item.category,
      productName: item.productName,
      unitType: item.unitType,
      unitValue: item.unitValue,
      unitLabel: item.unitLabel,
      unitPrice: item.unitPrice,
      finalizedQuantity: item.requestedQuantity,
      _key: item._key,
    })
  );
}

export function isValidFinalizedItem(
  item: unknown
): item is WholesaleOrderFinalizedLineItemInput {
  if (!item || typeof item !== "object") {
    return false;
  }

  const candidate = item as Partial<WholesaleOrderFinalizedLineItemInput>;

  return (
    isNonEmptyString(candidate.productId) &&
    isNonEmptyString(candidate.productName) &&
    isNonEmptyString(candidate.unitType) &&
    isOptionalString(candidate.sku) &&
    isOptionalString(candidate.category) &&
    typeof candidate.unitValue === "number" &&
    Number.isFinite(candidate.unitValue) &&
    candidate.unitValue > 0 &&
    isNonEmptyString(candidate.unitLabel) &&
    typeof candidate.unitPrice === "number" &&
    Number.isFinite(candidate.unitPrice) &&
    candidate.unitPrice >= 0 &&
    typeof candidate.finalizedQuantity === "number" &&
    Number.isFinite(candidate.finalizedQuantity) &&
    candidate.finalizedQuantity >= 1
  );
}

export function isValidFinalizedItems(
  items: unknown
): items is WholesaleOrderFinalizedLineItemInput[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(isValidFinalizedItem)
  );
}

export function recalculateFinalizedLineItem(
  item: WholesaleOrderFinalizedLineItemInput
): WholesaleOrderFinalizedLineItem {
  const unitPrice = item.unitPrice;
  const finalizedQuantity = item.finalizedQuantity;

  return {
    _key: resolveArrayItemKey(item._key),
    productId: item.productId.trim(),
    sku: item.sku?.trim() || "",
    category: item.category?.trim() || "",
    productName: item.productName.trim(),
    unitType: item.unitType.trim(),
    unitValue: item.unitValue,
    unitLabel: item.unitLabel.trim(),
    unitPrice,
    finalizedQuantity,
    lineTotal: calculateLineTotal(unitPrice, finalizedQuantity),
  };
}

export function normalizeFinalizedItems(
  items: WholesaleOrderFinalizedLineItemInput[]
): WholesaleOrderFinalizedLineItem[] {
  return items.map(recalculateFinalizedLineItem);
}

export function calculateFinalizedTotal(
  items: WholesaleOrderFinalizedLineItem[]
): number {
  return Number(
    items
      .reduce((total, item) => total + item.lineTotal, 0)
      .toFixed(2)
  );
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
