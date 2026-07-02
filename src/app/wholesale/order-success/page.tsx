"use client";

import { useState, Suspense } from "react";
import Navigation from "@/components/Navigation";
import AIAssistant from "@/components/AIAssistant";
import { useSearchParams, useRouter } from "next/navigation";

// Disable static generation for this page
export const dynamic = "force-dynamic";

function OrderSuccessContent() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation
          onAIOpen={() => setIsAIOpen(true)}
          showMenu={true}
          cartItemCount={0}
          onCartClick={() => {}}
        />
      </Suspense>
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
                Order Request Received
              </h1>
              <p className="text-xl text-gray-600 font-sodo mb-8">
                Thank you for your wholesale order request. Our team will review
                availability and confirm final quantities with you.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-8 mb-8 max-w-md mx-auto">
              <p className="text-sm text-gray-600 font-sodo mb-2">
                Your Request Number:
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
                  We&apos;ll review your requested items and available stock
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  You&apos;ll receive a final confirmation email after we
                  finalize quantities
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Our team will contact you if any adjustments are needed
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Delivery and payment details will be confirmed after review
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

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
