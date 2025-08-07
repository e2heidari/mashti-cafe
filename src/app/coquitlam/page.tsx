"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import MenuItem from "../../components/MenuItem";

interface MenuItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  popular: boolean;
  discount: boolean;
  bogo: boolean;
  active: boolean;
  available: boolean;
  order: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  active: boolean;
  order: number;
  imageUrl?: string;
  imageAlt?: string;
  items: MenuItemType[];
}

interface MenuApiResponse {
  categories: MenuCategory[];
  menuItems: MenuItemType[];
}

export default function CoquitlamBranch() {
  const [activeMenu, setActiveMenu] = useState("shakes");
  const [filter, setFilter] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [menuData, setMenuData] = useState<MenuApiResponse>({
    categories: [],
    menuItems: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch menu data from CMS
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch("/api/menu");
        if (response.ok) {
          const data = await response.json();
          setMenuData(data);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Filter functions
  const filterItems = (items: MenuItemType[], category: string) => {
    if (!filter) return items;
    let filteredItems = items;

    if (filter === "popular") {
      filteredItems = items.filter((item) => item.popular);
    } else if (filter === "discount") {
      filteredItems = items.filter((item) => item.discount);
    } else if (filter === "promotion") {
      filteredItems = items.filter((item) => item.bogo);
    }

    return filteredItems.map((item) => ({ ...item, category: category }));
  };

  const getAllFilteredItems = () => {
    if (!filter) return [];
    const allItems = menuData.categories.flatMap((category) =>
      filterItems(category.items, category.name)
    );
    return allItems;
  };

  // Get items for current active menu
  const getCurrentMenuItems = () => {
    if (!menuData.categories.length) return [];
    const category = menuData.categories.find((cat) =>
      cat.name.toLowerCase().includes(activeMenu.toLowerCase())
    );
    return category?.items || [];
  };

  // Get all categories for tabs
  const getMenuCategories = () => {
    return menuData.categories.sort((a, b) => a.order - b.order);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-[#e80812] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation onAIOpen={() => setIsAIOpen(true)} />
      </Suspense>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-4 sm:px-6 lg:px-8 bg-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Image
              src="/images/newmashti-logo.png"
              alt="Mashti Logo"
              width={80}
              height={80}
              className="rounded-full"
            />
            <div className="text-white">
              <h1 className="text-3xl font-bold">MASHTI</h1>
              <p className="text-lg opacity-90">JUICE BAR + COFFEE</p>
            </div>
          </div>
          <h2 className="text-5xl font-bold text-white font-pike mb-6">
            Coquitlam Branch
          </h2>
          <p className="text-xl text-gray-300 mb-8">Coquitlam Centre</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400">📍</div>
                <p className="text-gray-300 text-sm">Pinetree Way</p>
                <p className="text-gray-300 text-sm">Coquitlam, BC</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">📞</div>
                <p className="text-gray-300 text-sm">(604) 971 0588</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">🕒</div>
                <p className="text-gray-300 text-sm">Mon-Sun</p>
                <p className="text-gray-300 text-sm">11AM-12AM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white font-pike text-center mb-8">
            Our Menu
          </h2>

          {/* Menu Tabs */}
          <div
            className={`flex flex-wrap justify-center gap-2 mb-8 ${
              filter ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {getMenuCategories().map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveMenu(category.name.toLowerCase())}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeMenu === category.name.toLowerCase()
                    ? "bg-[#e80812] text-white shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilter("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === ""
                  ? "bg-[#e80812] text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setFilter("popular")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "popular"
                  ? "bg-[#e80812] text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Popular
            </button>
            <button
              onClick={() => setFilter("discount")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "discount"
                  ? "bg-[#e80812] text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Discount
            </button>
            <button
              onClick={() => setFilter("promotion")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === "promotion"
                  ? "bg-[#e80812] text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              BOGO
            </button>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filter
              ? // Show filtered items across all categories
                getAllFilteredItems().map((item) => (
                  <MenuItem
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    category={item.category}
                    imageUrl={item.imageUrl}
                    imageAlt={item.imageAlt}
                    popular={item.popular}
                    discount={item.discount}
                    bogo={item.bogo}
                  />
                ))
              : // Show items for current active menu
                getCurrentMenuItems().map((item) => (
                  <MenuItem
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    category={item.category}
                    imageUrl={item.imageUrl}
                    imageAlt={item.imageAlt}
                    popular={item.popular}
                    discount={item.discount}
                    bogo={item.bogo}
                  />
                ))}
          </div>

          {/* No Items Message */}
          {((filter && getAllFilteredItems().length === 0) ||
            (!filter && getCurrentMenuItems().length === 0)) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No items found
              </h3>
              <p className="text-gray-300">
                {filter
                  ? `No ${filter} items available at the moment.`
                  : "No items available in this category."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Assistant */}
      {isAIOpen && (
        <div className="fixed inset-0 z-50">
          {/* AI Assistant component will be rendered here */}
        </div>
      )}
    </div>
  );
}
