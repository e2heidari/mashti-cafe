import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// In-memory cache
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(process.env.NEWS_CACHE_TTL_MS || ONE_HOUR_MS);
const DEFAULT_FALLBACK_TTL_MS = Number(process.env.NEWS_FALLBACK_TTL_MS || 5 * 60 * 1000);

type NewsItem = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText?: string;
  order: number;
  active: boolean;
}

type CachedPayload = { newsItems: NewsItem[]; message?: string };
let newsCache: { payload: CachedPayload; expiresAt: number } | null = null;

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

    if (!noCache && newsCache && newsCache.expiresAt > now) {
      return NextResponse.json(newsCache.payload, {
        headers: buildCacheHeaders(newsCache.expiresAt - now, 'HIT'),
      })
    }

    const newsItems = await client.fetch(`
      *[_type == "newsItem" && active == true] | order(order asc) {
        _id,
        title,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        buttonText,
        order,
        active
      }
    `)
    const payload: CachedPayload = { newsItems }
    newsCache = { payload, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS }
    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_CACHE_TTL_MS, 'MISS'),
    })
  } catch (error) {
    console.error('Error fetching news items:', error)
    const payload: CachedPayload = { newsItems: [], message: 'Failed to fetch news items' }
    newsCache = { payload, expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS }
    return NextResponse.json(payload, {
      status: 500,
      headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, 'FALLBACK'),
    })
  }
} 