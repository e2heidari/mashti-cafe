"use client";

import { useState, useEffect, Suspense } from "react";
import Navigation from "@/components/Navigation";
import AIAssistant from "@/components/AIAssistant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CartItem, WholesaleOrderCustomer } from "@/lib/wholesale/types";

export const dynamic = "force-dynamic";

const initialOrderForm: WholesaleOrderCustomer = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  deliveryAddress: "",
  message: "",
};

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const { product, quantity } = item as Partial<CartItem>;

  if (!product || typeof product !== "object") {
    return false;
  }

  if (typeof product._id !== "string" || !product._id.trim()) {
    return false;
  }

  if (typeof product.name !== "string" || !product.name.trim()) {
    return false;
  }

  if (
    typeof product.unitPrice !== "number" ||
    !Number.isFinite(product.unitPrice) ||
    product.unitPrice < 0
  ) {
    return false;
  }

  if (typeof product.unitLabel !== "string" || !product.unitLabel.trim()) {
    return false;
  }

  if (typeof product.unitType !== "string" || !product.unitType.trim()) {
    return false;
  }

  if (
    typeof product.unitValue !== "number" ||
    !Number.isFinite(product.unitValue) ||
    product.unitValue <= 0
  ) {
    return false;
  }

  if (typeof product.active !== "boolean") {
    return false;
  }

  return typeof quantity === "number" && Number.isFinite(quantity) && quantity >= 1;
}

function loadWholesaleCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = localStorage.getItem("wholesaleCart");
  if (!savedCart) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(savedCart);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem("wholesaleCart");
      return [];
    }

    const validCart = parsed.filter(isValidCartItem);
    const filteredCart = validCart.filter(
      (item) => item.product.active !== false
    );

    if (
      validCart.length !== parsed.length ||
      filteredCart.length !== validCart.length
    ) {
      localStorage.setItem("wholesaleCart", JSON.stringify(filteredCart));
    }

    return filteredCart;
  } catch (error) {
    console.error("Failed to parse wholesale cart from localStorage:", error);
    localStorage.removeItem("wholesaleCart");
    return [];
  }
}

function CartContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [orderForm, setOrderForm] = useState(initialOrderForm);
  const router = useRouter();

  useEffect(() => {
    setCart(loadWholesaleCartFromStorage());
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
      (total, item) => total + item.product.unitPrice * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCartClick = () => {};

  const handleSubmitOrderRequest = async () => {
    if (cart.length === 0) {
      setSubmitMessage("Please add items to your cart first.");
      return;
    }
    if (cart.some((item) => item.product.active === false)) {
      setSubmitMessage(
        "Some items are no longer available. Please remove them from your cart."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const orderData = {
        customer: {
          businessName: orderForm.businessName.trim(),
          contactName: orderForm.contactName.trim(),
          email: orderForm.email.trim(),
          phone: orderForm.phone.trim(),
          deliveryAddress: orderForm.deliveryAddress.trim(),
          message: orderForm.message?.trim() || "",
        },
        items: cart.map((item) => ({
          productId: item.product._id,
          sku: item.product.sku?.trim() || "",
          productName: item.product.name,
          category: item.product.category?.trim() || "",
          unitType: item.product.unitType,
          unitValue: item.product.unitValue,
          unitLabel: item.product.unitLabel,
          unitPrice: item.product.unitPrice,
          requestedQuantity: item.quantity,
        })),
      };

      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const response = await fetch(`${baseUrl}/api/wholesale-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Request failed: ${response.status} ${text}`);
      }

      const result = await response
        .json()
        .catch(() => ({ success: false, message: "Invalid JSON response" }));

      if (result && result.success) {
        setCart([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("wholesaleCart");
        }
        setOrderForm(initialOrderForm);
        setIsOrderModalOpen(false);

        const orderNumber = result.orderNumber || "";
        router.push(
          `/wholesale/order-success?orderNumber=${encodeURIComponent(orderNumber)}`
        );
      } else {
        setSubmitMessage(`Error: ${result.message || "Submission failed"}`);
      }
    } catch (error) {
      console.error("Error submitting order request:", error);
      setSubmitMessage("Error submitting order request. Please try again.");
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
                  Add products to your cart to submit a wholesale order request.
                </p>
              </div>
              <button
                onClick={() => router.push("/wholesale")}
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
                ← Back to Products
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
                    {item.product.category?.trim() ? (
                      <p className="text-xs text-red-600 font-sodo">
                        {item.product.category}
                      </p>
                    ) : null}
                    <p className="text-xs text-gray-600 font-sodo">
                      {item.product.unitLabel}
                    </p>
                    <p className="text-xs text-gray-500 font-sodo">
                      ${item.product.unitPrice.toFixed(2)} per unit
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
                        ${(item.product.unitPrice * item.quantity).toFixed(2)}
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
                  <div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 font-pike">
                      {`Estimated Total: $${getTotalPrice().toFixed(2)}`}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-500 font-sodo mt-1">
                      Final pricing and quantities will be confirmed by our team.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-green-700 transition-colors font-pike text-sm sm:text-base"
                  >
                    Submit Order Request
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push("/wholesale")}
                className="bg-gray-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </section>
      </div>

      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-gray-900 sm:text-2xl font-bold mb-2 font-pike">
              Submit Order Request
            </h2>
            <p className="text-sm text-gray-600 font-sodo mb-4">
              Tell us about your business. We will review availability and
              confirm final quantities.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitOrderRequest();
              }}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={orderForm.businessName}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={orderForm.contactName}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      contactName: e.target.value,
                    })
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
                  Delivery Address *
                </label>
                <textarea
                  value={orderForm.deliveryAddress}
                  onChange={(e) =>
                    setOrderForm({
                      ...orderForm,
                      deliveryAddress: e.target.value,
                    })
                  }
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm sm:text-base"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Message / Notes
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
                  {isSubmitting ? "Submitting..." : "Submit Order Request"}
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
