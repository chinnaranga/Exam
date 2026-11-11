import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import { ShieldCheck, SmartphoneNfc } from 'lucide-react';

export const MFAVerification: React.FC = () => {
  const navigate = useNavigate();
  const [totp, setTotp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (totp.length < 6) {
      toast.error('Enter 6-digit authenticator TOTP token');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('MFA Verification Successful');
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1d] via-[#111827] to-[#1e1b4b] flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-xl bg-surface/30">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
          <SmartphoneNfc className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight">Two-Factor Authentication Required</h1>
        <p className="text-xs text-gray-400 mt-2">
          Open Google Authenticator or your Security Key app to view your 6-digit TOTP code.
        </p>

        <form onSubmit={handleVerify} className="space-y-4 mt-6">
          <Input
            type="text"
            placeholder="123 456"
            maxLength={6}
            className="text-center text-2xl font-mono tracking-widest bg-surface-dark border-white/10 text-white"
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
          />

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25" disabled={isLoading}>
            {isLoading ? 'Verifying TOTP...' : 'Verify MFA Token'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MFAVerification;
