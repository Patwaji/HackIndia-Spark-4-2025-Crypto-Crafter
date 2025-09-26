import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MealPlan, MealPreferences, HealthGoals, BudgetConstraints } from '@/lib/gemini';

export interface SavedMealPlan {
  id: string;
  userId: string;
  mealPlan: MealPlan;
  name: string;
  description?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  totalCost: number;
  totalCalories: number;
  isTemplate: boolean; // Whether this is a reusable template
}

export interface ShoppingListItem {
  ingredient: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface MealPlanHistory {
  id: string;
  userId: string;
  mealPlanId: string;
  generatedAt: Date;
  preferences: MealPreferences;
  goals: HealthGoals;
  budget: BudgetConstraints;
}

class MealPlanService {
  // Save a meal plan
  async saveMealPlan(
    userId: string, 
    mealPlan: MealPlan, 
    name: string, 
    description?: string,
    tags: string[] = []
  ): Promise<string> {
    const mealPlanId = doc(collection(db, 'mealPlans')).id;
    
    const savedPlan: SavedMealPlan = {
      id: mealPlanId,
      userId,
      mealPlan,
      name,
      description,
      tags,
      isFavorite: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      totalCost: this.calculateTotalCost(mealPlan),
      totalCalories: this.calculateTotalCalories(mealPlan),
      isTemplate: false
    };

    await setDoc(doc(db, 'mealPlans', mealPlanId), savedPlan);
    return mealPlanId;
  }

  // Load a specific meal plan
  async loadMealPlan(mealPlanId: string): Promise<SavedMealPlan | null> {
    const docRef = doc(db, 'mealPlans', mealPlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as SavedMealPlan;
    }
    
    return null;
  }

  // Get user's meal plans
  async getUserMealPlans(userId: string, limitCount: number = 20): Promise<SavedMealPlan[]> {
    const q = query(
      collection(db, 'mealPlans'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as SavedMealPlan;
    });
  }

  // Get user's favorite meal plans
  async getFavoriteMealPlans(userId: string): Promise<SavedMealPlan[]> {
    const q = query(
      collection(db, 'mealPlans'),
      where('userId', '==', userId),
      where('isFavorite', '==', true),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as SavedMealPlan;
    });
  }

  // Toggle favorite status
  async toggleFavorite(mealPlanId: string): Promise<void> {
    const docRef = doc(db, 'mealPlans', mealPlanId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentStatus = docSnap.data().isFavorite;
      await updateDoc(docRef, {
        isFavorite: !currentStatus,
        updatedAt: new Date()
      });
    }
  }

  // Delete meal plan
  async deleteMealPlan(mealPlanId: string): Promise<void> {
    await deleteDoc(doc(db, 'mealPlans', mealPlanId));
  }

  // Generate shopping list from meal plan
  generateShoppingList(mealPlan: MealPlan): ShoppingListItem[] {
    const ingredientMap = new Map<string, { quantity: string, category: string }>();

    // Process single day meal plan
    [mealPlan.breakfast, mealPlan.lunch, mealPlan.snack, mealPlan.dinner].forEach(meal => {
      if (meal && meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          const category = this.categorizeIngredient(ingredient);
          if (ingredientMap.has(ingredient)) {
            // Could implement quantity aggregation logic here
            const existing = ingredientMap.get(ingredient)!;
            ingredientMap.set(ingredient, {
              quantity: `${existing.quantity} + more`,
              category
            });
          } else {
            ingredientMap.set(ingredient, {
              quantity: '1 unit',
              category
            });
          }
        });
      }
    });

    return Array.from(ingredientMap.entries()).map(([ingredient, data]) => ({
      ingredient,
      quantity: data.quantity,
      category: data.category,
      checked: false
    }));
  }

  // Export shopping list to CSV
  exportShoppingListToCSV(shoppingList: ShoppingListItem[]): string {
    const headers = ['Ingredient', 'Quantity', 'Category', 'Checked'];
    const csvContent = [
      headers.join(','),
      ...shoppingList.map(item => [
        `"${item.ingredient}"`,
        `"${item.quantity}"`,
        `"${item.category}"`,
        item.checked ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Download CSV file
  downloadCSV(csvContent: string, filename: string = 'shopping-list.csv'): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Generate iCal content for meal plan
  generateICalContent(mealPlan: MealPlan, startDate: Date = new Date()): string {
    const events: string[] = [];
    const dayDate = new Date(startDate);
    
    // Add breakfast event
    if (mealPlan.breakfast) {
      events.push(this.createICalEvent(
        `Breakfast: ${mealPlan.breakfast.name}`,
        dayDate,
        8, 0, // 8:00 AM
        9, 0  // 9:00 AM
      ));
    }

    // Add lunch event
    if (mealPlan.lunch) {
      events.push(this.createICalEvent(
        `Lunch: ${mealPlan.lunch.name}`,
        dayDate,
        12, 0, // 12:00 PM
        13, 0  // 1:00 PM
      ));
    }

    // Add snack event
    if (mealPlan.snack) {
      events.push(this.createICalEvent(
        `Snack: ${mealPlan.snack.name}`,
        dayDate,
        16, 0, // 4:00 PM
        16, 30  // 4:30 PM
      ));
    }

    // Add dinner event
    if (mealPlan.dinner) {
      events.push(this.createICalEvent(
        `Dinner: ${mealPlan.dinner.name}`,
        dayDate,
        19, 0, // 7:00 PM
        20, 0  // 8:00 PM
      ));
    }

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NutriPlan//Meal Planner//EN
${events.join('\n')}
END:VCALENDAR`;
  }

  // Create individual iCal event
  private createICalEvent(
    title: string, 
    date: Date, 
    startHour: number, 
    startMinute: number,
    endHour: number, 
    endMinute: number
  ): string {
    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VEVENT
UID:${Date.now()}-${Math.random()}@nutriplan.app
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${title}
DESCRIPTION:Meal planned by NutriPlan AI
END:VEVENT`;
  }

  // Download iCal file
  downloadICalFile(icalContent: string, filename: string = 'meal-plan.ics'): void {
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Helper functions
  private calculateTotalCost(mealPlan: MealPlan): number {
    return (mealPlan.breakfast?.cost || 0) + 
           (mealPlan.lunch?.cost || 0) + 
           (mealPlan.snack?.cost || 0) + 
           (mealPlan.dinner?.cost || 0);
  }

  private calculateTotalCalories(mealPlan: MealPlan): number {
    return (mealPlan.breakfast?.nutrition.calories || 0) + 
           (mealPlan.lunch?.nutrition.calories || 0) + 
           (mealPlan.snack?.nutrition.calories || 0) + 
           (mealPlan.dinner?.nutrition.calories || 0);
  }

  private categorizeIngredient(ingredient: string): string {
    const categories = {
      'Vegetables': ['onion', 'garlic', 'ginger', 'tomato', 'potato', 'carrot', 'peas', 'spinach', 'cauliflower', 'cabbage'],
      'Proteins': ['chicken', 'fish', 'egg', 'paneer', 'tofu', 'lentils', 'chickpeas', 'beans'],
      'Grains': ['rice', 'wheat', 'bread', 'roti', 'oats', 'quinoa'],
      'Dairy': ['milk', 'yogurt', 'cheese', 'butter', 'ghee'],
      'Spices': ['turmeric', 'cumin', 'coriander', 'salt', 'pepper', 'chili', 'garam masala']
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.toLowerCase().includes(item))) {
        return category;
      }
    }

    return 'Other';
  }
}

export const mealPlanService = new MealPlanService();

// Export convenience functions for easier importing
export const saveMealPlan = (userId: string, mealPlan: MealPlan, name: string, description?: string, tags: string[] = []) =>
  mealPlanService.saveMealPlan(userId, mealPlan, name, description, tags);

export const loadUserMealPlans = (userId: string, limitCount?: number) =>
  mealPlanService.getUserMealPlans(userId, limitCount);

export const loadMealPlan = (mealPlanId: string) =>
  mealPlanService.loadMealPlan(mealPlanId);

export const deleteMealPlan = (mealPlanId: string) =>
  mealPlanService.deleteMealPlan(mealPlanId);

export const toggleFavorite = (mealPlanId: string) =>
  mealPlanService.toggleFavorite(mealPlanId);

export const getFavoriteMealPlans = (userId: string) =>
  mealPlanService.getFavoriteMealPlans(userId);

export const generateShoppingList = (mealPlan: MealPlan) =>
  mealPlanService.generateShoppingList(mealPlan);

export const exportToCalendar = (mealPlan: MealPlan, title?: string) =>
  mealPlanService.generateICalContent(mealPlan, new Date());

export const exportShoppingListCSV = (mealPlan: MealPlan, filename?: string) =>
  mealPlanService.exportShoppingListToCSV(mealPlanService.generateShoppingList(mealPlan));
