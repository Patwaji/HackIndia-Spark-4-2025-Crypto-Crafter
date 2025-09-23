import MealPlanWizard from "@/components/MealPlanWizard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const MealPlanner = () => {
  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center gap-2 justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
              AI Meal Planner
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your personalized meal plan in just a few steps
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>
      
      <MealPlanWizard />
    </main>
  );
};

export default MealPlanner;