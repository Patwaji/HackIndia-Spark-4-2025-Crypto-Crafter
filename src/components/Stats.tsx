import { Users, Utensils, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "New",
    label: "Fresh Platform",
    description: "Just launched - be among the first users",
  },
  {
    icon: Utensils,
    number: "AI-Powered",
    label: "Smart Generation",
    description: "Advanced AI creates personalized meal plans",
  },
  {
    icon: DollarSign,
    number: "Budget-Friendly",
    label: "Cost Effective",
    description: "Designed to work within your budget constraints",
  },
  {
    icon: Clock,
    number: "Quick Setup",
    label: "Save Time",
    description: "Get meal plans in minutes, not hours",
  },
];

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Our 
            <span className="bg-gradient-hero bg-clip-text text-transparent block sm:inline sm:ml-2">
              AI Meal Planner?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the benefits of AI-powered meal planning designed specifically for Indian cuisine
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-card/60 backdrop-blur border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}