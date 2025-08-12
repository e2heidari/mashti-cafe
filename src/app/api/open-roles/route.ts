import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: true,
})

type JobOpening = {
  _id: string;
  title: string;
  location?: string;
  type?: string;
  postedAt?: string;
  active: boolean;
};

// Simple in-memory cache for roles
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(process.env.OPEN_ROLES_CACHE_TTL_MS || ONE_HOUR_MS);
const DEFAULT_FALLBACK_TTL_MS = Number(process.env.OPEN_ROLES_FALLBACK_TTL_MS || 5 * 60 * 1000);

type CachedPayload = { roles: JobOpening[]; message?: string };
let rolesCache: { payload: CachedPayload; expiresAt: number } | null = null;

function buildCacheHeaders(ttlMs: number, status: 'HIT' | 'MISS' | 'FALLBACK'): HeadersInit {
  const sMaxAge = Math.max(0, Math.floor(ttlMs / 1000));
  const browserMaxAge = Math.min(600, sMaxAge); // cap browser at 10m
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

    if (!noCache && rolesCache && rolesCache.expiresAt > now) {
      return NextResponse.json(rolesCache.payload, {
        headers: buildCacheHeaders(rolesCache.expiresAt - now, 'HIT'),
      });
    }

    const roles = await client.fetch<JobOpening[]>(`*[_type == "jobOpening" && active == true] | order(order asc, postedAt desc){
      _id, title, location, type, postedAt, active
    }`)

    const payload: CachedPayload = { roles };
    rolesCache = { payload, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS };
    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_CACHE_TTL_MS, 'MISS'),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load roles'
    const payload: CachedPayload = { roles: [], message }
    rolesCache = { payload, expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS }
    return NextResponse.json(payload, {
      status: 500,
      headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, 'FALLBACK'),
    })
  }
}


