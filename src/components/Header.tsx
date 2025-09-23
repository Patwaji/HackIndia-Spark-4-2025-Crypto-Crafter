import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              NutriPlan AI
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <Link to="/meal-planner" className="text-sm font-medium hover:text-primary transition-colors">
            Meal Planner
          </Link>
          <Link to="/ai-assistant" className="text-sm font-medium hover:text-primary transition-colors">
            AI Assistant
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Link to="/meal-planner">
            <Button variant="hero" size="sm" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}