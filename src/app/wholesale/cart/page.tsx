"use client";

import { useState, useEffect, Suspense } from "react";
import Navigation from "@/components/Navigation";
import AIAssistant from "@/components/AIAssistant";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Disable static generation for this page
export const dynamic = "force-dynamic";

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

function CartContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const router = useRouter();

  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("wholesaleCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem("wholesaleCart", JSON.stringify(newCart));
      }
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.product._id !== productId);
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
    // Do nothing when already on cart page
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      setSubmitMessage("Please add items to your cart first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const orderData = {
        ...orderForm,
        items: cart.map((item) => ({
          name: item.product.name,
          weight: item.product.weight,
          quantity: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
        })),
        totalAmount: getTotalPrice(),
      };

      // Generate order number
      const randomNum = Math.floor(Math.random() * 9999);
      const newOrderNumber = `WH-${randomNum}`;
      const orderDataWithNumber = { ...orderData, orderNumber: newOrderNumber };

      const response = await fetch("/api/wholesale-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDataWithNumber),
      });

      const result = await response.json();

      if (result.success) {
        // Clear cart
        setCart([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("wholesaleCart");
        }
        setOrderForm({ name: "", email: "", phone: "", message: "" });
        setIsOrderModalOpen(false);

        // Navigate to success page
        router.push(`/wholesale/order-success?orderNumber=${newOrderNumber}`);
      } else {
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setSubmitMessage("Error submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
          }
        >
          <Navigation
            onAIOpen={() => setIsAIOpen(true)}
            showMenu={true}
            cartItemCount={0}
            onCartClick={handleCartClick}
          />
        </Suspense>
        <div className="pt-48">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="text-center">
              <div className="mb-6 sm:mb-8">
                <svg
                  className="w-16 sm:w-20 h-16 sm:h-20 text-gray-400 mx-auto mb-4 sm:mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-pike mb-3 sm:mb-4">
                  Your Cart is Empty
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 font-sodo mb-6 sm:mb-8">
                  Add some products to your cart to get started.
                </p>
              </div>
              <button
                onClick={() => router.push("/wholesale?showProducts=true")}
                className="bg-red-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike text-sm sm:text-base"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
        }
      >
        <Navigation
          onAIOpen={() => setIsAIOpen(true)}
          showMenu={true}
          cartItemCount={getCartItemCount()}
          onCartClick={handleCartClick}
        />
      </Suspense>
      <div className="pt-48">
        <section className="sm:py-16 px-4 pb-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
              <button
                onClick={() => router.push("/wholesale")}
                className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base order-1 sm:order-1"
              >
                ← Back to Home
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-pike text-center flex-1 order-2 sm:order-2">
                Your Cart ({getCartItemCount()} items)
              </h2>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white mb-3 last:mb-0"
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.imageAlt || item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-gray-400 text-lg">🍦</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 font-pike text-sm">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-600 font-sodo">
                      {item.product.weight}
                    </p>
                    <p className="text-xs text-gray-500 font-sodo">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-red-600 hover:text-red-800 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                  <span className="text-lg sm:text-xl font-bold text-gray-900 font-pike">
                    {`Total: $${getTotalPrice().toFixed(2)}`}
                  </span>
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-700 transition-colors font-pike text-sm sm:text-base"
                  >
                    Submit Order
                  </button>
                </div>
              </div>

              {/* Close card container before the bottom actions */}
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push("/wholesale?showProducts=true")}
                className="bg-gray-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 font-pike">
              Submit Order
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitOrder();
              }}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, name: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, email: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, phone: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={orderForm.message}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, message: e.target.value })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  rows={3}
                />
              </div>
              {submitMessage && (
                <div
                  className={`p-2 sm:p-3 rounded-lg text-sm sm:text-base ${
                    submitMessage.includes("Error")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-pike disabled:opacity-50 text-sm sm:text-base"
                >
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

export default function WholesaleCartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
