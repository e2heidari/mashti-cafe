"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "./Footer";

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

interface MobileCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onSubmitOrder: () => void;
  totalPrice: number;
}

export default function MobileCartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onSubmitOrder,
  totalPrice,
}: MobileCartModalProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Prevent page scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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
        totalAmount: totalPrice,
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
        if (typeof window !== "undefined") {
          localStorage.removeItem("wholesaleCart");
        }
        setOrderForm({ name: "", email: "", phone: "", message: "" });
        setIsOrderModalOpen(false);
        onClose();

        // Navigate to success page
        window.location.href = `/wholesale/order-success?orderNumber=${newOrderNumber}`;
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

  if (!isOpen) return null;

  return (
    <>
      {/* Cart Modal */}
      <div className="fixed inset-0 z-[20]">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-white bg-opacity-90"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal container that preserves header and footer visibility */}
        <div className="fixed top-40 bottom-20 left-0 right-0 overflow-y-auto pointer-events-none">
          {/* Center content vertically and horizontally */}
          <div className="flex min-h-full items-start justify-center p-4">
            {/* Actual modal content */}
            <div className="w-full max-w-lg bg-white rounded-lg shadow-xl pointer-events-auto">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 font-pike">
                  Cart ({cart.length} items)
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 -mr-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Cart Items and Total - Scrollable Area */}
              <div className="overflow-y-auto px-4 py-3 max-h-[60vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🛒</div>
                    <p className="text-gray-600 font-sodo mb-4">
                      Your cart is empty
                    </p>
                    <button
                      onClick={onClose}
                      className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg bg-white"
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
                                  onUpdateQuantity(
                                    item.product._id,
                                    item.quantity - 1
                                  )
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
                                  onUpdateQuantity(
                                    item.product._id,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold text-sm"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-gray-900 text-sm">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </span>
                              <button
                                onClick={() =>
                                  onRemoveFromCart(item.product._id)
                                }
                                className="text-red-600 hover:text-red-800 transition-colors text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total and Submit - Inside scrollable area */}
                    <div className="border-t border-gray-200 bg-white px-4 py-3 mt-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-gray-900 font-pike">
                          Total: ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsOrderModalOpen(true)}
                        className="w-full bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors font-pike"
                      >
                        Submit Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <Footer />
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 font-pike">Submit Order</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitOrder();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, email: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, phone: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  value={orderForm.message}
                  onChange={(e) =>
                    setOrderForm({ ...orderForm, message: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 text-sm"
                  rows={3}
                />
              </div>
              {submitMessage && (
                <div
                  className={`p-2 rounded-lg text-sm ${
                    submitMessage.includes("Error")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-pike disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-pike text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
