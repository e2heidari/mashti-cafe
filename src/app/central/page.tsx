"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import AIAssistant from "../../components/AIAssistant";
import {
  fetchMenuData,
  transformDirectusData,
  TransformedMenuCategory,
  TransformedMenuItem,
} from "../../data/menuApi";

export default function CentralBranch() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [menuData, setMenuData] = useState<{
    categories: TransformedMenuCategory[];
    items: TransformedMenuItem[];
  }>({
    categories: [],
    items: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData()
      .then((data) => {
        const transformed = transformDirectusData(data);
        setMenuData(transformed);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-white text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navigation onAIOpen={() => setIsAIOpen(true)} showMenu={true} />
      <div className="pt-48">
        {/* Gallery Section */}
        <section
          id="gallery"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white/20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
              <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 hidden md:block">
                <Image
                  src="/images/1.webp"
                  alt="Mashti Cafe Image 1"
                  width={600}
                  height={600}
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold">Fresh Juices</h3>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 block md:block">
                <Image
                  src="/images/2.webp"
                  alt="Mashti Cafe Image 2"
                  width={600}
                  height={600}
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold">Ice Cream</h3>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-105 hidden md:block">
                <Image
                  src="/images/3.webp"
                  alt="Mashti Cafe Image 3"
                  width={600}
                  height={600}
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-xl font-bold">Coffee</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="py-16 px-4 sm:px-6 lg:px-8 bg-white/10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-lg text-gray-300 mb-4">
              Have questions or want to place an order? Reach out to us!
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-300">(604) 971 0588</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">
                  1544 Lonsdale Ave, North Vancouver, BC
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-6 h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-300">Mon-Sun: 11AM-12AM</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Assistant Modal */}
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </div>
  );
}
