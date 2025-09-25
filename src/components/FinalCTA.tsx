import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-8">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Start Your AI Meal Planning Journey</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your 
            <span className="block">Eating Habits?</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
            Stop struggling with meal planning. Let our AI create personalized, healthy, 
            and budget-friendly meal plans that actually work for your lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/meal-planner">
              <Button 
                variant="secondary" 
                size="xl" 
                className="gap-2 font-semibold w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl"
              >
                <Sparkles className="h-5 w-5" />
                Create My First Meal Plan
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/ai-assistant">
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Try AI Assistant First
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>100% Free to Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}