import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  Clock, 
  DollarSign, 
  Users, 
  ChefHat,
  Zap,
  Apple,
  Heart,
  Download,
  Save,
  BookOpen,
  Loader
} from "lucide-react";
import type { MealPlan, Meal } from "@/lib/gemini";
import { generateRecipe } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, safeNumber } from "@/lib/utils";
import { useState } from "react";

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  onBack: () => void;
}

export default function MealPlanDisplay({ mealPlan, onBack }: MealPlanDisplayProps) {
  const [generatingRecipe, setGeneratingRecipe] = useState<string | null>(null);
  const [generatedRecipes, setGeneratedRecipes] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const meals = [
    { key: 'breakfast', meal: mealPlan.breakfast, icon: '🌅', color: 'text-yellow-600' },
    { key: 'lunch', meal: mealPlan.lunch, icon: '☀️', color: 'text-orange-600' },
    { key: 'snack', meal: mealPlan.snack, icon: '🍎', color: 'text-green-600' },
    { key: 'dinner', meal: mealPlan.dinner, icon: '🌙', color: 'text-purple-600' }
  ];

  const handleGenerateRecipe = async (meal: Meal, mealKey: string) => {
    setGeneratingRecipe(mealKey);
    try {
      const ingredients = meal.ingredients.join(', ');
      const recipe = await generateRecipe(ingredients, meal.cuisineType);
      setGeneratedRecipes(prev => ({ ...prev, [mealKey]: recipe }));
      toast({
        title: "Recipe Generated!",
        description: `Detailed recipe for ${meal.name} is ready.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Please try again later.",
      });
    } finally {
      setGeneratingRecipe(null);
    }
  };

  const macroPercentages = {
    protein: Math.round((safeNumber(mealPlan.totalNutrition.protein) * 4) / Math.max(safeNumber(mealPlan.totalNutrition.calories), 1) * 100),
    carbs: Math.round((safeNumber(mealPlan.totalNutrition.carbs) * 4) / Math.max(safeNumber(mealPlan.totalNutrition.calories), 1) * 100),
    fat: Math.round((safeNumber(mealPlan.totalNutrition.fat) * 9) / Math.max(safeNumber(mealPlan.totalNutrition.calories), 1) * 100)
  };

  return (
    <section className="py-20 bg-gradient-subtle min-h-screen">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Wizard
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Plan
            </Button>
            <Button variant="default" className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">{mealPlan.totalNutrition.calories}</div>
              <div className="text-sm text-muted-foreground">Total Calories</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary">{formatCurrency(mealPlan.totalCost)}</div>
              <div className="text-sm text-muted-foreground">Daily Cost</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent">{safeNumber(mealPlan.totalNutrition.protein)}g</div>
              <div className="text-sm text-muted-foreground">Protein</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{safeNumber(mealPlan.totalNutrition.fiber)}g</div>
              <div className="text-sm text-muted-foreground">Fiber</div>
            </CardContent>
          </Card>
        </div>

        {/* Macro Breakdown */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5 text-primary" />
              Macronutrient Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Protein</span>
                  <span>{macroPercentages.protein}%</span>
                </div>
                <Progress value={macroPercentages.protein} className="h-2" />
                <div className="text-sm text-muted-foreground">{safeNumber(mealPlan.totalNutrition.protein)}g</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Carbohydrates</span>
                  <span>{macroPercentages.carbs}%</span>
                </div>
                <Progress value={macroPercentages.carbs} className="h-2" />
                <div className="text-sm text-muted-foreground">{safeNumber(mealPlan.totalNutrition.carbs)}g</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Fat</span>
                  <span>{macroPercentages.fat}%</span>
                </div>
                <Progress value={macroPercentages.fat} className="h-2" />
                <div className="text-sm text-muted-foreground">{safeNumber(mealPlan.totalNutrition.fat)}g</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meals.map(({ key, meal, icon, color }) => (
            <Card key={key} className="shadow-card hover:shadow-glow transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <div className="capitalize font-bold">{meal.name}</div>
                    <div className={`text-sm font-normal ${color} capitalize`}>{meal.type}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Meal Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {meal.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {meal.servings} serving
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(meal.cost)}
                  </div>
                </div>

                {/* Difficulty & Cuisine */}
                <div className="flex items-center gap-2">
                  <Badge variant={meal.difficulty === 'easy' ? 'default' : meal.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                    {meal.difficulty}
                  </Badge>
                  {meal.cuisineType && (
                    <Badge variant="outline">{meal.cuisineType}</Badge>
                  )}
                </div>

                {/* Nutrition */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm space-y-1">
                    <div><strong>Calories:</strong> {safeNumber(meal.nutrition.calories)}</div>
                    <div><strong>Protein:</strong> {safeNumber(meal.nutrition.protein)}g</div>
                    <div><strong>Carbs:</strong> {safeNumber(meal.nutrition.carbs)}g</div>
                    <div><strong>Fat:</strong> {safeNumber(meal.nutrition.fat)}g</div>
                    <div><strong>Fiber:</strong> {safeNumber(meal.nutrition.fiber)}g</div>
                  </div>
                </div>

                {/* Description */}
                {meal.description && (
                  <p className="text-sm text-muted-foreground">{meal.description}</p>
                )}

                {/* Ingredients */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    Ingredients
                  </h4>
                  <ul className="text-sm space-y-1">
                    {meal.ingredients.slice(0, 4).map((ingredient, idx) => (
                      <li key={idx} className="text-muted-foreground">• {ingredient}</li>
                    ))}
                    {meal.ingredients.length > 4 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{meal.ingredients.length - 4} more ingredients...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Tips */}
                {meal.tips && meal.tips.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Pro Tips
                    </h4>
                    <ul className="text-sm space-y-1">
                      {meal.tips.map((tip, idx) => (
                        <li key={idx} className="text-muted-foreground">💡 {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator />

                {/* Instructions Preview */}
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <ol className="text-sm space-y-1">
                    {meal.instructions.slice(0, 2).map((step, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        {idx + 1}. {step}
                      </li>
                    ))}
                    {meal.instructions.length > 2 && (
                      <li className="text-xs text-muted-foreground italic">
                        +{meal.instructions.length - 2} more steps...
                      </li>
                    )}
                  </ol>
                </div>

                <Button variant="outline" size="sm" className="w-full mb-2">
                  View Full Recipe
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="meal" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => !generatedRecipes[key] && handleGenerateRecipe(meal, key)}
                      disabled={generatingRecipe === key}
                    >
                      {generatingRecipe === key ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-4 w-4" />
                          {generatedRecipes[key] ? 'View Generated Recipe' : 'Generate Detailed Recipe'}
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  {generatedRecipes[key] && (
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span className="text-2xl">{icon}</span>
                          {generatedRecipes[key].name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {generatedRecipes[key].cookingTime}
                          </div>
                          <Badge variant={generatedRecipes[key].difficulty === 'easy' ? 'default' : generatedRecipes[key].difficulty === 'medium' ? 'secondary' : 'destructive'}>
                            {generatedRecipes[key].difficulty}
                          </Badge>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Ingredients:</h4>
                          <ul className="space-y-1">
                            {generatedRecipes[key].ingredients?.map((ingredient: string, idx: number) => (
                              <li key={idx} className="text-sm">• {ingredient}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Instructions:</h4>
                          <ol className="space-y-2">
                            {generatedRecipes[key].instructions?.map((step: string, idx: number) => (
                              <li key={idx} className="text-sm">
                                <span className="font-medium">{idx + 1}.</span> {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        {generatedRecipes[key].estimatedCost && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(generatedRecipes[key].estimatedCost)} estimated cost
                          </div>
                        )}
                        
                        {generatedRecipes[key].nutrition && (
                          <div className="bg-muted rounded-lg p-3">
                            <h4 className="font-semibold mb-2">Nutrition (per serving):</h4>
                            <div className="grid grid-cols-4 gap-2 text-center text-sm">
                              <div>
                              <div className="font-semibold text-primary">{safeNumber(generatedRecipes[key].nutrition.calories)}</div>
                              <div className="text-xs text-muted-foreground">cal</div>
                            </div>
                            <div>
                              <div className="font-semibold">{safeNumber(generatedRecipes[key].nutrition.protein)}g</div>
                              <div className="text-xs text-muted-foreground">protein</div>
                            </div>
                            <div>
                              <div className="font-semibold">{safeNumber(generatedRecipes[key].nutrition.carbs)}g</div>
                              <div className="text-xs text-muted-foreground">carbs</div>
                            </div>
                            <div>
                              <div className="font-semibold">{safeNumber(generatedRecipes[key].nutrition.fat)}g</div>
                              <div className="text-xs text-muted-foreground">fat</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  )}
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary" />
              AI Nutritionist Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-600">✅ What's Great</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Excellent protein distribution throughout the day</li>
                  <li>• Good fiber content for digestive health</li>
                  <li>• Balanced macronutrient ratios</li>
                  <li>• Within your budget constraints</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-amber-600">💡 Suggestions</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Consider adding more colorful vegetables</li>
                  <li>• Stay hydrated - aim for 8 glasses of water</li>
                  <li>• Prep ingredients the night before</li>
                  <li>• Listen to your hunger cues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button variant="hero" size="lg" className="gap-2">
            <Save className="h-5 w-5" />
            Save This Plan
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            Generate New Plan
          </Button>
          <Button variant="secondary" size="lg" className="gap-2">
            Share Plan
          </Button>
        </div>
      </div>
    </section>
  );
}