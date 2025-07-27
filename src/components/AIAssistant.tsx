"use client";

import { useState, memo, useCallback } from "react";
import { MenuItem, getRecommendations } from "../data/menuDatabase";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuestionOption {
  value: string;
  label: string;
  emoji: string;
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
          { value: "both", label: "Both (هر دو)", emoji: "🌡️" },
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

    // Add taste preference question (simplified based on previous answers)
    const tastePreferenceQuestion = {
      id: "tastePreference",
      question: "What's your taste preference?\nترجیح طعم شما چیست؟",
      options: [] as QuestionOption[],
    };

    // Remove redundant options based on previous answers
    const usedFlavors = [answers.flavor, answers.temperature].filter(Boolean);

    if (usedFlavors.includes("sweet")) {
      tastePreferenceQuestion.options = [
        { value: "refreshing", label: "Refreshing (خنک کننده)", emoji: "🌊" },
        { value: "creamy", label: "Creamy (خامه‌ای)", emoji: "🥛" },
        { value: "none", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
      ];
    } else if (usedFlavors.includes("refreshing")) {
      tastePreferenceQuestion.options = [
        { value: "sweet", label: "Sweet (شیرین)", emoji: "🍯" },
        { value: "creamy", label: "Creamy (خامه‌ای)", emoji: "🥛" },
        { value: "none", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
      ];
    } else {
      tastePreferenceQuestion.options = [
        { value: "sweet", label: "Sweet (شیرین)", emoji: "🍯" },
        { value: "refreshing", label: "Refreshing (خنک کننده)", emoji: "🌊" },
        { value: "creamy", label: "Creamy (خامه‌ای)", emoji: "🥛" },
        { value: "none", label: "Doesn't matter (مهم نیست)", emoji: "🤷" },
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
      tastePreferenceQuestion,
      dietaryQuestion,
    ];
  }, [answers]);

  const questions = getDynamicQuestions();

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
            answers.tastePreference,
            dietaryRestrictions
          );

          setRecommendations(recs);
          setIsLoading(false);
          setShowResults(true);
        }, 1500);
      }
    },
    [currentStep, answers, questions.length]
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
        <div className="flex justify-between">
          <span>کالری:</span>
          <span>{item.calories}</span>
        </div>
        <div className="flex justify-between">
          <span>پروتئین:</span>
          <span>{item.protein}g</span>
        </div>
        <div className="flex justify-between">
          <span>قند:</span>
          <span>{item.sugar}g</span>
        </div>
        <div className="flex justify-between">
          <span>چربی:</span>
          <span>{item.fat}g</span>
        </div>
        <div className="mt-2">
          <span className="font-semibold">ویتامین‌ها:</span>
          <div className="text-xs">{item.vitamins.join(", ")}</div>
        </div>
        <div className="mt-1">
          <span className="font-semibold">مواد معدنی:</span>
          <div className="text-xs">{item.minerals.join(", ")}</div>
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400/90 to-pink-400/90 backdrop-blur-sm p-6 text-white text-center relative rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors duration-200 hover:scale-110"
          >
            ✕
          </button>
          <div className="flex items-center justify-center space-x-3 space-x-reverse">
            <div className="relative">
              <img
                src="/images/walnut.png"
                alt="AI Mashti"
                className="w-12 h-12 drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
            </div>
            <div>
              <h2 className="text-xl font-bold drop-shadow-sm font-pike">
                Mashti AI
              </h2>
              <p className="text-sm opacity-90">
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
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>
                    Question {currentStep + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 whitespace-pre-line">
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
                    className="w-full p-4 border-2 border-gray-200/50 rounded-2xl hover:border-orange-300/60 hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-pink-50/80 transition-all duration-300 text-right flex items-center justify-between group backdrop-blur-sm"
                  >
                    <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                      {option.emoji}
                    </span>
                    <span className="font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
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
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
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
                  className="flex-1 bg-red-100 text-red-600 py-3 px-4 rounded-xl font-medium hover:bg-red-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
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
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-400 mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-400/20 animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Analyzing your preferences...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Mashti AI is selecting the best products for you
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Mashti Recommendations
                </h3>
                <p className="text-gray-600">Based on your preferences</p>
              </div>

              <div className="space-y-4">
                {recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200/50 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/80"
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="text-3xl drop-shadow-sm">{item.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">
                            {item.title}
                          </h4>
                          <span className="text-orange-600 font-bold drop-shadow-sm">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>

                        {/* Category Badge */}
                        <div className="mb-3">
                          <span className="inline-block bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 text-xs px-3 py-1 rounded-full border border-orange-200/50">
                            {item.category}
                          </span>
                        </div>

                        {/* Nutritional Info */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-xs text-gray-700 mb-2">
                              Nutritional Info
                            </h5>
                            {getNutritionalInfo(item)}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-xs text-gray-700 mb-2">
                              Taste Profile
                            </h5>
                            {getTasteProfile(item)}
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1">
                            Ingredients:
                          </h5>
                          <div className="text-xs text-gray-600">
                            {item.ingredients.join(", ")}
                          </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1">
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
                            <h5 className="font-semibold text-xs text-red-700 mb-1">
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

                        <div className="text-sm text-gray-500 mt-2">
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
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
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
                  className="flex-1 bg-red-100 text-red-600 py-3 px-4 rounded-xl font-medium hover:bg-red-200 transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
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
