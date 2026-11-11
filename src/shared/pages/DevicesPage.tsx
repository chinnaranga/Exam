import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Switch } from '@/shared/components/ui/switch';
import { DeviceSessionService, UserDevice } from '@/server/auth/services/device_session.service';
import { ShieldCheck, ShieldAlert, Laptop, Smartphone, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<UserDevice[]>(() => DeviceSessionService.getUserDevices('user-01'));

  const handleToggleTrust = (id: string, currentTrust: boolean) => {
    const updated = DeviceSessionService.toggleDeviceTrust(id, !currentTrust);
    setDevices(DeviceSessionService.getUserDevices('user-01'));
    toast.success(`Device Trust Updated`, {
      description: `${updated?.deviceName} status changed to ${!currentTrust ? 'TRUSTED' : 'UNTRUSTED'}.`,
    });
  };

  const handleRevokeDevice = (id: string, name: string) => {
    DeviceSessionService.revokeDevice(id);
    setDevices(DeviceSessionService.getUserDevices('user-01'));
    toast.success(`Device Revoked`, {
      description: `Removed fingerprint for ${name}. Step-up MFA will be required on future logins.`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Device Risk Engine & Fingerprinting</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Recognized Enterprise Devices</h1>
        <p className="text-xs text-[#6B7280]">
          Hardware device fingerprints registered to your identity. Trusted devices bypass step-up MFA challenges.
        </p>
      </div>

      <div className="space-y-4">
        {devices.map((dev) => (
          <Card key={dev.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] text-[#2563EB]">
                {dev.deviceName.includes('iPhone') ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-sans">
                  <h3 className="font-bold text-sm text-[#111827]">{dev.deviceName}</h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    dev.isTrusted ? 'bg-emerald-50 text-[#16A34A] border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {dev.isTrusted ? 'TRUSTED DEVICE' : 'UNTRUSTED'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B7280]">
                  <span>Fingerprint: <code className="text-[#111827] font-bold">{dev.fingerprintHash}</code></span>
                  <span>Risk Score: <code className="text-[#16A34A] font-bold">{dev.riskScore} (Low)</code></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#6B7280]">Trust Device</span>
                <Switch checked={dev.isTrusted} onCheckedChange={() => handleToggleTrust(dev.id, dev.isTrusted)} />
              </div>

              <Button
                onClick={() => handleRevokeDevice(dev.id, dev.deviceName)}
                variant="outline"
                className="border-[#E5E7EB] text-red-600 hover:bg-red-50 text-xs font-bold p-2 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DevicesPage;
