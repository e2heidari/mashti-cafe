import {
  buildPatchFromChanges,
  diffProduct,
  toSanityDocument,
} from "./diff-product.mjs";
import { resolveImagePatch } from "./image-upload.mjs";
import { formatUnitLabel } from "./units.mjs";

export async function planProductUpsert({
  client,
  product,
  existing,
  allowedFields,
  imagesDir,
  dryRun,
  updateImage,
}) {
  const unitLabel = formatUnitLabel(
    product.unitValue,
    product.unitType,
    product.unitDisplayOverride
  );

  if (!existing) {
    const imageResult = await resolveImagePatch({
      client,
      product,
      imagesDir,
      existingAssetId: null,
      allowUpload: !dryRun,
      dryRun,
    });

    const document = toSanityDocument(product, imageResult.patch);

    return {
      action: "CREATE",
      sku: product.sku,
      sanityId: null,
      unitLabel,
      changes: [
        {
          field: "_document",
          from: null,
          to: document,
          display: "create new wholesaleProduct",
        },
      ],
      patch: null,
      document,
      imageMeta: imageResult,
    };
  }

  let imagePatch = null;
  let imageWillChange = false;

  if (allowedFields.includes("image") && updateImage) {
    const imageResult = await resolveImagePatch({
      client,
      product,
      imagesDir,
      existingAssetId: existing.imageAssetId,
      allowUpload: !dryRun,
      dryRun,
    });

    imagePatch = imageResult.patch;
    imageWillChange = Boolean(product.imageFile) || imageResult.usedPlaceholder;
  }

  const changes = diffProduct(existing, product, allowedFields, imageWillChange);

  if (changes.length === 0) {
    return {
      action: "UNCHANGED",
      sku: product.sku,
      sanityId: existing._id,
      unitLabel,
      changes: [],
      patch: null,
      document: null,
      imageMeta: null,
    };
  }

  const patch = buildPatchFromChanges(changes, product, imagePatch);

  return {
    action: "UPDATE",
    sku: product.sku,
    sanityId: existing._id,
    unitLabel,
    changes,
    patch,
    document: null,
    imageMeta: imagePatch ? { patch: imagePatch } : null,
  };
}

export async function applyProductPlan(client, plan) {
  if (plan.action === "CREATE") {
    const created = await client.create(plan.document);
    return {
      ...plan,
      sanityId: created._id,
    };
  }

  if (plan.action === "UPDATE") {
    await client.patch(plan.sanityId).set(plan.patch).commit();
    return plan;
  }

  return plan;
}
