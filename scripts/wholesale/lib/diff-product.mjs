function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return false;
  }

  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export function diffProduct(existing, incoming, allowedFields, imageWillChange) {
  const changes = [];

  const compareField = (field, formatter = (value) => value) => {
    if (!allowedFields.includes(field)) {
      return;
    }

    const fromValue = existing?.[field];
    const toValue = incoming[field];

    if (field === "ingredients") {
      if (!arraysEqual(fromValue || [], toValue || [])) {
        changes.push({
          field,
          from: fromValue || [],
          to: toValue || [],
          display: `ingredients: changed (${(fromValue || []).length} → ${(toValue || []).length} items)`,
        });
      }
      return;
    }

    if (field === "unitDisplayOverride") {
      const normalizedFrom = (fromValue || "").trim();
      const normalizedTo = (toValue || "").trim();
      if (normalizedFrom !== normalizedTo) {
        changes.push({
          field,
          from: normalizedFrom || null,
          to: normalizedTo || null,
          display:
            normalizedTo.length === 0
              ? "unitDisplayOverride: cleared"
              : "unitDisplayOverride: updated",
        });
      }
      return;
    }

    if (field === "description") {
      if ((fromValue || "") !== (toValue || "")) {
        changes.push({
          field,
          from: fromValue,
          to: toValue,
          display: "description: updated",
        });
      }
      return;
    }

    if (fromValue !== toValue) {
      changes.push({
        field,
        from: fromValue,
        to: toValue,
        display: `${field}: ${formatter(fromValue)} → ${formatter(toValue)}`,
      });
    }
  };

  compareField("name");
  compareField("description");
  compareField("category");
  compareField("ingredients");
  compareField("unitType");
  compareField("unitValue");
  compareField("unitDisplayOverride");
  compareField("unitPrice", (value) => `$${Number(value).toFixed(2)}`);
  compareField("order");
  compareField("active", (value) => String(value));

  if (allowedFields.includes("image") && imageWillChange) {
    changes.push({
      field: "image",
      from: existing?.imageAssetId || null,
      to: incoming.imageFile || "placeholder",
      display: "image: would update",
    });
  }

  return changes;
}

export function buildPatchFromChanges(changes, incoming, imagePatch) {
  const patch = {};

  for (const change of changes) {
    if (change.field === "image") {
      if (imagePatch) {
        patch.image = imagePatch;
      }
      continue;
    }

    patch[change.field] = incoming[change.field];
  }

  return patch;
}

export function toSanityDocument(product, imagePatch) {
  const document = {
    _type: "wholesaleProduct",
    sku: product.sku,
    name: product.name,
    description: product.description,
    category: product.category,
    ingredients: product.ingredients,
    unitType: product.unitType,
    unitValue: product.unitValue,
    unitPrice: product.unitPrice,
    order: product.order,
    active: product.active,
  };

  if (product.unitDisplayOverride) {
    document.unitDisplayOverride = product.unitDisplayOverride;
  }

  if (imagePatch) {
    document.image = imagePatch;
  }

  return document;
}
