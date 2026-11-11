import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from "@/shared/services/authService";
import { toast } from 'sonner';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Reset Instructions Sent', {
        description: `Check your inbox at ${email} for password recovery instructions.`,
      });
    } catch (err: any) {
      toast.error('Request Failed', { description: err.message });
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

        {isSubmitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Reset Email Dispatched</h2>
            <p className="text-sm text-gray-400">
              We have sent a secure password reset link to <span className="text-primary font-mono">{email}</span>. Please verify your inbox.
            </p>
            <Button variant="outline" className="w-full mt-4" onClick={() => setIsSubmitted(false)}>
              Resend Reset Link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Recover Password</h2>
              <p className="text-sm text-gray-400 mt-1">Enter your institutional email to receive a recovery token</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-gray-300 text-xs uppercase font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu"
                  className="pl-10 bg-surface-dark border-white/10 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25 mt-2" disabled={isLoading}>
              {isLoading ? 'Processing Request...' : 'Send Recovery Link'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
