export interface MenuItem {
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
  // New detailed fields
  ingredients: string[];
  vitamins: string[];
  minerals: string[];
  calories: number;
  sugar: number; // grams
  protein: number; // grams
  fat: number; // grams
  tasteProfile: {
    sweetness: number; // 1-10
    acidity: number; // 1-10
    bitterness: number; // 1-10
    creaminess: number; // 1-10
    spiciness: number; // 1-10
    freshness: number; // 1-10
  };
  allergens: string[];
  dietaryInfo: string[];
  preparationTime: number; // minutes
  servingSize: string;
  origin: string; // Persian, International, etc.
}

export const menuDatabase: MenuItem[] = [
  // Hot Drinks
  {
    title: "Espresso",
    description: "Rich and bold coffee shot for energy",
    icon: "☕",
    category: "Coffee & Tea",
    price: "$3.95",
    temperature: "hot",
    flavors: ["bold", "rich", "strong"],
    caffeine: true,
    healthBenefits: ["energy", "antioxidants"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 9,
    reason: "Perfect hot drink for energy boost",
    ingredients: ["Arabica coffee beans", "water"],
    vitamins: ["B3", "B5"],
    minerals: ["magnesium", "potassium"],
    calories: 5,
    sugar: 0,
    protein: 0.5,
    fat: 0,
    tasteProfile: {
      sweetness: 1,
      acidity: 8,
      bitterness: 9,
      creaminess: 1,
      spiciness: 1,
      freshness: 3
    },
    allergens: [],
    dietaryInfo: ["vegan", "gluten-free"],
    preparationTime: 2,
    servingSize: "30ml",
    origin: "International"
  },
  {
    title: "Cappuccino",
    description: "Rich and smooth espresso-style coffee drink",
    icon: "☕",
    category: "Coffee & Tea",
    price: "$5.45",
    temperature: "hot",
    flavors: ["creamy", "smooth", "rich"],
    caffeine: true,
    healthBenefits: ["energy", "calcium"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 8,
    reason: "Classic coffee choice with perfect balance",
    ingredients: ["espresso", "steamed milk", "milk foam"],
    vitamins: ["B3", "B5", "D", "B12"],
    minerals: ["calcium", "magnesium", "potassium"],
    calories: 120,
    sugar: 12,
    protein: 8,
    fat: 6,
    tasteProfile: {
      sweetness: 4,
      acidity: 6,
      bitterness: 5,
      creaminess: 9,
      spiciness: 1,
      freshness: 2
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 4,
    servingSize: "180ml",
    origin: "International"
  },
  {
    title: "Black Tea",
    description: "Strong and soothing black tea for a perfect pick-me-up",
    icon: "🫖",
    category: "Coffee & Tea",
    price: "$4.00",
    temperature: "hot",
    flavors: ["strong", "soothing"],
    caffeine: true,
    healthBenefits: ["energy", "antioxidants", "heart health"],
    timeOfDay: ["morning", "afternoon", "evening"],
    seasonality: ["all"],
    popularity: 7,
    reason: "Great hot beverage for any time",
    ingredients: ["black tea leaves", "water"],
    vitamins: ["B1", "B2", "C"],
    minerals: ["manganese", "fluoride"],
    calories: 2,
    sugar: 0,
    protein: 0,
    fat: 0,
    tasteProfile: {
      sweetness: 1,
      acidity: 3,
      bitterness: 7,
      creaminess: 1,
      spiciness: 1,
      freshness: 4
    },
    allergens: [],
    dietaryInfo: ["vegan", "gluten-free"],
    preparationTime: 3,
    servingSize: "240ml",
    origin: "International"
  },
  {
    title: "Chamomile Tea",
    description: "Soothing herbal tea with a calming aroma",
    icon: "🫖",
    category: "Coffee & Tea",
    price: "$4.00",
    temperature: "hot",
    flavors: ["soothing", "calming"],
    caffeine: false,
    healthBenefits: ["relaxation", "sleep", "digestion"],
    timeOfDay: ["evening", "night"],
    seasonality: ["all"],
    popularity: 6,
    reason: "Perfect for relaxation and sleep",
    ingredients: ["chamomile flowers", "water"],
    vitamins: ["A", "C"],
    minerals: ["calcium", "magnesium"],
    calories: 1,
    sugar: 0,
    protein: 0,
    fat: 0,
    tasteProfile: {
      sweetness: 2,
      acidity: 2,
      bitterness: 3,
      creaminess: 1,
      spiciness: 1,
      freshness: 5
    },
    allergens: [],
    dietaryInfo: ["vegan", "gluten-free"],
    preparationTime: 3,
    servingSize: "240ml",
    origin: "International"
  },

  // Cold Drinks
  {
    title: "Strawberry Smoothie",
    description: "Fresh strawberries blended to a smooth and refreshing treat",
    icon: "🥤",
    category: "Smoothies",
    price: "$9.99",
    temperature: "cold",
    flavors: ["fruity", "sweet", "refreshing"],
    caffeine: false,
    healthBenefits: ["vitamins", "antioxidants", "fiber"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["spring", "summer"],
    popularity: 8,
    reason: "Refreshing cold drink with fruity flavor",
    ingredients: ["fresh strawberries", "milk", "yogurt", "honey", "ice"],
    vitamins: ["C", "K", "B6", "B9"],
    minerals: ["potassium", "manganese"],
    calories: 180,
    sugar: 25,
    protein: 6,
    fat: 4,
    tasteProfile: {
      sweetness: 8,
      acidity: 6,
      bitterness: 1,
      creaminess: 7,
      spiciness: 1,
      freshness: 9
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 5,
    servingSize: "350ml",
    origin: "International"
  },
  {
    title: "Mango Smoothie",
    description: "Sweet and refreshing blend of mango puree",
    icon: "🥤",
    category: "Smoothies",
    price: "$9.99",
    temperature: "cold",
    flavors: ["fruity", "sweet", "refreshing"],
    caffeine: false,
    healthBenefits: ["vitamins", "antioxidants", "digestion"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["spring", "summer"],
    popularity: 9,
    reason: "Popular choice with great taste",
    ingredients: ["mango puree", "milk", "yogurt", "honey", "ice"],
    vitamins: ["A", "C", "E", "B6"],
    minerals: ["potassium", "copper"],
    calories: 200,
    sugar: 28,
    protein: 5,
    fat: 3,
    tasteProfile: {
      sweetness: 9,
      acidity: 4,
      bitterness: 1,
      creaminess: 6,
      spiciness: 1,
      freshness: 8
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 5,
    servingSize: "350ml",
    origin: "International"
  },
  {
    title: "Vanilla Cinnamon Shake",
    description: "Creamy blend of vanilla and cinnamon flavours",
    icon: "🥤",
    category: "Shakes",
    price: "$9.99",
    temperature: "cold",
    flavors: ["sweet", "creamy", "spicy"],
    caffeine: false,
    healthBenefits: ["comfort", "digestion"],
    timeOfDay: ["afternoon", "evening"],
    seasonality: ["fall", "winter"],
    popularity: 7,
    reason: "Delicious cold treat with sweet flavor",
    ingredients: ["vanilla ice cream", "milk", "cinnamon", "vanilla extract", "whipped cream"],
    vitamins: ["A", "D", "B12"],
    minerals: ["calcium", "phosphorus"],
    calories: 320,
    sugar: 35,
    protein: 8,
    fat: 12,
    tasteProfile: {
      sweetness: 9,
      acidity: 2,
      bitterness: 2,
      creaminess: 10,
      spiciness: 4,
      freshness: 3
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 4,
    servingSize: "400ml",
    origin: "International"
  },
  {
    title: "Chocolate Shake",
    description: "Rich and creamy blend of chocolate",
    icon: "🥤",
    category: "Shakes",
    price: "$9.99",
    temperature: "cold",
    flavors: ["sweet", "creamy", "rich"],
    caffeine: false,
    healthBenefits: ["comfort", "mood boost"],
    timeOfDay: ["afternoon", "evening"],
    seasonality: ["all"],
    popularity: 8,
    reason: "Classic chocolate treat for any time",
    ingredients: ["chocolate ice cream", "milk", "chocolate syrup", "whipped cream"],
    vitamins: ["A", "D", "B12"],
    minerals: ["calcium", "iron"],
    calories: 380,
    sugar: 42,
    protein: 9,
    fat: 15,
    tasteProfile: {
      sweetness: 10,
      acidity: 2,
      bitterness: 3,
      creaminess: 10,
      spiciness: 1,
      freshness: 2
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 4,
    servingSize: "400ml",
    origin: "International"
  },

  // Protein Shakes
  {
    title: "Chocolate Protein Shake",
    description: "High protein chocolate shake with whey protein",
    icon: "🏋️",
    category: "Protein Shakes",
    price: "$12.99",
    temperature: "cold",
    flavors: ["sweet", "creamy", "rich"],
    caffeine: false,
    healthBenefits: ["protein", "energy", "muscle building"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 8,
    reason: "Perfect for muscle building and energy",
    ingredients: ["whey protein", "milk", "chocolate syrup", "banana", "peanut butter"],
    vitamins: ["B12", "D", "E"],
    minerals: ["calcium", "iron", "zinc"],
    calories: 280,
    sugar: 18,
    protein: 25,
    fat: 8,
    tasteProfile: {
      sweetness: 7,
      acidity: 3,
      bitterness: 4,
      creaminess: 8,
      spiciness: 1,
      freshness: 4
    },
    allergens: ["milk", "peanuts"],
    dietaryInfo: ["high-protein"],
    preparationTime: 6,
    servingSize: "450ml",
    origin: "International"
  },
  {
    title: "Strawberry Protein Shake",
    description: "Refreshing strawberry protein shake",
    icon: "🏋️",
    category: "Protein Shakes",
    price: "$12.99",
    temperature: "cold",
    flavors: ["fruity", "sweet", "refreshing"],
    caffeine: false,
    healthBenefits: ["protein", "vitamins", "antioxidants"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["spring", "summer"],
    popularity: 7,
    reason: "Great protein boost with fruity flavor",
    ingredients: ["whey protein", "milk", "strawberries", "yogurt", "honey"],
    vitamins: ["C", "B12", "D"],
    minerals: ["calcium", "potassium"],
    calories: 260,
    sugar: 20,
    protein: 22,
    fat: 6,
    tasteProfile: {
      sweetness: 8,
      acidity: 6,
      bitterness: 2,
      creaminess: 7,
      spiciness: 1,
      freshness: 8
    },
    allergens: ["milk"],
    dietaryInfo: ["high-protein"],
    preparationTime: 6,
    servingSize: "450ml",
    origin: "International"
  },

  // Energy Drinks
  {
    title: "Nescafe Shake",
    description: "Delicious coffee-flavored shake",
    icon: "🥤",
    category: "Shakes",
    price: "$9.99",
    temperature: "cold",
    flavors: ["sweet", "creamy", "rich"],
    caffeine: true,
    healthBenefits: ["energy", "mood boost"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 7,
    reason: "Coffee-based drink for energy boost",
    ingredients: ["coffee", "milk", "vanilla ice cream", "coffee syrup", "whipped cream"],
    vitamins: ["B3", "B5", "D"],
    minerals: ["calcium", "magnesium"],
    calories: 340,
    sugar: 38,
    protein: 8,
    fat: 12,
    tasteProfile: {
      sweetness: 8,
      acidity: 5,
      bitterness: 6,
      creaminess: 9,
      spiciness: 1,
      freshness: 3
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 5,
    servingSize: "400ml",
    origin: "International"
  },

  // Fresh Juices
  {
    title: "Orange Juice",
    description: "Fresh squeezed orange juice",
    icon: "🧃",
    category: "Fresh Juices",
    price: "$6.99",
    temperature: "cold",
    flavors: ["fruity", "refreshing", "sweet"],
    caffeine: false,
    healthBenefits: ["vitamins", "energy", "immunity"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 8,
    reason: "Classic vitamin C boost",
    ingredients: ["fresh oranges"],
    vitamins: ["C", "B6", "B9", "A"],
    minerals: ["potassium", "magnesium"],
    calories: 110,
    sugar: 22,
    protein: 2,
    fat: 0,
    tasteProfile: {
      sweetness: 7,
      acidity: 8,
      bitterness: 2,
      creaminess: 1,
      spiciness: 1,
      freshness: 10
    },
    allergens: [],
    dietaryInfo: ["vegan", "gluten-free"],
    preparationTime: 3,
    servingSize: "300ml",
    origin: "International"
  },
  {
    title: "Pomegranate Juice",
    description: "Fresh pomegranate juice with antioxidants",
    icon: "🧃",
    category: "Fresh Juices",
    price: "$8.99",
    temperature: "cold",
    flavors: ["fruity", "refreshing", "tart"],
    caffeine: false,
    healthBenefits: ["vitamins", "antioxidants", "heart health"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["fall", "winter"],
    popularity: 6,
    reason: "Antioxidant-rich Persian favorite",
    ingredients: ["fresh pomegranate seeds"],
    vitamins: ["C", "K", "B6", "B9"],
    minerals: ["potassium", "copper", "manganese"],
    calories: 130,
    sugar: 24,
    protein: 2,
    fat: 0,
    tasteProfile: {
      sweetness: 6,
      acidity: 7,
      bitterness: 3,
      creaminess: 1,
      spiciness: 1,
      freshness: 9
    },
    allergens: [],
    dietaryInfo: ["vegan", "gluten-free"],
    preparationTime: 4,
    servingSize: "300ml",
    origin: "Persian"
  },

  // Persian Specialties
  {
    title: "Lavashak Smoothie",
    description: "Traditional Persian fruit leather smoothie with tangy flavor",
    icon: "🥤",
    category: "Smoothies",
    price: "$15.99",
    temperature: "cold",
    flavors: ["fruity", "tart", "refreshing"],
    caffeine: false,
    healthBenefits: ["vitamins", "antioxidants", "digestion"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["all"],
    popularity: 8,
    reason: "Traditional Persian treat with unique tangy taste",
    ingredients: ["lavashak (fruit leather)", "yogurt", "honey", "mint", "ice"],
    vitamins: ["C", "A", "B6"],
    minerals: ["potassium", "calcium"],
    calories: 180,
    sugar: 20,
    protein: 6,
    fat: 3,
    tasteProfile: {
      sweetness: 5,
      acidity: 8,
      bitterness: 2,
      creaminess: 6,
      spiciness: 1,
      freshness: 8
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 6,
    servingSize: "350ml",
    origin: "Persian"
  },
  {
    title: "Shahtootfarangi Smoothie",
    description: "Traditional Persian mulberry smoothie",
    icon: "🥤",
    category: "Smoothies",
    price: "$12.99",
    temperature: "cold",
    flavors: ["fruity", "sweet", "refreshing"],
    caffeine: false,
    healthBenefits: ["vitamins", "antioxidants", "iron"],
    timeOfDay: ["morning", "afternoon"],
    seasonality: ["spring", "summer"],
    popularity: 7,
    reason: "Traditional Persian mulberry treat",
    ingredients: ["fresh mulberries", "milk", "honey", "yogurt", "ice"],
    vitamins: ["C", "K", "E", "B6"],
    minerals: ["iron", "potassium", "manganese"],
    calories: 160,
    sugar: 18,
    protein: 5,
    fat: 4,
    tasteProfile: {
      sweetness: 8,
      acidity: 4,
      bitterness: 2,
      creaminess: 6,
      spiciness: 1,
      freshness: 9
    },
    allergens: ["milk"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 5,
    servingSize: "350ml",
    origin: "Persian"
  },

  // Ice Cream
  {
    title: "Vanilla Ice Cream",
    description: "Classic vanilla ice cream",
    icon: "🍨",
    category: "Ice Cream",
    price: "$4.99",
    temperature: "cold",
    flavors: ["sweet", "creamy"],
    caffeine: false,
    healthBenefits: ["comfort", "calcium"],
    timeOfDay: ["afternoon", "evening"],
    seasonality: ["spring", "summer"],
    popularity: 8,
    reason: "Classic ice cream choice",
    ingredients: ["milk", "cream", "sugar", "vanilla extract", "egg yolks"],
    vitamins: ["A", "D", "B12"],
    minerals: ["calcium", "phosphorus"],
    calories: 250,
    sugar: 28,
    protein: 4,
    fat: 14,
    tasteProfile: {
      sweetness: 9,
      acidity: 1,
      bitterness: 1,
      creaminess: 10,
      spiciness: 1,
      freshness: 2
    },
    allergens: ["milk", "eggs"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 0,
    servingSize: "100g",
    origin: "International"
  },
  {
    title: "Chocolate Ice Cream",
    description: "Rich chocolate ice cream",
    icon: "🍨",
    category: "Ice Cream",
    price: "$4.99",
    temperature: "cold",
    flavors: ["sweet", "creamy", "rich"],
    caffeine: false,
    healthBenefits: ["comfort", "mood boost"],
    timeOfDay: ["afternoon", "evening"],
    seasonality: ["all"],
    popularity: 9,
    reason: "Popular chocolate treat",
    ingredients: ["milk", "cream", "chocolate", "sugar", "egg yolks"],
    vitamins: ["A", "D", "B12"],
    minerals: ["calcium", "iron"],
    calories: 280,
    sugar: 32,
    protein: 5,
    fat: 16,
    tasteProfile: {
      sweetness: 10,
      acidity: 2,
      bitterness: 4,
      creaminess: 10,
      spiciness: 1,
      freshness: 2
    },
    allergens: ["milk", "eggs"],
    dietaryInfo: ["vegetarian"],
    preparationTime: 0,
    servingSize: "100g",
    origin: "International"
  }
];

export const getRecommendations = (
  temperature?: string,
  timeOfDay?: string,
  flavor?: string,
  caffeine?: string,
  healthGoal?: string,
  tastePreference?: string,
  dietaryRestrictions?: string[]
): MenuItem[] => {
  const filtered = [...menuDatabase];
  let strictFiltered = [...menuDatabase];

  // Apply strict filters (all must match)
  if (temperature && temperature !== "both") {
    strictFiltered = strictFiltered.filter(item => item.temperature === temperature);
  }

  if (timeOfDay) {
    strictFiltered = strictFiltered.filter(item => item.timeOfDay.includes(timeOfDay));
  }

  if (flavor) {
    strictFiltered = strictFiltered.filter(item => item.flavors.includes(flavor));
  }

  if (caffeine === "yes") {
    strictFiltered = strictFiltered.filter(item => item.caffeine);
  } else if (caffeine === "no") {
    strictFiltered = strictFiltered.filter(item => !item.caffeine);
  }

  if (healthGoal && healthGoal !== "none") {
    strictFiltered = strictFiltered.filter(item => item.healthBenefits.includes(healthGoal));
  }

  // Filter by dietary restrictions
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    strictFiltered = strictFiltered.filter(item => {
      return dietaryRestrictions.every(restriction => 
        item.dietaryInfo.includes(restriction) || 
        (restriction === "vegan" && !item.allergens.includes("milk") && !item.allergens.includes("eggs"))
      );
    });
  }

  // If we have strict matches, use them
  if (strictFiltered.length > 0) {
    return strictFiltered
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }

  // Otherwise, apply flexible filtering (at least 2 criteria must match)
  let flexibleFiltered = [...menuDatabase];
  const matchCounts = new Map<MenuItem, number>();

  flexibleFiltered.forEach(item => {
    let matches = 0;
    
    if (temperature && temperature !== "both" && item.temperature === temperature) matches++;
    if (timeOfDay && item.timeOfDay.includes(timeOfDay)) matches++;
    if (flavor && item.flavors.includes(flavor)) matches++;
    if (caffeine === "yes" && item.caffeine) matches++;
    if (caffeine === "no" && !item.caffeine) matches++;
    if (healthGoal && healthGoal !== "none" && item.healthBenefits.includes(healthGoal)) matches++;
    
    // Taste preference matching
    if (tastePreference) {
      const taste = item.tasteProfile;
      switch (tastePreference) {
        case "sweet":
          if (taste.sweetness >= 7) matches++;
          break;
        case "refreshing":
          if (taste.freshness >= 7) matches++;
          break;
        case "creamy":
          if (taste.creaminess >= 7) matches++;
          break;
        case "spicy":
          if (taste.spiciness >= 5) matches++;
          break;
      }
    }
    
    matchCounts.set(item, matches);
  });

  // Filter items with at least 2 matches
  flexibleFiltered = flexibleFiltered.filter(item => matchCounts.get(item)! >= 2);

  // If still no matches, return popular items
  if (flexibleFiltered.length === 0) {
    return menuDatabase
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 3);
  }

  // Sort by match count and popularity
  return flexibleFiltered
    .sort((a, b) => {
      const aMatches = matchCounts.get(a)!;
      const bMatches = matchCounts.get(b)!;
      if (aMatches !== bMatches) return bMatches - aMatches;
      return b.popularity - a.popularity;
    })
    .slice(0, 3);
}; 