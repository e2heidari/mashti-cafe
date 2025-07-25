"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Navigation from "../../../components/Navigation";
import MenuItem from "../../../components/MenuItem";
import dynamic from "next/dynamic";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamic(() => import("../../../components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});
import {
  TransformedMenuCategory,
  TransformedMenuItem,
  MenuApiResponse,
} from "../../../data/menuApi";

export default function CentralMenuPage() {
  const [activeMenu, setActiveMenu] = useState("");
  const [filter, setFilter] = useState("");
  const [menuData, setMenuData] = useState<{
    categories: TransformedMenuCategory[];
    menuItems: TransformedMenuItem[];
  }>({
    categories: [],
    menuItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch("/api/menu", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "max-age=900", // 15 minutes cache
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: MenuApiResponse = await res.json();
      setMenuData(data);

      if (data.categories.length > 0) {
        const firstCategoryWithItems = data.categories.find(
          (cat: TransformedMenuCategory) =>
            data.menuItems.some(
              (item: TransformedMenuItem) => item.category === cat.name
            )
        );
        if (firstCategoryWithItems) {
          setActiveMenu(firstCategoryWithItems.name);
        }
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setError(error instanceof Error ? error.message : "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtered items for better performance
  const filteredItems = useMemo(() => {
    if (!menuData.menuItems.length) return [];

    let items = menuData.menuItems;

    if (filter === "popular") {
      items = items.filter((item) => item.popular);
    } else if (filter === "discount") {
      items = items.filter((item) => item.discount);
    } else if (filter === "bogo") {
      items = items.filter((item) => item.bogo);
    } else if (activeMenu) {
      items = items.filter((item) => item.category === activeMenu);
    }

    return items.sort((a, b) => a.order - b.order);
  }, [menuData.menuItems, filter, activeMenu]);

  // Memoized sorted categories
  const sortedCategories = useMemo(() => {
    return menuData.categories.sort((a, b) => a.order - b.order);
  }, [menuData.categories]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setActiveMenu(categoryName);
    setFilter("");
  }, []);

  const handleFilterClick = useCallback((filterType: string) => {
    setFilter(filterType);
    setActiveMenu("");
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
        <div className="pt-56 pb-12">
          <div className="text-white text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
        <div className="pt-56 pb-12">
          <div className="text-white text-center py-20">
            <p className="text-lg mb-4">Failed to load menu</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
      <div className="pt-56 pb-12">
        <h1 className="text-5xl font-extrabold text-white text-center mb-8">
          Menu
        </h1>

        {/* Menu Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {sortedCategories.map(
            (cat: TransformedMenuCategory, index: number) => (
              <button
                key={cat._id || `category-${cat.name}-${index}`}
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeMenu === cat.name
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {cat.name}
              </button>
            )
          )}
        </div>

        {/* Filter Options */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => handleFilterClick("popular")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "popular"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => handleFilterClick("discount")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "discount"
                ? "bg-red-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Discount
          </button>
          <button
            onClick={() => handleFilterClick("bogo")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "bogo"
                ? "bg-purple-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            BOGO
          </button>
        </div>

        {/* Menu Items */}
        <div className="max-w-6xl mx-auto px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-lg mb-4">
                {filter || activeMenu
                  ? `No items found in ${filter || activeMenu}`
                  : "No menu items available"}
              </p>
              <button
                onClick={() => {
                  setFilter("");
                  setActiveMenu("");
                }}
                className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: TransformedMenuItem) => (
                <MenuItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  popular={item.popular}
                  discount={item.discount}
                  promotion={item.bogo}
                  originalPrice={item.originalPrice}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      {isAIOpen && (
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      )}
    </div>
  );
}
