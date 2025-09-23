import { ArrowRight, MessageSquare, Sparkles, ChefHat, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: MessageSquare,
    title: "Share Your Preferences",
    description: "Tell our AI about your dietary needs, health goals, budget, and favorite cuisines",
    color: "text-primary"
  },
  {
    icon: Sparkles,
    title: "AI Creates Your Plan",
    description: "Our advanced AI generates a personalized meal plan with recipes, nutrition info, and shopping lists",
    color: "text-secondary"
  },
  {
    icon: ChefHat,
    title: "Cook with Confidence",
    description: "Follow step-by-step recipes with our AI cooking assistant available for real-time help",
    color: "text-accent"
  },
  {
    icon: Heart,
    title: "Track Your Progress",
    description: "Monitor your health journey with nutrition analytics and achieve your wellness goals",
    color: "text-red-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with AI-powered meal planning in just four simple steps
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={index} className="flex items-start gap-8 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary mb-4 flex-shrink-0">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-transparent"></div>
                  )}
                </div>
                
                <div className="flex-1 pt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Link to="/meal-planner">
            <Button variant="hero" size="xl" className="gap-2 font-semibold">
              <Sparkles className="h-5 w-5" />
              Start Your Journey Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}