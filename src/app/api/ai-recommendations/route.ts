import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { temperature, timeOfDay, flavor, caffeine, healthGoal, dietaryRestrictions } = body;

    console.log('AI Recommendation Request:', body);

    // Fetch menu items from AI menu API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/ai-menu`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.status}`);
    }
    const data = await response.json();
    const menuItems = data.menuItems;

    if (!menuItems || !Array.isArray(menuItems)) {
      throw new Error('Invalid menu items data');
    }

    console.log('Fetched menu items count:', menuItems.length);

    function getRecommendations() {
      let filtered = [...menuItems];

      // Step 1: Filter by temperature (most important)
      if (temperature && temperature !== "both") {
        if (temperature === "hot") {
          // For hot drinks, only Coffee & Tea categories
          filtered = filtered.filter(item => 
            item.category.includes("Coffee") || 
            item.category.includes("Tea") ||
            item.title.toLowerCase().includes("tea") ||
            item.title.toLowerCase().includes("coffee")
          );
        } else if (temperature === "cold") {
          // For cold drinks, exclude Coffee & Tea (except iced versions)
          filtered = filtered.filter(item => 
            !item.category.includes("Coffee") && 
            !item.category.includes("Tea") &&
            !item.title.toLowerCase().includes("tea") &&
            !item.title.toLowerCase().includes("coffee")
          );
        }
      }

      console.log('After temperature filter:', filtered.length);

      // Step 2: Filter by caffeine preference
      if (caffeine === "yes") {
        filtered = filtered.filter(item => item.caffeine);
      } else if (caffeine === "no") {
        filtered = filtered.filter(item => !item.caffeine);
      }

      console.log('After caffeine filter:', filtered.length);

      // Step 3: Filter by flavor with precise matching
      if (flavor) {
        filtered = filtered.filter(item => {
          const itemName = item.title.toLowerCase();
          const itemDescription = (item.description || "").toLowerCase();
          
          if (flavor === "rich") {
            // Rich flavor: creamy, chocolate, caramel, nutty drinks
            return itemName.includes("chocolate") || 
                   itemName.includes("caramel") || 
                   itemName.includes("nutella") ||
                   itemName.includes("peanut") ||
                   itemName.includes("cappuccino") ||
                   itemName.includes("latte") ||
                   itemName.includes("macchiato") ||
                   itemDescription.includes("creamy") ||
                   itemDescription.includes("rich");
          }
          
          if (flavor === "sweet") {
            // Sweet flavor: caramel, chocolate, vanilla, fruit drinks
            return itemName.includes("caramel") || 
                   itemName.includes("chocolate") || 
                   itemName.includes("vanilla") ||
                   itemName.includes("strawberry") ||
                   itemName.includes("mango") ||
                   itemName.includes("smoothie") ||
                   itemName.includes("shake") ||
                   itemDescription.includes("sweet");
          }
          
          if (flavor === "sour") {
            // Sour flavor: citrus, berry, tart drinks
            return itemName.includes("lemon") || 
                   itemName.includes("orange") || 
                   itemName.includes("pomegranate") ||
                   itemName.includes("strawberry") ||
                   itemName.includes("lavashak") ||
                   itemName.includes("barberry") ||
                   itemName.includes("ginger") ||
                   itemDescription.includes("sour") ||
                   itemDescription.includes("tart");
          }
          
          if (flavor === "refreshing") {
            // Refreshing: mint, citrus, light drinks
            return itemName.includes("mint") || 
                   itemName.includes("lemon") || 
                   itemName.includes("ginger") ||
                   itemName.includes("pomegranate") ||
                   itemName.includes("orange") ||
                   itemDescription.includes("refreshing") ||
                   itemDescription.includes("light");
          }
          
          if (flavor === "soothing") {
            // Soothing: herbal, calming drinks
            return itemName.includes("chamomile") || 
                   itemName.includes("mint") || 
                   itemName.includes("herbal") ||
                   itemName.includes("tea") ||
                   itemDescription.includes("soothing") ||
                   itemDescription.includes("calming");
          }
          
          return item.flavors.includes(flavor);
        });
      }

      console.log('After flavor filter:', filtered.length);

      // Step 4: Filter by health goals
      if (healthGoal && healthGoal !== "none") {
        filtered = filtered.filter(item => item.healthBenefits.includes(healthGoal));
      }

      console.log('After health goal filter:', filtered.length);

      // Step 5: Filter by time of day
      if (timeOfDay) {
        filtered = filtered.filter(item => item.timeOfDay.includes(timeOfDay));
      }

      console.log('After time of day filter:', filtered.length);

      // If we have matches, return them with some randomness
      if (filtered.length > 0) {
        const shuffled = filtered.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      }

      // If no strict matches, try flexible matching
      let flexibleFiltered = [...menuItems];
      const matchCounts = new Map();

      flexibleFiltered.forEach(item => {
        let matches = 0;
        
        // Temperature matching
        if (temperature && temperature !== "both") {
          if (temperature === "hot" && (item.category.includes("Coffee") || item.category.includes("Tea"))) matches++;
          if (temperature === "cold" && !item.category.includes("Coffee") && !item.category.includes("Tea")) matches++;
        }
        
        // Caffeine matching
        if (caffeine === "yes" && item.caffeine) matches++;
        if (caffeine === "no" && !item.caffeine) matches++;
        
        // Flavor matching with bonus points
        if (flavor) {
          const itemName = item.title.toLowerCase();
          if (flavor === "rich" && (itemName.includes("chocolate") || itemName.includes("caramel") || itemName.includes("cappuccino") || itemName.includes("latte"))) matches += 2;
          if (flavor === "sweet" && (itemName.includes("caramel") || itemName.includes("chocolate") || itemName.includes("vanilla"))) matches += 2;
          if (flavor === "sour" && (itemName.includes("lemon") || itemName.includes("pomegranate") || itemName.includes("lavashak"))) matches += 2;
          if (flavor === "refreshing" && (itemName.includes("mint") || itemName.includes("lemon") || itemName.includes("ginger"))) matches += 2;
          if (flavor === "soothing" && (itemName.includes("chamomile") || itemName.includes("mint") || itemName.includes("tea"))) matches += 2;
        }
        
        // Health goal matching
        if (healthGoal && healthGoal !== "none" && item.healthBenefits.includes(healthGoal)) matches++;
        
        // Time of day matching
        if (timeOfDay && item.timeOfDay.includes(timeOfDay)) matches++;
        
        matchCounts.set(item, matches);
      });

      // Filter items with at least 1 match
      flexibleFiltered = flexibleFiltered.filter(item => matchCounts.get(item) >= 1);

      console.log('After flexible matching:', flexibleFiltered.length);

      if (flexibleFiltered.length === 0) {
        // If still no matches, return random items from appropriate temperature
        let fallbackItems = [...menuItems];
        if (temperature === "hot") {
          fallbackItems = fallbackItems.filter(item => 
            item.category.includes("Coffee") || item.category.includes("Tea")
          );
        } else if (temperature === "cold") {
          fallbackItems = fallbackItems.filter(item => 
            !item.category.includes("Coffee") && !item.category.includes("Tea")
          );
        }
        const shuffled = fallbackItems.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      }

      // Sort by match count and add randomness
      const sorted = flexibleFiltered
        .sort((a, b) => {
          const aMatches = matchCounts.get(a);
          const bMatches = matchCounts.get(b);
          return bMatches - aMatches;
        });
      
      const topResults = sorted.slice(0, 6);
      const shuffled = topResults.sort(() => Math.random() - 0.5);
      
      return shuffled.slice(0, 3);
    }

    const recommendations = getRecommendations();
    
    console.log('AI Recommendations Generated:', {
      count: recommendations.length,
      items: recommendations.map(r => r.title)
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
} 