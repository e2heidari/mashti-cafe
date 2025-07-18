"use client";

import { useState } from "react";
import Navigation from "../components/Navigation";
import MenuItem from "../components/MenuItem";
import AIAssistant from "../components/AIAssistant";
import Image from "next/image";

interface MenuItemType {
  icon: string;
  title: string;
  price: string;
  description: string;
  bgColor: string;
  popular?: boolean;
  discount?: boolean;
  originalPrice?: string;
  subtitle?: string;
  promotion?: boolean;
  category?: string;
}

export default function Home() {
  const [activeMenu, setActiveMenu] = useState("shakes");
  const [filter, setFilter] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const menuItems = [
    {
      icon: "🥤",
      title: "Vanilla Cinnamon Shake",
      price: "$9.99",
      description: "Creamy blend of vanilla and cinnamon flavours.",
      bgColor: "bg-orange-500",
    },
    {
      icon: "🥤",
      title: "Caramel Shake",
      price: "$9.99",
      description: "Rich and creamy caramel flavoured milkshake.",
      bgColor: "bg-amber-600",
    },
    {
      icon: "🥤",
      title: "Chocolate Shake",
      price: "$9.99",
      description: "Rich and creamy blend of chocolate.",
      bgColor: "bg-brown-600",
    },
    {
      icon: "🥤",
      title: "Oreo Shake",
      price: "$9.99",
      description: "Rich and creamy blend of Oreo cookies.",
      bgColor: "bg-gray-700",
    },
    {
      icon: "🥤",
      title: "Nutella Shake",
      price: "$9.99",
      description:
        "Rich and creamy chocolate-hazelnut treat blended to perfection.",
      bgColor: "bg-brown-800",
    },
    {
      icon: "🥤",
      title: "M & M Shake",
      price: "$9.99",
      description: "Rich and creamy shake with M&M's.",
      bgColor: "bg-red-600",
    },
    {
      icon: "🥤",
      title: "Lotus Shake",
      price: "$9.99",
      description: "Creamy and refreshing drink with a hint of lotus flavour.",
      bgColor: "bg-yellow-600",
    },
    {
      icon: "🥤",
      title: "Nescafe Shake",
      price: "$9.99",
      description: "Delicious coffee-flavored shake.",
      bgColor: "bg-amber-800",
    },
    {
      icon: "🥤",
      title: "Peanut Butter Shake",
      price: "$9.99",
      description: "Rich and creamy peanut butter blended to perfection.",
      bgColor: "bg-yellow-700",
    },
    {
      icon: "🥤",
      title: "Tahini Shake",
      price: "$9.99",
      description: "Creamy sesame-based drink with a nutty flavour.",
      bgColor: "bg-yellow-800",
    },
    {
      icon: "🥤",
      title: "Barberry Shake",
      price: "$10.99",
      description: "A refreshing blend of barberry flavours.",
      bgColor: "bg-red-700",
    },
  ];

  const coffeeTeaItems = [
    {
      icon: "☕",
      title: "Espresso",
      price: "$3.95",
      description: "Rich and bold coffee shot.",
      bgColor: "bg-brown-800",
      popular: true,
    },
    {
      icon: "☕",
      title: "Cappuccino",
      price: "$5.45",
      description: "Rich and smooth espresso-style coffee drink.",
      bgColor: "bg-brown-700",
    },
    {
      icon: "☕",
      title: "Latte",
      price: "$5.45",
      description: "Rich and smooth espresso-style coffee drink.",
      bgColor: "bg-brown-600",
    },
    {
      icon: "☕",
      title: "Americano",
      price: "$4.45",
      description: "Classic American coffee.",
      bgColor: "bg-brown-900",
    },
    {
      icon: "☕",
      title: "Caramel Macchiato",
      price: "$5.95",
      description: "Rich espresso shot topped with a velvety caramel drizzle.",
      bgColor: "bg-amber-700",
    },
    {
      icon: "🫖",
      title: "Black Tea",
      price: "$4.00",
      description: "Strong and soothing black tea for a perfect pick-me-up.",
      bgColor: "bg-gray-800",
      popular: true,
    },
    {
      icon: "🫖",
      title: "Green Tea",
      price: "$4.00",
      description: "Refreshing and healthy green tea.",
      bgColor: "bg-green-700",
    },
    {
      icon: "🫖",
      title: "Chamomile Tea",
      price: "$4.00",
      description: "Soothing herbal tea with a calming aroma.",
      bgColor: "bg-yellow-600",
    },
    {
      icon: "🫖",
      title: "Lemon & Ginger Tea",
      price: "$4.00",
      description: "Soothing tea infused with citrusy lemon and spicy ginger.",
      bgColor: "bg-yellow-500",
    },
    {
      icon: "🫖",
      title: "Mint Medley Tea",
      price: "$4.00",
      description: "Refreshing blend of mint flavours.",
      bgColor: "bg-green-600",
    },
    {
      icon: "🫖",
      title: "Mix Fruit Tea",
      price: "$4.00",
      description: "A refreshing blend of fruits infused in tea.",
      bgColor: "bg-pink-600",
    },
  ];

  const smoothieItems = [
    {
      icon: "🥤",
      title: "Strawberry Smoothie",
      price: "$9.99",
      description:
        "Fresh strawberries blended to a smooth and refreshing treat.",
      bgColor: "bg-pink-500",
    },
    {
      icon: "🥤",
      title: "Mango Smoothie",
      price: "$9.99",
      description: "Sweet and refreshing blend of mango puree.",
      bgColor: "bg-yellow-500",
      popular: true,
    },
    {
      icon: "🥤",
      title: "Pineapple Smoothie",
      price: "$9.99",
      description: "Refreshing blend of pineapple puree.",
      bgColor: "bg-yellow-400",
    },
    {
      icon: "🥤",
      title: "Peach Smoothie",
      price: "$9.99",
      description: "Fresh peaches blended to a smooth and refreshing treat.",
      bgColor: "bg-orange-400",
    },
    {
      icon: "🥤",
      title: "Pomegranate Smoothie",
      price: "$12.99",
      description:
        "Served with real fruit and your choice of regular milk, soy milk, almond milk, and oat milk or protein powder with additional charge.",
      bgColor: "bg-red-600",
    },
    {
      icon: "🥤",
      title: "Shahtootfarangi",
      price: "$12.99",
      description: "Traditional Persian mulberry smoothie.",
      bgColor: "bg-purple-600",
    },
    {
      icon: "🥤",
      title: "Watermelon Strawberry Smoothie",
      price: "$10.99",
      description: "Refreshing blend of watermelon and strawberry.",
      bgColor: "bg-pink-400",
    },
    {
      icon: "🥤",
      title: "Lavashak Smoothie",
      price: "$15.99",
      description:
        "A refreshing blend of flavours in a smooth and creamy treat.",
      bgColor: "bg-red-700",
    },
    {
      icon: "🥤",
      title: "Vitamine",
      price: "$16.99",
      description:
        "Maajoon ice cream, milk, dates, figs, coconut powder, sesame seeds, cream, rosewater, pineapple, walnuts, pistachios, cashews.",
      bgColor: "bg-amber-600",
      popular: true,
    },
    {
      icon: "🥤",
      title: "Shir Moz",
      price: "$10.99",
      description: "Milk, banana. Buy 1, Get 1 Free",
      bgColor: "bg-yellow-600",
    },
    {
      icon: "🥤",
      title: "Shir Pesteh",
      price: "$13.99",
      description: "Vanilla ice cream, pistachio powder.",
      bgColor: "bg-green-600",
    },
    {
      icon: "🥤",
      title: "Shir Fandogh",
      price: "$12.99",
      description: "Vanilla ice cream, hazelnut powder.",
      bgColor: "bg-brown-600",
    },
    {
      icon: "🥤",
      title: "Havij Bastani",
      price: "$12.99",
      description: "Carrot juice, traditional saffron ice cream.",
      bgColor: "bg-orange-500",
    },
    {
      icon: "🥤",
      title: "Faloodeh",
      price: "$9.99",
      description: "Starch rice noodles, rosewater.",
      bgColor: "bg-pink-300",
    },
    {
      icon: "🥤",
      title: "Faloodeh Bastani",
      price: "$11.99",
      description: "Starch noodles, rosewater, traditional saffron ice cream.",
      bgColor: "bg-pink-400",
    },
    {
      icon: "🥤",
      title: "Londsgate Shake",
      price: "$11.99",
      description: "Avocado, milk, mango, honey, cinnamon.",
      bgColor: "bg-green-500",
    },
    {
      icon: "🥤",
      title: "Ferrero",
      price: "$10.99",
      description: "Ice cream, brownie, Nutella.",
      bgColor: "bg-brown-700",
    },
    {
      icon: "🥤",
      title: "Affogato",
      price: "$6.99",
      description: "Ice cream, a shot of espresso.",
      bgColor: "bg-brown-800",
    },
    {
      icon: "🥤",
      title: "Lavashak Plate",
      price: "$12.99",
      description: "A fruit leather made of plums and pomegranates.",
      bgColor: "bg-red-800",
    },
    {
      icon: "🥤",
      title: "Maajoon",
      price: "$15.99",
      description:
        "Maajoon ice cream, Banana, milk, dates, figs, coconut powder, sesame seeds, cream, rosewater, walnuts, cashews.",
      bgColor: "bg-amber-700",
    },
    {
      icon: "🥤",
      title: "Vitamine Akbar Mashti",
      price: "$16.99",
      description:
        "Akbar Mashti ice cream, milk, dates, figs, coconut powder, sesame seeds, cream, rosewater, pineapple, walnuts, pistachios, cashews.",
      bgColor: "bg-amber-800",
    },
    {
      icon: "🥤",
      title: "Shir Moz Anbe",
      price: "$10.99",
      description: "Milk, banana, Mango. Buy 1, Get 1 Free",
      bgColor: "bg-yellow-500",
    },
    {
      icon: "🥤",
      title: "Shir Pesteh Moz",
      price: "$14.99",
      description: "Milk, Vanilla ice cream, pistachio, Banana.",
      bgColor: "bg-green-700",
    },
    {
      icon: "🥤",
      title: "Shir Pesteh Moz Nutella",
      price: "$15.99",
      description: "Milk, Vanilla ice cream, pistachio, Banana, Nutella.",
      bgColor: "bg-brown-600",
    },
    {
      icon: "🥤",
      title: "Pirashki Bastani",
      price: "$11.99",
      description: "A Sweet doughnut filled with Akbar mashti ice cream.",
      bgColor: "bg-amber-500",
    },
  ];

  const juiceItems = [
    {
      icon: "🍊",
      title: "Orange Juice",
      price: "$9.99",
      description: "Freshly squeezed juice made from oranges.",
      bgColor: "bg-orange-500",
    },
    {
      icon: "🥕",
      title: "Carrot Juice",
      price: "$6.99",
      originalPrice: "$9.99",
      description: "Freshly squeezed juice made from carrots. 30% off",
      bgColor: "bg-orange-600",
      discount: true,
    },
    {
      icon: "🍎",
      title: "Apple Juice",
      price: "$8.99",
      description: "Freshly squeezed juice made from apples.",
      bgColor: "bg-red-500",
    },
    {
      icon: "🍇",
      title: "Pomegranate Juice",
      price: "$12.99",
      description: "Freshly squeezed juice from pomegranate.",
      bgColor: "bg-red-700",
      popular: true,
    },
    {
      icon: "🥬",
      title: "Celery Juice",
      price: "$8.99",
      description: "Freshly squeezed juice made from celery.",
      bgColor: "bg-green-600",
    },
    {
      icon: "🍒",
      title: "Sour Cherry Juice",
      price: "$12.99",
      description: "Freshly squeezed juice made from sour cherries.",
      bgColor: "bg-red-600",
    },
    {
      icon: "🥥",
      title: "Coco Juice",
      price: "$12.99",
      description: "Fresh coconut water, a refreshing and natural beverage.",
      bgColor: "bg-yellow-600",
    },
    {
      icon: "🫐",
      title: "Barberry Juice",
      price: "$12.99",
      description: "Freshly squeezed juice made from barberries.",
      bgColor: "bg-red-800",
    },
  ];

  const sweetsItems = [
    {
      icon: "🧁",
      title: "Cream Puffs",
      price: "$7.99",
      description: "Light Pastry filled with rich cream.",
      bgColor: "bg-pink-400",
    },
    {
      icon: "🥟",
      title: "Pirashki",
      price: "$7.99",
      description:
        "Golden-brown dough filled with a variety of savory or sweet fillings, perfect for any occasion.",
      bgColor: "bg-amber-500",
    },
    {
      icon: "🍯",
      title: "Zaban",
      price: "$7.00",
      description: "Traditional Persian sweet treat.",
      bgColor: "bg-amber-600",
    },
  ];

  const iceCreamItems = [
    {
      icon: "🍦",
      title: "Akbar Mashti (KG)",
      price: "$18.00",
      description: "Family size Persian-style ice cream.",
      bgColor: "bg-amber-500",
    },
    {
      icon: "🍦",
      title: "Akbar Mashti Cup",
      price: "$7.99",
      description: "Rich and creamy Persian-style ice cream.",
      bgColor: "bg-amber-600",
      popular: true,
    },
    {
      icon: "🍦",
      title: "Vanilla Cup",
      price: "$4.99",
      description: "Creamy and smooth vanilla ice cream.",
      bgColor: "bg-yellow-400",
    },
    {
      icon: "🍦",
      title: "Chocolate Cup",
      price: "$4.99",
      description: "Rich and creamy chocolate dessert.",
      bgColor: "bg-brown-600",
    },
    {
      icon: "🍦",
      title: "Mango Cup",
      price: "$4.99",
      description: "Sweet and creamy mango ice cream.",
      bgColor: "bg-yellow-500",
    },
    {
      icon: "🍦",
      title: "Strawberry Cup",
      price: "$4.99",
      description: "Sweet and refreshing strawberry treat.",
      bgColor: "bg-pink-400",
    },
    {
      icon: "🍦",
      title: "Saffron Cup",
      price: "$6.99",
      description: "Rich and creamy ice cream infused with saffron.",
      bgColor: "bg-yellow-600",
    },
  ];

  const proteinShakeItems = [
    {
      icon: "💪",
      title: "Boost Shake",
      subtitle: "Coffee, Date & Peanut Butter Protein Shake",
      price: "$12.99",
      description:
        "Rich coffee, date, and peanut butter blended with protein for a nutritious boost. Buy 1, Get 1 Free",
      bgColor: "bg-brown-600",
      promotion: true,
    },
    {
      icon: "💪",
      title: "Berry Blast",
      subtitle: "Mixed Berry Protein Shake",
      price: "$12.99",
      description:
        "Mixed berry blend with protein for a refreshing treat. Buy 1, Get 1 Free",
      bgColor: "bg-purple-600",
      promotion: true,
    },
    {
      icon: "💪",
      title: "Green Power",
      subtitle: "Matcha & Spinach Protein Shake",
      price: "$12.99",
      description:
        "Matcha and spinach blended with protein for a healthy and refreshing drink. Buy 1, Get 1 Free",
      bgColor: "bg-green-600",
      promotion: true,
    },
  ];

  // Filter functions
  const filterItems = (items: MenuItemType[], category: string) => {
    if (!filter) return items;

    const filteredItems = items.filter((item) => {
      switch (filter) {
        case "popular":
          return item.popular;
        case "discount":
          return item.discount;
        case "promotion":
          return item.promotion;
        default:
          return true;
      }
    });

    return filteredItems.map((item) => ({
      ...item,
      category: category,
    }));
  };

  // Get all filtered items across all categories
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

      {/* Gallery Section - Now Larger */}
      <section
        id="gallery"
        className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-white/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-16">
            <Image
              src="/images/logo.webp"
              alt="Mashti Logo"
              width={120}
              height={120}
              className="animate-pulse-glow rounded-full shadow-2xl"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
            <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 hidden md:block">
              <Image
                src="/images/1.webp"
                alt="Mashti Cafe Image 1"
                width={600}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold">Fresh Juices</h3>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 block md:block">
              <Image
                src="/images/2.webp"
                alt="Mashti Cafe Image 2"
                width={600}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold">Ice Cream</h3>
                </div>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 hidden md:block">
              <Image
                src="/images/3.webp"
                alt="Mashti Cafe Image 3"
                width={600}
                height={600}
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-bold">Coffee</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Menu Section */}
      <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-8">
            Our Menu
          </h2>

          {/* Menu Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
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
              🥛 Shakes
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filter ? (
              // Show filtered items across all categories
              getAllFilteredItems().map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    {item.category}
                  </div>
                  <MenuItem
                    icon={item.icon}
                    title={item.title}
                    price={item.price}
                    description={item.description}
                    bgColor={item.bgColor}
                    popular={item.popular}
                    discount={item.discount}
                    originalPrice={item.originalPrice}
                    subtitle={item.subtitle}
                    promotion={item.promotion}
                  />
                </div>
              ))
            ) : (
              // Show items for selected category
              <>
                {activeMenu === "shakes" &&
                  menuItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                    />
                  ))}

                {activeMenu === "coffee-tea" &&
                  coffeeTeaItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                      popular={item.popular}
                    />
                  ))}

                {activeMenu === "smoothies" &&
                  smoothieItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                      popular={item.popular}
                    />
                  ))}

                {activeMenu === "juices" &&
                  juiceItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                      popular={item.popular}
                      discount={item.discount}
                      originalPrice={item.originalPrice}
                    />
                  ))}

                {activeMenu === "protein" &&
                  proteinShakeItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      subtitle={item.subtitle}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                      promotion={item.promotion}
                    />
                  ))}

                {activeMenu === "ice-cream" &&
                  iceCreamItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                      popular={item.popular}
                    />
                  ))}

                {activeMenu === "sweets" &&
                  sweetsItems.map((item, index) => (
                    <MenuItem
                      key={index}
                      icon={item.icon}
                      title={item.title}
                      price={item.price}
                      description={item.description}
                      bgColor={item.bgColor}
                    />
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
                About Mashti
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Mashti is the first Iranian juice and ice cream bar in British
                Columbia, bringing authentic Persian flavors to Vancouver. Our
                commitment to quality and tradition makes every visit a unique
                experience.
              </p>
              <p className="text-gray-300 text-lg mb-6">
                We use only the finest ingredients, traditional recipes, and
                modern techniques to create beverages and desserts that honor
                our heritage while appealing to contemporary tastes.
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
                src="/images/about.jpeg"
                alt="About Mashti"
                width={800}
                height={400}
                className="w-full h-64 md:h-96 rounded-2xl shadow-2xl mx-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Visit Us
          </h2>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Central Branch */}
            <a
              href="https://www.google.com/maps/place/MASHTI+CAFE+%7C+%D9%85%D8%B4%D8%AA%DB%8C%E2%80%AD/@49.3227941,-123.0745482,17z/data=!4m15!1m8!3m7!1s0x548670388c205dbb:0xafc8aca9f6fb486e!2s1544+Lonsdale+Ave,+North+Vancouver,+BC+V7M+2J3!3b1!8m2!3d49.3227941!4d-123.0719733!16s%2Fg%2F11q2x8v2r9!3m5!1s0x548671c78c936b15:0xf9b8365b30f87f69!8m2!3d49.3227722!4d-123.0721125!16s%2Fg%2F11l75cym_2?entry=ttu&g_ep=EgoyMDI1MDcxNS4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Central Branch
                </h3>
                <div className="w-12 h-1 bg-orange-400 mx-auto rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                  1544 Lonsdale
                  <br />
                  North Vancouver, BC
                </p>
                <div className="mt-4">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MAIN LOCATION
                  </span>
                </div>
              </div>
            </a>

            {/* Coquitlam Branch */}
            <a
              href="https://streetfoodapp.com/vancouver/mashti"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-pink-400/30 hover:border-pink-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Coquitlam Branch
                </h3>
                <div className="w-12 h-1 bg-pink-400 mx-auto rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Pinetree Way
                  <br />
                  Coquitlam, BC
                </p>
                <div className="mt-4">
                  <span className="bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW LOCATION
                  </span>
                </div>
              </div>
            </a>

            {/* Wholesale */}
            <a
              href="https://www.google.com/maps/place/399+Mountain+Hwy,+North+Vancouver,+BC+V7J+1G4/@49.3085948,-123.03693,16z/data=!3m1!4b1!4m6!3m5!1s0x5486708bb3c6b3d9:0x528e6174c45d6107!8m2!3d49.3085949!4d-123.032322!16s%2Fg%2F11rg66gr74?entry=ttu&g_ep=EgoyMDI1MDcxNS4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Wholesale</h3>
                <div className="w-12 h-1 bg-purple-400 mx-auto rounded-full"></div>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm leading-relaxed">
                  399 Mountain Highway
                  <br />
                  North Vancouver, BC
                </p>
                <div className="mt-4">
                  <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    WHOLESALE
                  </span>
                </div>
              </div>
            </a>
          </div>

          {/* Contact Info & Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-orange-400 text-xl">📞</span>
                  <p className="text-gray-300">+1 (604) 971-0588</p>
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
                  <span className="text-gray-300">Friday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Saturday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sunday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tuesday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Wednesday</span>
                  <span className="text-orange-400 font-semibold">
                    11:00 AM - 12:00 AM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Thursday</span>
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

          {/* Social Media */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
            <div className="flex justify-center space-x-4 flex-wrap">
              <a
                href="https://www.facebook.com/MASHTICAFE"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/mashticafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/mashticafe/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@MASHTICAFE"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://x.com/mashticafe?s=11"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@mashticafe?_t=ZM-8vwR525ipGR&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-4 rounded-full transition-all duration-300 hover:transform hover:scale-110 shadow-lg cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-white font-bold text-2xl mb-4">MASHTI</div>
          <p className="text-gray-300 mb-4">
            The First Iranian Juice and Ice Cream Bar in B.C.
          </p>
          <p className="text-gray-400 text-sm">
            © 2024 Mashti Cafe. All rights reserved.
          </p>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
