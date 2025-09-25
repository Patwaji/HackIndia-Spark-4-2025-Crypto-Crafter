import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, MessageCircle } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Community Reviews
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our growing community of users transforming their eating habits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Users className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Beta</h3>
                <p className="text-muted-foreground">Community</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Join our beta community and help shape the future of AI meal planning
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Real Reviews</h3>
                <p className="text-muted-foreground">Coming Soon</p>
              </div>
              <p className="text-sm text-muted-foreground">
                We're collecting authentic feedback from our users to share genuine experiences
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-2" />
                <h3 className="text-2xl font-bold text-foreground">Share Feedback</h3>
                <p className="text-muted-foreground">Help Us Improve</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Your feedback helps us create better AI-powered meal planning experiences
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Be among the first to try our AI meal planner and share your experience!
          </p>
        </div>
      </div>
    </section>
  );
}