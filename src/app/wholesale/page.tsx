"use client";

import Navigation from "../../components/Navigation";
import AIAssistant from "../../components/AIAssistant";
import { useState } from "react";

export default function WholesaleBranch() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navigation onAIOpen={() => setIsAIOpen(true)} />

      {/* Coming Soon Section */}
      <section className="pt-48 pb-20 px-4 sm:px-6 lg:px-8 bg-white/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
            <div className="text-8xl mb-8">🚧</div>
            <h1 className="text-5xl font-bold text-gray-900 font-pike mb-6">
              Coming Soon
            </h1>
            <p className="text-xl text-gray-900 mb-8 font-sodo">
              Our Wholesale Division is under construction
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 font-pike mb-4">
                Wholesale Services
              </h2>
              <p className="text-gray-900 mb-6 font-sodo">
                We&apos;re working hard to bring you bulk orders, distribution
                services, and wholesale solutions for your business needs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🏢</div>
                  <p className="text-gray-900 text-sm font-sodo">
                    Business Orders
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-gray-900 text-sm font-sodo">
                    Events & Catering
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🚚</div>
                  <p className="text-gray-900 text-sm font-sodo">
                    Distribution
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-900 text-sm mb-4 font-sodo">
                For immediate inquiries, please contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:wholesale@mashticafe.ca"
                  className="inline-flex items-center space-x-2 bg-yellow-400 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors font-pike"
                >
                  <span>📧</span>
                  <span>Email Us</span>
                </a>
                <a
                  href="tel:+16049710588"
                  className="inline-flex items-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors font-pike"
                >
                  <span>📞</span>
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
