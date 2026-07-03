import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

import { resolveProductUnitFields } from '@/lib/wholesale/units'
import type { WholesaleProduct } from '@/lib/wholesale/types'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(process.env.WHOLESALE_PRODUCTS_CACHE_TTL_MS || ONE_HOUR_MS);
const DEFAULT_FALLBACK_TTL_MS = Number(process.env.WHOLESALE_PRODUCTS_FALLBACK_TTL_MS || 5 * 60 * 1000);

type RawProduct = {
  _id: string;
  sku?: string;
  name: string;
  description: string;
  ingredients: string[];
  category?: string;
  unitType?: string;
  unitValue?: number;
  unitDisplayOverride?: string;
  unitPrice?: number;
  weight?: string;
  price?: number;
  imageUrl?: string | null;
  imageAlt?: string;
  order: number;
  active: boolean;
};

type CachedPayload = { wholesaleProducts: WholesaleProduct[]; message?: string };
let productsCache: { payload: CachedPayload; expiresAt: number } | null = null;

function buildCacheHeaders(ttlMs: number, status: 'HIT' | 'MISS' | 'FALLBACK'): HeadersInit {
  const sMaxAge = Math.max(0, Math.floor(ttlMs / 1000));
  const browserMaxAge = Math.min(600, sMaxAge);
  return {
    'Cache-Control': `public, max-age=${browserMaxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    'X-Cache': status,
    'X-Cache-TTL': String(sMaxAge),
  };
}

function mapProduct(raw: RawProduct): WholesaleProduct {
  const unitFields = resolveProductUnitFields(raw);

  return {
    _id: raw._id,
    sku: raw.sku,
    name: raw.name,
    description: raw.description,
    ingredients: raw.ingredients,
    category: raw.category,
    unitType: unitFields.unitType,
    unitValue: unitFields.unitValue,
    unitDisplayOverride: unitFields.unitDisplayOverride,
    unitLabel: unitFields.unitLabel,
    unitPrice: unitFields.unitPrice,
    imageUrl: raw.imageUrl,
    imageAlt: raw.imageAlt,
    order: raw.order,
    active: raw.active,
  };
}

export async function GET(request: Request) {
  try {
    const now = Date.now();
    const url = new URL(request.url);
    const noCache = url.searchParams.get('nocache') === '1' || url.searchParams.get('refresh') === '1';

    if (!noCache && productsCache && productsCache.expiresAt > now) {
      return NextResponse.json(productsCache.payload, {
        headers: buildCacheHeaders(productsCache.expiresAt - now, 'HIT'),
      })
    }

    const rawProducts: RawProduct[] = await client.fetch(`
      *[_type == "wholesaleProduct" && active == true] | order(order asc) {
        _id,
        sku,
        name,
        description,
        ingredients,
        category,
        unitType,
        unitValue,
        unitDisplayOverride,
        unitPrice,
        weight,
        price,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        order,
        active
      }
    `)

    const wholesaleProducts = rawProducts.map(mapProduct);
    const payload: CachedPayload = { wholesaleProducts }
    productsCache = { payload, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS }
    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_CACHE_TTL_MS, 'MISS'),
    })
  } catch (error) {
    console.error('Error fetching wholesale products:', error)
    const payload: CachedPayload = { wholesaleProducts: [], message: 'Failed to fetch wholesale products' }
    productsCache = { payload, expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS }
    return NextResponse.json(payload, {
      status: 500,
      headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, 'FALLBACK'),
    })
  }
}
