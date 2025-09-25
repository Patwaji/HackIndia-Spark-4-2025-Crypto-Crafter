import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import MealPlanner from "./pages/MealPlanner";
import AIAssistantPage from "./pages/AIAssistant";
import Profile from "./pages/Profile";
import MyMealPlans from "./pages/MyMealPlans";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-meal-plans" element={<MyMealPlans />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
