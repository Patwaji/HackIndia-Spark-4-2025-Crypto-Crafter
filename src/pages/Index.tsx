import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </main>
  );
};

export default Index;