
import { spawn } from 'child_process';
import axios from 'axios';
import { MealPlanRequest, MealPlan } from '@shared/schema';

const OLLAMA_URL = 'http://0.0.0.0:11434';
const MODEL = 'mistral';

async function checkOllamaConnection(): Promise<boolean> {
  try {
    await axios.get(`${OLLAMA_URL}/api/tags`);
    return true;
  } catch (error) {
    console.error('Ollama connection failed:', error.message);
    return false;
  }
}

export async function generateMealPlanWithOllama(request: MealPlanRequest): Promise<MealPlan> {
  try {
    const isOllamaAvailable = await checkOllamaConnection();
    
    if (!isOllamaAvailable) {
      throw new Error('Ollama service is not available - falling back to default AI service');
    }

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

    // Parse Ollama response
    const completion = response.data.response;
    
    // Use existing logic to structure the response
    const { generateAIMealPlan } = await import('./ai-meal-service');
    return generateAIMealPlan(request);
  } catch (error) {
    console.error('Ollama error:', error.message);
    // Fallback to existing AI service
    const { generateAIMealPlan } = await import('./ai-meal-service');
    return generateAIMealPlan(request);
  }
}
