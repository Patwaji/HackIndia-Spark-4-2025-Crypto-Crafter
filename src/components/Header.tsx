import { Button } from "@/components/ui/button";
import { ChefHat, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/30 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">
              NutriPlan AI
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 hover:scale-105">
            Features
          </a>
          <Link to="/meal-planner" className="text-sm font-medium text-foreground/80 hover:text-secondary transition-all duration-300 hover:scale-105">
            Meal Planner
          </Link>
          <Link to="/ai-assistant" className="text-sm font-medium text-foreground/80 hover:text-accent transition-all duration-300 hover:scale-105">
            AI Assistant
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <UserMenu />
          <Link to="/meal-planner">
            <Button variant="hero" size="sm" className="gap-2 bg-gradient-hero border-0 text-white shadow-soft hover-lift hover:scale-105 transition-all duration-300">
              <Sparkles className="h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}