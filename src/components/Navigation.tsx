"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navigation({ onAIOpen }: { onAIOpen: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/30 backdrop-blur-md z-50 border-b border-yellow-400/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32 py-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/newmashti-logo.png"
                alt="Mashti Logo"
                width={240}
                height={240}
                className="animate-pulse-glow"
              />
              <div className="text-orange-400 text-lg font-medium hidden sm:block">
                JUICE BAR + COFFEE
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#menu"
              className="text-white hover:text-orange-400 transition-colors font-semibold"
            >
              Menu
            </a>
            <a
              href="#about"
              className="text-white hover:text-orange-400 transition-colors font-semibold"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-white hover:text-orange-400 transition-colors font-semibold"
            >
              Contact
            </a>

            {/* AI Assistant Button */}
            <button
              onClick={onAIOpen}
              className="flex items-center space-x-4 bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 rounded-full hover:from-orange-600 hover:to-pink-600 transition-all duration-300 group"
            >
              <Image
                src="/images/walnut.png"
                alt="AI Mashti"
                width={56}
                height={56}
                className="rounded-full"
              />
              <span className="text-white font-semibold text-lg">
                AI Mashti
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-orange-400 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-yellow-400/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#menu"
                className="block px-3 py-2 text-gray-800 hover:text-orange-400 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Menu
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-gray-800 hover:text-orange-400 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 text-gray-800 hover:text-orange-400 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>

              {/* AI Assistant Mobile */}
              <button
                onClick={() => {
                  onAIOpen();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg w-full text-left"
              >
                <Image
                  src="/images/walnut.png"
                  alt="AI Mashti"
                  width={44}
                  height={44}
                  className="rounded-full"
                />
                <span className="text-white font-semibold text-sm">
                  AI Mashti
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
