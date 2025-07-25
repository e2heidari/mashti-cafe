import { createClient } from 'next-sanity'

// Sanity data interfaces
export interface SanityMenuItem {
  _id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  category: {
    _id: string
    name: string
    order: number
  }
  popular: boolean
  discount: boolean
  bogo: boolean
  active: boolean
  available: boolean
  order: number
}

export interface SanityMenuCategory {
  _id: string
  name: string
  order: number
}

export interface MenuApiResponse {
  categories: TransformedMenuCategory[];
  menuItems: TransformedMenuItem[];
}

// Fetch menu data from Sanity
export async function fetchMenuData(): Promise<MenuApiResponse> {
  try {
    console.log('Sanity config:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    });

    // Create Sanity client inside the function
    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: '2024-01-01',
      useCdn: true, // Enable CDN for better performance
    })

    // Fetch categories
    const categories = await client.fetch<SanityMenuCategory[]>(`
      *[_type == "menuCategory"] | order(order asc) {
        _id,
        name,
        order
      }
    `)

    console.log('Categories fetched:', categories.length);

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
    `)

    console.log('Items fetched:', items.length);

    // Transform the data to match our interfaces
    const transformedCategories: TransformedMenuCategory[] = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      order: cat.order
    }));

    const transformedItems: TransformedMenuItem[] = items.map(item => ({
      id: item._id,
      name: item.name,
      price: item.price,
      description: item.description || "",
      popular: item.popular,
      discount: item.discount,
      bogo: item.bogo,
      category: item.category?.name || "",
      originalPrice: item.originalPrice
    }));

    return {
      categories: transformedCategories,
      menuItems: transformedItems
    }
  } catch (error) {
    console.error('Error fetching menu data from Sanity:', error)
    throw new Error('Failed to fetch menu data')
  }
}

// Transformed menu item type for our components
export interface TransformedMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  popular: boolean;
  discount: boolean;
  bogo: boolean;
  category: string;
  originalPrice?: number;
}

export interface TransformedMenuCategory {
  _id: string;
  name: string;
  order: number;
}

export function transformDirectusData(directusData: MenuApiResponse) {
  // Transform categories
  const categories = directusData.categories.map((cat: TransformedMenuCategory) => ({
    _id: cat._id,
    name: cat.name,
    order: cat.order
  }));

  // Transform items
  const items = directusData.menuItems.map((item: TransformedMenuItem) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    description: item.description,
    popular: item.popular,
    discount: item.discount,
    bogo: item.bogo,
    category: item.category,
    originalPrice: item.originalPrice
  }));

  return { categories, items };
} 