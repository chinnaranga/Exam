import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { authService } from "@/shared/services/authService";
import { toast } from 'sonner';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword('mock_token', password);
      toast.success('Password Reset Complete', { description: 'You can now sign in with your new credentials.' });
      navigate('/auth/login');
    } catch (err: any) {
      toast.error('Reset Failed', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-8 max-w-md w-full shadow-2xl backdrop-blur-xl bg-surface/30">
        <Link to="/auth/login" className="inline-flex items-center text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Login
        </Link>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Set New Password</h2>
          <p className="text-sm text-gray-400 mt-1">Ensure your new password contains at least 8 characters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pass" className="text-gray-300 text-xs uppercase font-medium">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="pass"
                type="password"
                placeholder="••••••••••••"
                className="pl-10 bg-surface-dark border-white/10 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPass" className="text-gray-300 text-xs uppercase font-medium">Confirm New Password</Label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPass"
                type="password"
                placeholder="••••••••••••"
                className="pl-10 bg-surface-dark border-white/10 text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25 mt-2" disabled={isLoading}>
            {isLoading ? 'Updating Password...' : 'Reset Master Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
