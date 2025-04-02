
import { Link } from "wouter";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section with AI Focus */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-primary/5 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block bg-primary/10 px-4 py-2 rounded-full mb-4">
              <span className="text-primary font-medium">Powered by Advanced AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Experience the Future of <br /> <span className="text-primary">AI-Powered Nutrition</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our advanced AI analyzes thousands of meal combinations to create the perfect personalized meal plan, considering your preferences, health goals, and budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/meal-planner">
                <a className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <span className="material-icons">smart_toy</span>
                  Try AI Meal Planner
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className="border border-gray-300 hover:border-primary text-gray-800 hover:text-primary px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200">
                  See AI in Action
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-heading text-center text-gray-900 mb-12">AI-Powered Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-lightest p-6 rounded-lg border border-primary/10">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">psychology</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Meal Analysis</h3>
              <p className="text-gray-600">Our AI analyzes nutritional balance, meal variety, and dietary requirements in real-time.</p>
            </div>
            
            <div className="bg-neutral-lightest p-6 rounded-lg border border-primary/10">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">auto_awesome</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Insights</h3>
              <p className="text-gray-600">Get AI-generated insights about your meal plan's nutritional value and suggestions for improvement.</p>
            </div>
            
            <div className="bg-neutral-lightest p-6 rounded-lg border border-primary/10">
              <div className="bg-primary-light w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="material-icons text-primary">model_training</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Adaptive Learning</h3>
              <p className="text-gray-600">Our AI learns from your preferences and feedback to provide increasingly personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Stats Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1M+</div>
              <div className="text-gray-600">Meals Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">AI Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">Experience AI-Powered Meal Planning</h2>
          <p className="text-xl text-white/90 mb-8">
            Let our AI create your perfect meal plan in seconds.
          </p>
          <Link href="/meal-planner">
            <a className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-md font-medium text-lg transition-colors duration-200 inline-flex items-center gap-2">
              <span className="material-icons">bolt</span>
              Start Using AI Now
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
