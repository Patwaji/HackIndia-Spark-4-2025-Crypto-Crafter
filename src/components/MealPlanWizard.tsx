import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ChevronRight, ChevronLeft, Utensils, Target, DollarSign, Loader } from "lucide-react";
import { generateMealPlan, type MealPreferences, type HealthGoals, type BudgetConstraints } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";
import MealPlanDisplay from "./MealPlanDisplay";
import BudgetTips from "./BudgetTips";

const cuisineOptions = [
  "Any", "Italian", "Asian", "Mexican", "American", "Mediterranean", "Indian", "French", "Thai", "Japanese"
];

const dietaryRestrictions = [
  "None", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Keto", "Paleo", "Low-carb", "Low-sodium"
];

const healthConditions = [
  "None", "Diabetes", "Heart conditions", "High blood pressure", "IBS", "Food allergies"
];

export default function MealPlanWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const { toast } = useToast();

  // Form state
  const [preferences, setPreferences] = useState<MealPreferences>({
    cuisineType: "Any",
    dietaryRestrictions: [],
    dislikedIngredients: ""
  });

  const [goals, setGoals] = useState<HealthGoals>({
    primaryGoal: "maintenance",
    calorieTarget: 2000,
    healthConditions: []
  });

  const [budget, setBudget] = useState<BudgetConstraints>({
    dailyBudget: 300,
    budgetPriority: "balanced"
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (!canProceedToNext()) {
      toast({
        variant: "destructive",
        title: "Please complete this step",
        description: "Fill in all required fields before proceeding.",
      });
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      setPreferences({
        ...preferences,
        dietaryRestrictions: [...preferences.dietaryRestrictions, restriction]
      });
    } else {
      setPreferences({
        ...preferences,
        dietaryRestrictions: preferences.dietaryRestrictions.filter(r => r !== restriction)
      });
    }
  };

  const handleHealthConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setGoals({
        ...goals,
        healthConditions: [...goals.healthConditions, condition]
      });
    } else {
      setGoals({
        ...goals,
        healthConditions: goals.healthConditions.filter(c => c !== condition)
      });
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return preferences.cuisineType !== "";
      case 2:
        return goals.calorieTarget > 0;
      case 3:
        return budget.dailyBudget >= 150;
      default:
        return true;
    }
  };

  const canProceedToNext = () => {
    return validateStep(currentStep);
  };

  const handleGeneratePlan = async () => {
    // Validate minimum budget
    if (budget.dailyBudget < 150) {
      toast({
        variant: "destructive",
        title: "Budget Too Low",
        description: "Daily budget should be at least ₹150 to create a balanced meal plan with proper nutrition.",
      });
      return;
    }

    console.log("Generating meal plan with:", { preferences, goals, budget });
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(preferences, goals, budget);
      setGeneratedPlan(plan);
      toast({
        title: "Meal Plan Generated!",
        description: "Your personalized meal plan is ready.",
      });
    } catch (error) {
      console.error('Meal plan generation error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Unable to generate meal plan. Please check your connection and try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (generatedPlan) {
    return <MealPlanDisplay mealPlan={generatedPlan} onBack={() => setGeneratedPlan(null)} />;
  }

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Create Your Personalized Meal Plan</h2>
          <p className="text-muted-foreground">Let our AI create the perfect meal plan for your needs</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Step {currentStep} of {totalSteps}
              </CardTitle>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Preferences */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary">
                  <Utensils className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Food Preferences</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cuisine">Preferred Cuisine</Label>
                    <Select value={preferences.cuisineType} onValueChange={(value) => 
                      setPreferences({...preferences, cuisineType: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisineOptions.map(cuisine => (
                          <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Dietary Restrictions</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                      {dietaryRestrictions.map(restriction => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            id={restriction}
                            checked={preferences.dietaryRestrictions.includes(restriction)}
                            onCheckedChange={(checked) => 
                              handleDietaryRestrictionChange(restriction, checked as boolean)
                            }
                          />
                          <Label htmlFor={restriction} className="text-sm">{restriction}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="disliked">Disliked Ingredients (optional)</Label>
                    <Textarea
                      id="disliked"
                      placeholder="e.g., mushrooms, olives, spicy food..."
                      value={preferences.dislikedIngredients}
                      onChange={(e) => setPreferences({...preferences, dislikedIngredients: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-secondary">
                  <Target className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Health Goals</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Primary Goal</Label>
                    <Select value={goals.primaryGoal} onValueChange={(value: any) => 
                      setGoals({...goals, primaryGoal: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight_loss">Weight Loss</SelectItem>
                        <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Daily Calorie Target: {goals.calorieTarget} calories</Label>
                    <Slider
                      value={[goals.calorieTarget]}
                      onValueChange={([value]) => setGoals({...goals, calorieTarget: value})}
                      min={1200}
                      max={3500}
                      step={50}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>1,200</span>
                      <span>3,500</span>
                    </div>
                  </div>

                  <div>
                    <Label>Health Conditions (if any)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {healthConditions.map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={condition}
                            checked={goals.healthConditions.includes(condition)}
                            onCheckedChange={(checked) => 
                              handleHealthConditionChange(condition, checked as boolean)
                            }
                          />
                          <Label htmlFor={condition} className="text-sm">{condition}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Budget Section */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-accent">
                  <DollarSign className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Budget Planning</h3>
                </div>

                <BudgetTips budget={budget.dailyBudget} />

                <div className="space-y-4">
                  <div>
                    <Label>Daily Budget: ₹{budget.dailyBudget}</Label>
                    <Slider
                      value={[budget.dailyBudget]}
                      onValueChange={([value]) => setBudget({...budget, dailyBudget: value})}
                      min={100}
                      max={1000}
                      step={25}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>₹100</span>
                      <span>₹1,000</span>
                    </div>
                    {budget.dailyBudget < 150 && (
                      <p className="text-sm text-destructive mt-1">
                        ⚠️ Very low budget - may limit meal variety and nutrition
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Budget Priority</Label>
                    <Select value={budget.budgetPriority} onValueChange={(value: any) => 
                      setBudget({...budget, budgetPriority: value})
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict - Stay within budget (₹{budget.dailyBudget})</SelectItem>
                        <SelectItem value="balanced">Balanced - Budget-conscious with flexibility</SelectItem>
                        <SelectItem value="nutrition_focused">Nutrition Focused - Health over budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Generate */}
            {currentStep === 4 && (
              <div className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Ready to Generate Your Meal Plan!</h3>
                </div>

                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold">Your Preferences Summary:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong>Cuisine:</strong> {preferences.cuisineType}<br />
                      <strong>Restrictions:</strong> {preferences.dietaryRestrictions.join(', ') || 'None'}
                    </div>
                    <div>
                      <strong>Goal:</strong> {goals.primaryGoal.replace('_', ' ')}<br />
                      <strong>Calories:</strong> {goals.calorieTarget}/day
                    </div>
                    <div>
                      <strong>Budget:</strong> ₹{budget.dailyBudget}/day<br />
                      <strong>Priority:</strong> {budget.budgetPriority.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate My Meal Plan
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              
              {currentStep < totalSteps && (
                <Button 
                  variant="default" 
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}