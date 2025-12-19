import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Shield,
  Palette,
  Bell,
  Save,
  Settings as SettingsIcon
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="h-full bg-[hsl(var(--main-bg))] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-accent/10 rounded-lg hidden">
            <SettingsIcon className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
              Settings
            </h1>
            <p className="text-sm text-body">
              Manage your account preferences and system configuration
            </p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="court-card border-none shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-headings text-lg">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-white">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="border-borders">Change Avatar</Button>
                    <p className="text-xs text-body mt-1">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-headings">Full Name</Label>
                    <Input id="name" defaultValue={user?.username} className="border-borders" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-headings">Email</Label>
                    <Input id="email" type="email" defaultValue="user@court.gov" className="border-borders" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-headings">Role</Label>
                    <Input id="role" value={user?.role} disabled className="capitalize border-borders" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department" className="text-headings">Department</Label>
                    <Input id="department" defaultValue="Criminal Division" className="border-borders" />
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="court-card border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-headings text-lg">Change Password</CardTitle>
                    <CardDescription>Update your password regularly for security</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password" className="text-headings">Current Password</Label>
                    <Input id="current-password" type="password" className="border-borders" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-password" className="text-headings">New Password</Label>
                    <Input id="new-password" type="password" className="border-borders" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password" className="text-headings">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="border-borders" />
                  </div>
                  <Button className="w-full">Update Password</Button>
                </CardContent>
              </Card>

              <Card className="court-card border-none shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-headings text-lg">Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-headings">Enable 2FA</p>
                      <p className="text-sm text-body">Require authentication code on login</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme">
            <Card className="court-card border-none shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Palette className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-headings text-lg">Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your interface</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-headings">Dark Mode</p>
                      <p className="text-sm text-body">Switch between light and dark themes</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-headings">Theme Color</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-borders">
                        <div className="w-8 h-8 rounded-full bg-accent mb-2" />
                        <span className="text-xs">Default</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-borders">
                        <div className="w-8 h-8 rounded-full bg-blue-500 mb-2" />
                        <span className="text-xs">Blue</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-borders">
                        <div className="w-8 h-8 rounded-full bg-purple-500 mb-2" />
                        <span className="text-xs">Purple</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-headings">Compact Mode</p>
                      <p className="text-sm text-body">Reduce spacing for more content</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="court-card border-none shadow-md">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                <div className="p-3 bg-amber-50 rounded-xl">
                  <Bell className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-headings text-lg">Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-headings">Email Notifications</p>
                    <p className="text-sm text-body">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-headings">Case Updates</p>
                    <p className="text-sm text-body">Notify about case status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-headings">Document Approvals</p>
                    <p className="text-sm text-body">Notify when documents need review</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-headings">AI Suggestions</p>
                    <p className="text-sm text-body">Receive AI-powered recommendations</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-headings">System Maintenance</p>
                    <p className="text-sm text-body">Important system updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
