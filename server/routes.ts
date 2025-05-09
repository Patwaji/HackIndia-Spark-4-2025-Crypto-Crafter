import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  mealPlanRequest, 
  insertMealPlanSchema, 
  type MealPlanRequest,
  type InsertMealPlan
} from "../shared/schema";
import { generateMealPlan } from "./meal-generator";
import { getNutritionInfo } from "./nutrition-api";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key'
});

const SYSTEM_PROMPT = `You are an experienced cooking assistant with deep knowledge of various cuisines, ingredients, and cooking techniques. You provide helpful, clear, and concise advice about cooking. Keep responses friendly and practical.`;

interface CookingAssistantRequest {
  message: string;
}

async function generateAssistantResponse(message: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    return "Sorry, I'm having trouble processing your request right now.";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to generate a meal plan
  app.post('/api/meal-plan', async (req, res) => {
    try {
      console.log('Received meal plan generation request');

      const result = mealPlanRequest.safeParse(req.body);

      if (!result.success) {
        console.error('Invalid meal plan request:', result.error.errors);
        return res.status(400).json({ 
          message: "Invalid request body", 
          errors: result.error.errors 
        });
      }

      const mealPlanData: MealPlanRequest = result.data;
      console.log('Starting AI-powered meal plan generation');

      try {
        const mealPlan = await generateMealPlan(mealPlanData);
        console.log('Meal plan generated successfully');
        return res.json(mealPlan);
      } catch (mealPlanError) {
        console.error('Error in meal plan generation process:', mealPlanError);
        return res.status(500).json({ 
          message: "Failed to generate meal plan",
          error: mealPlanError instanceof Error ? mealPlanError.message : "Unknown error"
        });
      }
    } catch (error) {
      console.error('Unexpected error in meal plan generation route:', error);
      return res.status(500).json({ 
        message: "Failed to process meal plan request",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Cooking Assistant endpoint
  app.post('/api/cooking-assistant', async (req, res) => {
    try {
      const { message } = req.body as CookingAssistantRequest;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await generateAssistantResponse(message);
      res.json({ response });
    } catch (error) {
      console.error('Error in cooking assistant:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });

  // Get nutrition info
  app.get('/api/nutrition/:food', async (req, res) => {
    try {
      const food = req.params.food;

      if (!food) {
        return res.status(400).json({ message: "Food parameter is required" });
      }

      const nutritionInfo = await getNutritionInfo(food);
      return res.json(nutritionInfo);
    } catch (error) {
      console.error('Error fetching nutrition info:', error);
      return res.status(500).json({ 
        message: "Failed to fetch nutrition information",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Save a meal plan
  app.post('/api/meal-plans/save', async (req, res) => {
    try {
      // Temporary user_id - in a real app this would come from authentication
      const userId = req.body.user_id || 1;
      const planName = req.body.plan_name || `Meal Plan - ${new Date().toLocaleDateString()}`;
      
      // Validate request body
      const mealPlanResult = mealPlanRequest.safeParse(req.body.plan_request);
      
      if (!mealPlanResult.success) {
        return res.status(400).json({ 
          message: "Invalid meal plan request", 
          errors: mealPlanResult.error.errors 
        });
      }
      
      // Also validate the meal plan data
      if (!req.body.plan_data) {
        return res.status(400).json({ message: "Plan data is required" });
      }
      
      const insertData: InsertMealPlan = {
        user_id: userId,
        plan_name: planName,
        preferences: mealPlanResult.data.preferences,
        goals: mealPlanResult.data.goals,
        budget: mealPlanResult.data.budget,
        plan_data: req.body.plan_data
      };
      
      // Save the meal plan to the database
      const savedPlan = await storage.saveMealPlan(insertData);
      
      return res.status(201).json(savedPlan);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      return res.status(500).json({ 
        message: "Failed to save meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all saved meal plans for a user
  app.get('/api/meal-plans/user/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const mealPlans = await storage.getUserMealPlans(userId);
      
      return res.json(mealPlans);
    } catch (error) {
      console.error('Error fetching user meal plans:', error);
      return res.status(500).json({ 
        message: "Failed to fetch user meal plans",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific meal plan by ID
  app.get('/api/meal-plans/:id', async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid meal plan ID" });
      }
      
      const mealPlan = await storage.getMealPlan(planId);
      
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      
      return res.json(mealPlan);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      return res.status(500).json({ 
        message: "Failed to fetch meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });


  // Delete a meal plan
  app.delete('/api/meal-plans/:id', async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid meal plan ID" });
      }
      
      const deleted = await storage.deleteMealPlan(planId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Meal plan not found or already deleted" });
      }
      
      return res.json({ message: "Meal plan deleted successfully" });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      return res.status(500).json({ 
        message: "Failed to delete meal plan",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}