import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const client = createClient({
  projectId: "eh05fgze",
  dataset: "mashti-menu",
  apiVersion: "2024-01-01",
  useCdn: true,
});

interface MenuItem {
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
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

interface SanityMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: {
    name: string;
  };
  popular: boolean;
  order: number;
}

// Simple in-memory cache for this API route (per server instance)
const ONE_HOUR_MS = 60 * 60 * 1000;
const DEFAULT_CACHE_TTL_MS = Number(
  process.env.AI_MENU_CACHE_TTL_MS || ONE_HOUR_MS
);
const DEFAULT_FALLBACK_TTL_MS = Number(
  process.env.AI_MENU_FALLBACK_TTL_MS || 5 * 60 * 1000
);

type CachedPayload = { menuItems: MenuItem[]; message?: string };
let aiMenuCache: { payload: CachedPayload; expiresAt: number } | null = null;

function buildCacheHeaders(
  ttlMs: number,
  status: "HIT" | "MISS" | "FALLBACK"
): HeadersInit {
  const sMaxAge = Math.max(0, Math.floor(ttlMs / 1000));
  const browserMaxAge = Math.min(600, sMaxAge); // cap browser at 10m to keep UI fresh
  return {
    "Cache-Control": `public, max-age=${browserMaxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=86400`,
    "X-Cache": status,
    "X-Cache-TTL": String(sMaxAge),
  };
}

// Helper function to determine temperature based on category
function getTemperature(category: string): "hot" | "cold" | "both" {
  const hotCategories = ["Coffee & Tea", "Hot Drinks"];
  const coldCategories = [
    "Smoothies",
    "Shakes",
    "Juices",
    "Ice Cream",
    "Cold Drinks",
    "Fresh Juice",
  ];

  if (hotCategories.includes(category)) return "hot";
  if (coldCategories.includes(category)) return "cold";

  // Default based on category
  if (category.includes("Coffee") || category.includes("Tea")) return "hot";
  if (
    category.includes("Smoothie") ||
    category.includes("Juice") ||
    category.includes("Ice Cream")
  )
    return "cold";
  if (category.includes("Shake")) return "cold";

  return "both";
}

// Helper function to get icon based on category and name (more accurate)
function getIcon(category: string, name: string): string {
  const c = category.toLowerCase();
  const n = name.toLowerCase();

  // Strong name-based overrides first
  // Protein/fitness shakes (even if they mention coffee)
  if (n.includes("shake")) {
    if (
      n.includes("protein") ||
      n.includes("boost") ||
      n.includes("peanut") ||
      n.includes("nescafe")
    ) {
      return "🏋️";
    }
    return "🥤";
  }

  // Specific items requested as shake icons
  if (
    n.includes("shir pesteh moz nutella") ||
    n.includes("shir pesteh moz") ||
    n.includes("shir pesteh") ||
    n.includes("shir fandogh") ||
    n.includes("vitamine akbar mashti") ||
    n.includes("vitamin akbar mashti") ||
    n.includes("maajoon")
  ) {
    return "🥤";
  }

  // Explicit dessert-style drinks/plates
  // (keep other dessert items below)

  // Name-based priority (hot drinks / desserts)
  if (n.includes("tea")) return "🍵";
  if (
    n.includes("coffee") ||
    n.includes("espresso") ||
    n.includes("americano") ||
    n.includes("latte") ||
    n.includes("cappuccino") ||
    n.includes("macchiato") ||
    n.includes("nescafe")
  ) {
    return "☕";
  }
  if (n.includes("ferrero")) return "🍨";
  if (n.includes("affogato")) return "🍨";
  if (n.includes("faloodeh")) return "🍧";
  if (n.includes("lavashak")) return "🍋";
  if (n.includes("baklava") || n.includes("zoolbia") || n.includes("bamieh"))
    return "🍰";
  if (n.includes("bastani") || n.includes("havij bastani")) return "🍨";
  if (n.includes("shir moz anbe") || n.includes("shir moz")) return "🥤";

  // Category-based fallback
  if (c.includes("juice") || category === "Fresh Juice") return "🧃";
  if (c.includes("smoothie")) return "🥤";
  if (c.includes("shake")) return "🥤";
  if (c.includes("ice cream")) return "🍨";
  if (c.includes("protein")) return "🏋️";
  if (c.includes("dessert") || c.includes("sweets")) return "🍰";
  if (c.includes("cold drinks")) return "🥤";
  if (c.includes("hot drinks")) return "☕";
  if (c.includes("coffee")) return "☕";
  if (c.includes("tea")) return "🍵";

  return "🍽️";
}

// Helper function to get flavors based on name and category
function getFlavors(name: string, category: string): string[] {
  const flavors: string[] = [];

  // Add category-based flavors
  if (category.includes("Coffee")) flavors.push("bold", "rich");
  if (category.includes("Tea")) flavors.push("soothing");
  if (category.includes("Smoothie")) flavors.push("fruity", "refreshing");
  if (category.includes("Shake")) flavors.push("sweet", "creamy");
  if (category.includes("Juice")) flavors.push("fruity", "refreshing");
  if (category.includes("Ice Cream")) flavors.push("sweet", "creamy");

  // Add name-based flavors
  const nameLower = name.toLowerCase();
  if (nameLower.includes("chocolate")) flavors.push("rich", "sweet");
  if (nameLower.includes("vanilla")) flavors.push("sweet", "creamy");
  if (nameLower.includes("strawberry")) flavors.push("fruity", "sweet");
  if (nameLower.includes("mango")) flavors.push("fruity", "sweet");
  if (nameLower.includes("coffee")) flavors.push("bold", "rich");
  if (nameLower.includes("tea")) flavors.push("soothing");
  if (nameLower.includes("caramel")) flavors.push("sweet", "rich");
  if (nameLower.includes("nutella")) flavors.push("sweet", "rich");
  if (nameLower.includes("oreo")) flavors.push("sweet", "creamy");
  if (nameLower.includes("peanut")) flavors.push("nutty", "rich");
  if (nameLower.includes("tahini")) flavors.push("nutty");
  if (nameLower.includes("barberry")) flavors.push("tart", "refreshing");
  if (nameLower.includes("lavashak")) flavors.push("tart", "fruity", "sour");
  if (nameLower.includes("shahtoot")) flavors.push("fruity", "sweet");
  if (nameLower.includes("pomegranate")) flavors.push("tart", "refreshing");
  if (nameLower.includes("orange")) flavors.push("fruity", "refreshing");
  if (nameLower.includes("apple")) flavors.push("fruity", "refreshing");
  if (nameLower.includes("carrot")) flavors.push("earthy", "refreshing");
  if (nameLower.includes("berry")) flavors.push("fruity", "refreshing");
  if (nameLower.includes("protein")) flavors.push("rich", "nutritious");
  if (nameLower.includes("baklava")) flavors.push("sweet", "rich");
  if (nameLower.includes("zoolbia")) flavors.push("sweet", "syrupy");
  if (nameLower.includes("bamieh")) flavors.push("sweet", "syrupy");

  return [...new Set(flavors)]; // Remove duplicates
}

// Helper function to get health benefits
function getHealthBenefits(category: string, name: string): string[] {
  const benefits: string[] = [];
  const nameLower = name.toLowerCase();

  if (category.includes("Coffee") || nameLower.includes("coffee"))
    benefits.push("energy");
  if (category.includes("Tea")) benefits.push("relaxation", "antioxidants");
  if (category.includes("Smoothie") || category.includes("Juice"))
    benefits.push("vitamins", "antioxidants");
  if (category.includes("Protein"))
    benefits.push("protein", "energy", "muscle building");
  if (category.includes("Ice Cream")) benefits.push("comfort", "calcium");
  if (nameLower.includes("pomegranate"))
    benefits.push("antioxidants", "heart health");
  if (nameLower.includes("orange")) benefits.push("vitamins", "immunity");
  if (nameLower.includes("carrot")) benefits.push("vitamins", "eye health");
  if (nameLower.includes("berry")) benefits.push("antioxidants", "vitamins");
  if (nameLower.includes("lavashak")) benefits.push("vitamins", "digestion");
  if (nameLower.includes("shahtoot")) benefits.push("antioxidants", "iron");

  return benefits;
}

// Helper function to get time of day
function getTimeOfDay(category: string, name: string): string[] {
  const nameLower = name.toLowerCase();

  if (category.includes("Coffee") || nameLower.includes("coffee"))
    return ["morning", "afternoon"];
  if (category.includes("Tea")) return ["morning", "afternoon", "evening"];
  if (category.includes("Smoothie") || category.includes("Juice"))
    return ["morning", "afternoon"];
  if (category.includes("Shake") || category.includes("Ice Cream"))
    return ["afternoon", "evening"];
  if (category.includes("Protein")) return ["morning", "afternoon"];
  if (category.includes("Sweets")) return ["afternoon", "evening"];

  return ["morning", "afternoon"];
}

// Helper function to get taste profile
function getTasteProfile(
  name: string,
  category: string
): MenuItem["tasteProfile"] {
  const nameLower = name.toLowerCase();

  const clamp = (v: number) => Math.max(0, Math.min(10, v));

  // Baseline by category to avoid creamy juices etc.
  let profile = {
    sweetness: 5,
    acidity: 3,
    bitterness: 3,
    creaminess: 2,
    spiciness: 1,
    freshness: 5,
  };

  if (category.includes("Juice") || nameLower.includes("juice")) {
    profile = {
      sweetness: 5,
      acidity: 4,
      bitterness: 1,
      creaminess: 0,
      spiciness: 1,
      freshness: 9,
    };
  } else if (category.includes("Smoothie")) {
    profile = {
      sweetness: 6,
      acidity: 4,
      bitterness: 1,
      creaminess: 4,
      spiciness: 1,
      freshness: 7,
    };
  } else if (category.includes("Shake")) {
    profile = {
      sweetness: 8,
      acidity: 2,
      bitterness: 1,
      creaminess: 9,
      spiciness: 1,
      freshness: 3,
    };
  } else if (category.includes("Ice Cream")) {
    profile = {
      sweetness: 7,
      acidity: 1,
      bitterness: 1,
      creaminess: 9,
      spiciness: 1,
      freshness: 2,
    };
  } else if (category.includes("Coffee")) {
    profile = {
      sweetness: 2,
      acidity: 5,
      bitterness: 7,
      creaminess: 1,
      spiciness: 1,
      freshness: 3,
    };
  } else if (category.includes("Tea")) {
    profile = {
      sweetness: 1,
      acidity: 4,
      bitterness: 4,
      creaminess: 0,
      spiciness: 1,
      freshness: 7,
    };
  } else if (category.includes("Protein")) {
    profile = {
      sweetness: 5,
      acidity: 3,
      bitterness: 2,
      creaminess: 6,
      spiciness: 1,
      freshness: 5,
    };
  }

  // Name-based refinements
  if (
    nameLower.includes("latte") ||
    nameLower.includes("cappuccino") ||
    nameLower.includes("macchiato") ||
    nameLower.includes("mocha") ||
    nameLower.includes("flat white")
  ) {
    profile.creaminess = 7;
    profile.sweetness = Math.max(profile.sweetness, 4);
    profile.bitterness = Math.min(profile.bitterness, 4);
  }
  if (nameLower.includes("affogato")) {
    profile.creaminess = 8;
    profile.sweetness = Math.max(profile.sweetness, 5);
    profile.bitterness = Math.max(profile.bitterness, 3);
  }
  if (
    nameLower.includes("chocolate") ||
    nameLower.includes("nutella") ||
    nameLower.includes("m & m")
  ) {
    profile.sweetness = Math.max(profile.sweetness, 8);
    profile.creaminess = Math.max(profile.creaminess, 7);
    profile.bitterness = Math.max(profile.bitterness, 4);
  }
  if (nameLower.includes("vanilla")) {
    profile.sweetness = Math.max(profile.sweetness, 7);
    profile.creaminess = Math.max(profile.creaminess, 7);
  }
  if (
    nameLower.includes("strawberry") ||
    nameLower.includes("berry") ||
    nameLower.includes("shahtoot")
  ) {
    profile.sweetness = Math.max(profile.sweetness, 6);
    profile.acidity = Math.max(profile.acidity, 5);
    profile.freshness = Math.max(profile.freshness, 8);
  }
  if (
    nameLower.includes("mango") ||
    nameLower.includes("pineapple") ||
    nameLower.includes("peach")
  ) {
    profile.sweetness = Math.max(profile.sweetness, 7);
    profile.freshness = Math.max(profile.freshness, 7);
    profile.acidity = Math.max(profile.acidity, 3);
  }
  if (
    nameLower.includes("pomegranate") ||
    nameLower.includes("barberry") ||
    nameLower.includes("lavashak") ||
    nameLower.includes("orange")
  ) {
    profile.acidity = Math.max(profile.acidity, 7);
    profile.freshness = Math.max(profile.freshness, 8);
    profile.sweetness = Math.min(profile.sweetness, 5);
  }
  if (nameLower.includes("apple")) {
    profile.sweetness = Math.max(profile.sweetness, 5);
    profile.acidity = 3; // apples are mildly tart
    profile.freshness = Math.max(profile.freshness, 6);
  }
  if (nameLower.includes("carrot")) {
    profile.sweetness = Math.max(profile.sweetness, 4);
    profile.acidity = 2; // carrot juices are low-acid
    profile.freshness = Math.max(profile.freshness, 5);
  }
  if (nameLower.includes("celery")) {
    profile.sweetness = Math.min(profile.sweetness, 3);
    profile.acidity = 3;
    profile.bitterness = Math.max(profile.bitterness, 2);
    profile.freshness = Math.max(profile.freshness, 8);
  }
  if (nameLower.includes("sour cherry")) {
    profile.sweetness = Math.min(profile.sweetness, 5);
    profile.acidity = Math.max(profile.acidity, 7);
    profile.freshness = Math.max(profile.freshness, 8);
  }
  if (nameLower.includes("watermelon")) {
    profile.sweetness = Math.max(profile.sweetness, 6);
    profile.acidity = Math.min(profile.acidity, 3);
    profile.freshness = 9;
  }
  if (
    nameLower.includes("peanut") ||
    nameLower.includes("tahini") ||
    nameLower.includes("pistachio") ||
    nameLower.includes("fandogh") ||
    nameLower.includes("pesteh") ||
    nameLower.includes("shir ")
  ) {
    profile.creaminess = Math.max(profile.creaminess, 7);
    profile.sweetness = Math.max(profile.sweetness, 5);
  }

  // Coffee/tea textual hints if category mislabeled
  if (nameLower.includes("coffee")) {
    profile.bitterness = Math.max(profile.bitterness, 7);
    profile.acidity = Math.max(profile.acidity, 5);
    profile.sweetness = Math.min(profile.sweetness, 3);
    profile.creaminess = Math.max(profile.creaminess, 1);
  }
  if (nameLower.includes("tea")) {
    profile.bitterness = Math.max(profile.bitterness, 4);
    profile.freshness = Math.max(profile.freshness, 7);
    profile.sweetness = Math.min(profile.sweetness, 2);
    profile.creaminess = 0;
    profile.acidity = Math.max(profile.acidity, 4);
  }

  // Clamp values to 0..10
  profile = {
    sweetness: clamp(profile.sweetness),
    acidity: clamp(profile.acidity),
    bitterness: clamp(profile.bitterness),
    creaminess: clamp(profile.creaminess),
    spiciness: clamp(profile.spiciness),
    freshness: clamp(profile.freshness),
  };

  return profile;
}

// Helper function to get nutritional info
function getNutritionalInfo(
  name: string,
  category: string
): {
  calories: number;
  sugar: number;
  protein: number;
  fat: number;
  vitamins: string[];
  minerals: string[];
  ingredients: string[];
  allergens: string[];
  dietaryInfo: string[];
} {
  const nameLower = name.toLowerCase();

  // Curated vitamins for specific items (by exact name, case-insensitive)
  const VITAMIN_MAP: Record<string, string[]> = {
    // Juices
    "orange juice": ["C", "B9", "A"],
    "barberry juice": ["C"],
    "sour cherry juice": ["A", "C"],
    "apple juice": ["C"],
    "coco juice": ["C"],
    "carrot juice": ["A", "K", "B6"],
    "pomegranate juice": ["C", "K", "B9"],
    "celery juice": ["K", "A", "C"],
    // Smoothies
    "strawberry smoothie": ["C", "K", "B9"],
    "watermelon strawberry smoothie": ["A", "C", "B9"],
    shahtootfarangi: ["C", "K"],
    "pomegranate smoothie": ["C", "K", "B9"],
    "lavashak smoothie": ["C"],
    "mango smoothie": ["A", "C", "E", "B6"],
    "pineapple smoothie": ["C", "B6"],
    "peach smoothie": ["A", "C", "E"],
    // Protein blends (approximate, fruit-forward)
    "berry blast": ["C", "K", "B9"],
    "green power": ["A", "C", "K", "B6"],
    // Shakes & dairy
    "vanilla cinnamon shake": ["A", "D", "B12"],
    "caramel shake": ["A", "D", "B12"],
    "oreo shake": ["A", "D", "B12"],
    ferrero: ["A", "D", "B12"],
    "lotus shake": ["A", "D", "B12"],
    "nutella shake": ["A", "D", "B12"],
    "m & m shake": ["A", "D", "B12"],
    "chocolate shake": ["A", "D", "B12"],
    "londsgate shake": ["A", "D", "B12"],
    "barberry shake": ["A", "D", "B12"],
    "shir moz": ["A", "D", "B12"],
    "shir moz anbe": ["A", "D", "B12"],
    "peanut butter shake": ["A", "D", "B12"],
    "tahini shake": ["A", "D", "B12"],
    "nescafe shake": ["A", "D", "B12"],
    // Traditional/fusion desserts (minimal vitamins)
    "akbar mashti cup": ["A", "D", "B12"],
    "saffron cup": ["A", "D", "B12"],
    "havij bastani": ["A", "D", "B12"],
    "vanilla cup": ["A", "D", "B12"],
    "chocolate cup": ["A", "D", "B12"],
    "strawberry cup": ["C", "B9"],
    "mango cup": ["A", "C", "E"],
    faloodeh: [],
    "faloodeh bastani": ["A", "D", "B12"],
    "lavashak plate": ["C"],
    affogato: ["A", "D", "B12"],
    // Coffee & Tea
    espresso: ["B2", "B3", "B5"],
    americano: ["B2", "B3", "B5"],
    latte: ["A", "D", "B12"],
    cappuccino: ["A", "D", "B12"],
    "caramel macchiato": ["A", "D", "B12"],
    "black tea": ["B2"],
    "green tea": ["B2"],
    "chamomile tea": [],
    "mint medley tea": [],
    "lemon & ginger tea": ["C"],
    "mix fruit tea": ["C"],
  };

  const normalize = (s: string) => s.toLowerCase().trim();

  // Base nutritional info
  let calories = 200;
  let sugar = 20;
  let protein = 5;
  let fat = 8;
  let vitamins = VITAMIN_MAP[normalize(name)] || ["C"];
  let minerals = ["potassium"];
  let ingredients = ["water"];
  let allergens: string[] = [];
  let dietaryInfo = ["vegetarian"];

  // Adjust based on category and name
  if (category.includes("Coffee") && !nameLower.includes("tea")) {
    calories = 5;
    sugar = 0;
    protein = 0.5;
    fat = 0;
    vitamins = VITAMIN_MAP[normalize(name)] || ["B2", "B3", "B5"];
    minerals = ["magnesium", "potassium"];
    ingredients = ["coffee beans", "water"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  } else if (category.includes("Tea") || nameLower.includes("tea")) {
    calories = 2;
    sugar = 0;
    protein = 0;
    fat = 0;
    vitamins = VITAMIN_MAP[normalize(name)] || ["B2"];
    minerals = ["manganese", "fluoride"];
    ingredients = ["tea leaves", "water"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  } else if (category.includes("Smoothie")) {
    calories = 180;
    sugar = 25;
    protein = 6;
    fat = 4;
    vitamins = VITAMIN_MAP[normalize(name)] || ["C", "A", "B6"];
    minerals = ["potassium", "calcium"];
    ingredients = ["fruits", "milk", "yogurt", "honey"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  } else if (category.includes("Shake")) {
    calories = 320;
    sugar = 35;
    protein = 8;
    fat = 12;
    vitamins = VITAMIN_MAP[normalize(name)] || ["A", "D", "B12"];
    minerals = ["calcium", "phosphorus"];
    ingredients = ["milk", "ice cream", "flavoring"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  } else if (category.includes("Juice")) {
    calories = 110;
    sugar = 22;
    protein = 2;
    fat = 0;
    vitamins = VITAMIN_MAP[normalize(name)] || ["C", "A"];
    minerals = ["potassium"];
    ingredients = ["fresh fruits"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  } else if (category.includes("Ice Cream")) {
    calories = 250;
    sugar = 28;
    protein = 4;
    fat = 14;
    vitamins = VITAMIN_MAP[normalize(name)] || ["A", "D", "B12"];
    minerals = ["calcium", "phosphorus"];
    ingredients = ["milk", "cream", "sugar", "flavoring"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  } else if (category.includes("Protein")) {
    calories = 280;
    sugar = 18;
    protein = 25;
    fat = 8;
    vitamins = VITAMIN_MAP[normalize(name)] || ["B12", "D", "E"];
    minerals = ["calcium", "iron", "zinc"];
    ingredients = ["whey protein", "milk", "fruits"];
    allergens = ["milk"];
    dietaryInfo = ["high-protein"];
  } else if (category.includes("Sweets")) {
    calories = 300;
    sugar = 35;
    protein = 5;
    fat = 15;
    vitamins = ["A", "E"];
    minerals = ["calcium"];
    ingredients = ["flour", "sugar", "honey", "nuts"];
    allergens = ["nuts", "gluten"];
    dietaryInfo = ["vegetarian"];
  }

  // Adjust based on specific names
  if (nameLower.includes("chocolate")) {
    calories += 50;
    sugar += 10;
    fat += 5;
    vitamins.push("E");
    minerals.push("iron");
    ingredients.push("chocolate");
  }
  if (nameLower.includes("strawberry")) {
    calories -= 20;
    sugar -= 5;
    vitamins.push("K", "B9");
    minerals.push("manganese");
    ingredients.push("strawberries");
  }
  if (nameLower.includes("mango")) {
    calories += 20;
    sugar += 5;
    vitamins.push("A", "E", "B6");
    minerals.push("copper");
    ingredients.push("mango");
  }
  if (nameLower.includes("pomegranate")) {
    calories += 20;
    sugar += 5;
    vitamins.push("K", "B6", "B9");
    minerals.push("copper", "manganese");
    ingredients.push("pomegranate");
  }
  if (nameLower.includes("carrot")) {
    calories -= 30;
    sugar -= 10;
    vitamins.push("A", "K", "B6");
    minerals.push("potassium");
    ingredients.push("carrots");
  }
  if (nameLower.includes("protein")) {
    calories += 100;
    protein += 20;
    ingredients.push("protein powder");
  }
  if (nameLower.includes("baklava")) {
    calories += 100;
    sugar += 15;
    fat += 8;
    ingredients.push("phyllo dough", "honey", "pistachios");
    allergens.push("nuts");
  }
  if (nameLower.includes("zoolbia")) {
    calories += 80;
    sugar += 20;
    ingredients.push("flour", "saffron", "rose water");
  }
  if (nameLower.includes("bamieh")) {
    calories += 80;
    sugar += 20;
    ingredients.push("flour", "honey", "rose water");
  }

  return {
    calories,
    sugar,
    protein,
    fat,
    vitamins: [...new Set(vitamins)],
    minerals: [...new Set(minerals)],
    ingredients: [...new Set(ingredients)],
    allergens,
    dietaryInfo,
  };
}

// Helper function to get serving size based on category
function getServingSize(category: string): string {
  if (category.includes("Coffee") || category.includes("Tea")) {
    return "250ml";
  }
  if (category.includes("Smoothie") || category.includes("Shake")) {
    return "400ml";
  }
  if (category.includes("Juice")) {
    return "300ml";
  }
  if (category.includes("Ice Cream")) {
    return "100g";
  }
  if (category.includes("Sweets") || category.includes("Desserts")) {
    return "50g";
  }
  if (category.includes("Protein")) {
    return "350ml";
  }

  // Default
  return "350ml";
}

export async function GET(request: Request) {
  try {
    // Serve from cache if valid and not explicitly bypassed
    const now = Date.now();
    const url = new URL(request.url);
    const noCache =
      url.searchParams.get("nocache") === "1" ||
      url.searchParams.get("refresh") === "1";
    if (!noCache && aiMenuCache && aiMenuCache.expiresAt > now) {
      return NextResponse.json(aiMenuCache.payload, {
        headers: buildCacheHeaders(aiMenuCache.expiresAt - now, "HIT"),
      });
    }
    // Fetch all menu items from CMS
    const menuItems = await client.fetch<SanityMenuItem[]>(`
      *[_type == "menuItem" && active == true] | order(order asc) {
        _id,
        name,
        description,
        price,
        "imageUrl": image.asset->url,
        category->{
          name
        },
        popular,
        order
      }
    `);

    // Transform CMS items to AI format
    const aiMenuItems: MenuItem[] = menuItems.map((item: SanityMenuItem) => {
      const category = item.category?.name || "Other";
      const temperature = getTemperature(category);
      const icon = getIcon(category, item.name);
      const flavors = getFlavors(item.name, category);
      const healthBenefits = getHealthBenefits(category, item.name);
      const timeOfDay = getTimeOfDay(category, item.name);
      const tasteProfile = getTasteProfile(item.name, category);
      const nutritional = getNutritionalInfo(item.name, category);
      const servingSize = getServingSize(category);

      // Determine caffeine based on category and name
      let caffeine = false;

      // Coffee always has caffeine
      if (
        category.includes("Coffee") ||
        item.name.toLowerCase().includes("coffee") ||
        item.name.toLowerCase().includes("nescafe")
      ) {
        caffeine = true;
      }
      // Tea - only Black Tea and Green Tea have caffeine
      else if (item.name.toLowerCase().includes("tea")) {
        const teaName = item.name.toLowerCase();
        if (teaName === "black tea" || teaName === "green tea") {
          caffeine = true;
        } else {
          // Herbal teas, chamomile, mint, ginger, fruit teas don't have caffeine
          caffeine = false;
        }
      }

      // Determine origin
      const origin =
        item.name.toLowerCase().includes("persian") ||
        item.name.toLowerCase().includes("lavashak") ||
        item.name.toLowerCase().includes("shahtoot") ||
        item.name.toLowerCase().includes("baklava") ||
        item.name.toLowerCase().includes("zoolbia") ||
        item.name.toLowerCase().includes("bamieh")
          ? "Persian"
          : "International";

      return {
        title: item.name,
        description: item.description || `Delicious ${item.name.toLowerCase()}`,
        icon,
        imageUrl: item.imageUrl,
        category,
        price: `$${item.price.toFixed(2)}`,
        temperature,
        flavors,
        caffeine,
        healthBenefits,
        timeOfDay,
        seasonality: ["all"],
        popularity: 5, // Fixed popularity for all items
        reason: `Great choice for ${timeOfDay[0]} with ${flavors[0]} flavor`,
        ...nutritional,
        tasteProfile,
        preparationTime: 5,
        servingSize,
        origin,
      };
    });

    // If CMS returns nothing, provide a minimal fallback so UI still works
    if (!aiMenuItems || aiMenuItems.length === 0) {
      const payload = {
        menuItems: getFallbackItems(),
        message: "Using fallback items",
      };
      aiMenuCache = {
        payload,
        expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS,
      };
      return NextResponse.json(payload, {
        headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, "FALLBACK"),
      });
    }
    const payload = { menuItems: aiMenuItems };
    aiMenuCache = { payload, expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS };
    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_CACHE_TTL_MS, "MISS"),
    });
  } catch {
    // Keep UI responsive if CMS fails; cache fallback briefly
    const payload = {
      menuItems: getFallbackItems(),
      message: "Fallback due to fetch error",
    };
    aiMenuCache = { payload, expiresAt: Date.now() + DEFAULT_FALLBACK_TTL_MS };
    return NextResponse.json(payload, {
      headers: buildCacheHeaders(DEFAULT_FALLBACK_TTL_MS, "FALLBACK"),
    });
  }
}

// Minimal fallback items to keep Mashti AI responsive even if CMS is unavailable
function getFallbackItems(): MenuItem[] {
  const mk = (
    title: string,
    category: string,
    price: string,
    temperature: "hot" | "cold" | "both"
  ): MenuItem => ({
    title,
    description: `Delicious ${title.toLowerCase()}`,
    icon: getIcon(category, title),
    category,
    price,
    temperature,
    flavors: getFlavors(title, category),
    caffeine: ["Coffee", "Tea", "Hot Drinks", "Coffee & Tea"].some((c) =>
      category.includes(c)
    )
      ? !/chamomile|mint|ginger|fruit/i.test(title)
      : false,
    healthBenefits: getHealthBenefits(category, title),
    timeOfDay: getTimeOfDay(category, title),
    seasonality: ["all"],
    popularity: 7,
    reason: "Great fit based on your choices",
    ...getNutritionalInfo(title, category),
    tasteProfile: getTasteProfile(title, category),
    preparationTime: 5,
    servingSize: getServingSize(category),
    origin: "International",
  });

  return [
    // Hot coffee
    mk("Espresso", "Coffee & Tea", "$2.99", "hot"),
    mk("Americano", "Coffee & Tea", "$3.49", "hot"),
    mk("Latte", "Coffee & Tea", "$4.49", "hot"),
    mk("Cappuccino", "Coffee & Tea", "$4.49", "hot"),
    mk("Caramel Macchiato", "Coffee & Tea", "$4.99", "hot"),
    // Hot tea
    mk("Black Tea", "Coffee & Tea", "$2.49", "hot"),
    mk("Green Tea", "Coffee & Tea", "$2.49", "hot"),
    mk("Chamomile Tea", "Coffee & Tea", "$2.49", "hot"),
    mk("Mint Medley Tea", "Coffee & Tea", "$2.49", "hot"),
    mk("Lemon & Ginger Tea", "Coffee & Tea", "$2.49", "hot"),
    mk("Mix Fruit Tea", "Coffee & Tea", "$2.49", "hot"),
    // Cold juice
    mk("Orange Juice", "Juices", "$5.49", "cold"),
    mk("Apple Juice", "Juices", "$5.49", "cold"),
    mk("Pomegranate Juice", "Juices", "$5.99", "cold"),
    mk("Sour Cherry Juice", "Juices", "$5.99", "cold"),
    // Smoothies
    mk("Strawberry Smoothie", "Smoothies", "$6.99", "cold"),
    mk("Mango Smoothie", "Smoothies", "$6.99", "cold"),
    // Protein/Nutty & Dessert examples
    mk("Nescafe Shake", "Protein Shakes", "$7.99", "cold"),
    mk("Peanut Butter Shake", "Protein Shakes", "$7.99", "cold"),
    mk("Maajoon", "Desserts", "$8.99", "cold"),
    mk("Vitamine Akbar Mashti", "Desserts", "$8.99", "cold"),
    mk("Shir Pesteh Moz Nutella", "Desserts", "$8.99", "cold"),
    mk("Shir Pesteh Moz", "Desserts", "$8.49", "cold"),
  ];
}
