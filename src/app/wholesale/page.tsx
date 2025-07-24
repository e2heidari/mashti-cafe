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

export default function WholesaleBranch() {
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
            Wholesale Division
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bulk Orders & Distribution
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-yellow-400">📍</div>
                <p className="text-gray-300 text-sm">399 Mountain Highway</p>
                <p className="text-gray-300 text-sm">North Vancouver, BC</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">📞</div>
                <p className="text-gray-300 text-sm">(604) 971 0588</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">🕒</div>
                <p className="text-gray-300 text-sm">Mon-Fri</p>
                <p className="text-gray-300 text-sm">8AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wholesale Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-400/20 to-blue-400/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Wholesale Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Business Orders
              </h3>
              <p className="text-gray-300">
                Bulk orders for restaurants, cafes, and food service businesses.
                Custom packaging and delivery options available.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Events & Catering
              </h3>
              <p className="text-gray-300">
                Special event catering with custom menus and large quantity
                orders. Perfect for weddings, corporate events, and parties.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Distribution
              </h3>
              <p className="text-gray-300">
                Reliable delivery service across the Greater Vancouver area.
                Scheduled deliveries and rush orders available.
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Why Choose Mashti Wholesale?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      Premium Quality
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Only the finest ingredients and traditional recipes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">Custom Orders</h4>
                    <p className="text-gray-300 text-sm">
                      Tailored to your specific requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      Reliable Delivery
                    </h4>
                    <p className="text-gray-300 text-sm">
                      On-time delivery guaranteed
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      Competitive Pricing
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Bulk discounts and special rates
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">
                      Flexible Scheduling
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Accommodate your business hours
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-orange-400 text-xl">✓</span>
                  <div>
                    <h4 className="text-white font-semibold">Expert Support</h4>
                    <p className="text-gray-300 text-sm">
                      Dedicated wholesale team
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Available Products
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

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Contact Wholesale
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
                    <p className="text-gray-300">399 Mountain Highway</p>
                    <p className="text-gray-300">North Vancouver, BC V7J 1G4</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">📞</span>
                  <p className="text-gray-300">(604) 971-0588</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">📧</span>
                  <p className="text-gray-300">wholesale@mashticafe.ca</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Business Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday - Friday</span>
                  <span className="text-orange-400 font-semibold">
                    8:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-orange-400 font-semibold">
                    9:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunday</span>
                  <span className="text-gray-400">Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-600">
                  <p className="text-gray-400 text-sm italic">
                    *Emergency orders available outside business hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="mt-8 text-center space-y-4">
            <a
              href="mailto:wholesale@mashticafe.ca"
              className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors mx-2"
            >
              <span>📧</span>
              <span>Email Us</span>
            </a>
            <a
              href="tel:+16049710588"
              className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors mx-2"
            >
              <span>📞</span>
              <span>Call Us</span>
            </a>
            <a
              href="https://www.google.com/maps/place/399+Mountain+Hwy,+North+Vancouver,+BC+V7J+1G4/@49.3085948,-123.03693,16z/data=!3m1!4b1!4m6!3m5!1s0x5486708bb3c6b3d9:0x528e6174c45d6107!8m2!3d49.3085949!4d-123.032322!16s%2Fg%2F11rg66gr74?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors mx-2"
            >
              <span>📍</span>
              <span>View on Map</span>
            </a>
          </div>
        </div>
      </section>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
