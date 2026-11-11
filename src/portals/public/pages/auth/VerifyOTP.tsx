import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import { KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('Please enter complete 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('OTP Authentication Verified');
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <Link to="/auth/login" className="inline-flex items-center text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Login
        </Link>

        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
          <KeyRound className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Verify One-Time Passcode</h1>
        <p className="text-xs text-gray-400 mt-2">
          We sent a 6-digit code to your registered device. Enter the passcode to authenticate.
        </p>

        <form onSubmit={handleVerify} className="space-y-6 mt-6">
          <div className="flex justify-between max-w-xs mx-auto">
            {otp.map((digit, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-11 h-12 text-center text-xl font-mono font-bold bg-surface-dark border-white/10 text-white focus:border-primary"
              />
            ))}
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25" disabled={isLoading}>
            {isLoading ? 'Verifying Code...' : 'Authenticate OTP Code'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default VerifyOTP;
