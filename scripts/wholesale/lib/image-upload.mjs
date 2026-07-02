import fs from "node:fs";
import path from "node:path";

export async function resolveImagePatch({
  client,
  product,
  imagesDir,
  existingAssetId,
  allowUpload,
  dryRun = false,
}) {
  if (product.imageFile) {
    const imagePath = path.join(imagesDir, product.imageFile);

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found for ${product.sku}: ${imagePath}`);
    }

    if (!allowUpload) {
      return {
        patch: existingAssetId
          ? {
              _type: "image",
              asset: { _type: "reference", _ref: existingAssetId },
              alt: product.imageAlt,
            }
          : {
              _type: "image",
              asset: { _type: "reference", _ref: "dry-run-image" },
              alt: product.imageAlt,
            },
        usedPlaceholder: false,
        uploaded: false,
      };
    }

    const asset = await client.assets.upload("image", fs.createReadStream(imagePath), {
      filename: product.imageFile,
    });

    return {
      patch: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: product.imageAlt,
      },
      usedPlaceholder: false,
      uploaded: true,
    };
  }

  const placeholderId = process.env.WHOLESALE_DEFAULT_PRODUCT_IMAGE_ASSET_ID?.trim();

  if (dryRun) {
    return {
      patch: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: placeholderId || "dry-run-placeholder-image",
        },
        alt: product.imageAlt,
      },
      usedPlaceholder: true,
      uploaded: false,
    };
  }

  if (placeholderId) {
    return {
      patch: {
        _type: "image",
        asset: { _type: "reference", _ref: placeholderId },
        alt: product.imageAlt,
      },
      usedPlaceholder: true,
      uploaded: false,
    };
  }

  throw new Error(
    `CREATE for ${product.sku} requires imageFile or WHOLESALE_DEFAULT_PRODUCT_IMAGE_ASSET_ID`
  );
}
