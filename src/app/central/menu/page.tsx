"use client";

import { useState, useEffect } from "react";
import Navigation from "../../../components/Navigation";
import MenuItem from "../../../components/MenuItem";
import AIAssistant from "../../../components/AIAssistant";
import {
  fetchMenuData,
  transformDirectusData,
  TransformedMenuCategory,
  TransformedMenuItem,
  MenuApiResponse,
} from "../../../data/menuApi";

export default function CentralMenuPage() {
  const [activeMenu, setActiveMenu] = useState("");
  const [filter, setFilter] = useState("");
  const [menuData, setMenuData] = useState<{
    categories: TransformedMenuCategory[];
    items: TransformedMenuItem[];
  }>({
    categories: [],
    items: [],
  });
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);

  useEffect(() => {
    fetchMenuData()
      .then((data: MenuApiResponse) => {
        const transformed = transformDirectusData(data);
        setMenuData(transformed);
        if (transformed.categories.length > 0) {
          const firstCategoryWithItems = transformed.categories.find(
            (cat: TransformedMenuCategory) =>
              transformed.items.some(
                (item: TransformedMenuItem) => item.category === cat.name
              )
          );
          if (firstCategoryWithItems) {
            setActiveMenu(firstCategoryWithItems.name);
          }
        }
        setLoading(false);
      })
      .catch((error: unknown) => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
      <div className="pt-56 pb-12">
        <h1 className="text-5xl font-extrabold text-white text-center mb-8">
          Menu
        </h1>
        {/* Menu Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {menuData.categories
            .sort((a, b) => a.order - b.order)
            .map((cat: TransformedMenuCategory) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveMenu(cat.name);
                  setFilter("");
                }}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeMenu === cat.name
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {cat.name}
              </button>
            ))}
        </div>
        {/* Filter Options */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => {
              setFilter("popular");
              setActiveMenu("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "popular"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            ⭐ Popular
          </button>
          <button
            onClick={() => {
              setFilter("discount");
              setActiveMenu("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "discount"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            🏷️ Discount
          </button>
          <button
            onClick={() => {
              setFilter("promotion");
              setActiveMenu("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "promotion"
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            🎁 Buy 1 Get 1 FREE
          </button>
        </div>
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {(() => {
            let itemsToShow = menuData.items;
            if (filter) {
              if (filter === "popular") {
                itemsToShow = itemsToShow.filter(
                  (item: TransformedMenuItem) => item.popular
                );
              } else if (filter === "discount") {
                itemsToShow = itemsToShow.filter(
                  (item: TransformedMenuItem) => item.discount
                );
              } else if (filter === "promotion") {
                itemsToShow = itemsToShow.filter(
                  (item: TransformedMenuItem) => item.promotion
                );
              }
            } else if (activeMenu) {
              itemsToShow = itemsToShow.filter(
                (item: TransformedMenuItem) => item.category === activeMenu
              );
            }
            if (itemsToShow.length === 0) {
              let message = "No items available.";
              if (filter === "discount")
                message = "No discounted items available.";
              else if (filter === "popular")
                message = "No popular items available.";
              else if (filter === "promotion")
                message = "No promotional items available.";
              else if (activeMenu)
                message = `No items available in ${activeMenu} category.`;
              else message = "No items available.";
              return (
                <div className="col-span-full text-center text-gray-300 text-lg py-10">
                  {message}
                </div>
              );
            }
            return itemsToShow.map(
              (item: TransformedMenuItem, index: number) => (
                <MenuItem
                  key={index}
                  {...item}
                  price={item.price.toString()}
                  originalPrice={item.originalPrice?.toString()}
                />
              )
            );
          })()}
        </div>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
