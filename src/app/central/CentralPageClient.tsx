"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

const AIAssistant = dynamic(() => import("@/components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});

export interface NewsItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText?: string;
  order: number;
  active: boolean;
}

interface CentralPageClientProps {
  newsItems: NewsItem[];
  error?: string | null;
}

export default function CentralPageClient({
  newsItems,
  error = null,
}: CentralPageClientProps) {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={<div className="text-white">Loading Navigation...</div>}
      >
        <Navigation onAIOpen={() => setIsAIOpen(true)} showMenu />
      </Suspense>
      <div className="pt-48">
        <section id="news" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg mb-4 font-sodo">
                  Failed to load news
                </p>
                <Link
                  href="/central?refresh=1"
                  className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-pike inline-flex items-center justify-center"
                >
                  Try Again
                </Link>
              </div>
            ) : newsItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 text-lg font-sodo">
                  No news items available
                </p>
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
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 font-pike">
                      {item.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 font-sodo">
                      {item.description}
                    </p>
                    <Link href="/central/menu">
                      <button className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-colors font-pike">
                        {item.buttonText ?? "View Menu"}
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    </div>
  );
}
