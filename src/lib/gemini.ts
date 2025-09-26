import { GoogleGenerativeAI, GoogleGenerativeAIResponseError } from '@google/generative-ai';
import { safeNumber } from './utils';

// Initialize Gemini AI with secure environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-8b'
});

export interface MealPreferences {
  cuisineType: string;
  dietaryRestrictions: string[];
  dislikedIngredients: string;
}

export interface VideoScene {
  scene_visual: string;
  narration: string;
  duration_in_seconds: number;
}

// VideoScript is now an array of VideoScene
export type VideoScript = VideoScene[];

export interface HealthGoals {
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  calorieTarget: number;
  healthConditions: string[];
}

export interface BudgetConstraints {
  dailyBudget: number;
  budgetPriority: 'strict' | 'balanced' | 'nutrition_focused';
}

export interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  description?: string;
  cost: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  ingredients: string[];
  instructions: string[];
  prepTime?: string;
  servings?: number;
  tips?: string[];
  cuisineType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  snack: Meal;
  dinner: Meal;
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  totalCost: number;
}

export interface GeneratedRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  estimatedCost: number;
}

export async function generateMealPlan(
  preferences: MealPreferences,
  goals: HealthGoals,
  budget: BudgetConstraints
): Promise<MealPlan> {
  // Validate API key
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('❌ Gemini API key is missing. Please check your .env file.');
  }

  console.log('🔑 Using API Key:', apiKey.substring(0, 15) + '...');
  console.log('🤖 Model:', 'gemini-pro');
  
  try {
    const prompt = `You are a professional nutritionist and meal planning expert specializing in Indian cuisine and Indian market pricing. Create a complete daily meal plan based on these requirements:

STRICT REQUIREMENTS (MUST FOLLOW):
- Cuisine: ${preferences.cuisineType} ${preferences.cuisineType !== 'Any' ? '(ONLY this cuisine type - no mixing with other cuisines)' : ''}
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'} ${preferences.dietaryRestrictions.length > 0 ? '(STRICTLY avoid these - no exceptions)' : ''}
- Disliked ingredients: ${preferences.dislikedIngredients || 'None'} ${preferences.dislikedIngredients ? '(COMPLETELY avoid these ingredients)' : ''}

HEALTH GOALS (MANDATORY):
- Primary goal: ${goals.primaryGoal.replace('_', ' ')}
- Daily calorie target: EXACTLY ${goals.calorieTarget} calories (CRITICAL: Must be within ${goals.calorieTarget - 50} to ${goals.calorieTarget + 50} calories - NO EXCEPTIONS)
- Health conditions: ${goals.healthConditions.join(', ') || 'None'} ${goals.healthConditions.length > 0 ? '(Adjust recipes accordingly)' : ''}

BUDGET (STRICT CONSTRAINT):
- Daily budget: ₹${budget.dailyBudget} (DO NOT exceed this amount)
- Budget priority: ${budget.budgetPriority.replace('_', ' ')}

CRITICAL REQUIREMENTS:
1. CUISINE COMPLIANCE: If user selected "${preferences.cuisineType}" cuisine, ALL meals must be from this cuisine only
2. DIETARY RESTRICTIONS: Absolutely NO ${preferences.dietaryRestrictions.join(', ')} ingredients or preparations
3. DISLIKED INGREDIENTS: Never include: ${preferences.dislikedIngredients || 'None specified'}
4. CALORIE TARGET: ***CRITICAL*** Total daily calories MUST be between ${goals.calorieTarget - 50} and ${goals.calorieTarget + 50} calories. Calculate each meal's calories carefully and ensure the sum equals ${goals.calorieTarget} calories (±50). DO NOT create low-calorie meal plans.
5. BUDGET: Total cost must not exceed ₹${budget.dailyBudget}

INDIAN MARKET PRICING (Use these exact ranges):
- Rice/wheat: ₹40-60 per kg
- Dal/pulses: ₹80-120 per kg  
- Vegetables: ₹20-80 per kg
- Milk: ₹50-60 per liter
- Cooking oil: ₹120-160 per liter
- Spices: ₹100-300 per kg
- Typical meal cost: ₹30-120

MEAL STRUCTURE (EXACT CALORIE DISTRIBUTION):
- Breakfast: ${Math.round(goals.calorieTarget * 0.25)} calories (25% of ${goals.calorieTarget})
- Lunch: ${Math.round(goals.calorieTarget * 0.35)} calories (35% of ${goals.calorieTarget})  
- Snack: ${Math.round(goals.calorieTarget * 0.15)} calories (15% of ${goals.calorieTarget})
- Dinner: ${Math.round(goals.calorieTarget * 0.25)} calories (25% of ${goals.calorieTarget})
TOTAL MUST EQUAL: ${goals.calorieTarget} calories

Create meals that are:
- Authentic to the selected cuisine
- Nutritionally balanced for the health goal
- Within budget constraints
- Free from restricted/disliked ingredients
- If budget is below ₹200/day, focus on dal-rice, seasonal vegetables, and affordable proteins

Create a meal plan with breakfast, lunch, snack, and dinner. Each meal must include:
- Authentic, culturally appropriate Indian name (if Indian cuisine selected)
- Detailed ingredient list with measurements in Indian units (kg, grams, liters, cups, teaspoons)
- Step-by-step cooking instructions (5-8 steps)
- Accurate nutritional breakdown (calories, protein, carbs, fat, fiber, sugar)
- Cost estimation in Indian Rupees (₹)
- Preparation time
- Indian cooking tips and techniques

CRITICAL VALIDATION BEFORE RESPONDING: 
1. Calculate breakfast + lunch + snack + dinner calories = MUST be between ${goals.calorieTarget - 50} and ${goals.calorieTarget + 50} calories
2. If total calories are below ${goals.calorieTarget - 50}, increase portions or add healthy ingredients
3. If total calories exceed ${goals.calorieTarget + 50}, reduce portions
4. Double-check NO restricted ingredients (${preferences.dietaryRestrictions.join(', ') || 'None'}) are included

Return ONLY valid JSON in this exact format:
{
  "breakfast": {
    "name": "meal name",
    "type": "breakfast",
    "description": "brief description",
    "cost": 0.00,
    "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sugar": 0},
    "ingredients": ["ingredient 1", "ingredient 2"],
    "instructions": ["step 1", "step 2"],
    "prepTime": "15 minutes",
    "servings": 1,
    "tips": ["tip 1"],
    "cuisineType": "cuisine",
    "difficulty": "easy"
  },
  "lunch": { /* same structure */ },
  "snack": { /* same structure */ },
  "dinner": { /* same structure */ },
  "totalNutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0, "fiber": 0, "sugar": 0},
  "totalCost": 0.00
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Successfully got response from Gemini');
    console.log('📝 Response preview:', text.substring(0, 200) + '...');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    const mealPlan = JSON.parse(jsonMatch[0]);
    console.log('✅ Successfully parsed meal plan');
    
    // Validate the meal plan follows user preferences
    const totalCost = mealPlan.totalCost || 0;
    const totalCalories = mealPlan.totalNutrition?.calories || 0;
    
    // Budget validation
    if (totalCost > budget.dailyBudget * 1.1) { // Allow 10% tolerance
      console.warn(`Generated meal plan cost (₹${totalCost}) exceeds budget (₹${budget.dailyBudget})`);
    }
    
    // Calorie validation - stricter enforcement
    const calorieVariance = Math.abs(totalCalories - goals.calorieTarget);
    if (calorieVariance > 50) { // Only allow 50 calorie variance
      console.warn(`Generated meal plan calories (${totalCalories}) differ from target (${goals.calorieTarget}) by ${calorieVariance} calories`);
      // Could regenerate here if needed
    }
    
    // Dietary restriction validation
    if (preferences.dietaryRestrictions.length > 0) {
      const allMeals = [mealPlan.breakfast, mealPlan.lunch, mealPlan.snack, mealPlan.dinner];
      for (const meal of allMeals) {
        if (meal && meal.ingredients) {
          const mealText = JSON.stringify(meal).toLowerCase();
          for (const restriction of preferences.dietaryRestrictions) {
            if (restriction.toLowerCase() !== 'none') {
              // Check for common restriction violations
              if (restriction.toLowerCase().includes('vegetarian') && 
                  (mealText.includes('chicken') || mealText.includes('mutton') || mealText.includes('fish') || mealText.includes('egg'))) {
                console.warn(`Meal plan may violate ${restriction} restriction`);
              }
              if (restriction.toLowerCase().includes('vegan') && 
                  (mealText.includes('milk') || mealText.includes('cheese') || mealText.includes('butter') || mealText.includes('ghee'))) {
                console.warn(`Meal plan may violate ${restriction} restriction`);
              }
            }
          }
        }
      }
    }
    
    return mealPlan;
  } catch (error) {
    console.error('❌ Error generating meal plan:', error);
    
    if (error instanceof Error) {
      // Check for specific API errors
      if (error.message.includes('404')) {
        throw new Error('❌ Model not found. Your API key may not have access to Gemini models. Please:\n1. Generate a new API key at https://aistudio.google.com/app/apikey\n2. Make sure Gemini API is enabled\n3. Check if your API key has proper permissions');
      }
      if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('❌ Permission denied. Please check your API key permissions.');
      }
      if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('❌ API quota exceeded. Please check your usage limits.');
      }
      
      throw new Error(`❌ Failed to generate meal plan: ${error.message}`);
    }
    throw new Error('❌ An unknown error occurred during meal plan generation.');
  }
}

export async function getCookingAssistance(message: string, context?: string): Promise<string> {
  const prompt = `You are a helpful AI cooking assistant. ${context ? `Context: ${context}` : ''} 
  
User question: ${message}

Please provide a helpful, encouraging response with practical cooking advice. Format your response with:
- Use **bold** for important terms or headings
- Use bullet points (- ) for lists and tips
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Break content into short paragraphs for readability
- Add relevant cooking tips and suggestions

Be conversational, supportive, and informative.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting cooking assistance:', error);
    throw new Error('Failed to get cooking assistance. Please try again.');
  }
}

export async function generateRecipe(ingredients: string, cuisine?: string): Promise<GeneratedRecipe> {
  const prompt = `Create a recipe using these available ingredients: ${ingredients}
  ${cuisine ? `Cuisine preference: ${cuisine}` : ''}
  
  IMPORTANT: Use Indian market pricing in Rupees (₹) and Indian cooking methods.
  
  Return a complete recipe with:
  - Creative recipe name (use Indian names if appropriate)
  - Full ingredient list with measurements in Indian units (grams, cups, teaspoons)
  - Detailed cooking instructions suitable for Indian kitchens
  - Cooking time and difficulty level
  - Nutritional information (must be numbers, not strings)
  - Cost estimation in Indian Rupees (must be a number, not string)
  
  CRITICAL: All numeric values must be actual numbers, not strings.
  
  Format as JSON with this EXACT structure (ensure all numbers are actual numbers):
  {
    "name": "recipe name",
    "ingredients": ["ingredient with measurement"],
    "instructions": ["step by step"],
    "cookingTime": "time",
    "difficulty": "easy/medium/hard",
    "nutrition": {
      "calories": 0,
      "protein": 0,
      "carbs": 0,
      "fat": 0
    },
    "estimatedCost": 0.00
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const recipe = JSON.parse(jsonMatch[0]);
    
    // Ensure numeric values are properly converted
    if (recipe.nutrition) {
      recipe.nutrition.calories = safeNumber(recipe.nutrition.calories);
      recipe.nutrition.protein = safeNumber(recipe.nutrition.protein);
      recipe.nutrition.carbs = safeNumber(recipe.nutrition.carbs);
      recipe.nutrition.fat = safeNumber(recipe.nutrition.fat);
    }
    
    if (recipe.estimatedCost) {
      recipe.estimatedCost = safeNumber(recipe.estimatedCost);
    }
    
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw new Error('Failed to generate recipe. Please try again.');
  }
}

export async function generateVideoScript(recipe: Meal): Promise<VideoScript> {
  const prompt = `Given a meal plan with ingredients and cooking steps, create a short recipe video script under 3 minutes.\n\nInclude:\n1. Title scene (2-3 sec).\n2. Ingredients list (≤ 15 sec).\n3. 3–5 cooking scenes with short narration (≤ 20 sec each).\n4. Final dish presentation (≤ 5 sec).\n\nKeep narration concise, beginner-friendly, and engaging.\nOutput in JSON format as an array of scenes, each with:\n- scene_visual\n- narration\n- duration_in_seconds\n\nRECIPE DETAILS:\n- Dish: ${recipe.name}\n- Cuisine: ${recipe.cuisineType || 'Indian'}\n- Prep Time: ${recipe.prepTime || '15 minutes'}\n- Difficulty: ${recipe.difficulty || 'Easy'}\n\nINGREDIENTS:\n${recipe.ingredients ? recipe.ingredients.join(', ') : 'Standard ingredients'}\n\nCOOKING STEPS:\n${recipe.instructions ? recipe.instructions.join('\n') : 'Standard cooking process'}\n\nReturn ONLY valid JSON in this format:\n[\n  {\n    "scene_visual": "...",\n    "narration": "...",\n    "duration_in_seconds": 0\n  }\n]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini response for video script:", text);

    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No valid JSON array found in video script response');
    }

    try {
      const videoScenes = JSON.parse(jsonMatch[0]);
      return videoScenes;
    } catch (parseError) {
      console.error("Failed to parse video script JSON:", parseError);
      throw new Error("The AI returned an invalid format for the video script.");
    }

  } catch (error) {
    console.error('Error generating video script:', error);
    if (error instanceof GoogleGenerativeAIResponseError) {
      console.error('Gemini Response Error:', JSON.stringify(error.response, null, 2));
      const blockReason = error.response.promptFeedback?.blockReason;
      throw new Error(`Video script generation failed due to: ${blockReason || 'API error'}. Check console for details.`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to generate video script: ${error.message}`);
    }
    throw new Error('Failed to generate video script. Please try again.');
  }
}