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
    color: "text-primary",
    gradient: "bg-gradient-to-br from-primary to-primary/70"
  },
  {
    icon: Utensils,
    title: "Smart Recipe Generation",
    description: "Create complete recipes from available ingredients with detailed instructions and nutritional analysis.",
    color: "text-secondary",
    gradient: "bg-gradient-to-br from-secondary to-secondary/70"
  },
  {
    icon: DollarSign,
    title: "Budget-Conscious Planning",
    description: "Cost-effective meal planning with flexible budget allocation and smart ingredient optimization.",
    color: "text-accent",
    gradient: "bg-gradient-to-br from-accent to-accent/70"
  },
  {
    icon: Heart,
    title: "Health Goal Alignment",
    description: "Customized plans for weight loss, muscle gain, or maintenance with precise calorie and macro targeting.",
    color: "text-red-500",
    gradient: "bg-gradient-to-br from-red-500 to-red-400"
  },
  {
    icon: MessageSquare,
    title: "AI Cooking Assistant",
    description: "Conversational cooking guidance with real-time help, tips, and recipe modifications.",
    color: "text-blue-500",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-400"
  },
  {
    icon: ChefHat,
    title: "Cuisine Variety",
    description: "Explore diverse cuisines from Italian to Asian, maintaining authenticity while meeting your dietary needs.",
    color: "text-tertiary",
    gradient: "bg-gradient-to-br from-tertiary to-tertiary/70"
  },
  {
    icon: Target,
    title: "Dietary Accommodation",
    description: "Support for all dietary restrictions including vegan, keto, gluten-free, and medical dietary requirements.",
    color: "text-quaternary",
    gradient: "bg-gradient-to-br from-quaternary to-quaternary/70"
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Get complete meal plans in under 20 seconds with our optimized AI processing pipeline.",
    color: "text-yellow-500",
    gradient: "bg-gradient-to-br from-yellow-500 to-yellow-400"
  },
  {
    icon: Shield,
    title: "Nutritional Accuracy",
    description: "AI-powered nutritional analysis with comprehensive macro and micronutrient calculations for Indian cuisine.",
    color: "text-indigo-500",
    gradient: "bg-gradient-to-br from-indigo-500 to-indigo-400"
  },
  {
    icon: Clock,
    title: "Time-Saving Solutions",
    description: "Streamlined meal planning that saves hours of research and preparation time every week.",
    color: "text-pink-500",
    gradient: "bg-gradient-to-br from-pink-500 to-pink-400"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-floating-orbs">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Powerful Features for 
            <span className="text-gradient block sm:inline sm:ml-2">
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
                className="shadow-soft hover:shadow-warm transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-primary/20 bg-card/70 backdrop-blur-sm hover-lift group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.gradient} flex items-center justify-center mb-4 shadow-soft group-hover:animate-pulse-glow transition-all duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-foreground group-hover:text-gradient transition-all duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-all duration-300">
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