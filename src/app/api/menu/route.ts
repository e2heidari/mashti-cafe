import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create Sanity client with CDN enabled for better performance
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true, // Enable CDN for better performance
});

interface SanityMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
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
}

interface TransformedMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
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
  items: TransformedMenuItem[];
}

async function fetchMenuData() {
  try {
    // Fetch categories
    const categories = await client.fetch<SanityMenuCategory[]>(`
      *[_type == "menuCategory"] | order(order asc) {
        _id,
        name,
        order
      }
    `);

    // Fetch items with category information
    const items = await client.fetch<SanityMenuItem[]>(`
      *[_type == "menuItem" && active == true] | order(order asc) {
        _id,
        name,
        description,
        price,
        originalPrice,
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
    `);

    // Transform the data to match the expected format
    const transformedCategories: TransformedCategory[] = categories.map(category => ({
      id: category._id,
      name: category.name,
      description: '',
      active: true,
      order: category.order,
      items: []
    }));

    const transformedItems: TransformedMenuItem[] = items.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category?.name || 'Unknown',
      popular: item.popular,
      discount: item.discount,
      bogo: item.bogo,
      active: item.active,
      available: item.available,
      order: item.order
    }));

    // Group items by category
    transformedCategories.forEach(category => {
      category.items = transformedItems.filter(item => item.category === category.name);
    });

    return { categories: transformedCategories, menuItems: transformedItems };
  } catch (error) {
    console.error('Error fetching menu data from Sanity:', error);
    return null;
  }
}

// Cache for storing the last successfully fetched data
let cachedData: { categories: TransformedCategory[]; menuItems: TransformedMenuItem[] } | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache for better performance

export async function GET() {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedData && (now - lastCacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData);
    }

    // Try to fetch fresh data
    const freshData = await fetchMenuData();
    
    if (freshData) {
      // Update cache with fresh data
      cachedData = freshData;
      lastCacheTime = now;
      return NextResponse.json(freshData);
    }

    // If fresh data failed but we have cached data, return cached data
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // If no data available at all, return empty arrays
    return NextResponse.json({ categories: [], menuItems: [] });
  } catch (error) {
    console.error('API route error:', error);
    
    // Return cached data if available, otherwise empty arrays
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    
    return NextResponse.json({ categories: [], menuItems: [] });
  }
} 