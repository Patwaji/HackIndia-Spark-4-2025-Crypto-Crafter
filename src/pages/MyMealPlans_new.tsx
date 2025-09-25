import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loadUserMealPlans, deleteMealPlan, SavedMealPlan, generateShoppingList, exportToCalendar } from '../lib/mealPlanService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { 
  Calendar, 
  Download, 
  Search, 
  Trash2, 
  ChefHat, 
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  FileDown
} from 'lucide-react';

const MyMealPlans: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMealPlans();
  }, [user]);

  const loadMealPlans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const plans = await loadUserMealPlans(user.uid);
      setMealPlans(plans);
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!user || !confirm('Are you sure you want to delete this meal plan?')) return;
    
    setDeleteLoading(planId);
    try {
      await deleteMealPlan(planId);
      setMealPlans(plans => plans.filter(plan => plan.id !== planId));
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleExportShoppingList = async (plan: SavedMealPlan) => {
    try {
      const ingredients = generateShoppingList(plan.mealPlan);
      const csv = ['Item,Category'].concat(
        ingredients.map(item => `"${item.ingredient}","${item.category}"`)
      ).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name}-shopping-list.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting shopping list:', error);
    }
  };

  const handleExportCalendar = async (plan: SavedMealPlan) => {
    try {
      const icalContent = exportToCalendar(plan.mealPlan, plan.name);
      const blob = new Blob([icalContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name}-meal-schedule.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting calendar:', error);
    }
  };

  const filteredPlans = mealPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: any) => {
    if (!date) return 'Unknown';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const getMealCount = (mealPlan: any) => {
    let count = 0;
    if (mealPlan.breakfast) count++;
    if (mealPlan.lunch) count++;
    if (mealPlan.dinner) count++;
    if (mealPlan.snacks) count++;
    return count;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-gray-400">Please sign in to view your meal plans.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              My Meal Plans
            </h1>
            <p className="text-gray-400 mt-2">Manage and organize your saved meal plans</p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search meal plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Card className="px-4 py-2 bg-gray-800 border-gray-700">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-300">{mealPlans.length} Plans</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Meal Plans Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredPlans.length === 0 ? (
                <Card className="text-center py-12 bg-gray-800 border-gray-700">
                  <CardContent>
                    <ChefHat className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">
                      {searchTerm ? 'No meal plans found' : 'No meal plans yet'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms' 
                        : 'Create your first meal plan to get started!'
                      }
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={() => navigate('/meal-planner')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Create Meal Plan
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPlans.map((plan) => (
                    <Card key={plan.id} className="group hover:shadow-lg transition-all bg-gray-800 border-gray-700">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-100 group-hover:text-orange-400 transition-colors">
                              {plan.name}
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                              Created on {formatDate(plan.createdAt)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                            disabled={deleteLoading === plan.id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            {deleteLoading === plan.id ? (
                              <span className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Meal Plan Stats */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <ChefHat className="w-4 h-4 text-orange-500" />
                            <span>{getMealCount(plan.mealPlan)} meals</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span>₹{plan.mealPlan.totalCost || 0}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{plan.mealPlan.totalNutrition?.calories || 0} cal</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span>1 serving</span>
                          </div>
                        </div>

                        {/* Tags */}
                        {plan.tags && plan.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {plan.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                                {tag}
                              </Badge>
                            ))}
                            {plan.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                                +{plan.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        {plan.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {plan.description}
                          </p>
                        )}

                        <Separator className="bg-gray-700" />

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => {
                              // Navigate to meal plan detail view
                              console.log('View plan:', plan.id);
                            }}
                          >
                            View Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportShoppingList(plan)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExportCalendar(plan)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Quick Actions */}
          {!loading && mealPlans.length > 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Ready for more?</h3>
                    <p className="text-gray-400">Create a new meal plan or explore more features</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate('/meal-planner')}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Create New Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/ai-assistant')}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      AI Assistant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyMealPlans;
