
import { Card } from "@/components/ui/card";
import { Bell, Eye, Lock, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Receive exam and result updates via email</p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <div>
                <h3 className="font-medium">Browser Notifications</h3>
                <p className="text-sm text-gray-400">Get notifications in your browser</p>
              </div>
              <Switch 
                checked={browserNotifications} 
                onCheckedChange={setBrowserNotifications} 
              />
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Switch 
                checked={twoFactorAuth} 
                onCheckedChange={setTwoFactorAuth} 
              />
            </div>
            
            <Button variant="outline" className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
        </Card>
        
        <Card className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UserCog className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Account Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-dark rounded-lg">
              <div>
                <h3 className="font-medium">Profile Visibility</h3>
                <p className="text-sm text-gray-400">Control who can see your profile and results</p>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Manage
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
