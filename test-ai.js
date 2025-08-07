// Test script for AI recommendations
async function testAIRecommendations() {
  console.log('🧪 Testing AI Recommendations...\n');
  
  const testCases = [
    {
      name: "Hot Coffee Request",
      request: {
        temperature: "hot",
        timeOfDay: "morning",
        flavor: "rich",
        caffeine: "yes",
        healthGoal: "energy",
        dietaryRestrictions: []
      },
      expected: ["Coffee", "Tea", "Hot"]
    },
    {
      name: "Cold Refreshing Request",
      request: {
        temperature: "cold",
        timeOfDay: "afternoon",
        flavor: "refreshing",
        caffeine: "no",
        healthGoal: "vitamins",
        dietaryRestrictions: []
      },
      expected: ["Smoothie", "Juice", "Cold"]
    },
    {
      name: "Sweet Dessert Request",
      request: {
        temperature: "cold",
        timeOfDay: "evening",
        flavor: "sweet",
        caffeine: "no",
        healthGoal: "none",
        dietaryRestrictions: []
      },
      expected: ["Ice Cream", "Shake", "Sweet"]
    },
    {
      name: "Sour Flavor Request",
      request: {
        temperature: "cold",
        timeOfDay: "afternoon",
        flavor: "sour",
        caffeine: "no",
        healthGoal: "vitamins",
        dietaryRestrictions: []
      },
      expected: ["Lavashak", "Sour", "Acidic"]
    },
    {
      name: "Any Temperature Request",
      request: {
        temperature: "both",
        timeOfDay: "afternoon",
        flavor: "sweet",
        caffeine: "no",
        healthGoal: "none",
        dietaryRestrictions: []
      },
      expected: ["Any"]
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`📋 Testing: ${testCase.name}`);
    console.log(`Request: ${JSON.stringify(testCase.request, null, 2)}`);
    
    try {
      const response = await fetch('http://localhost:3001/api/ai-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.request)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Got ${data.recommendations.length} recommendations:`);
        
        data.recommendations.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.title} (${item.category}) - ${item.temperature}`);
          if (item.tasteProfile) {
            console.log(`     Acidity: ${item.tasteProfile.acidity}/10`);
          }
        });
        
        // Check if recommendations match expected categories
        const hasExpectedCategory = data.recommendations.some(item => 
          testCase.expected.some(expected => 
            item.category.includes(expected) || item.title.includes(expected)
          )
        );
        
        if (hasExpectedCategory) {
          console.log('✅ Recommendations match expected categories');
        } else {
          console.log('❌ Recommendations do not match expected categories');
        }
        
      } else {
        console.log('❌ API request failed');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    console.log('---\n');
  }
}

testAIRecommendations(); 