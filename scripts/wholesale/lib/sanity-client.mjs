import { createClient } from "@sanity/client";

export function createSanityWriteClient() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
    );
  }

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN");
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

export async function fetchExistingProducts(client) {
  return client.fetch(`
    *[_type == "wholesaleProduct"]{
      _id,
      sku,
      name,
      description,
      category,
      ingredients,
      unitType,
      unitValue,
      unitDisplayOverride,
      unitPrice,
      order,
      active,
      "imageAssetId": image.asset->_id
    }
  `);
}

export function indexProductsBySku(existingProducts) {
  const map = new Map();

  for (const product of existingProducts) {
    if (!product.sku) {
      continue;
    }

    map.set(product.sku.trim().toUpperCase(), product);
  }

  return map;
}
