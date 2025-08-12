import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create Sanity client with CDN enabled for better performance
const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: true, // Enable CDN for better performance
});

interface SanityMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  imageAlt?: string;
  category: {
    _id: string;
    name: string;
    order: number;
  };
  popular: boolean;
  discount: boolean;
  bogo: boolean;
  active: boolean;
  available: boolean;
  order: number;
}

interface SanityMenuCategory {
  _id: string;
  name: string;
  order: number;
  imageUrl?: string;
  imageAlt?: string;
}

interface TransformedMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  popular: boolean;
  discount: boolean;
  bogo: boolean;
  active: boolean;
  available: boolean;
  order: number;
}

interface TransformedCategory {
  id: string;
  name: string;
  description: string;
  active: boolean;
  order: number;
  imageUrl?: string;
  imageAlt?: string;
  items: TransformedMenuItem[];
}

// In-memory cache (per server instance)
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(process.env.MENU_CACHE_TTL_MS || ONE_HOUR_MS);
const DEFAULT_FALLBACK_TTL_MS = Number(process.env.MENU_FALLBACK_TTL_MS || 5 * 60 * 1000);

type CachedPayload = { categories: TransformedCategory[]; menuItems: TransformedMenuItem[]; message?: string };
let menuCache: { payload: CachedPayload; expiresAt: number } | null = null;

function buildCacheHeaders(ttlMs: number, status: 'HIT' | 'MISS' | 'FALLBACK'): HeadersInit {
  const sMaxAge = Math.max(0, Math.floor(ttlMs / 1000));
  const browserMaxAge = Math.min(600, sMaxAge); // cap browser at 10m
  return {
    'Cache-Control': `public, max-age=${browserMaxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    'Content-Type': 'application/json',
    'X-Cache': status,
    'X-Cache-TTL': String(sMaxAge),
  };
}

async function fetchMenuData() {
  try {
    // Single optimized query to fetch all data at once
    const data = await client.fetch<{
      categories: SanityMenuCategory[];
      items: SanityMenuItem[];
    }>(`
      {
        "categories": *[_type == "menuCategory"] | order(order asc) {
          _id,
          name,
          order,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        },
        "items": *[_type == "menuItem" && active == true] | order(order asc) {
          _id,
          name,
          description,
          price,
          originalPrice,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt,
          category->{
            _id,
            name,
            order
          },
          popular,
          discount,
          bogo,
          active,
          available,
          order
        }
      }
    `);

    // Transform the data to match the expected format
    const transformedCategories: TransformedCategory[] = data.categories.map(category => ({
      id: category._id,
      name: category.name,
      description: '',
      active: true,
      order: category.order,
      imageUrl: category.imageUrl,
      imageAlt: category.imageAlt,
      items: []
    }));

    const transformedItems: TransformedMenuItem[] = data.items.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category?.name || '',
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      popular: item.popular,
      discount: item.discount,
      bogo: item.bogo,
      active: item.active,
      available: item.available,
      order: item.order
    }));

    // Group items by category
    const categoriesWithItems = transformedCategories.map(category => ({
      ...category,
      items: transformedItems.filter(item => item.category === category.name)
    }));

    return {
      categories: categoriesWithItems,
      menuItems: transformedItems
    };
  } catch (error) {
    console.error('Error fetching menu data:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const now = Date.now();
    const url = new URL(request.url);
    const noCache = url.searchParams.get('nocache') === '1' || url.searchParams.get('refresh') === '1';

    if (!noCache && menuCache && menuCache.expiresAt > now) {
      return NextResponse.json(menuCache.payload, {
        headers: buildCacheHeaders(menuCache.expiresAt - now, 'HIT'),
      });
    }

    const data = await fetchMenuData();
    const payload: CachedPayload = data;
    menuCache = { payload, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS };

    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_CACHE_TTL_MS, 'MISS'),
    });
  } catch (error) {
    console.error('API Error:', error);
    const payload: CachedPayload = { categories: [], menuItems: [], message: 'Failed to fetch menu data' };
    menuCache = { payload, expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS };
    return NextResponse.json(payload, {
      status: 500,
      headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, 'FALLBACK'),
    });
  }
} 