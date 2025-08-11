"use client";
import { useState, Suspense } from "react";
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
      <Suspense
        fallback={
          <div className="fixed top-0 w-full z-50 bg-[#e80812] h-16"></div>
        }
      >
        <Navigation showMenu={true} onAIOpen={() => setIsAIOpen(true)} />
      </Suspense>
      <div className="pt-64 pb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 text-center mb-8 font-pike">
          About Central Branch
        </h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="mb-8 md:mb-0 px-2 sm:px-0">
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
          <div className="px-2 sm:px-0">
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

        {/* Founders */}
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-10 font-pike">
            Founders of Mashti
          </h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10 font-sodo">
            Mashti was founded with passion and craftsmanship by{" "}
            <span className="font-semibold">Armin NejadYousefi</span> and{" "}
            <span className="font-semibold">Hooman Khabbaz</span>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-5">
              <div className="relative w-28 h-28 flex-shrink-0">
                <Image
                  src="/images/armin-mashti.jpg"
                  alt="Founder portrait"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-pike">
                  Armin NejadYousefi
                </h3>
                <p className="text-gray-700 mt-1 font-sodo">
                  Co‑founder focused on product quality, flavor design, and the
                  everyday guest experience at Mashti.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-5">
              <div className="relative w-28 h-28 flex-shrink-0">
                <Image
                  src="/images/hooman-mashti.jpg"
                  alt="Founder portrait"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-pike">
                  Hooman Khabbaz
                </h3>
                <p className="text-gray-700 mt-1 font-sodo">
                  Co‑founder leading operations and brand experience, bringing
                  the spirit of Persian hospitality to the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
