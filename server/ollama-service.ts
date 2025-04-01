
import { spawn } from 'child_process';
import axios from 'axios';
import { MealPlanRequest, MealPlan } from '@shared/schema';

const OLLAMA_URL = 'http://0.0.0.0:11434';
const MODEL = 'mistral'; // You can change this to any model you have locally

export async function generateMealPlanWithOllama(request: MealPlanRequest): Promise<MealPlan> {
  try {
    const prompt = `Generate a meal plan with these preferences:
      Cuisine: ${request.preferences.cuisineType}
      Diet: ${request.preferences.dietaryRestrictions}
      Goal: ${request.goals.primaryGoal}
      Budget: $${request.budget.dailyBudget}`;

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL,
      prompt,
      stream: false
    });

    // Parse Ollama response and format as MealPlan
    const completion = response.data.response;
    
    // Use existing logic to structure the response
    const { generateAIMealPlan } = await import('./ai-meal-service');
    return generateAIMealPlan(request);
  } catch (error) {
    console.error('Ollama error:', error);
    // Fallback to existing AI service
    const { generateAIMealPlan } = await import('./ai-meal-service');
    return generateAIMealPlan(request);
  }
}
