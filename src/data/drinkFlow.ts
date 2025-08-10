export type FlowOption = {
  label: string;
  next?: string;
  result?: string[];
};

export type FlowNode = {
  question: string;
  options: FlowOption[];
};

export type FlowMap = Record<string, FlowNode>;

export const drinkFlow: FlowMap = {
  start: {
    question: "الان بیشتر هوس یه چیز خنک داری یا یه نوشیدنی گرم؟",
    options: [
      { label: "❄️ نوشیدنی سرد", next: "cold_start" },
      { label: "☕ نوشیدنی گرم", next: "hot_start" },
    ],
  },

  // ───────── مسیر نوشیدنی سرد ─────────
  cold_start: {
    question: "چه سبکی از نوشیدنیِ سرد مد نظرت هست؟",
    options: [
      { label: "🥤 خنک و سبک", next: "juice_or_smoothie" },
      { label: "💪 سیرکننده / بعدِ ورزش", next: "protein_base" },
      { label: "🍧 کرمی و دسرگونه (شیک/بستنی)", next: "creamy_base" },
    ],
  },

  // تفاوت آبمیوه و اسموتی
  juice_or_smoothie: {
    question: "بافت و پایهٔ نوشیدنی سبک رو کدوم می‌خوای؟",
    options: [
      { label: "آبمیوهٔ تازه", next: "juice_profile" },
      { label: "اسموتی میوه‌ای", next: "smoothie_profile" },
    ],
  },

  juice_profile: {
    question: "آبمیوت بیشتر چه حال‌وهوایی داشته باشه؟",
    options: [
      {
        label: "ترش و سرحال‌کننده",
        result: ["Orange Juice", "Barberry Juice", "Sour Cherry Juice"],
      },
      {
        label: "شیرین و سبک",
        result: ["Apple Juice", "Coco Juice", "Carrot Juice"],
      },
      { label: "آنتی‌اکسیدان بالا", result: ["Pomegranate Juice", "Celery Juice"] },
    ],
  },

  smoothie_profile: {
    question: "اسموتی با چه طعمی می‌پسندی؟",
    options: [
      {
        label: "بری/قرمز",
        result: [
          "Strawberry Smoothie",
          "Watermelon strawberry Smoothie",
          "Shahtootfarangi",
        ],
      },
      { label: "ترش‌/آنتی‌اکسیدان", result: ["Pomegranate Smoothie", "Lavashak Smoothie"] },
      { label: "تروپیکال/گرمسیری", result: ["Mango Smoothie", "Pineapple Smoothie", "Peach Smoothie"] },
    ],
  },

  // ───────── مسیر ۲: سیرکننده / بعدِ ورزش ─────────
  protein_base: {
    question: "طعم غالب برای ریکاوری؟",
    options: [
      { label: "میوه‌ای پروتئینی", result: ["Berry Blast", "Green Power"] },
      {
        label: "آجیلی پروتئینی",
        result: [
          "Boost Shake (Coffee, Date & Peanut Butter Protein Shake)",
          "Peanut Butter Shake",
          "Nescafe Shake",
        ],
      },
      {
        label: "آجیلی میوه‌ای",
        result: [
          "Maajoon",
          "Vitamine Akbar Mashti",
          "Shir Pesteh Moz Nutella",
          "Shir Pesteh Moz",
        ],
      },
    ],
  },

  // ───────── مسیر ۳: کرمی و دسرگونه ─────────
  creamy_base: {
    question: "بیشتر چی هوس کردی؟",
    options: [
      { label: "نوشیدنی کرمی (شِیک)", next: "shake_by_flavor" },
      { label: "بستنی/دسر با قاشق", next: "dessert_by_style" },
    ],
  },

  shake_by_flavor: {
    question: "طعم شِیک؟",
    options: [
      { label: "کلاسیک کرمی", result: ["Vanilla Cinnamon Shake", "Caramel Shake"] },
      { label: "کوکی", result: ["Oreo Shake", "Ferrero", "Lotus Shake"] },
      { label: "شکلاتی", result: ["Nutella Shake", "M & M Shake", "Chocolate Shake", "Shir Pesteh Moz Nutella"] },
      { label: "میوه‌ای", result: ["Londsgate Shake", "Barberry Shake", "Shir Moz", "Shir Moz Anbe"] },
      { label: "آجیلی/کنجدی", result: ["Peanut Butter Shake", "Tahini Shake", "Shir Pesteh", "Shir Fandogh"] },
      { label: "کافئین‌دار", result: ["Nescafe Shake", "Affogato"] },
    ],
  },

  dessert_by_style: {
    question: "چه مدل بستنی یا دسری مدنظرت هست؟",
    options: [
      { label: "کاپ بستنی‌ها", next: "icecream_pick" },
      { label: "دسر سنتی ایرانی", next: "dessert_traditional" },
      { label: "فیوژن/کافه‌ای", result: ["Affogato", "Ferrero", "Pirashki Bastani"] },
    ],
  },

  icecream_pick: {
    question: "بستنی با چه طعمی؟",
    options: [
      { label: "کلاسیک ایرانی", result: ["Akbar Mashti Cup", "Saffron Cup", "Havij Bastani"] },
      { label: "کلاسیک", result: ["Vanilla Cup", "Chocolate Cup"] },
      { label: "میوه‌ای", result: ["Strawberry Cup", "Mango Cup"] },
    ],
  },

  dessert_traditional: {
    question: "دسر سنتی انتخاب کن:",
    options: [
      { label: "بستنی‌های سنتی", result: ["Akbar Mashti Cup", "Saffron Cup", "Havij Bastani"] },
      { label: "دسرهای سنتی", result: ["Faloodeh", "Faloodeh Bastani", "Lavashak Plate"] },
    ],
  },

  // ───────── مسیر نوشیدنی گرم ─────────
  hot_start: {
    question: "امروز بیشتر حوصله‌ی قهوه داری یا چای/دمنوش؟",
    options: [
      { label: "☕ قهوه", next: "coffee_strength" },
      { label: "🍵 چای / دمنوش", next: "tea_caffeine" },
    ],
  },

  coffee_strength: {
    question: "میخوای قهوه‌ت خیلی پرانرژی باشه یا ملایم‌تر؟",
    options: [
      {
        label: "خیلی قوی",
        next: "coffee_pure_or_sweet",
        result: ["Espresso", "Americano"],
      },
      {
        label: "ملایم",
        next: "coffee_pure_or_sweet",
        result: ["Latte", "Cappuccino", "Caramel Macchiato"],
      },
    ],
  },

  coffee_pure_or_sweet: {
    question: "قهوه خالص میخوای یا کمی شیرین و خوش‌عطر؟",
    options: [
      { label: "خالص", next: "coffee_final", result: ["Espresso", "Americano"] },
      { label: "شیرین", next: "coffee_final", result: ["Caramel Macchiato", "Latte", "Cappuccino"] },
    ],
  },

  coffee_final: {
    question: "قهوه‌ت رو فومی و خامه‌ای می‌پسندی؟",
    options: [
      { label: "بله", result: ["Cappuccino", "Latte", "Caramel Macchiato"] },
      { label: "نه", result: ["Espresso", "Americano"] },
    ],
  },

  tea_caffeine: {
    question: "دوست داری کمی کافئین برای انرژی بگیری یا کاملاً بدون کافئین باشه؟",
    options: [
      { label: "با کافئین", next: "tea_function", result: ["Black Tea", "Green Tea"] },
      {
        label: "بدون کافئین",
        next: "tea_function",
        result: [
          "Chamomile Tea",
          "Mint Medley Tea",
          "Lemon & Ginger Tea",
          "Mix Fruit Tea",
        ],
      },
    ],
  },

  tea_function: {
    question: "دنبال چه اثری از نوشیدنی هستی؟",
    options: [
      { label: "آرام‌بخش/ریلکس", next: "tea_flavour", result: ["Chamomile Tea", "Mint Medley Tea", "Green Tea"] },
      { label: "شادابی/هشیاری", next: "tea_flavour", result: ["Black Tea", "Green Tea", "Mix Fruit Tea", "Lemon & Ginger Tea"] },
      { label: "گوارش/گرم‌کننده", next: "tea_flavour", result: ["Lemon & Ginger Tea", "Mint Medley Tea"] },
      { label: "تقویت سیستم ایمنی/آنتی‌اکسیدان", next: "tea_flavour", result: ["Green Tea", "Lemon & Ginger Tea"] },
    ],
  },

  tea_flavour: {
    question: "طعم گیاهی/ملایم رو ترجیح میدی یا کمی تُرش و میوه‌ای؟",
    options: [
      { label: "گیاهی", result: ["Mint Medley Tea", "Chamomile Tea", "Green Tea", "Black Tea"] },
      { label: "میوه‌ای", result: ["Mix Fruit Tea", "Lemon & Ginger Tea"] },
    ],
  },
};


