"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import dynamicImport from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";

// Disable static generation for this page
export const dynamic = "force-dynamic";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamicImport(
  () => import("../../components/AIAssistant"),
  {
    loading: () => <div className="text-white">Loading AI Assistant...</div>,
    ssr: false,
  }
);

interface WholesaleProduct {
  _id: string;
  name: string;
  description: string;
  ingredients: string[];
  weight: string;
  price: number;
  imageUrl: string;
  imageAlt?: string;
  order: number;
  active: boolean;
}

interface CartItem {
  product: WholesaleProduct;
  quantity: number;
}

interface WholesaleSection {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText: string;
  order: number;
  active: boolean;
}

// Fallback sections if CMS is not available
const fallbackSections: WholesaleSection[] = [
  {
    _id: "fallback-1",
    title: "Wholesale Division",
    description:
      "Discover our premium wholesale ice cream and juice products. Perfect for restaurants, cafes, and retail businesses looking for authentic Persian flavors.",
    imageUrl: "/images/wholesales.jpeg",
    buttonText: "View Products",
    order: 1,
    active: true,
  },
  {
    _id: "fallback-2",
    title: "Bulk Orders & Distribution",
    description:
      "We specialize in bulk orders and reliable distribution services. From small cafes to large restaurants, we deliver quality products on time.",
    imageUrl: "/images/northvan.jpeg",
    buttonText: "Order Now",
    order: 2,
    active: true,
  },
  {
    _id: "fallback-3",
    title: "Quality & Authenticity",
    description:
      "Every product is crafted with authentic Persian recipes and premium ingredients. Experience the true taste of Iran in every bite.",
    imageUrl: "/images/about.jpeg",
    buttonText: "Learn More",
    order: 3,
    active: true,
  },
];

function WholesaleContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [wholesaleSections, setWholesaleSections] = useState<
    WholesaleSection[]
  >([]);
  const [wholesaleProducts, setWholesaleProducts] = useState<
    WholesaleProduct[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL parameters for showProducts
  useEffect(() => {
    const showProductsParam = searchParams.get("showProducts");
    if (showProductsParam === "true") {
      setShowProducts(true);
    } else {
      setShowProducts(false);
    }
  }, [searchParams]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("wholesaleCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Fetch wholesale sections from CMS
  useEffect(() => {
    const fetchWholesaleSections = async () => {
      try {
        const response = await fetch("/api/wholesale-sections");
        if (!response.ok) throw new Error("Failed to fetch sections");
        const data = await response.json();
        setWholesaleSections(data.wholesaleSections || []);
      } catch (error) {
        console.error("Error fetching wholesale sections:", error);
        setError("Failed to load sections");
      } finally {
        setLoading(false);
      }
    };

    fetchWholesaleSections();
  }, []);

  // Fetch wholesale products from CMS
  useEffect(() => {
    const fetchWholesaleProducts = async () => {
      try {
        const response = await fetch("/api/wholesale-products");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setWholesaleProducts(data.wholesaleProducts || []);
      } catch (error) {
        console.error("Error fetching wholesale products:", error);
        // Keep using fallback data if CMS fails
      }
    };

    fetchWholesaleProducts();
  }, []);

  const addToCart = (product: WholesaleProduct) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );
      if (existingItem) {
        const newCart = prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        if (typeof window !== "undefined") {
          localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
        }
        return newCart;
      } else {
        const newCart = [...prevCart, { product, quantity: 1 }];
        if (typeof window !== "undefined") {
          localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
        }
        return newCart;
      }
    });
  };

  // const updateQuantity = (productId: string, quantity: number) => {
  //   if (quantity <= 0) {
  //     removeFromCart(productId);
  //     return;
  //   }
  //   setCart((prevCart) => {
  //     const newCart = prevCart.map((item) =>
  //       item.product._id === productId ? { ...item, quantity } : item
  //     );
  //     if (typeof window !== "undefined") {
  //       localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
  //     }
  //     return newCart;
  //   });
  // };

  // removeFromCart will be reintroduced when cart UI supports removal actions

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // const getTotalPrice = () => {
  //   return cart.reduce(
  //     (total, item) => total + item.product.price * item.quantity,
  //     0
  //   );
  // };

  const handleCartClick = () => {
    router.push("/wholesale/cart");
  };

  // const handleSubmitOrder = () => {
  //   // This will be handled by the cart page component
  // };

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
        {/* Main Content - Similar to Central Branch */}
        {!showProducts ? (
          <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-12 sm:py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-base sm:text-lg font-sodo">
                    Loading wholesale sections...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12 sm:py-20">
                  <p className="text-red-600 text-base sm:text-lg mb-4 font-sodo">
                    Failed to load wholesale sections
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-red-700 transition-colors font-pike text-sm sm:text-base"
                  >
                    Try Again
                  </button>
                </div>
              ) : wholesaleSections.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                  <p className="text-gray-600 text-base sm:text-lg font-sodo mb-4">
                    No wholesale sections available from CMS
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-sodo">
                    Showing sample content. Add content in Sanity Studio to
                    replace this.
                  </p>
                </div>
              ) : (
                <>
                  {/* Show fallback data if no sections from CMS */}
                  {(wholesaleSections.length === 0
                    ? fallbackSections
                    : wholesaleSections
                  ).map((section, index) => (
                    <div
                      key={section._id}
                      className={`flex flex-col lg:flex-row items-center gap-6 sm:gap-8 ${
                        index <
                        (wholesaleSections.length === 0
                          ? fallbackSections.length
                          : wholesaleSections.length) -
                          1
                          ? "mb-12 sm:mb-16"
                          : ""
                      } ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                    >
                      <div className="w-full lg:w-1/2">
                        <Image
                          src={section.imageUrl}
                          alt={section.imageAlt || section.title}
                          width={600}
                          height={400}
                          className="w-full h-auto rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl object-cover"
                          priority
                        />
                      </div>
                      <div className="w-full lg:w-1/2 text-center lg:text-left px-2 sm:px-0">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 font-pike">
                          {section.title}
                        </h3>
                        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-sodo leading-relaxed">
                          {section.description}
                        </p>
                        <button
                          onClick={() => {
                            setShowProducts(true);
                            router.push("/wholesale?showProducts=true");
                          }}
                          className="bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike text-sm sm:text-base"
                        >
                          {section.buttonText}
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Products Section */}
            <section className="sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <button
                    onClick={() => {
                      setShowProducts(false);
                      router.push("/wholesale");
                    }}
                    className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base order-1 sm:order-1"
                  >
                    ← Back to Home
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-pike text-center w-full sm:flex-1 order-2 sm:order-2">
                    Our Wholesale Products
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {wholesaleProducts.map((product) => (
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
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-pike mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 font-sodo leading-relaxed">
                          {product.description}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-sodo">
                          <strong>Weight:</strong> {product.weight}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 font-sodo">
                          <strong>Ingredients:</strong>{" "}
                          {product.ingredients.join(", ")}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                          <span className="text-xl sm:text-2xl font-bold text-red-600 font-pike">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike text-sm sm:text-base"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* AI Assistant Modal */}
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        {/* Mobile cart modal removed: cart uses dedicated route */}
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
