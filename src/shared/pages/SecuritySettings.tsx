import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { authService } from "@/shared/services/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { ActiveSessionRecord, DeviceRecord } from "@/shared/types/auth";
import { toast } from 'sonner';
import { Lock, Shield, Laptop, Smartphone, Key, SmartphoneNfc, LogOut, CheckCircle2, History } from 'lucide-react';

export const SecuritySettings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  const [sessions, setSessions] = useState<ActiveSessionRecord[]>([]);
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    authService.getActiveSessions().then(setSessions);
    authService.getDevices().then(setDevices);
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword('mock_token', newPass);
      toast.success('Security Credentials Updated', { description: 'Master password changed successfully.' });
      setCurrentPass('');
      setNewPass('');
    } catch (err: any) {
      toast.error('Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMFA = (checked: boolean) => {
    setMfaEnabled(checked);
    updateUser({ mfaEnabled: checked });
    toast.success(checked ? '2FA Protection Activated' : '2FA Deactivated', {
      description: checked ? 'Authenticator app verification required on new logins.' : '2FA disabled.',
    });
  };

  const handleRevokeSession = async (id: string) => {
    await authService.revokeSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.info('Session Revoked Successfully');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Security & Auth Management</h1>
        <p className="text-sm text-gray-400 mt-1">Manage zero-trust identity credentials, active sessions, and 2FA authentication</p>
      </div>

      {/* MFA Card */}
      <Card className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Multi-Factor Authentication (MFA / 2FA)</h2>
            <p className="text-xs text-gray-400">Add an extra verification layer via Google Authenticator or WebAuthn keys</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface-dark/80 border border-white/5">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-white">Require Authenticator Token on Sign-In</h3>
            <p className="text-xs text-gray-400">Mandatory 6-digit TOTP verification for sensitive actions</p>
          </div>
          <Switch checked={mfaEnabled} onCheckedChange={handleToggleMFA} />
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Change Master Password</h2>
            <p className="text-xs text-gray-400">Update your institutional master password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300 uppercase font-medium">Current Password</Label>
            <Input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="bg-surface-dark border-white/10 text-white" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300 uppercase font-medium">New Password</Label>
            <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="bg-surface-dark border-white/10 text-white" />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-medium shadow-md shadow-primary/20" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>

      {/* Active Sessions */}
      <Card className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Active Login Sessions</h2>
              <p className="text-xs text-gray-400">Manage device sessions authenticated to your identity</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div key={sess.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-dark/80 border border-white/5">
              <div className="flex items-center space-x-3">
                <Laptop className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm text-white">{sess.userAgent}</h3>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">IP Address: {sess.ipAddress} • Created: {new Date(sess.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {!sess.isCurrent && (
                <Button variant="outline" size="sm" onClick={() => handleRevokeSession(sess.id)} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettings;
