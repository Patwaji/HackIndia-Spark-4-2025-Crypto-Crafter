import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Working Mother",
    location: "Mumbai",
    avatar: "PS",
    rating: 5,
    content: "NutriPlan AI has been a game-changer for my family. It creates healthy meal plans within our ₹400/day budget and my kids actually enjoy the meals!"
  },
  {
    name: "Rahul Verma",
    role: "Fitness Enthusiast",
    location: "Delhi",
    avatar: "RV",
    rating: 5,
    content: "The AI understands my muscle-building goals perfectly. It suggests high-protein Indian meals that fit my macros and taste amazing."
  },
  {
    name: "Anjali Patel",
    role: "Diabetic Patient",
    location: "Bangalore",
    avatar: "AP",
    rating: 5,
    content: "Finally, an AI that creates diabetic-friendly Indian recipes. The portion control and sugar management suggestions are spot-on."
  },
  {
    name: "Suresh Kumar",
    role: "Senior Citizen",
    location: "Chennai",
    avatar: "SK",
    rating: 5,
    content: "Simple, heart-healthy recipes that are easy to cook. The AI assistant helps me with cooking techniques I'd forgotten."
  },
  {
    name: "Meera Singh",
    role: "Vegan Food Blogger",
    location: "Pune",
    avatar: "MS",
    rating: 5,
    content: "Incredible variety of vegan Indian recipes. The AI suggests creative plant-based alternatives I never thought of!"
  },
  {
    name: "Arjun Kapoor",
    role: "College Student",
    location: "Jaipur",
    avatar: "AK",
    rating: 5,
    content: "Perfect for my tight student budget. Gets creative with simple ingredients and the recipes are actually doable in my hostel."
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our Users Are Saying
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real people who've transformed their eating habits with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}