"use client";
import { useState } from "react";
import Image from "next/image";
import Navigation from "../../../components/Navigation";
import dynamic from "next/dynamic";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamic(() => import("../../../components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});

export default function CentralAboutPage() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
      <div className="pt-64 pb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-8 font-pike">
          About Central Branch
        </h1>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="mb-8 md:mb-0">
            <Image
              src="/images/about.webp"
              alt="About Mashti Cafe"
              width={700}
              height={400}
              className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
          <div>
            <p className="text-lg text-gray-900 mb-4 font-sodo">
              Welcome to Mashti Central Branch! Experience the authentic taste
              of Iran in the heart of North Vancouver. Our menu features a wide
              variety of fresh juices, smoothies, shakes, ice creams, and
              traditional Persian sweets. Whether you are looking for a healthy
              drink, a sweet treat, or a cozy place to relax, Mashti has
              something for everyone.
            </p>
            <ul className="list-disc list-inside text-gray-900 mb-4 font-sodo">
              <li>Premium quality ingredients</li>
              <li>Unique Persian flavors</li>
              <li>Friendly and welcoming atmosphere</li>
              <li>Perfect for families and friends</li>
            </ul>
            <p className="text-lg text-gray-900 font-sodo">
              Visit us and enjoy a memorable experience at Mashti Central
              Branch!
            </p>
          </div>
        </div>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
