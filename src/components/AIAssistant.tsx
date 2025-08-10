"use client";

import { useState, memo, useCallback, useEffect } from "react";
import { drinkFlow } from "@/data/drinkFlow";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

// Legacy dynamic-question types removed; new flow uses drinkFlow only

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  category: string;
  price: string;
  temperature: "hot" | "cold" | "both";
  flavors: string[];
  caffeine: boolean;
  healthBenefits: string[];
  timeOfDay: string[];
  seasonality: string[];
  popularity: number;
  reason: string;
  ingredients: string[];
  vitamins: string[];
  minerals: string[];
  calories: number;
  sugar: number;
  protein: number;
  fat: number;
  tasteProfile: {
    sweetness: number;
    acidity: number;
    bitterness: number;
    creaminess: number;
    spiciness: number;
    freshness: number;
  };
  allergens: string[];
  dietaryInfo: string[];
  preparationTime: number;
  servingSize: string;
  origin: string;
}

const AIAssistant = memo(function AIAssistant({
  isOpen,
  onClose,
}: AIAssistantProps) {
  // Dynamic-question state removed; flow-based only
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  // Hot-drink flow state
  // Fixed to hot-drink flow for now; language can be toggled later if needed
  // Always use the structured drinkFlow
  // Currently unused; questions/options render bilingual automatically
  // const [flowLang] = useState<"en" | "fa">("en");
  const [currentNodeKey, setCurrentNodeKey] = useState<string>("start");
  const [visitedNodeKeys, setVisitedNodeKeys] = useState<string[]>(["start"]);

  // English translations aligned with the combined (FA) drink flow
  const englishQuestions: Record<string, string> = {
    start: "Are you craving a cold refreshment or a hot drink?",
    // Cold branch
    cold_start: "What style of cold drink do you want?",
    juice_or_smoothie: "For a light drink, which base do you want?",
    juice_profile: "What vibe for your fresh juice?",
    smoothie_profile: "What flavor profile for your smoothie?",
    protein_base: "Preferred flavor for recovery?",
    creamy_base: "What are you in the mood for?",
    shake_by_flavor: "Shake flavor?",
    dessert_by_style: "Which style do you want?",
    icecream_pick: "Which ice cream flavor?",
    dessert_traditional: "Pick a traditional dessert:",
    // Hot branch
    hot_start:
      "Are you more in the mood for coffee or tea/herbal infusion today?",
    coffee_strength:
      "Do you want your coffee very strong and energizing, or milder?",
    coffee_pure_or_sweet:
      "Do you prefer pure coffee or something a bit sweet and aromatic?",
    coffee_final: "Are you okay waiting a bit for milk foam and silky cream?",
    tea_caffeine:
      "Would you like some caffeine for energy, or completely caffeine‑free?",
    tea_function: "What effect are you looking for from your drink?",
    tea_flavour:
      "Do you prefer a herbal/mild taste or something a bit tangy and fruity?",
  };

  const englishOptions: Record<string, string[]> = {
    // Cold branch
    start: ["❄️ Cold Drink", "☕ Hot Drink"],
    cold_start: [
      "🥤 Cool & Light",
      "💪 Filling / Post‑workout",
      "🍧 Creamy & Dessert‑like",
    ],
    juice_or_smoothie: ["Fresh Juice", "Fruit Smoothie"],
    juice_profile: [
      "Citrusy / Tart & Energizing",
      "Sweet & Light",
      "High Antioxidants",
    ],
    smoothie_profile: ["Berry / Red", "More Tart / Antioxidant", "Tropical"],
    protein_base: ["Fruity Protein", "Nutty Protein", "Nutty + Fruity"],
    creamy_base: ["Creamy Drink (Shake)", "Ice cream / Spoon Dessert"],
    shake_by_flavor: [
      "Classic Creamy",
      "Cookie",
      "Chocolate",
      "Fruity",
      "Nutty / Sesame",
      "Caffeinated",
    ],
    dessert_by_style: [
      "Ice‑cream cups",
      "Traditional Persian Desserts",
      "Fusion / Cafe‑style",
    ],
    icecream_pick: ["Persian Classics", "Classics", "Fruity"],
    dessert_traditional: ["Traditional Ice‑creams", "Traditional Desserts"],
    // Hot branch
    hot_start: ["☕ Coffee", "🍵 Tea / Herbal"],
    coffee_strength: ["Very strong", "Mild"],
    coffee_pure_or_sweet: ["Pure", "Sweet"],
    coffee_final: ["Yes", "No"],
    tea_caffeine: ["With caffeine", "Caffeine‑free"],
    tea_flavour: ["Herbal", "Fruity"],
    tea_function: [
      "Relaxing / Calm",
      "Refreshing / Alert",
      "Digestion / Warming",
      "Immune support / Antioxidants",
    ],
  };

  // Explicit emoji stickers for clearer visual cues, especially where labels have no emoji
  const optionEmojis: Record<string, string[]> = {
    // Cold branch
    cold_start: ["🥤", "💪", "🍧"],
    juice_or_smoothie: ["🧃", "🥤"],
    juice_profile: ["🍊", "🍎", "🛡️"],
    smoothie_profile: ["🍓", "🍒", "🥭"],
    protein_base: ["🍓", "🥜", "🥜"],
    creamy_base: ["🥤", "🍨"],
    shake_by_flavor: ["🍦", "🍪", "🍫", "🍑", "🥜", "☕"],
    dessert_by_style: ["🍨", "🧁", "✨"],
    icecream_pick: ["🍨", "🍦", "🍓"],
    dessert_traditional: ["🍨", "🍧"],
    // Hot branch
    coffee_strength: ["⚡", "🙂"],
    coffee_pure_or_sweet: ["☕", "🍯"],
    coffee_final: ["✅", "🚫"],
    tea_caffeine: ["⚡", "🌿"],
    tea_function: ["😌", "✨", "🫚", "🛡️"],
    tea_flavour: ["🌿", "🍋"],
  };

  // Load menu items from CMS on component mount
  const loadMenuItems = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL &&
        process.env.NEXT_PUBLIC_BASE_URL.startsWith("http")
          ? process.env.NEXT_PUBLIC_BASE_URL
          : typeof window !== "undefined"
            ? window.location.origin
            : "";
      const url = `${baseUrl}/api/ai-menu`;
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menuItems || []);
      } else {
        console.error("Error loading menu items: ", response.status);
        setMenuItems([]);
      }
    } catch (error) {
      console.error("Error loading menu items:", error);
      setMenuItems([]);
    }
  }, []);

  // Load menu items when modal opens (only once while empty)
  useEffect(() => {
    if (isOpen && menuItems.length === 0) {
      loadMenuItems();
    }
  }, [isOpen, menuItems.length, loadMenuItems]);

  // Legacy dynamic-question builder removed

  // Map terminal results (list of names) to menu items, preserving order
  const mapResultNamesToMenuItems = useCallback(
    (names: string[]): MenuItem[] => {
      const results: MenuItem[] = [];
      const seen = new Set<string>();

      for (const name of names) {
        const target = name.toLowerCase();
        // Exact match
        let item = menuItems.find((mi) => mi.title.toLowerCase() === target);
        // Fallback: partial match
        if (!item) {
          item = menuItems.find(
            (mi) =>
              mi.title.toLowerCase().includes(target) ||
              target.includes(mi.title.toLowerCase())
          );
        }
        if (item && !seen.has(item.title)) {
          results.push(item);
          seen.add(item.title);
        }
      }

      return results;
    },
    [menuItems]
  );

  // Function to get recommendations from CMS data
  const getRecommendations = useCallback(
    (
      temperature?: string,
      timeOfDay?: string,
      flavor?: string,
      caffeine?: string,
      healthGoal?: string,
      dietaryRestrictions?: string[]
    ): MenuItem[] => {
      let filtered = [...menuItems];

      // Apply strict filters with better logic
      if (temperature && temperature !== "both") {
        filtered = filtered.filter((item) => item.temperature === temperature);
        console.log(
          `Temperature filter (${temperature}): ${filtered.length} items remaining`
        );
      }

      if (timeOfDay) {
        filtered = filtered.filter((item) =>
          item.timeOfDay.includes(timeOfDay)
        );
        console.log(
          `Time filter (${timeOfDay}): ${filtered.length} items remaining`
        );
      }

      if (flavor) {
        filtered = filtered.filter((item) => item.flavors.includes(flavor));
        console.log(
          `Flavor filter (${flavor}): ${filtered.length} items remaining`
        );
      }

      if (caffeine === "yes") {
        filtered = filtered.filter((item) => item.caffeine);
        console.log(
          `Caffeine filter (yes): ${filtered.length} items remaining`
        );
      } else if (caffeine === "no") {
        filtered = filtered.filter((item) => !item.caffeine);
        console.log(`Caffeine filter (no): ${filtered.length} items remaining`);
      }

      if (healthGoal && healthGoal !== "none") {
        filtered = filtered.filter((item) =>
          item.healthBenefits.includes(healthGoal)
        );
        console.log(
          `Health goal filter (${healthGoal}): ${filtered.length} items remaining`
        );
      }

      // Filter by dietary restrictions
      if (dietaryRestrictions && dietaryRestrictions.length > 0) {
        filtered = filtered.filter((item) => {
          return dietaryRestrictions.every(
            (restriction) =>
              item.dietaryInfo.includes(restriction) ||
              (restriction === "vegan" &&
                !item.allergens.includes("milk") &&
                !item.allergens.includes("eggs"))
          );
        });
        console.log(`Dietary filter: ${filtered.length} items remaining`);
      }

      // If we have strict matches, use them
      if (filtered.length > 0) {
        const sorted = filtered
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 3);
        console.log(`Using strict matches: ${sorted.length} items`);
        return sorted;
      }

      // If no strict matches, use intelligent fallback
      console.log("No strict matches found, using intelligent fallback");

      // Create a scoring system
      const scoredItems = menuItems.map((item) => {
        let score = 0;
        let matchCount = 0;

        // Temperature matching (high priority)
        if (temperature && temperature !== "both") {
          if (item.temperature === temperature) {
            score += 10;
            matchCount++;
          } else {
            score -= 5; // Penalty for wrong temperature
          }
        }

        // Time of day matching
        if (timeOfDay) {
          if (item.timeOfDay.includes(timeOfDay)) {
            score += 8;
            matchCount++;
          }
        }

        // Flavor matching
        if (flavor) {
          if (item.flavors.includes(flavor)) {
            score += 8;
            matchCount++;
          }
        }

        // Caffeine matching
        if (caffeine === "yes") {
          if (item.caffeine) {
            score += 6;
            matchCount++;
          } else {
            score -= 3; // Penalty for no caffeine when requested
          }
        } else if (caffeine === "no") {
          if (!item.caffeine) {
            score += 6;
            matchCount++;
          } else {
            score -= 3; // Penalty for caffeine when not wanted
          }
        }

        // Health goal matching
        if (healthGoal && healthGoal !== "none") {
          if (item.healthBenefits.includes(healthGoal)) {
            score += 7;
            matchCount++;
          }
        }

        // Dietary restrictions
        if (dietaryRestrictions && dietaryRestrictions.length > 0) {
          const dietaryMatch = dietaryRestrictions.every(
            (restriction) =>
              item.dietaryInfo.includes(restriction) ||
              (restriction === "vegan" &&
                !item.allergens.includes("milk") &&
                !item.allergens.includes("eggs"))
          );
          if (dietaryMatch) {
            score += 6;
            matchCount++;
          } else {
            score -= 10; // Heavy penalty for dietary mismatch
          }
        }

        // Bonus for popular items
        if (item.popularity >= 8) {
          score += 3;
        }

        // Bonus for at least 2 matches
        if (matchCount >= 2) {
          score += 5;
        }

        return { item, score, matchCount };
      });

      // Filter items with at least 1 match and positive score
      const validItems = scoredItems
        .filter(({ score, matchCount }) => score > 0 && matchCount > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ item }) => item);

      console.log(`Intelligent fallback: ${validItems.length} items`);

      // If still no good matches, return popular items from the same category
      if (validItems.length === 0) {
        console.log("No intelligent matches, returning popular items");
        return menuItems
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 3);
      }

      return validItems;
    },
    [menuItems]
  );

  const handleFlowAnswer = useCallback(
    (option: { next?: string; result?: string[] }) => {
      if (option.next) {
        setCurrentNodeKey(option.next);
        setVisitedNodeKeys((prev) => [...prev, option.next as string]);
        return;
      }

      if (option.result) {
        setIsLoading(true);
        // Small delay to mimic async processing, consistent with existing UX
        setTimeout(() => {
          let recs = mapResultNamesToMenuItems(option.result as string[]);
          // Fallback: if nothing matched, use broader hot recommendations
          if (recs.length === 0) {
            const inferredTemp = visitedNodeKeys.includes("hot_start")
              ? "hot"
              : visitedNodeKeys.includes("cold_start")
                ? "cold"
                : undefined;
            recs = getRecommendations(
              inferredTemp,
              undefined,
              undefined,
              undefined,
              undefined,
              []
            );
          }
          setRecommendations(recs);
          setIsLoading(false);
          setShowResults(true);
        }, 600);
      }
    },
    [getRecommendations, mapResultNamesToMenuItems, visitedNodeKeys]
  );

  // Helpers to extract emoji (if any) and plain text from a label like "☕ Coffee"
  // (helper removed; inlined where needed)

  // Legacy dynamic-answer handler removed

  const resetConversation = useCallback(() => {
    setRecommendations([]);
    setShowResults(false);
  }, []);

  const getNutritionalInfo = (item: MenuItem) => {
    return (
      <div className="text-xs text-gray-600 space-y-1">
        <div className="mb-2 pb-2 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-1">
            📊 اطلاعات تغذیه‌ای ({item.servingSize})
          </div>
        </div>
        <div className="flex justify-between">
          <span>کالری:</span>
          <span className="font-semibold">{item.calories} kcal</span>
        </div>
        <div className="flex justify-between">
          <span>پروتئین:</span>
          <span className="font-semibold">{item.protein}g</span>
        </div>
        <div className="flex justify-between">
          <span>قند:</span>
          <span className="font-semibold">{item.sugar}g</span>
        </div>
        <div className="flex justify-between">
          <span>چربی:</span>
          <span className="font-semibold">{item.fat}g</span>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="mb-2">
            <span className="font-semibold text-blue-600">🥬 ویتامین‌ها:</span>
            <div className="text-xs mt-1 text-gray-700">
              {item.vitamins.join(", ")}
            </div>
          </div>
          <div>
            <span className="font-semibold text-green-600">💎 مواد معدنی:</span>
            <div className="text-xs mt-1 text-gray-700">
              {item.minerals.join(", ")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getTasteProfile = (item: MenuItem) => {
    const { tasteProfile } = item;
    return (
      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>شیرینی:</span>
          <span>{tasteProfile.sweetness}/10</span>
        </div>
        <div className="flex justify-between">
          <span>ترشی:</span>
          <span>{tasteProfile.acidity}/10</span>
        </div>
        <div className="flex justify-between">
          <span>تلخی:</span>
          <span>{tasteProfile.bitterness}/10</span>
        </div>
        <div className="flex justify-between">
          <span>خامه‌ای:</span>
          <span>{tasteProfile.creaminess}/10</span>
        </div>
      </div>
    );
  };

  // Remove eager calls in render to avoid multiple fetches

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl border border-gray-200 max-w-lg md:max-w-xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#e80812] p-6 md:p-7 text-white text-center relative rounded-t-2xl md:rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors duration-200 hover:scale-110"
          >
            ✕
          </button>
          <div className="flex items-center justify-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm font-pike leading-tight">
                Mashti AI
              </h2>
              <p className="text-[13px] md:text-base opacity-95 font-sodo">
                Smart Product Selection Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[65vh] md:max-h-[70vh] overflow-y-auto">
          {!showResults ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-[13px] text-gray-600 mb-2 font-sodo">
                  <span>Progress</span>
                  <span>Step {visitedNodeKeys.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#e80812] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(visitedNodeKeys.length * 20, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question (bilingual) */}
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 whitespace-pre-line font-pike leading-relaxed">
                  {englishQuestions[currentNodeKey]}
                </h3>
                <div className="text-base md:text-lg text-gray-700 mt-2 font-sodo whitespace-pre-line leading-relaxed">
                  {drinkFlow[currentNodeKey]?.question}
                </div>
              </div>

              {/* Options (bilingual) */}
              <div className="space-y-3">
                {drinkFlow[currentNodeKey].options.map((optFa, idx) => {
                  const enLabel = englishOptions[currentNodeKey]?.[idx] || "";
                  // Prefer our curated emoji set; fallback to emoji embedded in label; otherwise use pointer
                  const curated = optionEmojis[currentNodeKey]?.[idx];
                  const labelForEmoji = enLabel || optFa.label;
                  const match = labelForEmoji.match(/^([^A-Za-z0-9\s]+)\s*/);
                  const inferred = match?.[1];
                  const emoji = curated || inferred || "👉";
                  const textEn = enLabel.replace(/^([^A-Za-z0-9\s]+)\s*/, "");
                  return (
                    <button
                      key={`${currentNodeKey}-${idx}`}
                      onClick={() =>
                        handleFlowAnswer({
                          next: optFa.next,
                          result: optFa.result,
                        })
                      }
                      className="w-full p-5 md:p-6 border-2 border-gray-200 rounded-2xl hover:border-[#e80812]/60 hover:bg-red-50 transition-all duration-300 text-right flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                    >
                      <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-200">
                        {emoji}
                      </span>
                      <span className="text-right">
                        <span className="block text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#e80812] transition-colors duration-200 font-sodo leading-snug">
                          {textEn || enLabel || optFa.label}
                        </span>
                        <span className="block text-gray-600 text-sm md:text-base font-sodo leading-snug">
                          {optFa.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex gap-3 mt-6">
                {/* Back */}
                {visitedNodeKeys.length > 1 && (
                  <button
                    onClick={() => {
                      setVisitedNodeKeys((prev) => prev.slice(0, -1));
                      setCurrentNodeKey(
                        visitedNodeKeys[visitedNodeKeys.length - 2]
                      );
                    }}
                    className="flex-1 bg-gray-100 text-gray-800 py-3.5 md:py-4 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-sodo focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>
                )}

                {/* Reset */}
                <button
                  onClick={() => {
                    resetConversation();
                    setCurrentNodeKey("start");
                    setVisitedNodeKeys(["start"]);
                  }}
                  className="flex-1 bg-red-100 text-red-600 py-3.5 md:py-4 px-4 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-sodo focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Start Over</span>
                </button>
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="relative mx-auto mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-[#e80812] mx-auto"></div>
                  </div>
                  <p className="text-gray-700 font-semibold font-sodo">
                    Analyzing your preferences...
                  </p>
                  <p className="text-gray-500 text-sm md:text-base mt-2 font-sodo">
                    Mashti AI is selecting the best products for you
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 font-pike">
                  Mashti Recommendations
                </h3>
                <p className="text-gray-600 font-sodo text-sm md:text-base">
                  Based on your preferences
                </p>
              </div>

              <div className="space-y-4">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900 font-pike text-lg md:text-xl">
                            {item.title}
                          </h4>
                          <span className="text-[#e80812] font-bold">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base mb-3 font-sodo leading-relaxed">
                          {item.description}
                        </p>

                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full border border-red-200">
                            {item.category}
                          </span>
                        </div>

                        {/* Nutritional Info */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-800 mb-2 font-sodo">
                              Nutritional Info
                            </h5>
                            {getNutritionalInfo(item)}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-sm text-gray-800 mb-2 font-sodo">
                              Taste Profile
                            </h5>
                            {getTasteProfile(item)}
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-sm text-gray-800 mb-1 font-sodo">
                            Ingredients:
                          </h5>
                          <div className="text-sm text-gray-700 font-sodo">
                            {item.ingredients.join(", ")}
                          </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-sm text-red-700 mb-1 font-sodo">
                            Health Benefits:
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {item.healthBenefits.map((benefit, idx) => (
                              <span
                                key={idx}
                                className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Allergens */}
                        {item.allergens.length > 0 && (
                          <div className="mb-3">
                            <h5 className="font-semibold text-xs text-red-700 mb-1 font-sodo">
                              Allergens:
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {item.allergens.map((allergen, idx) => (
                                <span
                                  key={idx}
                                  className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="text-sm md:text-base text-gray-600 mt-2 font-sodo leading-relaxed">
                          <span className="font-semibold">
                            Why we chose this:
                          </span>{" "}
                          {item.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {/* Back to Questions Button */}
                <button
                  onClick={() => {
                    setShowResults(false);
                    const lastKey =
                      visitedNodeKeys[visitedNodeKeys.length - 1] || "start";
                    setCurrentNodeKey(lastKey);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-sodo"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span>Back to Questions</span>
                </button>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    resetConversation();
                    setCurrentNodeKey("start");
                    setVisitedNodeKeys(["start"]);
                  }}
                  className="flex-1 bg-red-100 text-red-600 py-3 px-4 rounded-xl font-medium hover:bg-red-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse font-sodo"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default AIAssistant;
