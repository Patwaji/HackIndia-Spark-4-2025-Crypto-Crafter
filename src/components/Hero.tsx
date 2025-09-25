import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, DollarSign, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-meal-spread.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-mesh overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/25 to-secondary/15 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-accent/20 to-tertiary/12 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-quaternary/15 to-primary/10 rounded-full blur-2xl"></div>
      
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
        {/* Content */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-2 bg-gradient-warm text-white border-0 shadow-soft hover-lift">
              <Sparkles className="h-4 w-4" />
              AI-Powered Nutrition
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Your Personal
              <span className="text-gradient block">
                AI Nutritionist
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Create personalized, nutritious meal plans tailored to your health goals, 
              dietary preferences, and budget with advanced AI technology.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm shadow-soft hover-lift border border-primary/30">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold text-foreground">Smart AI</div>
                <div className="text-sm text-muted-foreground">Personalized plans</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm shadow-soft hover-lift border border-secondary/30">
              <Heart className="h-8 w-8 text-secondary" />
              <div>
                <div className="font-semibold text-foreground">Health Goals</div>
                <div className="text-sm text-muted-foreground">Track progress</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm shadow-soft hover-lift border border-accent/30">
              <DollarSign className="h-8 w-8 text-accent" />
              <div>
                <div className="font-semibold text-foreground">Budget Smart</div>
                <div className="text-sm text-muted-foreground">Cost effective</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/meal-planner">
              <Button variant="hero" size="xl" className="gap-2 font-semibold w-full sm:w-auto bg-gradient-hero border-0 text-white shadow-soft hover-lift hover:scale-105 transition-all duration-300">
                <Sparkles className="h-5 w-5" />
                Start Planning Meals
              </Button>
            </Link>
            <Link to="/ai-assistant">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-primary/50 bg-card/30 backdrop-blur-sm text-foreground hover:bg-primary/10 hover-lift">
                Try AI Assistant
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background"></div>
                ))}
              </div>
              <span>Try our AI meal planner</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-primary/20 px-3 py-1 rounded-full text-sm">
                New Launch
              </div>
              <span className="text-sm text-muted-foreground">AI-powered meal planning</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl shadow-soft border border-primary/30">
            <img 
              src={heroImage}
              alt="Healthy meal spread with various nutritious foods"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-hero opacity-20"></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-4 -right-4 p-4 bg-gradient-cool rounded-xl shadow-soft border border-primary/30 text-white hover-lift">
            <div className="text-2xl font-bold">2,500</div>
            <div className="text-sm opacity-90">Daily Calories</div>
          </div>
          
          <div className="absolute -bottom-4 -left-4 p-4 bg-gradient-warm rounded-xl shadow-soft border border-secondary/30 text-white hover-lift">
            <div className="text-2xl font-bold">₹300</div>
            <div className="text-sm opacity-90">Daily Budget</div>
          </div>
        </div>
      </div>
    </section>
  );
}