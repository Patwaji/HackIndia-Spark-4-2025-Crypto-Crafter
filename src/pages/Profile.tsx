import React, { useState } from 'react';
import { User as FirebaseUser, UserInfo } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { User, Mail, Calendar, Settings } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile({ displayName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberSince = (user: FirebaseUser) => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString();
    }
    return 'Recently';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-8">
            <p className="text-gray-400">Please sign in to view your profile.</p>
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
              My Profile
            </h1>
            <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Profile Card */}
          <Card className="shadow-card bg-gray-800 border-gray-700">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    {getInitials(user.displayName || user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl text-white">
                {user.displayName || 'Welcome, User!'}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-gray-700 border-gray-600 text-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    ) : (
                      <Input
                        id="displayName"
                        value={user.displayName || 'Not set'}
                        disabled
                        className="bg-gray-700 border-gray-600 text-gray-300"
                      />
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Account Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Account Type</Label>
                    <div className="mt-1">
                      <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        Free Account
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Member Since</Label>
                    <p className="text-sm text-gray-400 mt-1">
                      {getMemberSince(user)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Sign-in Method</Label>
                    <div className="mt-1">
                      {user.providerData?.map((provider: UserInfo, index: number) => (
                        <Badge key={index} variant="outline" className="mr-2 border-gray-600 text-gray-300">
                          {provider.providerId === 'google.com' ? 'Google' : 'Email'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Email Verified</Label>
                    <div className="mt-1">
                      <Badge variant={user.emailVerified ? "default" : "destructive"}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-700" />

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </h3>
                  <p className="text-sm text-gray-400">
                    Update your profile information
                  </p>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(user.displayName || '');
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
