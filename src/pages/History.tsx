import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loadUserMealPlans, generateShoppingList, exportToCalendar } from '../lib/mealPlanService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Calendar, 
  Search, 
  ChefHat, 
  Clock,
  Users,
  DollarSign,
  ShoppingCart,
  FileDown,
  Filter,
  History as HistoryIcon
} from 'lucide-react';
import type { SavedMealPlan } from '../lib/mealPlanService';
import type { MealPlan } from '../lib/gemini';

const History: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'cost'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'this_week' | 'this_month' | 'this_year'>('all');

  const loadHistory = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const plans = await loadUserMealPlans(user.uid, 100); // Load more for history
      setMealPlans(plans);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

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

  const getFilteredPlans = () => {
    let filtered = mealPlans;

    // Filter by time period
    const now = new Date();
    switch (filterBy) {
      case 'this_week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(plan => {
          const planDate = plan.createdAt instanceof Date ? plan.createdAt : new Date(plan.createdAt);
          return planDate >= weekAgo;
        });
        break;
      }
      case 'this_month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(plan => {
          const planDate = plan.createdAt instanceof Date ? plan.createdAt : new Date(plan.createdAt);
          return planDate >= monthAgo;
        });
        break;
      }
      case 'this_year': {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(plan => {
          const planDate = plan.createdAt instanceof Date ? plan.createdAt : new Date(plan.createdAt);
          return planDate >= yearAgo;
        });
        break;
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'cost':
        filtered.sort((a, b) => b.mealPlan.totalCost - a.mealPlan.totalCost);
        break;
      case 'date':
      default:
        filtered.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }

    return filtered;
  };

  const filteredPlans = getFilteredPlans();

  const formatDate = (date: Date | { toDate: () => Date }) => {
    if (!date) return 'Unknown';
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString();
  };

  const getRelativeTime = (date: Date | { toDate: () => Date }) => {
    if (!date) return 'Unknown';
    const d = date instanceof Date ? date : date.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2629746) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2629746)} months ago`;
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
            <p className="text-gray-400">Please sign in to view your history.</p>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Meal Plan History
            </h1>
            <p className="text-gray-400 mt-2">All your meal planning journey in one place</p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your meal plan history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-300 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterBy} onValueChange={(value: 'all' | 'this_week' | 'this_month' | 'this_year') => setFilterBy(value)}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all" className="text-gray-300 hover:bg-gray-700">All Time</SelectItem>
                  <SelectItem value="this_week" className="text-gray-300 hover:bg-gray-700">This Week</SelectItem>
                  <SelectItem value="this_month" className="text-gray-300 hover:bg-gray-700">This Month</SelectItem>
                  <SelectItem value="this_year" className="text-gray-300 hover:bg-gray-700">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'cost') => setSortBy(value)}>
                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="date" className="text-gray-300 hover:bg-gray-700">Date</SelectItem>
                  <SelectItem value="name" className="text-gray-300 hover:bg-gray-700">Name</SelectItem>
                  <SelectItem value="cost" className="text-gray-300 hover:bg-gray-700">Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="px-4 py-2 bg-gray-800 border-gray-700">
              <div className="flex items-center gap-2">
                <HistoryIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-300">{filteredPlans.length} Plans</span>
              </div>
            </Card>
          </div>

          {/* History Timeline */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <Card className="text-center py-12 bg-gray-800 border-gray-700">
              <CardContent>
                <HistoryIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-300">
                  {searchTerm || filterBy !== 'all' ? 'No plans found' : 'No meal plan history yet'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm || filterBy !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start creating meal plans to build your history!'
                  }
                </p>
                {!searchTerm && filterBy === 'all' && (
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
            <div className="space-y-4">
              {filteredPlans.map((plan, index) => (
                <Card key={plan.id} className="shadow-lg hover:shadow-xl transition-all group bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Plan Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-gray-600">
                          <ChefHat className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>

                      {/* Plan Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100 truncate">
                              {plan.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {getRelativeTime(plan.createdAt)} • {formatDate(plan.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300 border-gray-600">
                              {getMealCount(plan.mealPlan)} meals
                            </Badge>
                            {plan.isFavorite && (
                              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                                Favorite
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ₹{plan.mealPlan.totalCost.toFixed(0)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {plan.mealPlan.totalNutrition.calories} cal
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {getMealCount(plan.mealPlan)} meals
                          </div>
                        </div>

                        {/* Tags */}
                        {plan.tags && plan.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {plan.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {plan.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                +{plan.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportShoppingList(plan)}
                            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Shopping List
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportCalendar(plan)}
                            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <FileDown className="w-3 h-3 mr-1" />
                            Calendar
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            onClick={() => {
                              const planData = encodeURIComponent(JSON.stringify(plan.mealPlan));
                              navigate(`/meal-planner?plan=${planData}`);
                            }}
                          >
                            Use Again
                          </Button>
                        </div>
                      </div>
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

export default History;
