"use client";

import { useState } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import MenuItem from "../../components/MenuItem";
import AIAssistant from "../../components/AIAssistant";

// Import menu data
import {
  menuItems,
  coffeeTeaItems,
  smoothieItems,
  juiceItems,
  sweetsItems,
  iceCreamItems,
  proteinShakeItems,
  MenuItemType,
} from "../../data/menuData";

export default function CoquitlamBranch() {
  const [activeMenu, setActiveMenu] = useState("shakes");
  const [filter, setFilter] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Filter functions
  const filterItems = (items: MenuItemType[], category: string) => {
    if (!filter) return items;
    let filteredItems = items;

    if (filter === "popular") {
      filteredItems = items.filter((item) => item.popular);
    } else if (filter === "discount") {
      filteredItems = items.filter((item) => item.discount);
    } else if (filter === "promotion") {
      filteredItems = items.filter((item) => item.promotion);
    }

    return filteredItems.map((item) => ({ ...item, category: category }));
  };

  const getAllFilteredItems = () => {
    if (!filter) return [];
    const allItems = [
      ...filterItems(menuItems, "Shakes"),
      ...filterItems(coffeeTeaItems, "Coffee & Tea"),
      ...filterItems(smoothieItems, "Smoothies"),
      ...filterItems(juiceItems, "Fresh Juices"),
      ...filterItems(proteinShakeItems, "Protein Shakes"),
      ...filterItems(iceCreamItems, "Ice Cream"),
      ...filterItems(sweetsItems, "Sweets"),
    ];
    return allItems;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navigation onAIOpen={() => setIsAIOpen(true)} />

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
          <h2 className="text-5xl font-bold text-white mb-6">
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
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Our Menu
          </h2>

          {/* Menu Tabs */}
          <div
            className={`flex flex-wrap justify-center gap-2 mb-8 ${
              filter ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <button
              onClick={() => {
                setActiveMenu("shakes");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "shakes"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🥤 Shakes
            </button>
            <button
              onClick={() => {
                setActiveMenu("coffee-tea");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "coffee-tea"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              ☕ Coffee & Tea
            </button>
            <button
              onClick={() => {
                setActiveMenu("smoothies");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "smoothies"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🍹 Smoothies
            </button>
            <button
              onClick={() => {
                setActiveMenu("juices");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "juices"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🧃 Fresh Juices
            </button>
            <button
              onClick={() => {
                setActiveMenu("protein");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "protein"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🏋️ Protein Shakes
            </button>
            <button
              onClick={() => {
                setActiveMenu("ice-cream");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "ice-cream"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🍨 Ice Cream
            </button>
            <button
              onClick={() => {
                setActiveMenu("sweets");
                setFilter("");
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeMenu === "sweets"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              🍰 Sweets
            </button>
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

          {/* Menu Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filter ? (
              // Show filtered items across all categories
              getAllFilteredItems().map((item, index) => (
                <div key={index} className="relative h-full">
                  <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {item.category}
                  </div>
                  <MenuItem {...item} />
                </div>
              ))
            ) : (
              // Show items for selected category
              <>
                {activeMenu === "shakes" &&
                  menuItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "coffee-tea" &&
                  coffeeTeaItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "smoothies" &&
                  smoothieItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "juices" &&
                  juiceItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "protein" &&
                  proteinShakeItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "ice-cream" &&
                  iceCreamItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
                {activeMenu === "sweets" &&
                  sweetsItems.map((item, index) => (
                    <MenuItem key={index} {...item} />
                  ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-400/20 to-pink-400/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                About Mashti Coquitlam
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Our Coquitlam Branch brings the authentic taste of Mashti to the
                vibrant Coquitlam Centre area. This location serves as our
                newest expansion, bringing Persian flavors to the growing
                community.
              </p>
              <p className="text-gray-300 text-lg mb-6">
                From our signature shakes to traditional ice cream flavors,
                every item is crafted with care using the finest ingredients and
                time-honored recipes passed down through generations.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-orange-400">1+</div>
                  <div className="text-gray-300 text-sm">Years Experience</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-orange-400">
                    1000+
                  </div>
                  <div className="text-gray-300 text-sm">Happy Customers</div>
                </div>
                <div className="text-center bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="text-3xl font-bold text-orange-400">50+</div>
                  <div className="text-gray-300 text-sm">Unique Flavors</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Image
                src="/images/about.webp"
                alt="About Mashti Coquitlam"
                width={800}
                height={400}
                className="w-full h-64 md:h-96 rounded-2xl shadow-2xl mx-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Contact Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Location Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">📍</span>
                  <div>
                    <p className="text-gray-300">Pinetree Way</p>
                    <p className="text-gray-300">Coquitlam, BC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">📞</span>
                  <p className="text-gray-300">(604) 971-0588</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">🌐</span>
                  <p className="text-gray-300">www.mashticafe.ca</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Sunday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 text-sm italic">
                    *Hours may vary on holidays
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Online Link */}
          <div className="mt-8 text-center">
            <a
              href="https://streetfoodapp.com/vancouver/mashti"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
            >
              <span>🛒</span>
              <span>Order Online</span>
            </a>
          </div>
        </div>
      </section>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
