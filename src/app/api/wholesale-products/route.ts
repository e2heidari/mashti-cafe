import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})

// In-memory cache
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(process.env.WHOLESALE_PRODUCTS_CACHE_TTL_MS || ONE_HOUR_MS);
const DEFAULT_FALLBACK_TTL_MS = Number(process.env.WHOLESALE_PRODUCTS_FALLBACK_TTL_MS || 5 * 60 * 1000);

type Product = {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  weight: string;
  price: number;
  imageUrl: string;
  imageAlt?: string;
  order: number;
  active: boolean;
};

type CachedPayload = { wholesaleProducts: Product[]; message?: string };
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

export async function GET(request: Request) {
  try {
    const now = Date.now();
    const url = new URL(request.url);
    const noCache = url.searchParams.get('nocache') === '1' || url.searchParams.get('refresh') === '1';

    if (!noCache && productsCache && productsCache.expiresAt > now) {
      return NextResponse.json(productsCache.payload, {
        headers: buildCacheHeaders(productsCache.expiresAt - now, 'HIT'),
      });
    }

    const wholesaleProducts = await client.fetch(`
      *[_type == "wholesaleProduct" && active == true] | order(order asc) {
        _id,
        name,
        description,
        ingredients,
        weight,
        price,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        order,
        active
      }
    `)
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