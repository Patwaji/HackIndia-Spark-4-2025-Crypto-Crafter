import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

interface BudgetTipsProps {
  budget: number;
}

const BudgetTips = ({ budget }: BudgetTipsProps) => {
  const getBudgetCategory = () => {
    if (budget < 150) return 'very-low';
    if (budget < 250) return 'low';
    if (budget < 400) return 'moderate';
    if (budget < 600) return 'high';
    return 'premium';
  };

  const category = getBudgetCategory();

  const budgetData = {
    'very-low': {
      color: 'destructive',
      icon: AlertTriangle,
      title: 'Very Low Budget (Under ₹150)',
      tips: [
        'Focus on dal-rice combinations for complete protein',
        'Buy seasonal vegetables for best prices',
        'Use basic spices: turmeric, cumin, coriander',
        'Make large batches to reduce cooking costs',
        'Consider mixed vegetable curry to stretch ingredients'
      ],
      mealSuggestions: ['Dal-Chawal', 'Vegetable Khichdi', 'Aloo Sabzi', 'Seasonal fruit']
    },
    'low': {
      color: 'secondary',
      icon: CheckCircle,
      title: 'Budget-Friendly (₹150-250)',
      tips: [
        'Add paneer or eggs 2-3 times per week',
        'Include variety with different dals (moong, chana)',
        'Make homemade curd/yogurt',
        'Use local and seasonal produce',
        'Prepare simple parathas with sabzi'
      ],
      mealSuggestions: ['Rajma-Chawal', 'Paneer Curry', 'Egg Curry', 'Mixed Dal']
    },
    'moderate': {
      color: 'default',
      icon: CheckCircle,
      title: 'Balanced Budget (₹250-400)',
      tips: [
        'Include chicken/mutton 1-2 times per week',
        'Add variety with different cuisines',
        'Include dry fruits and nuts occasionally',
        'Make fresh chapatis daily',
        'Include fish if available locally'
      ],
      mealSuggestions: ['Chicken Curry', 'Fish Fry', 'Chole Bhature', 'Biryani']
    },
    'high': {
      color: 'default',
      icon: CheckCircle,
      title: 'Comfortable Budget (₹400-600)',
      tips: [
        'Include premium ingredients like basmati rice',
        'Add variety with regional specialties',
        'Include fresh fruits and salads daily',
        'Experiment with different cooking oils',
        'Include dairy products regularly'
      ],
      mealSuggestions: ['Mutton Curry', 'Prawn Masala', 'Stuffed Parathas', 'Fresh Fruits']
    },
    'premium': {
      color: 'default',
      icon: CheckCircle,
      title: 'Premium Budget (₹600+)',
      tips: [
        'Focus on organic and high-quality ingredients',
        'Include exotic vegetables and fruits',
        'Add international cuisine variations',
        'Include premium nuts and dry fruits',
        'Consider special dietary requirements easily'
      ],
      mealSuggestions: ['Tandoori Items', 'Sea Food', 'Exotic Fruits', 'Premium Sweets']
    }
  };

  const currentData = budgetData[category];
  const IconComponent = currentData.icon;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Budget Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={category === 'very-low' ? 'border-destructive' : ''}>
          <IconComponent className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={currentData.color as any}>{currentData.title}</Badge>
            </div>
          </AlertDescription>
        </Alert>

        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-accent" />
            Smart Shopping Tips
          </h4>
          <ul className="space-y-1 text-sm">
            {currentData.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Recommended Meals</h4>
          <div className="flex flex-wrap gap-2">
            {currentData.mealSuggestions.map((meal, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {meal}
              </Badge>
            ))}
          </div>
        </div>

        {category === 'very-low' && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Note:</strong> Very low budgets may limit nutritional variety. 
              Consider increasing budget to ₹200+ for better balanced meals.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetTips;