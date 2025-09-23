import { GoogleGenerativeAI } from '@google/generative-ai';
import { safeNumber } from './utils';

// Initialize Gemini AI
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface MealPreferences {
  cuisineType: string;
  dietaryRestrictions: string[];
  dislikedIngredients: string;
}

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

export async function generateMealPlan(
  preferences: MealPreferences,
  goals: HealthGoals,
  budget: BudgetConstraints
): Promise<MealPlan> {
  const prompt = `You are a professional nutritionist and meal planning expert specializing in Indian cuisine and Indian market pricing. Create a complete daily meal plan based on these requirements:

PREFERENCES:
- Cuisine: ${preferences.cuisineType}
- Dietary restrictions: ${preferences.dietaryRestrictions.join(', ') || 'None'}
- Disliked ingredients: ${preferences.dislikedIngredients || 'None'}

HEALTH GOALS:
- Primary goal: ${goals.primaryGoal.replace('_', ' ')}
- Daily calorie target: ${goals.calorieTarget} calories
- Health conditions: ${goals.healthConditions.join(', ') || 'None'}

BUDGET (Indian Rupees):
- Daily budget: ₹${budget.dailyBudget}
- Budget priority: ${budget.budgetPriority.replace('_', ' ')}

IMPORTANT PRICING GUIDELINES FOR INDIAN MARKET:
- Use Indian Rupee (₹) for all costs
- Base pricing on average Indian grocery costs:
  * Rice/wheat: ₹40-60 per kg
  * Dal/pulses: ₹80-120 per kg  
  * Vegetables: ₹20-80 per kg
  * Milk: ₹50-60 per liter
  * Cooking oil: ₹120-160 per liter
  * Spices: ₹100-300 per kg
- A typical Indian meal should cost between ₹30-120
- Consider regional Indian ingredients and cooking methods
- If budget is below ₹200/day, focus on dal-rice, seasonal vegetables, and affordable proteins

Create a meal plan with breakfast, lunch, snack, and dinner. Each meal must include:
- Authentic, culturally appropriate Indian name (if Indian cuisine selected)
- Detailed ingredient list with measurements in Indian units (kg, grams, liters, cups, teaspoons)
- Step-by-step cooking instructions (5-8 steps)
- Accurate nutritional breakdown (calories, protein, carbs, fat, fiber, sugar)
- Cost estimation in Indian Rupees (₹)
- Preparation time
- Indian cooking tips and techniques

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const mealPlan = JSON.parse(jsonMatch[0]);
    
    // Validate the meal plan has reasonable costs for Indian market
    if (mealPlan.totalCost && mealPlan.totalCost < 100) {
      console.warn('Generated meal plan cost seems too low for Indian market');
    }
    
    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan. Please try again.');
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

export async function generateRecipe(ingredients: string, cuisine?: string): Promise<any> {
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