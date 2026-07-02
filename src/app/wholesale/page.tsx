"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import dynamicImport from "next/dynamic";
import { useRouter } from "next/navigation";
import type { CartItem, WholesaleProduct } from "@/lib/wholesale/types";

export const dynamic = "force-dynamic";

const AIAssistant = dynamicImport(
  () => import("../../components/AIAssistant"),
  {
    loading: () => <div className="text-white">Loading AI Assistant...</div>,
    ssr: false,
  }
);

// CMS wholesale sections remain available via /api/wholesale-sections.
// The About Wholesale block is hidden on /wholesale for now.

function getProductCategories(products: WholesaleProduct[]): string[] {
  const categories = products
    .map((product) => product.category?.trim())
    .filter((category): category is string => Boolean(category));

  return Array.from(new Set(categories)).sort((a, b) => a.localeCompare(b));
}

function filterProducts(
  products: WholesaleProduct[],
  searchQuery: string,
  selectedCategory: string
): WholesaleProduct[] {
  const query = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const category = product.category?.trim() || "";
    const matchesCategory =
      selectedCategory === "all" ||
      category.toLowerCase() === selectedCategory.toLowerCase();

    if (!matchesCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      product.sku?.trim() || "",
      product.name,
      product.description,
      category,
      product.unitLabel,
      product.ingredients.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function WholesaleContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wholesaleProducts, setWholesaleProducts] = useState<
    WholesaleProduct[]
  >([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [productQuantities, setProductQuantities] = useState<
    Record<string, number>
  >({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("wholesaleCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  useEffect(() => {
    const fetchWholesaleProducts = async () => {
      try {
        const response = await fetch("/api/wholesale-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setWholesaleProducts(data.wholesaleProducts || []);
      } catch (error) {
        console.error("Error fetching wholesale products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchWholesaleProducts();
  }, []);

  const categories = useMemo(
    () => getProductCategories(wholesaleProducts),
    [wholesaleProducts]
  );

  const filteredProducts = useMemo(
    () => filterProducts(wholesaleProducts, searchQuery, selectedCategory),
    [wholesaleProducts, searchQuery, selectedCategory]
  );

  const getQuantityForProduct = (productId: string) =>
    productQuantities[productId] ?? 1;

  const setQuantityForProduct = (productId: string, quantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }));
  };

  const addToCart = (product: WholesaleProduct) => {
    if (!product.active) {
      return;
    }

    const quantity = getQuantityForProduct(product._id);

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );

      const newCart = existingItem
        ? prevCart.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...prevCart, { product, quantity }];

      if (typeof window !== "undefined") {
        localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
      }

      return newCart;
    });

    setQuantityForProduct(product._id, 1);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCartClick = () => {
    router.push("/wholesale/cart");
  };

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={<div className="text-white">Loading Navigation...</div>}
      >
        <Navigation
          onAIOpen={() => setIsAIOpen(true)}
          showMenu={true}
          cartItemCount={getCartItemCount()}
          onCartClick={handleCartClick}
        />
      </Suspense>

      <div className="pt-48">
        <section
          id="wholesale-products"
          className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-10 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-pike mb-3">
                Wholesale Products
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-sodo max-w-3xl">
                Browse our wholesale catalog, add your requested quantities, and
                submit an order request for seller confirmation.
              </p>
            </div>

            <div className="mb-6 sm:mb-8 space-y-4">
              <div>
                <label
                  htmlFor="wholesale-search"
                  className="sr-only"
                >
                  Search wholesale products
                </label>
                <input
                  id="wholesale-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, category, description, or ingredients..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 font-sodo"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors font-pike ${
                    selectedCategory === "all"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors font-pike ${
                      selectedCategory === category
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <p className="text-sm text-gray-500 font-sodo">
                Showing {filteredProducts.length} of {wholesaleProducts.length}{" "}
                products
              </p>
            </div>

            {productsLoading ? (
              <div className="text-center py-12 sm:py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-base sm:text-lg font-sodo">
                  Loading wholesale products...
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-gray-700 text-lg font-pike mb-2">
                  No products match your search
                </p>
                <p className="text-gray-500 font-sodo">
                  Try a different keyword or category filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => {
                  const quantity = getQuantityForProduct(product._id);

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-48 sm:h-64">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.imageAlt || product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-gray-400 text-3xl sm:text-4xl mb-2">
                                🍦
                              </div>
                              <p className="text-gray-500 text-xs sm:text-sm font-sodo">
                                No Image
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-pike">
                            {product.name}
                          </h3>
                          {product.category?.trim() ? (
                            <span className="shrink-0 rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-semibold font-sodo">
                              {product.category}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 font-sodo leading-relaxed">
                          {product.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-sodo">
                          <strong>Unit:</strong> {product.unitLabel}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 font-sodo">
                          <strong>Ingredients:</strong>{" "}
                          {product.ingredients.join(", ")}
                        </p>

                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xl sm:text-2xl font-bold text-red-600 font-pike">
                              ${product.unitPrice.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantityForProduct(
                                    product._id,
                                    quantity - 1
                                  )
                                }
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-semibold text-gray-900">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantityForProduct(
                                    product._id,
                                    quantity + 1
                                  )
                                }
                                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike text-sm sm:text-base"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </div>
  );
}

export default function WholesaleBranch() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <WholesaleContent />
    </Suspense>
  );
}
