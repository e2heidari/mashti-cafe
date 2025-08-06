"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamic(() => import("../../components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});

interface WholesaleProduct {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  weight: string;
  price: number;
  imageUrl: string;
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

const wholesaleProducts: WholesaleProduct[] = [
  {
    id: "1",
    name: "AKBAR MASHTI ICE CREAM",
    description: "Traditional Persian ice cream with saffron and rose water",
    ingredients: ["Milk", "Saffron", "Rose Water", "Cream", "Pistachios"],
    weight: "~4Kg",
    price: 65.0,
    imageUrl: "/images/wholesales.jpeg",
  },
  {
    id: "2",
    name: "AKBAR MASHTI ICE CREAM",
    description: "Traditional Persian ice cream with saffron and rose water",
    ingredients: ["Milk", "Saffron", "Rose Water", "Cream", "Pistachios"],
    weight: "~10Kg",
    price: 130.0,
    imageUrl: "/images/wholesales.jpeg",
  },
  {
    id: "3",
    name: "MILK ICE CREAM",
    description: "Creamy milk ice cream with rose water",
    ingredients: ["Milk", "Rose Water", "Cream"],
    weight: "~4Kg",
    price: 45.0,
    imageUrl: "/images/wholesales.jpeg",
  },
  {
    id: "4",
    name: "MILK ICE CREAM",
    description: "Creamy milk ice cream with rose water",
    ingredients: ["Milk", "Rose Water", "Cream"],
    weight: "~10Kg",
    price: 90.0,
    imageUrl: "/images/wholesales.jpeg",
  },
  {
    id: "5",
    name: "SAFFRON ICE CREAM",
    description: "Premium saffron ice cream with authentic Persian flavors",
    ingredients: ["Milk", "Saffron", "Rose Water", "Cream"],
    weight: "~4Kg",
    price: 55.0,
    imageUrl: "/images/wholesales.jpeg",
  },
  {
    id: "6",
    name: "SAFFRON ICE CREAM",
    description: "Premium saffron ice cream with authentic Persian flavors",
    ingredients: ["Milk", "Saffron", "Rose Water", "Cream"],
    weight: "~10Kg",
    price: 110.0,
    imageUrl: "/images/wholesales.jpeg",
  },
];

export default function WholesaleBranch() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [wholesaleSections, setWholesaleSections] = useState<
    WholesaleSection[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we should show products (from URL or Order button click)
  useEffect(() => {
    const showProductsParam = searchParams.get("showProducts");
    console.log("URL changed, showProductsParam:", showProductsParam);
    if (showProductsParam === "true") {
      console.log("Setting showProducts to true");
      setShowProducts(true);
    } else {
      console.log("Setting showProducts to false");
      setShowProducts(false);
    }
  }, [searchParams]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchWholesaleSections = async () => {
      try {
        const response = await fetch("/api/wholesale-sections");
        if (!response.ok) {
          throw new Error("Failed to fetch wholesale sections");
        }
        const data = await response.json();
        setWholesaleSections(data.wholesaleSections || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch wholesale sections"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWholesaleSections();
  }, []);

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("wholesaleCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // Fallback data if no content from Sanity
  const fallbackSections: WholesaleSection[] = [
    {
      _id: "fallback-1",
      title: "Wholesale Division",
      description:
        "Premium Persian ice cream for your business. We offer bulk orders, events, and distribution services. Our wholesale division provides high-quality ice cream products perfect for restaurants, cafes, events, and retail businesses.",
      imageUrl: "/images/wholesales.jpeg",
      imageAlt: "Wholesale Division",
      buttonText: "View Products",
      order: 1,
      active: true,
    },
    {
      _id: "fallback-2",
      title: "Bulk Orders & Distribution",
      description:
        "From small cafes to large events, we provide reliable bulk ice cream solutions. Our distribution network ensures timely delivery across the region. Perfect for weddings, corporate events, and retail establishments.",
      imageUrl: "/images/wholesales.jpeg",
      imageAlt: "Bulk Orders",
      buttonText: "Order Now",
      order: 2,
      active: true,
    },
    {
      _id: "fallback-3",
      title: "Quality & Authenticity",
      description:
        "Every batch is crafted with traditional Persian recipes using premium ingredients. Saffron, rose water, and authentic flavors that set us apart. Consistent quality and taste that your customers will love.",
      imageUrl: "/images/wholesales.jpeg",
      imageAlt: "Quality & Authenticity",
      buttonText: "Learn More",
      order: 3,
      active: true,
    },
  ];

  const addToCart = (product: WholesaleProduct) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prevCart, { product, quantity: 1 }];
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product.id !== productId);
      if (typeof window !== "undefined") {
        localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCartClick = () => {
    if (cart.length > 0) {
      // Navigate to cart page
      router.push("/wholesale/cart");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        onAIOpen={() => setIsAIOpen(true)}
        showMenu={true}
        cartItemCount={getCartItemCount()}
        onCartClick={handleCartClick}
      />

      <div className="pt-48">
        {/* Main Content - Similar to Central Branch */}
        {!showProducts ? (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg font-sodo">
                    Loading wholesale sections...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-600 text-lg mb-4 font-sodo">
                    Failed to load wholesale sections
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-pike"
                  >
                    Try Again
                  </button>
                </div>
              ) : wholesaleSections.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg font-sodo mb-4">
                    No wholesale sections available from CMS
                  </p>
                  <p className="text-sm text-gray-500 font-sodo">
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
                      className={`flex flex-col lg:flex-row items-center gap-8 ${
                        index <
                        (wholesaleSections.length === 0
                          ? fallbackSections.length
                          : wholesaleSections.length) -
                          1
                          ? "mb-16"
                          : ""
                      } ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                    >
                      <div className="w-full lg:w-1/2">
                        <Image
                          src={section.imageUrl}
                          alt={section.imageAlt || section.title}
                          width={600}
                          height={400}
                          className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                          priority={index === 0}
                        />
                      </div>
                      <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-pike">
                          {section.title}
                        </h3>
                        <p className="text-lg text-gray-600 mb-6 font-sodo">
                          {section.description}
                        </p>
                        <button
                          onClick={() => {
                            setShowProducts(true);
                            router.push("/wholesale?showProducts=true");
                          }}
                          className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike"
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
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
              <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setShowProducts(false);
                      router.push("/wholesale");
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike"
                  >
                    ← Back to Home
                  </button>
                  <h2 className="text-3xl font-bold text-gray-900 font-pike text-center flex-1">
                    Our Wholesale Products
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wholesaleProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative h-64">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 font-pike mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-3 font-sodo">
                          {product.description}
                        </p>
                        <p className="text-sm text-gray-500 mb-3 font-sodo">
                          <strong>Weight:</strong> {product.weight}
                        </p>
                        <p className="text-sm text-gray-500 mb-4 font-sodo">
                          <strong>Ingredients:</strong>{" "}
                          {product.ingredients.join(", ")}
                        </p>

                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-red-600 font-pike">
                            ${product.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike"
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
      </div>
    </div>
  );
}
