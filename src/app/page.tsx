"use client";

import Navigation from "../components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Marvel-style background effects */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F0131E' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation onAIOpen={() => {}} showMenu={false} />

      <main className="flex-1 w-full pt-48 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <section id="locations" className="max-w-6xl mx-auto">
          {/* Marvel-style title */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-wider uppercase font-pike"
              style={{
                textShadow:
                  "0 0 20px #F0131E, 0 0 40px #F0131E, 0 0 60px #F0131E",
                WebkitTextStroke: "1px #F0131E",
              }}
            >
              Our Locations
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-medium tracking-wide font-sodo">
              Choose Your Destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Central Branch - Marvel Style (First on Mobile) */}
            <a
              href="/central"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:rotate-1 shadow-lg order-1 md:order-2 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/northvan.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Central Branch
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    North Vancouver
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      1544 Lonsdale Ave, North Vancouver
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Everyday: 11AM - 12AM
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Coquitlam Branch - Marvel Style (Second on Mobile) */}
            <a
              href="https://streetfoodapp.com/vancouver/mashti"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:-rotate-1 shadow-lg order-2 md:order-1 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/truck.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Coquitlam Branch
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    Mashti On The Wheel
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      Pinetree Way, Coquitlam
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Everyday: 11AM - 12AM
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Wholesale - Marvel Style (Third on Mobile) */}
            <a
              href="/wholesale"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:rotate-1 shadow-lg order-3 md:order-3 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/wholesales.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Wholesale
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    Go big. Go kilo. Go MASHTI!
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      399 Mountain Highway, North Vancouver
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Mon-Fri: 8AM - 6PM
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
