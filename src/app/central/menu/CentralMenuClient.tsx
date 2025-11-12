"use client";

import { useMemo, useState, useCallback, Suspense, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import MenuItem from "@/components/MenuItem";
import dynamic from "next/dynamic";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"), {
  loading: () => <div className="text-black">Loading AI Assistant...</div>,
  ssr: false,
});

export interface MenuCategory {
  _id: string;
  name: string;
  order: number;
  imageUrl?: string;
  imageAlt?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  popular: boolean;
  discount: boolean;
  bogo: boolean;
  available: boolean;
  order: number;
}

interface CentralMenuClientProps {
  categories: MenuCategory[];
  menuItems: MenuItemData[];
  error?: string | null;
}

export default function CentralMenuClient({
  categories,
  menuItems,
  error = null,
}: CentralMenuClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const slugify = useCallback((value: string) => {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }, []);

  const initialActiveMenu = useMemo(() => {
    const firstCategory = categories.find((cat) =>
      menuItems.some((item) => item.category === cat.name)
    );
    return firstCategory?.name ?? "";
  }, [categories, menuItems]);

  const [activeMenu, setActiveMenu] = useState(initialActiveMenu);

  useEffect(() => {
    if (!searchParams) return;

    const categorySlug = searchParams.get("category");
    const filterParam = searchParams.get("filter");

    if (filterParam) {
      setFilter(filterParam);
      setActiveMenu("");
    } else if (categorySlug) {
      const matchedCategory = categories.find(
        (cat) => slugify(cat.name) === categorySlug
      );
      if (matchedCategory) {
        setActiveMenu(matchedCategory.name);
        setFilter("");
        return;
      }
    } else {
      setFilter("");
      setActiveMenu(initialActiveMenu);
    }
  }, [searchParams, categories, initialActiveMenu, slugify]);

  const updateQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const nextParams = new URLSearchParams(searchParams?.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      });

      const queryString = nextParams.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const handleCategoryClick = useCallback(
    (categoryName: string) => {
      setActiveMenu(categoryName);
      setFilter("");
      updateQueryString({
        category: slugify(categoryName),
        filter: null,
      });
    },
    [slugify, updateQueryString]
  );

  const handleFilterClick = useCallback(
    (filterType: string) => {
      setFilter(filterType);
      setActiveMenu("");
      updateQueryString({
        filter: filterType,
        category: null,
      });
    },
    [updateQueryString]
  );

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  const filteredItems = useMemo(() => {
    if (!menuItems.length) return [];
    let items = [...menuItems];

    if (filter === "popular") {
      items = items.filter((item) => item.popular);
    } else if (filter === "discount") {
      items = items.filter(
        (item) =>
          item.discount &&
          !!item.originalPrice &&
          item.originalPrice > item.price
      );
    } else if (filter === "bogo") {
      items = items.filter((item) => item.bogo);
    } else if (activeMenu) {
      items = items.filter((item) => item.category === activeMenu);
    }

    return items.sort((a, b) => a.order - b.order);
  }, [menuItems, filter, activeMenu]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
          }
        >
          <Navigation showMenu onAIOpen={() => setIsAIOpen(true)} />
        </Suspense>
        <div className="pt-64 pb-12">
          <div className="text-gray-600 text-center py-20">
            <p className="text-lg mb-4 font-sodo">Failed to load menu</p>
            <button
              onClick={() => router.refresh()}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-lander font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!menuItems.length) {
    return (
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
          }
        >
          <Navigation showMenu onAIOpen={() => setIsAIOpen(true)} />
        </Suspense>
        <div className="pt-64 pb-12">
          <div className="text-gray-600 text-center py-20">
            <p className="text-lg mb-4 font-sodo">No menu items available</p>
            <button
              onClick={() => router.push("/central")}
              className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-pike font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
        }
      >
        <Navigation showMenu onAIOpen={() => setIsAIOpen(true)} />
      </Suspense>
      <div className="pt-48 md:pt-64 pb-10">
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <button
            onClick={() => router.push("/central")}
            className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base"
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2 font-pike">
          Menu
        </h1>
        <div className="border-b-4 border-red-600 w-16 mx-auto my-4"></div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {sortedCategories.map((cat) => {
            const isActive = activeMenu
              ? activeMenu === cat.name
              : searchParams?.get("category") === slugify(cat.name);

            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat.name)}
                className={`border px-5 py-2 rounded-full font-semibold text-base transition-all font-lander
                ${
                  isActive
                    ? "border-red-600 text-red-600 font-bold bg-white"
                    : "border-gray-200 text-black bg-white"
                }
                hover:border-red-600 hover:text-red-600'`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => handleFilterClick("popular")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all font-lander
              ${
                filter === "popular"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'`}
          >
            Popular
          </button>
          <button
            onClick={() => handleFilterClick("discount")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all font-lander
              ${
                filter === "discount"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'`}
          >
            Discount
          </button>
          <button
            onClick={() => handleFilterClick("bogo")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all font-lander
              ${
                filter === "bogo"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'`}
          >
            Buy1 Get1 FREE
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4 font-sodo">
                {filter || activeMenu
                  ? `No items found in ${filter || activeMenu}`
                  : "No menu items available"}
              </p>
              <button
                onClick={() => {
                  setFilter("");
                  setActiveMenu(initialActiveMenu);
                  updateQueryString({
                    filter: null,
                    category: slugify(initialActiveMenu),
                  });
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-bold font-pike"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 shadow-xs rounded-lg p-5 mb-4 flex flex-col h-full"
                >
                  <MenuItem
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    popular={item.popular}
                    discount={item.discount}
                    bogo={item.bogo}
                    originalPrice={item.originalPrice}
                    imageUrl={item.imageUrl}
                    imageAlt={item.imageAlt}
                    category={item.category}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-3 mt-6 md:mt-8">
        <div className="flex justify-center">
          <a
            href="https://www.ubereats.com/ca/store/mashti-cafe/OTDxWR8iVwyOzfzA_HHxRA?diningMode=DELIVERY&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjIwNDElMjBCZWxsd29vZCUyMEF2ZSUyMiUyQyUyMnJlZmVyZW5jZSUyMiUzQSUyMjUxMmE3YzBkLTNiMjUtOTY1ZS1lYmYzLThiZWM1NTRkMTA4NyUyMiUyQyUyMnJlZmVyZW5jZVR5cGUlMjIlM0ElMjJ1YmVyX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBNDkuMjY1NzcyJTJDJTIybG9uZ2l0dWRlJTIyJTNBLTEyMi45ODg5MjMlN0Q%3D&sc=SEARCH_SUGGESTION"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#06c167] text-white px-6 py-3 rounded-full hover:brightness-95 transition font-semibold text-base md:text-lg"
            aria-label="Order on Uber Eats"
          >
            <Image
              src="/images/uber-eats.png"
              alt="Uber Eats"
              width={300}
              height={75}
              className="h-14 md:h-16 w-auto"
            />
            <span>Order on Uber Eats</span>
          </a>
        </div>
      </div>

      {isAIOpen && (
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      )}
    </div>
  );
}
