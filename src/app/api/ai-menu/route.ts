import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'eh05fgze',
  dataset: 'mashti-menu',
  apiVersion: '2024-01-01',
  useCdn: false,
});

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

interface SanityMenuItem {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: {
    name: string;
  };
  popular: boolean;
  order: number;
}

// Helper function to determine temperature based on category
function getTemperature(category: string): "hot" | "cold" | "both" {
  const hotCategories = ["Coffee & Tea", "Hot Drinks"];
  const coldCategories = ["Smoothies", "Shakes", "Juices", "Ice Cream", "Cold Drinks", "Fresh Juice"];
  
  if (hotCategories.includes(category)) return "hot";
  if (coldCategories.includes(category)) return "cold";
  
  // Default based on category
  if (category.includes("Coffee") || category.includes("Tea")) return "hot";
  if (category.includes("Smoothie") || category.includes("Juice") || category.includes("Ice Cream")) return "cold";
  if (category.includes("Shake")) return "cold";
  
  return "both";
}

// Helper function to get icon based on category
function getIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "Coffee & Tea": "☕",
    "Smoothies": "🥤",
    "Shakes": "🥤",
    "Juices": "🧃",
    "Ice Cream": "🍨",
    "Protein Shakes": "🏋️",
    "Sweets": "🍰",
    "Desserts": "🍰",
    "Hot Drinks": "☕",
    "Cold Drinks": "🥤"
  };
  return iconMap[category] || "🍽️";
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
  
  if (category.includes("Coffee") || nameLower.includes("coffee")) benefits.push("energy");
  if (category.includes("Tea")) benefits.push("relaxation", "antioxidants");
  if (category.includes("Smoothie") || category.includes("Juice")) benefits.push("vitamins", "antioxidants");
  if (category.includes("Protein")) benefits.push("protein", "energy", "muscle building");
  if (category.includes("Ice Cream")) benefits.push("comfort", "calcium");
  if (nameLower.includes("pomegranate")) benefits.push("antioxidants", "heart health");
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
  
  if (category.includes("Coffee") || nameLower.includes("coffee")) return ["morning", "afternoon"];
  if (category.includes("Tea")) return ["morning", "afternoon", "evening"];
  if (category.includes("Smoothie") || category.includes("Juice")) return ["morning", "afternoon"];
  if (category.includes("Shake") || category.includes("Ice Cream")) return ["afternoon", "evening"];
  if (category.includes("Protein")) return ["morning", "afternoon"];
  if (category.includes("Sweets")) return ["afternoon", "evening"];
  
  return ["morning", "afternoon"];
}

// Helper function to get taste profile
function getTasteProfile(name: string, category: string): MenuItem['tasteProfile'] {
  const nameLower = name.toLowerCase();
  
  // Default profile
  const profile = {
    sweetness: 5,
    acidity: 3,
    bitterness: 3,
    creaminess: 5,
    spiciness: 1,
    freshness: 5
  };
  
  // Adjust based on name
  if (nameLower.includes("chocolate")) {
    profile.sweetness = 8;
    profile.creaminess = 8;
    profile.bitterness = 5;
  }
  if (nameLower.includes("vanilla")) {
    profile.sweetness = 7;
    profile.creaminess = 8;
  }
  if (nameLower.includes("strawberry")) {
    profile.sweetness = 6;
    profile.acidity = 5;
    profile.freshness = 8;
  }
  if (nameLower.includes("mango")) {
    profile.sweetness = 7;
    profile.freshness = 7;
    profile.acidity = 3;
  }
  if (nameLower.includes("coffee")) {
    profile.bitterness = 8;
    profile.acidity = 6;
    profile.sweetness = 2;
    profile.creaminess = 3;
  }
  if (nameLower.includes("tea")) {
    profile.bitterness = 6;
    profile.freshness = 7;
    profile.sweetness = 2;
    profile.creaminess = 1;
    profile.acidity = 4;
  }
  if (nameLower.includes("caramel")) {
    profile.sweetness = 9;
    profile.creaminess = 7;
  }
  if (nameLower.includes("nutella")) {
    profile.sweetness = 8;
    profile.creaminess = 7;
    profile.bitterness = 4;
  }
  if (nameLower.includes("oreo")) {
    profile.sweetness = 7;
    profile.creaminess = 6;
    profile.bitterness = 3;
  }
  if (nameLower.includes("peanut")) {
    profile.sweetness = 5;
    profile.creaminess = 6;
    profile.bitterness = 2;
  }
  if (nameLower.includes("tahini")) {
    profile.creaminess = 5;
    profile.sweetness = 3;
    profile.bitterness = 2;
  }
  if (nameLower.includes("barberry")) {
    profile.acidity = 8;
    profile.freshness = 7;
    profile.sweetness = 3;
  }
  if (nameLower.includes("lavashak")) {
    profile.acidity = 9;
    profile.freshness = 8;
    profile.sweetness = 2;
  }
  if (nameLower.includes("shahtoot")) {
    profile.sweetness = 6;
    profile.freshness = 7;
    profile.acidity = 4;
  }
  if (nameLower.includes("pomegranate")) {
    profile.acidity = 7;
    profile.freshness = 8;
    profile.sweetness = 4;
  }
  if (nameLower.includes("orange")) {
    profile.acidity = 8;
    profile.freshness = 9;
    profile.sweetness = 5;
  }
  if (nameLower.includes("apple")) {
    profile.sweetness = 5;
    profile.freshness = 6;
    profile.acidity = 3;
  }
  if (nameLower.includes("carrot")) {
    profile.sweetness = 4;
    profile.freshness = 5;
    profile.creaminess = 3;
  }
  if (nameLower.includes("berry")) {
    profile.acidity = 6;
    profile.freshness = 8;
    profile.sweetness = 5;
  }
  if (nameLower.includes("protein")) {
    profile.sweetness = 5;
    profile.creaminess = 6;
    profile.bitterness = 2;
  }
  if (nameLower.includes("baklava")) {
    profile.sweetness = 9;
    profile.creaminess = 5;
    profile.bitterness = 1;
  }
  if (nameLower.includes("zoolbia")) {
    profile.sweetness = 9;
    profile.creaminess = 4;
    profile.bitterness = 1;
  }
  if (nameLower.includes("bamieh")) {
    profile.sweetness = 9;
    profile.creaminess = 4;
    profile.bitterness = 1;
  }
  
  return profile;
}

// Helper function to get nutritional info
function getNutritionalInfo(name: string, category: string): {
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
  
  // Base nutritional info
  let calories = 200;
  let sugar = 20;
  let protein = 5;
  let fat = 8;
  let vitamins = ["C"];
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
    vitamins = ["B3", "B5"];
    minerals = ["magnesium", "potassium"];
    ingredients = ["coffee beans", "water"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  }
  else if (category.includes("Tea") || nameLower.includes("tea")) {
    calories = 2;
    sugar = 0;
    protein = 0;
    fat = 0;
    vitamins = ["B1", "B2", "C"];
    minerals = ["manganese", "fluoride"];
    ingredients = ["tea leaves", "water"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  }
  else if (category.includes("Smoothie")) {
    calories = 180;
    sugar = 25;
    protein = 6;
    fat = 4;
    vitamins = ["C", "A", "B6"];
    minerals = ["potassium", "calcium"];
    ingredients = ["fruits", "milk", "yogurt", "honey"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  }
  else if (category.includes("Shake")) {
    calories = 320;
    sugar = 35;
    protein = 8;
    fat = 12;
    vitamins = ["A", "D", "B12"];
    minerals = ["calcium", "phosphorus"];
    ingredients = ["milk", "ice cream", "flavoring"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  }
  else if (category.includes("Juice")) {
    calories = 110;
    sugar = 22;
    protein = 2;
    fat = 0;
    vitamins = ["C", "A"];
    minerals = ["potassium"];
    ingredients = ["fresh fruits"];
    allergens = [];
    dietaryInfo = ["vegan", "gluten-free"];
  }
  else if (category.includes("Ice Cream")) {
    calories = 250;
    sugar = 28;
    protein = 4;
    fat = 14;
    vitamins = ["A", "D", "B12"];
    minerals = ["calcium", "phosphorus"];
    ingredients = ["milk", "cream", "sugar", "flavoring"];
    allergens = ["milk"];
    dietaryInfo = ["vegetarian"];
  }
  else if (category.includes("Protein")) {
    calories = 280;
    sugar = 18;
    protein = 25;
    fat = 8;
    vitamins = ["B12", "D", "E"];
    minerals = ["calcium", "iron", "zinc"];
    ingredients = ["whey protein", "milk", "fruits"];
    allergens = ["milk"];
    dietaryInfo = ["high-protein"];
  }
  else if (category.includes("Sweets")) {
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
    dietaryInfo
  };
}

// Helper function to get serving size based on category
function getServingSize(category: string, name: string): string {
  const nameLower = name.toLowerCase();
  
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

export async function GET() {
  try {
    // Fetch all menu items from CMS
    const menuItems = await client.fetch<SanityMenuItem[]>(`
      *[_type == "menuItem" && active == true] | order(order asc) {
        _id,
        name,
        description,
        price,
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
      const icon = getIcon(category);
      const flavors = getFlavors(item.name, category);
      const healthBenefits = getHealthBenefits(category, item.name);
      const timeOfDay = getTimeOfDay(category, item.name);
      const tasteProfile = getTasteProfile(item.name, category);
      const nutritional = getNutritionalInfo(item.name, category);
      const servingSize = getServingSize(category, item.name);
      
      // Determine caffeine based on category and name
      let caffeine = false;
      
      // Coffee always has caffeine
      if (category.includes("Coffee") || item.name.toLowerCase().includes("coffee") || item.name.toLowerCase().includes("nescafe")) {
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
      
      // Create the title for the transformed item
      const title = item.name;
      
      // Determine origin
      const origin = item.name.toLowerCase().includes("persian") || 
                    item.name.toLowerCase().includes("lavashak") ||
                    item.name.toLowerCase().includes("shahtoot") ||
                    item.name.toLowerCase().includes("baklava") ||
                    item.name.toLowerCase().includes("zoolbia") ||
                    item.name.toLowerCase().includes("bamieh") ? "Persian" : "International";
      
      return {
        title: item.name,
        description: item.description || `Delicious ${item.name.toLowerCase()}`,
        icon,
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
        origin
      };
    });

    return NextResponse.json({ menuItems: aiMenuItems });
  } catch (error) {
    console.error('Error fetching AI menu data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI menu data' },
      { status: 500 }
    );
  }
} 