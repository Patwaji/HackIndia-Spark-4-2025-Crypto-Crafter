import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getFavoriteMealPlans, toggleFavorite, generateShoppingList, exportToCalendar } from '../lib/mealPlanService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { 
  Calendar, 
  Download, 
  Search, 
  Heart, 
  ChefHat, 
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  FileDown,
  HeartOff
} from 'lucide-react';
import type { SavedMealPlan } from '../lib/mealPlanService';
import type { MealPlan } from '../lib/gemini';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const plans = await getFavoriteMealPlans(user.uid);
      setFavorites(plans);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = async (planId: string) => {
    if (!user) return;
    
    setToggleLoading(planId);
    try {
      await toggleFavorite(planId);
      // Remove from favorites list since it's no longer a favorite
      setFavorites(favs => favs.filter(fav => fav.id !== planId));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setToggleLoading(null);
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

  const filteredFavorites = favorites.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.tags?.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | { toDate: () => Date }) => {
    if (!date) return 'Unknown';
    const d = typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date);
    return d.toLocaleDateString();
  };

  const getMealCount = (mealPlan: MealPlan) => {
    let count = 0;
    if (mealPlan.breakfast) count++;
    if (mealPlan.lunch) count++;
    if (mealPlan.dinner) count++;
    if (mealPlan.snack) count++;
    return count;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-gray-400">Please sign in to view your favorites.</p>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Favorite Meal Plans
            </h1>
            <p className="text-gray-400 mt-2">Your most loved meal plans, ready to cook again</p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search favorite plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Card className="px-4 py-2 bg-gray-800 border-gray-700">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="text-sm font-medium text-gray-300">{favorites.length} Favorites</span>
                </div>
              </Card>
            </div>
          </div>

          {/* Favorites Grid */}
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
                      <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredFavorites.length === 0 ? (
            <Card className="text-center py-12 bg-gray-800 border-gray-700">
              <CardContent>
                <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  {searchTerm ? 'No matching favorites found' : 'No favorites yet'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start favoriting meal plans you love!'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => navigate('/my-meal-plans')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Browse My Plans
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((plan) => (
                <Card key={plan.id} className="shadow-lg hover:shadow-xl transition-shadow bg-gray-800 border-gray-700 border-red-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <span className="text-lg text-gray-100">{plan.name}</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500 fill-current" />
                        <Badge variant="secondary" className="ml-1 bg-gray-700 text-gray-300 border-gray-600">
                          {getMealCount(plan.mealPlan)} meals
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Created {formatDate(plan.createdAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Plan Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        ₹{plan.mealPlan.totalCost.toFixed(0)} total cost
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        {plan.mealPlan.totalNutrition.calories} calories
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        Last updated {formatDate(plan.updatedAt)}
                      </div>
                    </div>

                    {/* Tags */}
                    {plan.tags && plan.tags.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {plan.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                          {plan.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                              +{plan.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator className="bg-gray-700" />

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportShoppingList(plan)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Shopping List
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportCalendar(plan)}
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Calendar
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        onClick={() => {
                          // Navigate to meal planner with this plan loaded
                          const planData = encodeURIComponent(JSON.stringify(plan.mealPlan));
                          navigate(`/meal-planner?plan=${planData}`);
                        }}
                      >
                        Cook Again
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFavorite(plan.id!)}
                        disabled={toggleLoading === plan.id}
                        className="border-red-600 text-red-400 hover:bg-red-500/10"
                      >
                        {toggleLoading === plan.id ? (
                          <span className="w-4 h-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        ) : (
                          <HeartOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
