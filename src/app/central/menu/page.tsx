"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Navigation from "../../../components/Navigation";
import MenuItem from "../../../components/MenuItem";
import dynamic from "next/dynamic";

const AIAssistant = dynamic(() => import("../../../components/AIAssistant"), {
  loading: () => <div className="text-black">Loading AI Assistant...</div>,
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
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/menu", {
        signal: controller.signal,
        headers: {
          "Cache-Control": "max-age=900",
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
    <div className="min-h-screen bg-white">
      <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
      <div className="pt-56 pb-12">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
          Menu
        </h1>
        <div className="border-b-4 border-red-600 w-16 mx-auto my-4"></div>
        {/* Menu Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {sortedCategories.map(
            (cat: TransformedMenuCategory, index: number) => (
              <button
                key={cat._id || `category-${cat.name}-${index}`}
                onClick={() => handleCategoryClick(cat.name)}
                className={`border px-5 py-2 rounded-full font-semibold text-base transition-all
                  ${
                    activeMenu === cat.name
                      ? "border-red-600 text-red-600 font-bold bg-white"
                      : "border-gray-200 text-black bg-white"
                  }
                  hover:border-red-600 hover:text-red-600'
                `}
              >
                {cat.name}
              </button>
            )
          )}
        </div>
        {/* Filter Options */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => handleFilterClick("popular")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                filter === "popular"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'
            `}
          >
            Popular
          </button>
          <button
            onClick={() => handleFilterClick("discount")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                filter === "discount"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'
            `}
          >
            Discount
          </button>
          <button
            onClick={() => handleFilterClick("bogo")}
            className={`bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                filter === "bogo"
                  ? "bg-red-600 text-white border-red-600 font-bold"
                  : "text-gray-700"
              }
              hover:border-red-600 hover:text-red-600'
            `}
          >
            Buy1 Get1 FREE
          </button>
        </div>
        {/* Menu Items */}
        <div className="max-w-6xl mx-auto px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-4">
                {filter || activeMenu
                  ? `No items found in ${filter || activeMenu}`
                  : "No menu items available"}
              </p>
              <button
                onClick={() => {
                  setFilter("");
                  setActiveMenu("");
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-bold"
              >
                Show All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: TransformedMenuItem) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 shadow-xs rounded-lg p-5 mb-4 flex flex-col h-full"
                >
                  <MenuItem
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    popular={item.popular}
                    discount={item.discount}
                    promotion={item.bogo}
                    originalPrice={item.originalPrice}
                  />
                </div>
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
