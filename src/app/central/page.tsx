"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamic(() => import("../../components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText: string;
  order: number;
  active: boolean;
}

export default function CentralBranch() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) {
          throw new Error("Failed to fetch news items");
        }
        const data = await response.json();
        setNewsItems(data.newsItems || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch news items"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <Navigation onAIOpen={() => setIsAIOpen(true)} showMenu={true} />
      <div className="pt-48">
        {/* News Section */}
        <section id="news" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading news...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg mb-4">Failed to load news</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg">No news items available</p>
              </div>
            ) : (
              newsItems.map((item, index) => (
                <div
                  key={item._id}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index < newsItems.length - 1 ? "mb-16" : ""
                  } ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                >
                  <div className="w-full lg:w-1/2">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt || item.title}
                      width={600}
                      height={400}
                      className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                      priority={index === 0}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      {item.description}
                    </p>
                    <Link href="/central/menu">
                      <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors">
                        {item.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* AI Assistant Modal */}
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </div>
  );
}
