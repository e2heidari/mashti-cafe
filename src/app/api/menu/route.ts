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

// Cache duration in seconds (15 minutes)
const CACHE_DURATION = 15 * 60;

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
          order
        },
        "items": *[_type == "menuItem" && active == true] | order(order asc) {
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
      }
    `);

    // Transform the data to match the expected format
    const transformedCategories: TransformedCategory[] = data.categories.map(category => ({
      id: category._id,
      name: category.name,
      description: '',
      active: true,
      order: category.order,
      items: []
    }));

    const transformedItems: TransformedMenuItem[] = data.items.map(item => ({
      id: item._id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category?.name || '',
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

export async function GET() {
  try {
    const data = await fetchMenuData();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
} 