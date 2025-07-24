export interface DirectusMenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  popular: number; // Changed from boolean to number (0/1)
  discount: number; // Changed from boolean to number (0/1)
  bogo: number; // Changed from boolean to number (0/1)
  order: number;
  active: number; // Changed from boolean to number (0/1)
  available: number; // Changed from boolean to number (0/1)
  image?: {
    id: string;
    filename_download: string;
  };
  menu_category?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface DirectusMenuCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
  active: number; // Changed from boolean to number (0/1)
}

export interface MenuApiResponse {
  menuItems: DirectusMenuItem[];
  categories: DirectusMenuCategory[];
}

export async function fetchMenuData(): Promise<MenuApiResponse> {
  const res = await fetch('/api/menu');
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
}

// Transformed menu item type for our components
export interface TransformedMenuItem {
  id: number;
  icon: string;
  title: string;
  price: number;
  description: string;
  bgColor: string;
  popular: boolean;
  discount: boolean;
  promotion: boolean;
  category: string;
  originalPrice?: number;
  subtitle?: string;
}

export interface TransformedMenuCategory {
  id: number;
  name: string;
  slug: string;
  order: number;
  active: boolean;
}

export function transformDirectusData(directusData: MenuApiResponse) {
  // Transform categories
  const categories = directusData.categories.map((cat: DirectusMenuCategory) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    order: cat.order,
    active: Boolean(cat.active),
  }));

  // Transform items
  const items = directusData.menuItems.map((item: DirectusMenuItem) => ({
    id: item.id,
    icon: "🍽️", // Can be changed based on category
    title: item.name,
    price: item.price,
    description: item.description,
    bgColor: "bg-orange-500", // Or any color you want
    popular: Boolean(item.popular),
    discount: Boolean(item.discount),
    promotion: Boolean(item.bogo),
    category: item.menu_category?.name || "",
    originalPrice: undefined,
    subtitle: undefined,
  }));

  return { categories, items };
} 