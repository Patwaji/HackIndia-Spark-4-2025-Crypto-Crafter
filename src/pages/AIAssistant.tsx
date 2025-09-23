import AIAssistant from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const AIAssistantPage = () => {
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
              <MessageSquare className="h-8 w-8 text-primary" />
              AI Cooking Assistant
            </h1>
            <p className="text-muted-foreground mt-2">
              Get instant cooking advice and recipe help
            </p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>
      
      <AIAssistant />
    </main>
  );
};

export default AIAssistantPage;