"use client";

import { useState, memo, useCallback } from "react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuestionOption {
  value: string;
  label: string;
  emoji: string;
}

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
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Load menu items from CMS on component mount
  const loadMenuItems = useCallback(async () => {
    try {
      const response = await fetch("/api/ai-menu");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menuItems || []);
      }
    } catch (error) {
      console.error("Error loading menu items:", error);
    }
  }, []);

  // Load menu items when component mounts
  useCallback(() => {
    if (isOpen && menuItems.length === 0) {
      loadMenuItems();
    }
  }, [isOpen, menuItems.length, loadMenuItems]);

  // Dynamic questions based on previous answers
  const getDynamicQuestions = useCallback(() => {
    const baseQuestions = [
      {
        id: "temperature",
        question:
          "How would you like your drink?\nنوشیدنی خود را چگونه می‌خواهید؟",
        options: [
          { value: "hot", label: "Hot (گرم)", emoji: "🔥" },
          { value: "cold", label: "Cold (سرد)", emoji: "❄️" },
          { value: "both", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
        ],
      },
      {
        id: "timeOfDay",
        question: "What time of day is it?\nچه زمانی از روز می‌خواهید؟",
        options: [
          { value: "morning", label: "Morning (صبح)", emoji: "🌅" },
          { value: "afternoon", label: "Afternoon (ظهر)", emoji: "☀️" },
          { value: "evening", label: "Evening (عصر)", emoji: "🌆" },
          { value: "night", label: "Night (شب)", emoji: "🌙" },
        ],
      },
    ];

    // Add flavor question with optimized options based on temperature
    const flavorQuestion = {
      id: "flavor",
      question: "What flavor do you prefer?\nچه طعمی را ترجیح می‌دهید؟",
      options: [] as QuestionOption[],
    };

    if (answers.temperature === "hot") {
      flavorQuestion.options = [
        { value: "sweet", label: "Sweet (شیرین)", emoji: "🍯" },
        { value: "creamy", label: "Creamy (خامه‌ای)", emoji: "🥛" },
        { value: "rich", label: "Rich (پر و غنی)", emoji: "💎" },
      ];
    } else if (answers.temperature === "cold") {
      flavorQuestion.options = [
        { value: "fruity", label: "Fruity (میوه‌ای)", emoji: "🍓" },
        { value: "refreshing", label: "Refreshing (خنک کننده)", emoji: "🌊" },
        { value: "sweet", label: "Sweet (شیرین)", emoji: "🍯" },
        { value: "tart", label: "Tart (ترش)", emoji: "🍋" },
      ];
    } else {
      // Both or no answer yet - show all options
      flavorQuestion.options = [
        { value: "fruity", label: "Fruity (میوه‌ای)", emoji: "🍓" },
        { value: "sweet", label: "Sweet (شیرین)", emoji: "🍯" },
        { value: "creamy", label: "Creamy (خامه‌ای)", emoji: "🥛" },
        { value: "refreshing", label: "Refreshing (خنک کننده)", emoji: "🌊" },
        { value: "rich", label: "Rich (پر و غنی)", emoji: "💎" },
        { value: "tart", label: "Tart (ترش)", emoji: "🍋" },
      ];
    }

    // Add caffeine question with optimized options based on time of day
    const caffeineQuestion = {
      id: "caffeine",
      question: "Do you want caffeine?\nآیا کافئین می‌خواهید؟",
      options: [] as QuestionOption[],
    };

    if (answers.timeOfDay === "morning") {
      caffeineQuestion.options = [
        { value: "yes", label: "Yes (بله)", emoji: "☕" },
        { value: "both", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
      ];
    } else if (answers.timeOfDay === "night") {
      caffeineQuestion.options = [
        { value: "no", label: "No (نه)", emoji: "🚫" },
        { value: "both", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
      ];
    } else {
      caffeineQuestion.options = [
        { value: "yes", label: "Yes (بله)", emoji: "☕" },
        { value: "no", label: "No (نه)", emoji: "🚫" },
        { value: "both", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
      ];
    }

    // Add health goal question with optimized options based on flavor
    const healthGoalQuestion = {
      id: "healthGoal",
      question: "What's your health goal?\nهدف سلامتی شما چیست؟",
      options: [] as QuestionOption[],
    };

    if (answers.flavor === "fruity" || answers.flavor === "refreshing") {
      healthGoalQuestion.options = [
        { value: "vitamins", label: "Vitamins (ویتامین‌ها)", emoji: "🥬" },
        {
          value: "antioxidants",
          label: "Antioxidants (آنتی اکسیدان)",
          emoji: "🛡️",
        },
        { value: "energy", label: "Energy (انرژی)", emoji: "💪" },
        { value: "none", label: "None (هیچ کدام)", emoji: "🎯" },
      ];
    } else if (answers.flavor === "creamy" || answers.flavor === "rich") {
      healthGoalQuestion.options = [
        { value: "protein", label: "Protein (پروتئین)", emoji: "🏋️" },
        { value: "energy", label: "Energy (انرژی)", emoji: "💪" },
        { value: "relaxation", label: "Relaxation (آرامش)", emoji: "😌" },
        { value: "none", label: "None (هیچ کدام)", emoji: "🎯" },
      ];
    } else {
      healthGoalQuestion.options = [
        { value: "energy", label: "Energy (انرژی)", emoji: "💪" },
        { value: "vitamins", label: "Vitamins (ویتامین‌ها)", emoji: "🥬" },
        {
          value: "antioxidants",
          label: "Antioxidants (آنتی اکسیدان)",
          emoji: "🛡️",
        },
        { value: "protein", label: "Protein (پروتئین)", emoji: "🏋️" },
        { value: "relaxation", label: "Relaxation (آرامش)", emoji: "😌" },
        { value: "none", label: "None (هیچ کدام)", emoji: "🎯" },
      ];
    }

    // Add dietary restrictions question
    const dietaryQuestion = {
      id: "dietaryRestrictions",
      question: "Do you have dietary restrictions?\nآیا محدودیت غذایی دارید؟",
      options: [
        { value: "vegan", label: "Vegan (وگان)", emoji: "🌱" },
        { value: "vegetarian", label: "Vegetarian (گیاهخوار)", emoji: "🥗" },
        {
          value: "gluten-free",
          label: "Gluten-free (بدون گلوتن)",
          emoji: "🌾",
        },
        {
          value: "high-protein",
          label: "High protein (پروتئین بالا)",
          emoji: "🏋️",
        },
        { value: "none", label: "None (هیچ کدام)", emoji: "✅" },
      ],
    };

    return [
      ...baseQuestions,
      flavorQuestion,
      caffeineQuestion,
      healthGoalQuestion,
      dietaryQuestion,
    ];
  }, [answers]);

  const questions = getDynamicQuestions();

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

  const handleAnswer = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));

      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Get recommendations
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
          const dietaryRestrictions =
            answers.dietaryRestrictions === "none"
              ? []
              : [answers.dietaryRestrictions];
          const recs = getRecommendations(
            answers.temperature,
            answers.timeOfDay,
            answers.flavor,
            answers.caffeine,
            answers.healthGoal,
            dietaryRestrictions
          );

          setRecommendations(recs);
          setIsLoading(false);
          setShowResults(true);
        }, 1500);
      }
    },
    [currentStep, answers, questions.length, getRecommendations]
  );

  const resetConversation = useCallback(() => {
    setCurrentStep(0);
    setAnswers({});
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

  // Load menu items when modal opens
  if (isOpen && menuItems.length === 0) {
    loadMenuItems();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#e80812] p-6 text-white text-center relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors duration-200 hover:scale-110"
          >
            ✕
          </button>
          <div className="flex items-center justify-center">
            <div>
              <h2 className="text-xl font-bold drop-shadow-sm font-pike">
                Mashti AI
              </h2>
              <p className="text-sm opacity-90 font-sodo">
                Smart Product Selection Assistant
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!showResults ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-sodo">
                  <span>Progress</span>
                  <span>
                    Question {currentStep + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#e80812] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 whitespace-pre-line font-pike">
                  {questions[currentStep].question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentStep].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      handleAnswer(questions[currentStep].id, option.value)
                    }
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-[#e80812]/60 hover:bg-red-50 transition-all duration-300 text-right flex items-center justify-between group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {option.emoji}
                    </span>
                    <span className="font-medium text-gray-700 group-hover:text-[#e80812] transition-colors duration-200 font-sodo">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                {/* Back Button - Only show if not on first question */}
                {currentStep > 0 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
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
                    <span>Previous Question</span>
                  </button>
                )}

                {/* Reset Button - Always show */}
                <button
                  onClick={resetConversation}
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

              {/* Loading */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="relative mx-auto mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-200 border-t-[#e80812] mx-auto"></div>
                  </div>
                  <p className="text-gray-600 font-medium font-sodo">
                    Analyzing your preferences...
                  </p>
                  <p className="text-gray-400 text-sm mt-2 font-sodo">
                    Mashti AI is selecting the best products for you
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-pike">
                  Mashti Recommendations
                </h3>
                <p className="text-gray-600 font-sodo">
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
                          <h4 className="font-semibold text-gray-800 font-pike">
                            {item.title}
                          </h4>
                          <span className="text-[#e80812] font-bold">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 font-sodo">
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
                            <h5 className="font-semibold text-xs text-gray-700 mb-2 font-sodo">
                              Nutritional Info
                            </h5>
                            {getNutritionalInfo(item)}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-xs text-gray-700 mb-2 font-sodo">
                              Taste Profile
                            </h5>
                            {getTasteProfile(item)}
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1 font-sodo">
                            Ingredients:
                          </h5>
                          <div className="text-xs text-gray-600 font-sodo">
                            {item.ingredients.join(", ")}
                          </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1 font-sodo">
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

                        <div className="text-sm text-gray-500 mt-2 font-sodo">
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
                    setCurrentStep(0);
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
                  onClick={resetConversation}
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
