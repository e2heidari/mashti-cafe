"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import AIAssistant from "@/components/AIAssistant";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function WholesaleCartPage() {
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
        item.product.id === productId ? { ...item, quantity } : item
      );
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
    // This will navigate back to products page
    router.push("/wholesale?showProducts=true");
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

      // Generate order number first
      const randomNum = Math.floor(Math.random() * 9999);
      const newOrderNumber = `WH-${randomNum}`;

      // Send order with order number
      const orderDataWithNumber = {
        ...orderData,
        orderNumber: newOrderNumber,
      };

      const response = await fetch("/api/wholesale-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDataWithNumber),
      });

      const result = await response.json();

      if (result.success) {
        setCart([]);
        if (typeof window !== "undefined") {
          localStorage.removeItem("wholesaleCart");
        }
        setOrderForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
        setIsOrderModalOpen(false);
        // Navigate to success page with order number
        router.push(`/wholesale/order-success?orderNumber=${newOrderNumber}`);
      } else {
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      setSubmitMessage("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation
          onAIOpen={() => setIsAIOpen(true)}
          showMenu={true}
          cartItemCount={getCartItemCount()}
          onCartClick={handleCartClick}
        />
        <div className="pt-48">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 font-pike mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-gray-600 font-sodo mb-8">
                Add some products to your cart to continue with your order.
              </p>
              <button
                onClick={() => router.push("/wholesale?showProducts=true")}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike"
              >
                Continue Shopping
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
      <Navigation
        onAIOpen={() => setIsAIOpen(true)}
        showMenu={true}
        cartItemCount={getCartItemCount()}
        onCartClick={handleCartClick}
      />
      <div className="pt-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 font-pike mb-8">
            Your Cart ({cart.length} items)
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 font-pike">
                      {item.product.name} ({item.product.weight})
                    </h4>
                    <p className="text-gray-600 font-sodo">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-900 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 font-pike">
                  Total: ${getTotalPrice().toFixed(2)}
                </span>
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors font-pike"
                >
                  Submit Order
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/wholesale?showProducts=true")}
              className="bg-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 font-pike mb-4">
                Submit Order
              </h3>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-sodo">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderForm.name}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, name: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-sodo text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-sodo">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={orderForm.email}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, email: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-sodo text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-sodo">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderForm.phone}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, phone: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-sodo text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 font-sodo">
                      Additional Message
                    </label>
                    <textarea
                      rows={3}
                      value={orderForm.message}
                      onChange={(e) =>
                        setOrderForm({ ...orderForm, message: e.target.value })
                      }
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 font-sodo text-gray-900"
                    />
                  </div>
                </div>

                {submitMessage && (
                  <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-700 font-sodo">
                    {submitMessage}
                  </div>
                )}

                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOrderModalOpen(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-400 transition-colors font-pike"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors font-pike disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
