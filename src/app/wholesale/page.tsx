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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const quantity = getQuantityForProduct(product._id);
                  const sku = product.sku?.trim() || "";

                  return (
                    <article
                      key={product._id}
                      className="flex flex-col h-full rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex gap-4 p-4 pb-3 min-h-0">
                        <div className="relative w-[4.5rem] h-[4.5rem] shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.imageAlt || product.name}
                              fill
                              sizes="72px"
                              className="object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-gray-300 text-xl"
                              aria-hidden="true"
                            >
                              🍦
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-base font-bold text-gray-900 font-pike leading-snug line-clamp-2">
                            {product.name}
                          </h3>
                          {sku ? (
                            <p className="mt-1.5 text-xs text-gray-400 font-sodo truncate">
                              {sku}
                            </p>
                          ) : null}
                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs text-gray-500 font-sodo truncate">
                              {product.unitLabel}
                            </span>
                            <span className="shrink-0 text-base font-bold text-red-600 font-pike">
                              ${product.unitPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto border-t border-gray-100 bg-gray-50 px-4 py-4">
                        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                          <div
                            className="inline-flex h-10 items-stretch rounded-lg border border-gray-200 bg-white overflow-hidden"
                            role="group"
                            aria-label={`Quantity for ${product.name}`}
                          >
                            <button
                              type="button"
                              aria-label={`Decrease quantity for ${product.name}`}
                              onClick={() =>
                                setQuantityForProduct(
                                  product._id,
                                  quantity - 1
                                )
                              }
                              className="w-9 sm:w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-200 text-base leading-none"
                            >
                              −
                            </button>
                            <span
                              className="w-9 sm:w-10 flex items-center justify-center text-sm font-semibold text-gray-900 tabular-nums"
                              aria-live="polite"
                            >
                              {quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity for ${product.name}`}
                              onClick={() =>
                                setQuantityForProduct(
                                  product._id,
                                  quantity + 1
                                )
                              }
                              className="w-9 sm:w-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-200 text-base leading-none"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={`Add ${quantity} ${product.name} to cart`}
                            onClick={() => addToCart(product)}
                            className="h-10 w-full bg-red-600 text-white px-3 sm:px-4 rounded-full font-semibold hover:bg-red-700 active:bg-red-800 transition-colors font-pike text-xs sm:text-sm"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
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
