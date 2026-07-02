import { SKU_REGEX, normalizeSku } from "./units.mjs";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeUnitPrice(value) {
  if (value == null || value === "") {
    return 0;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return NaN;
  }

  return parsed;
}

function validateProductRow(product, index, categories, unitTypes) {
  const errors = [];
  const row = `products[${index}]`;

  if (!isNonEmptyString(product.sku)) {
    errors.push(`${row}: sku is required`);
  } else {
    const sku = normalizeSku(product.sku);
    if (!SKU_REGEX.test(sku)) {
      errors.push(`${row}: sku "${sku}" does not match required format`);
    }
  }

  if (!isNonEmptyString(product.name)) {
    errors.push(`${row}: name is required`);
  }

  if (!isNonEmptyString(product.description)) {
    errors.push(`${row}: description is required`);
  }

  if (!isNonEmptyString(product.category)) {
    errors.push(`${row}: category is required`);
  } else if (!categories.allowed.includes(product.category.trim())) {
    errors.push(`${row}: category "${product.category}" is not allowed`);
  }

  if (!Array.isArray(product.ingredients) || product.ingredients.length === 0) {
    errors.push(`${row}: ingredients must be a non-empty array`);
  }

  if (!isNonEmptyString(product.unitType)) {
    errors.push(`${row}: unitType is required`);
  } else if (!unitTypes.allowed.includes(product.unitType)) {
    errors.push(`${row}: unitType "${product.unitType}" is not allowed`);
  }

  if (typeof product.unitValue !== "number" || product.unitValue <= 0) {
    errors.push(`${row}: unitValue must be a number greater than 0`);
  }

  const unitPrice = normalizeUnitPrice(product.unitPrice);
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    errors.push(`${row}: unitPrice must be null/empty or a number >= 0`);
  }

  if (typeof product.order !== "number" || product.order < 1) {
    errors.push(`${row}: order must be a number >= 1`);
  }

  if (
    product.unitDisplayOverride != null &&
    product.unitDisplayOverride !== "" &&
    typeof product.unitDisplayOverride !== "string"
  ) {
    errors.push(`${row}: unitDisplayOverride must be a string when provided`);
  }

  return errors;
}

export function validateImportPayload(payload, categories, unitTypes) {
  const errors = [];
  const warnings = [];
  const normalizedProducts = [];
  const skuCounts = new Map();

  if (!payload || !Array.isArray(payload.products)) {
    return {
      errors: ["products.json must contain a products array"],
      warnings,
      products: [],
    };
  }

  payload.products.forEach((product, index) => {
    const rowErrors = validateProductRow(product, index, categories, unitTypes);
    errors.push(...rowErrors);

    if (rowErrors.length > 0) {
      return;
    }

    const sku = normalizeSku(product.sku);
    const unitPrice = normalizeUnitPrice(product.unitPrice);
    const hasNonPositivePrice = Number.isFinite(unitPrice) && unitPrice <= 0;
    const explicitActiveTrue = product.active === true;

    if (hasNonPositivePrice) {
      warnings.push({
        type: "nonPositivePrice",
        sku,
        message: `${sku} has unitPrice ${unitPrice.toFixed(2)} and will default to inactive unless active:true is explicitly set`,
      });
    }

    skuCounts.set(sku, (skuCounts.get(sku) || 0) + 1);
    normalizedProducts.push({
      ...product,
      sku,
      name: product.name.trim(),
      description: product.description.trim(),
      category: product.category.trim(),
      ingredients: product.ingredients.map((item) => item.trim()),
      unitType: product.unitType,
      unitValue: product.unitValue,
      unitPrice,
      unitDisplayOverride: product.unitDisplayOverride?.trim() || "",
      order: product.order,
      active: explicitActiveTrue || (!hasNonPositivePrice && product.active !== false),
      imageFile: product.imageFile?.trim() || "",
      imageAlt: product.imageAlt?.trim() || product.name.trim(),
    });
  });

  for (const [sku, count] of skuCounts.entries()) {
    if (count > 1) {
      errors.push(`Duplicate sku in JSON: ${sku} (${count} occurrences)`);
    }
  }

  const missingImage = normalizedProducts
    .filter((product) => !product.imageFile)
    .map((product) => product.sku);

  if (missingImage.length > 0) {
    warnings.push({
      type: "missingImageFile",
      items: missingImage,
      message: `${missingImage.length} product(s) missing imageFile`,
    });
  }

  return {
    errors,
    warnings,
    products: normalizedProducts,
  };
}

export function findDuplicateSkusInSanity(existingProducts) {
  const bySku = new Map();

  for (const product of existingProducts) {
    if (!product.sku) {
      continue;
    }

    const sku = normalizeSku(product.sku);
    const list = bySku.get(sku) || [];
    list.push(product);
    bySku.set(sku, list);
  }

  const duplicates = [];
  for (const [sku, docs] of bySku.entries()) {
    if (docs.length > 1) {
      duplicates.push({
        sku,
        ids: docs.map((doc) => doc._id),
      });
    }
  }

  return duplicates;
}

export function findProductsWithoutSku(existingProducts) {
  return existingProducts.filter((product) => !product.sku?.trim());
}
