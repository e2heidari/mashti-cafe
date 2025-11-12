import { cache, Suspense } from "react";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import CentralMenuClient, {
  MenuCategory,
  MenuItemData,
} from "./CentralMenuClient";

const REVALIDATE_SECONDS = 3600;
export const revalidate = 3600;

const menuQuery = groq`{
  "categories": *[_type == "menuCategory"] | order(order asc) {
    _id,
    name,
    order,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  },
  "menuItems": *[_type == "menuItem" && active == true] | order(order asc) {
    _id,
    name,
    description,
    price,
    originalPrice,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    popular,
    discount,
    bogo,
    available,
    order,
    "category": category->name
  }
}`;

type MenuQueryResult = {
  categories: MenuCategory[];
  menuItems: (Omit<MenuItemData, "id" | "category"> & {
    _id: string;
    category?: string;
  })[];
};

const getMenuData = cache(async () => {
  const data = await client.fetch<MenuQueryResult>(
    menuQuery,
    {},
    { next: { revalidate: REVALIDATE_SECONDS } }
  );

  const categories = data.categories ?? [];
  const menuItems: MenuItemData[] = (data.menuItems ?? []).map((item) => ({
    id: item._id,
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    originalPrice: item.originalPrice,
    category: item.category ?? "",
    imageUrl: item.imageUrl,
    imageAlt: item.imageAlt,
    popular: item.popular,
    discount: item.discount,
    bogo: item.bogo,
    available: item.available,
    order: item.order,
  }));

  return { categories, menuItems };
});

export default async function CentralMenuPage() {
  try {
    const { categories, menuItems } = await getMenuData();
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-gray-600 text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <p className="text-lg">Loading menu...</p>
            </div>
          </div>
        }
      >
        <CentralMenuClient categories={categories} menuItems={menuItems} />
      </Suspense>
    );
  } catch (error) {
    console.error("Failed to load menu data for Central branch:", error);
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-gray-600 text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
              <p className="text-lg">Loading menu...</p>
            </div>
          </div>
        }
      >
        <CentralMenuClient
          categories={[]}
          menuItems={[]}
          error="Failed to load menu"
        />
      </Suspense>
    );
  }
}
