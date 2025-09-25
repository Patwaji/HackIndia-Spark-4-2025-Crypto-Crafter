import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, MessageCircle } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose AI Meal Planning?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of personalized nutrition with our innovative AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Fresh Launch</h3>
                <p className="text-muted-foreground">Brand New Platform</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Be among the first to experience AI-powered meal planning tailored for Indian cuisine
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Your Feedback Matters</h3>
                <p className="text-muted-foreground">Shape Our Future</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing your experience and suggestions as we grow together
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Early Access</h3>
                <p className="text-muted-foreground">Pioneer User Benefits</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Get free access to all features and help us perfect the AI meal planning experience
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Ready to revolutionize your meal planning with AI? Let's get started!
          </p>
        </div>
      </div>
    </section>
  );
}