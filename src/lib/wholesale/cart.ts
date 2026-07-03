import type { CartItem } from "./types";

export function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const { product, quantity } = item as Partial<CartItem>;

  if (!product || typeof product !== "object") {
    return false;
  }

  if (typeof product._id !== "string" || !product._id.trim()) {
    return false;
  }

  if (typeof product.name !== "string" || !product.name.trim()) {
    return false;
  }

  if (
    typeof product.unitPrice !== "number" ||
    !Number.isFinite(product.unitPrice) ||
    product.unitPrice < 0
  ) {
    return false;
  }

  if (typeof product.unitLabel !== "string" || !product.unitLabel.trim()) {
    return false;
  }

  if (typeof product.unitType !== "string" || !product.unitType.trim()) {
    return false;
  }

  if (
    typeof product.unitValue !== "number" ||
    !Number.isFinite(product.unitValue) ||
    product.unitValue <= 0
  ) {
    return false;
  }

  if (typeof product.active !== "boolean") {
    return false;
  }

  return typeof quantity === "number" && Number.isFinite(quantity) && quantity >= 1;
}

export function loadWholesaleCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = localStorage.getItem("wholesaleCart");
  if (!savedCart) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem("wholesaleCart");
      return [];
    }

    const validCart = parsed.filter(isValidCartItem);
    const filteredCart = validCart.filter(
      (item) => item.product.active !== false
    );

    if (
      validCart.length !== parsed.length ||
      filteredCart.length !== validCart.length
    ) {
      localStorage.setItem("wholesaleCart", JSON.stringify(filteredCart));
    }

    return filteredCart;
  } catch (error) {
    console.error("Failed to parse wholesale cart from localStorage:", error);
    localStorage.removeItem("wholesaleCart");
    return [];
  }
}
