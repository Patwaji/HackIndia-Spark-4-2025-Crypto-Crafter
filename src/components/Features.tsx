import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Utensils, 
  DollarSign, 
  Heart, 
  MessageSquare, 
  ChefHat,
  Target,
  Zap,
  Shield,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Personalization",
    description: "Multi-AI system using Gemini AI for intelligent meal recommendations tailored to your unique preferences and goals.",
    color: "text-primary"
  },
  {
    icon: Utensils,
    title: "Smart Recipe Generation",
    description: "Create complete recipes from available ingredients with detailed instructions and nutritional analysis.",
    color: "text-secondary"
  },
  {
    icon: DollarSign,
    title: "Budget-Conscious Planning",
    description: "Cost-effective meal planning with flexible budget allocation and smart ingredient optimization.",
    color: "text-accent"
  },
  {
    icon: Heart,
    title: "Health Goal Alignment",
    description: "Customized plans for weight loss, muscle gain, or maintenance with precise calorie and macro targeting.",
    color: "text-red-500"
  },
  {
    icon: MessageSquare,
    title: "AI Cooking Assistant",
    description: "Conversational cooking guidance with real-time help, tips, and recipe modifications.",
    color: "text-blue-500"
  },
  {
    icon: ChefHat,
    title: "Cuisine Variety",
    description: "Explore diverse cuisines from Italian to Asian, maintaining authenticity while meeting your dietary needs.",
    color: "text-purple-500"
  },
  {
    icon: Target,
    title: "Dietary Accommodation",
    description: "Support for all dietary restrictions including vegan, keto, gluten-free, and medical dietary requirements.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Get complete meal plans in under 20 seconds with our optimized AI processing pipeline.",
    color: "text-yellow-500"
  },
  {
    icon: Shield,
    title: "Nutritional Accuracy",
    description: "USDA-verified nutritional data with AI-enhanced analysis for maximum accuracy and health benefits.",
    color: "text-indigo-500"
  },
  {
    icon: Clock,
    title: "Time-Saving Solutions",
    description: "Streamlined meal planning that saves hours of research and preparation time every week.",
    color: "text-pink-500"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powerful Features for 
            <span className="bg-gradient-hero bg-clip-text text-transparent block sm:inline sm:ml-2">
              Smart Meal Planning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our AI-powered platform revolutionizes the way you plan, 
            prepare, and enjoy healthy meals every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-background to-muted flex items-center justify-center mb-4 shadow-md`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}