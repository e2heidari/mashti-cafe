import { NextResponse } from 'next/server';

// Cache for storing the last successful Directus data
let cachedData: any = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export async function GET() {
  try {
    // Try to fetch from Directus first
    const directusUrl = 'http://localhost:8055';
    
    // Check if Directus is available with a short timeout
    const serverCheck = await fetch(`${directusUrl}/server/info`, { 
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    }).catch(() => null);
    
    if (!serverCheck || !serverCheck.ok) {
      console.log('Directus not available, checking cache...');
      
      // Check if we have valid cached data
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        console.log('Using cached data from Directus');
        return NextResponse.json(cachedData);
      } else {
        console.log('No valid cache available, returning empty data');
        return NextResponse.json({
          categories: [],
          menuItems: []
        });
      }
    }
    
    // Try to login to Directus
    const loginResponse = await fetch(`${directusUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'ehsan.heydari@gmail.com',
        password: 'admin123'
      }),
      signal: AbortSignal.timeout(3000) // 3 second timeout
    }).catch(() => null);
    
    if (!loginResponse || !loginResponse.ok) {
      console.log('Directus login failed, checking cache...');
      
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        console.log('Using cached data from Directus');
        return NextResponse.json(cachedData);
      } else {
        console.log('No valid cache available, returning empty data');
        return NextResponse.json({
          categories: [],
          menuItems: []
        });
      }
    }
    
    const loginData = await loginResponse.json();
    const accessToken = loginData.data.access_token;
    
    // Try to get categories
    const categoriesResponse = await fetch(`${directusUrl}/items/menu_categories?filter[active][_eq]=true&sort=order`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    
    if (!categoriesResponse || !categoriesResponse.ok) {
      console.log('Categories fetch failed, checking cache...');
      
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        console.log('Using cached data from Directus');
        return NextResponse.json(cachedData);
      } else {
        console.log('No valid cache available, returning empty data');
        return NextResponse.json({
          categories: [],
          menuItems: []
        });
      }
    }
    
    const categoriesData = await categoriesResponse.json();
    
    // Try to get menu items
    const menuItemsResponse = await fetch(`${directusUrl}/items/menu_items?filter[active][_eq]=true&sort=order&fields=*,menu_category.*`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);
    
    if (!menuItemsResponse || !menuItemsResponse.ok) {
      console.log('Menu items fetch failed, checking cache...');
      
      if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
        console.log('Using cached data from Directus');
        return NextResponse.json(cachedData);
      } else {
        console.log('No valid cache available, returning empty data');
        return NextResponse.json({
          categories: [],
          menuItems: []
        });
      }
    }
    
    const menuItemsData = await menuItemsResponse.json();

    // If we get here, Directus is working perfectly
    console.log('Directus working perfectly, using live data and updating cache');

    // Create a map of category IDs to category objects
    const categoryMap = new Map();
    categoriesData.data.forEach((cat: any) => {
      categoryMap.set(cat.id, cat);
    });

    // Add full category objects to menu items
    const menuItemsWithCategories = menuItemsData.data.map((item: any) => ({
      ...item,
      menu_category: categoryMap.get(item.menu_category) || null
    }));

    const freshData = {
      categories: categoriesData.data || [],
      menuItems: menuItemsWithCategories || []
    };

    // Update cache with fresh data
    cachedData = freshData;
    lastCacheTime = Date.now();

    return NextResponse.json(freshData);

  } catch (error) {
    console.error('Error fetching menu data from Directus, checking cache:', error);
    
    if (cachedData && (Date.now() - lastCacheTime) < CACHE_DURATION) {
      console.log('Using cached data from Directus');
      return NextResponse.json(cachedData);
    } else {
      console.log('No valid cache available, returning empty data');
      return NextResponse.json({
        categories: [],
        menuItems: []
      });
    }
  }
} 