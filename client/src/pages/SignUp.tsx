
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignUp() {
  const [_, setLocation] = useLocation();

  const handleSignUpWithReplit = () => {
    window.addEventListener("message", authComplete);
    const h = 500;
    const w = 350;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    const authWindow = window.open(
      "https://replit.com/auth_with_repl_site?domain=" + location.host,
      "_blank",
      "modal=yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
        w +
        ", height=" +
        h +
        ", top=" +
        top +
        ", left=" +
        left
    );

    function authComplete(e: MessageEvent) {
      if (e.data !== "auth_complete") {
        return;
      }
      window.removeEventListener("message", authComplete);
      if (authWindow) authWindow.close();
      setLocation('/meal-planner');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up for NutriPlan</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Create an account to save your meal plans and track your nutrition goals
          </p>
          <Button 
            className="w-full" 
            onClick={handleSignUpWithReplit}
          >
            Sign Up with Replit
          </Button>
        </div>
      </Card>
    </div>
  );
}
