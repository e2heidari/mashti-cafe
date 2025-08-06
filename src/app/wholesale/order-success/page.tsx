"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import AIAssistant from "@/components/AIAssistant";
import { useSearchParams, useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        onAIOpen={() => setIsAIOpen(true)}
        showMenu={true}
        cartItemCount={0}
        onCartClick={() => {}}
      />
      <div className="pt-48">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="w-20 h-20 text-green-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900 font-pike mb-4">
                Order Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 font-sodo mb-8">
                Thank you for your wholesale order. We'll contact you soon.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 font-sodo mb-2">
                Your Order Number:
              </p>
              <p className="text-3xl font-bold text-gray-900 font-pike">
                {orderNumber || "WH-000000"}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 font-pike mb-3">
                What happens next?
              </h3>
              <ul className="text-left text-gray-600 font-sodo space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  We'll review your order and contact you within 24 hours
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You'll receive a confirmation email with your order details
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Our team will discuss delivery options and payment
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Your order will be prepared and delivered as agreed
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/wholesale")}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike"
              >
                Back to Wholesale
              </button>
              <div>
                <button
                  onClick={() => router.push("/")}
                  className="bg-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike"
                >
                  Go to Main Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
