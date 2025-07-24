import { NextResponse } from 'next/server';

interface DirectusCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
  active: number;
}

interface DirectusMenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  popular: number;
  discount: number;
  bogo: number;
  order: number;
  active: number;
  available: number;
  image?: unknown;
  menu_category?: DirectusCategory;
}

let cachedData: {
  categories: DirectusCategory[];
  menuItems: DirectusMenuItem[];
} | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function GET() {
  try {
    const directusUrl = 'http://localhost:8055';
    const serverCheck = await fetch(`${directusUrl}/server/info`, { 
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    }).catch(() => null);
    if (!serverCheck || !serverCheck.ok) {
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        return NextResponse.json(cachedData);
      } else {
        return NextResponse.json({ categories: [], menuItems: [] });
      }
    }
    const loginResponse = await fetch(`${directusUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ehsan.heydari@gmail.com',
        password: 'admin123'
      }),
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    if (!loginResponse || !loginResponse.ok) {
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        return NextResponse.json(cachedData);
      } else {
        return NextResponse.json({ categories: [], menuItems: [] });
      }
    }
    const loginData = await loginResponse.json();
    const accessToken = loginData.data.access_token;
    const categoriesResponse = await fetch(`${directusUrl}/items/menu_categories?filter[active][_eq]=true&sort=order`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    if (!categoriesResponse || !categoriesResponse.ok) {
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        return NextResponse.json(cachedData);
      } else {
        return NextResponse.json({ categories: [], menuItems: [] });
      }
    }
    const categoriesData = await categoriesResponse.json();
    const menuItemsResponse = await fetch(`${directusUrl}/items/menu_items?filter[active][_eq]=true&sort=order&fields=*,menu_category.*`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    if (!menuItemsResponse || !menuItemsResponse.ok) {
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        return NextResponse.json(cachedData);
      } else {
        return NextResponse.json({ categories: [], menuItems: [] });
      }
    }
    const menuItemsData = await menuItemsResponse.json();
    const categoryMap = new Map<number, DirectusCategory>();
    (categoriesData.data as DirectusCategory[]).forEach((cat) => {
      categoryMap.set(cat.id, cat);
    });
    const menuItemsWithCategories = (menuItemsData.data as DirectusMenuItem[]).map((item) => ({
      ...item,
      menu_category: item.menu_category ? categoryMap.get((item.menu_category as DirectusCategory).id) : undefined
    }));
    const freshData = {
      categories: categoriesData.data as DirectusCategory[] || [],
      menuItems: menuItemsWithCategories || []
    };
    cachedData = freshData;
    lastCacheTime = Date.now();
    return NextResponse.json(freshData);
  } catch {
    if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    } else {
      return NextResponse.json({ categories: [], menuItems: [] });
    }
  }
} 