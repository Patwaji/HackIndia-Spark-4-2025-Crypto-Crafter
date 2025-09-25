import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  Check
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // User preferences state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile
      await updateUserProfile({ displayName });
      
      // In a real app, you'd save other preferences to Firestore
      // For now, we'll just simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // In a real app, you'd export user data from Firestore
    const userData = {
      profile: {
        email: user?.email,
        displayName: user?.displayName,
        createdAt: user?.metadata?.creationTime,
      },
      preferences: {
        emailNotifications,
        mealReminders,
        weeklyReports,
        theme,
        language,
        currency
      },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nutriplan-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your meal plans, preferences, and data.'
    );
    
    if (confirmed) {
      const doubleConfirmed = window.prompt(
        'To confirm account deletion, please type "DELETE" (in capital letters):'
      );
      
      if (doubleConfirmed === 'DELETE') {
        try {
          // In a real app, you'd delete user data from Firestore and then delete the account
          alert('Account deletion feature would be implemented here. For demo purposes, this is disabled.');
        } catch (error) {
          console.error('Error deleting account:', error);
        }
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-gray-400">Please sign in to access settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Customize your NutriPlan experience</p>
          </div>

          {/* Profile Settings */}
          <Card className="shadow-card bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="bg-gray-700 border-gray-600 text-gray-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>
                <div>
                  <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Account Type</Label>
                  <div className="mt-2">
                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      Free Account
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Email Verified</Label>
                  <div className="mt-2">
                    <Badge variant={user.emailVerified ? "default" : "destructive"}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-card bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-400">
                Choose how you want to be notified about meal plans and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates about your meal plans via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Meal Reminders</Label>
                  <p className="text-sm text-gray-500">
                    Get reminded about upcoming meals and prep times
                  </p>
                </div>
                <Switch
                  checked={mealReminders}
                  onCheckedChange={setMealReminders}
                />
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">
                    Receive weekly nutrition and spending summaries
                  </p>
                </div>
                <Switch
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="shadow-card bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="w-5 h-5" />
                Appearance & Localization
              </CardTitle>
              <CardDescription className="text-gray-400">
                Customize how NutriPlan looks and behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="light" className="text-white hover:bg-gray-600">Light</SelectItem>
                      <SelectItem value="dark" className="text-white hover:bg-gray-600">Dark</SelectItem>
                      <SelectItem value="system" className="text-white hover:bg-gray-600">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="en" className="text-white hover:bg-gray-600">English</SelectItem>
                      <SelectItem value="hi" className="text-white hover:bg-gray-600">हिंदी</SelectItem>
                      <SelectItem value="ta" className="text-white hover:bg-gray-600">தமிழ்</SelectItem>
                      <SelectItem value="te" className="text-white hover:bg-gray-600">తెలుగు</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="INR" className="text-white hover:bg-gray-600">₹ Indian Rupee</SelectItem>
                      <SelectItem value="USD" className="text-white hover:bg-gray-600">$ US Dollar</SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-gray-600">€ Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="shadow-card bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your data and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Export My Data</Label>
                  <p className="text-sm text-gray-500">
                    Download a copy of all your data
                  </p>
                </div>
                <Button variant="outline" onClick={handleExportData} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <Separator className="bg-gray-700" />
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Sign Out</Label>
                  <p className="text-sm text-gray-500">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" onClick={logout} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="shadow-card border-red-600 bg-red-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-300">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-red-400">Delete Account</Label>
                  <p className="text-sm text-red-300">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end items-center gap-4">
            {saved && (
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">Settings saved!</span>
              </div>
            )}
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
