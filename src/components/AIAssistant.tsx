"use client";

import { useState } from "react";
import { MenuItem, getRecommendations } from "../data/menuDatabase";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: "temperature",
      question: "نوشیدنی خود را چگونه می‌خواهید؟",
      options: [
        { value: "hot", label: "گرم", emoji: "🔥" },
        { value: "cold", label: "سرد", emoji: "❄️" },
        { value: "both", label: "هر دو", emoji: "🌡️" },
      ],
    },
    {
      id: "timeOfDay",
      question: "چه زمانی از روز می‌خواهید؟",
      options: [
        { value: "morning", label: "صبح", emoji: "🌅" },
        { value: "afternoon", label: "ظهر", emoji: "☀️" },
        { value: "evening", label: "عصر", emoji: "🌆" },
        { value: "night", label: "شب", emoji: "🌙" },
      ],
    },
    {
      id: "flavor",
      question: "چه طعمی را ترجیح می‌دهید؟",
      options: [
        { value: "fruity", label: "میوه‌ای", emoji: "🍓" },
        { value: "sweet", label: "شیرین", emoji: "🍯" },
        { value: "creamy", label: "خامه‌ای", emoji: "🥛" },
        { value: "refreshing", label: "خنک کننده", emoji: "🌊" },
        { value: "rich", label: "پر و غنی", emoji: "💎" },
        { value: "tart", label: "ترش", emoji: "🍋" },
      ],
    },
    {
      id: "caffeine",
      question: "آیا کافئین می‌خواهید؟",
      options: [
        { value: "yes", label: "بله", emoji: "☕" },
        { value: "no", label: "نه", emoji: "🚫" },
        { value: "both", label: "مهم نیست", emoji: "🤷" },
      ],
    },
    {
      id: "healthGoal",
      question: "هدف سلامتی شما چیست؟",
      options: [
        { value: "energy", label: "انرژی", emoji: "💪" },
        { value: "vitamins", label: "ویتامین‌ها", emoji: "🥬" },
        { value: "antioxidants", label: "آنتی اکسیدان", emoji: "🛡️" },
        { value: "protein", label: "پروتئین", emoji: "🏋️" },
        { value: "relaxation", label: "آرامش", emoji: "😌" },
        { value: "none", label: "هیچ کدام", emoji: "🎯" },
      ],
    },
    {
      id: "tastePreference",
      question: "ترجیح طعم شما چیست؟",
      options: [
        { value: "sweet", label: "شیرین", emoji: "🍯" },
        { value: "refreshing", label: "خنک کننده", emoji: "🌊" },
        { value: "creamy", label: "خامه‌ای", emoji: "🥛" },
        { value: "spicy", label: "ادویه‌دار", emoji: "🌶️" },
        { value: "none", label: "مهم نیست", emoji: "🤷" },
      ],
    },
    {
      id: "dietaryRestrictions",
      question: "آیا محدودیت غذایی دارید؟",
      options: [
        { value: "vegan", label: "وگان", emoji: "🌱" },
        { value: "vegetarian", label: "گیاهخوار", emoji: "🥗" },
        { value: "gluten-free", label: "بدون گلوتن", emoji: "🌾" },
        { value: "high-protein", label: "پروتئین بالا", emoji: "🏋️" },
        { value: "none", label: "هیچ کدام", emoji: "✅" },
      ],
    },
  ];

  const handleAnswer = (questionId: string, answer: string) => {
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
  };

  const resetConversation = () => {
    setCurrentStep(0);
    setAnswers({});
    setRecommendations([]);
    setShowResults(false);
  };

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
              <h2 className="text-xl font-bold drop-shadow-sm">AI مشتی</h2>
              <p className="text-sm opacity-90">دستیار هوشمند انتخاب محصول</p>
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
                  <span>پیشرفت</span>
                  <span>
                    سوال {currentStep + 1} از {questions.length}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
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

              {/* Loading */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="relative mx-auto mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-400 mx-auto"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-400/20 animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    در حال تحلیل ترجیحات شما...
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    AI مشتی در حال انتخاب بهترین محصولات است
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results */
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  پیشنهادات مشتی
                </h3>
                <p className="text-gray-600">بر اساس ترجیحات شما</p>
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
                              اطلاعات تغذیه‌ای
                            </h5>
                            {getNutritionalInfo(item)}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h5 className="font-semibold text-xs text-gray-700 mb-2">
                              پروفایل طعم
                            </h5>
                            {getTasteProfile(item)}
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1">
                            مواد تشکیل دهنده:
                          </h5>
                          <div className="text-xs text-gray-600">
                            {item.ingredients.join(", ")}
                          </div>
                        </div>

                        {/* Health Benefits */}
                        <div className="mb-3">
                          <h5 className="font-semibold text-xs text-gray-700 mb-1">
                            فواید سلامتی:
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
                              مواد حساسیت‌زا:
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
                          <span className="font-semibold">دلیل انتخاب:</span>{" "}
                          {item.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={resetConversation}
                className="w-full mt-6 bg-gradient-to-r from-orange-400 to-pink-400 text-white py-3 px-6 rounded-2xl font-semibold hover:from-orange-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm"
              >
                شروع مجدد
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
