import { Users, Utensils, DollarSign, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    number: "50,000+",
    label: "Happy Users",
    description: "People trust our AI for their daily nutrition",
  },
  {
    icon: Utensils,
    number: "2M+",
    label: "Meals Generated",
    description: "Personalized recipes created and enjoyed",
  },
  {
    icon: DollarSign,
    number: "₹15,000",
    label: "Average Savings",
    description: "Monthly grocery savings per family",
  },
  {
    icon: Clock,
    number: "4.5 hours",
    label: "Time Saved Weekly",
    description: "Less time planning, more time enjoying",
  },
];

export default function Stats() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by Thousands of 
            <span className="bg-gradient-hero bg-clip-text text-transparent block sm:inline sm:ml-2">
              Health-Conscious Indians
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a growing community of people who've revolutionized their meal planning with AI
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