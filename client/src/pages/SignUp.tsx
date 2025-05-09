import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function SignUp() {
  const [_, setLocation] = useLocation();

  const handleAuthWindow = (authProvider: string) => {
    window.addEventListener("message", authComplete);
    const h = 500;
    const w = 350;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;

    let authUrl = "";
    switch (authProvider) {
      case "replit":
        authUrl = "https://replit.com/auth_with_repl_site?domain=" + location.host;
        break;
      case "github":
        authUrl = "/api/auth/github";
        break;
      case "google":
        authUrl = "/api/auth/google";
        break;
    }

    const authWindow = window.open(
      authUrl,
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

  const handleSignUpWithReplit = () => handleAuthWindow("replit");
  const handleSignUpWithGithub = () => handleAuthWindow("github");
  const handleSignUpWithGoogle = () => handleAuthWindow("google");

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up for NutriPlan</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Create an account to save your meal plans and track your nutrition goals
          </p>
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#0E1525] hover:bg-[#1C2333] text-white" 
              onClick={handleSignUpWithReplit}
            >
              <img src="https://replit.com/public/images/logo.svg" alt="Replit" className="w-5 h-5 mr-2" />
              Sign Up with Replit
            </Button>

            <Button 
              className="w-full bg-[#24292E] hover:bg-[#2F363D] text-white" 
              onClick={handleSignUpWithGithub}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Sign Up with GitHub
            </Button>

            <Button 
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300" 
              onClick={handleSignUpWithGoogle}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign Up with Google
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}