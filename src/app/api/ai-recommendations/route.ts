import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "../../../data/menuDatabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      temperature,
      timeOfDay,
      flavor,
      caffeine,
      healthGoal,
      tastePreference,
      dietaryRestrictions
    } = body;

    console.log("AI Recommendation Request:", {
      temperature,
      timeOfDay,
      flavor,
      caffeine,
      healthGoal,
      tastePreference,
      dietaryRestrictions
    });

    // Get recommendations using the enhanced database
    const recommendations = getRecommendations(
      temperature,
      timeOfDay,
      flavor,
      caffeine,
      healthGoal,
      tastePreference,
      dietaryRestrictions
    );

    // Generate detailed reasoning based on user preferences
    const reasoning = generateReasoning({
      temperature,
      timeOfDay,
      flavor,
      caffeine,
      healthGoal,
      tastePreference,
      dietaryRestrictions,
      recommendations
    });

    console.log("AI Recommendations Generated:", {
      count: recommendations.length,
      items: recommendations.map(r => r.title)
    });

    return NextResponse.json({
      success: true,
      recommendations,
      reasoning,
      analysis: {
        totalProducts: recommendations.length,
        nutritionalSummary: generateNutritionalSummary(recommendations),
        tasteAnalysis: generateTasteAnalysis(recommendations),
        healthBenefits: generateHealthBenefitsSummary(recommendations)
      }
    });

  } catch (error) {
    console.error("AI Recommendation API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate recommendations",
        recommendations: []
      },
      { status: 500 }
    );
  }
}

interface ReasoningParams {
  recommendations: MenuItem[];
  temperature?: string;
  timeOfDay?: string;
  flavor?: string;
  healthGoal?: string;
  caffeine?: string;
  tastePreference?: string;
  dietaryRestrictions?: string[];
}

function generateReasoning(params: ReasoningParams) {
  const { recommendations, temperature, timeOfDay, flavor, healthGoal } = params;
  
  let reasoning = "بر اساس ترجیحات شما، این محصولات را پیشنهاد می‌دهم: ";
  
  if (temperature === "hot") {
    reasoning += "محصولات داغ برای گرم کردن شما در ";
  } else if (temperature === "cold") {
    reasoning += "محصولات خنک برای طراوت و تازگی در ";
  }
  
  if (timeOfDay === "morning") {
    reasoning += "صبح، ";
  } else if (timeOfDay === "afternoon") {
    reasoning += "ظهر، ";
  } else if (timeOfDay === "evening") {
    reasoning += "عصر، ";
  }
  
  if (flavor === "fruity") {
    reasoning += "با طعم میوه‌ای طبیعی ";
  } else if (flavor === "sweet") {
    reasoning += "با شیرینی متعادل ";
  } else if (flavor === "creamy") {
    reasoning += "با بافت خامه‌ای نرم ";
  }
  
  if (healthGoal === "energy") {
    reasoning += "و انرژی‌بخش برای فعالیت‌های روزانه. ";
  } else if (healthGoal === "vitamins") {
    reasoning += "و سرشار از ویتامین‌های ضروری. ";
  } else if (healthGoal === "protein") {
    reasoning += "و غنی از پروتئین برای عضله‌سازی. ";
  }
  
  reasoning += "این محصولات ترکیبی از طعم عالی و فواید سلامتی هستند.";
  
  return reasoning;
}

interface MenuItem {
  calories: number;
  protein: number;
  sugar: number;
  tasteProfile: {
    sweetness: number;
    acidity: number;
    creaminess: number;
  };
  healthBenefits: string[];
}

function generateNutritionalSummary(recommendations: MenuItem[]) {
  const totalCalories = recommendations.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = recommendations.reduce((sum, item) => sum + item.protein, 0);
  const totalSugar = recommendations.reduce((sum, item) => sum + item.sugar, 0);
  const avgCalories = Math.round(totalCalories / recommendations.length);
  
  return {
    averageCalories: avgCalories,
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalSugar: Math.round(totalSugar * 10) / 10,
    proteinRich: totalProtein > 20,
    lowSugar: totalSugar < 30
  };
}

function generateTasteAnalysis(recommendations: MenuItem[]) {
  const avgSweetness = recommendations.reduce((sum, item) => sum + item.tasteProfile.sweetness, 0) / recommendations.length;
  const avgAcidity = recommendations.reduce((sum, item) => sum + item.tasteProfile.acidity, 0) / recommendations.length;
  const avgCreaminess = recommendations.reduce((sum, item) => sum + item.tasteProfile.creaminess, 0) / recommendations.length;
  
  return {
    sweetnessLevel: avgSweetness > 7 ? "شیرین" : avgSweetness > 4 ? "متوسط" : "کم شیرین",
    acidityLevel: avgAcidity > 6 ? "ترش" : avgAcidity > 3 ? "متوسط" : "ملایم",
    creaminessLevel: avgCreaminess > 7 ? "خامه‌ای" : avgCreaminess > 4 ? "نرم" : "سبک"
  };
}

function generateHealthBenefitsSummary(recommendations: MenuItem[]) {
  const allBenefits = recommendations.flatMap(item => item.healthBenefits);
  const benefitCounts = allBenefits.reduce((acc, benefit) => {
    acc[benefit] = (acc[benefit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topBenefits = Object.entries(benefitCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([benefit]) => benefit);
  
  return {
    primaryBenefits: topBenefits,
    totalBenefits: allBenefits.length,
    uniqueBenefits: Object.keys(benefitCounts).length
  };
} 