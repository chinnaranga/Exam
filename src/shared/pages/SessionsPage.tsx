import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeviceSessionService, ActiveSession } from '@/server/auth/services/device_session.service';
import { Monitor, Smartphone, ShieldAlert, LogOut, CheckCircle2, Globe, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const SessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>(() => DeviceSessionService.getActiveSessions('user-01'));

  const handleRevokeSession = (id: string, deviceName: string) => {
    DeviceSessionService.revokeSession(id);
    setSessions(DeviceSessionService.getActiveSessions('user-01'));
    toast.success(`Session Revoked`, {
      description: `Logged out of ${deviceName}.`,
    });
  };

  const handleRevokeAll = () => {
    const revokedCount = DeviceSessionService.revokeAllSessions('user-01', 'sess-01');
    setSessions(DeviceSessionService.getActiveSessions('user-01'));
    toast.success(`All Remote Sessions Revoked`, {
      description: `Terminated ${revokedCount} active concurrent session(s).`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
            <Monitor className="w-3.5 h-3.5" />
            <span>Entra ID Concurrent Session Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Active Concurrent Sessions</h1>
          <p className="text-xs text-[#6B7280]">
            Manage all active browser and device sessions authenticated with your enterprise principal ID.
          </p>
        </div>

        <Button
          onClick={handleRevokeAll}
          variant="outline"
          className="border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs px-4 py-2 rounded-xl shrink-0"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Revoke All Other Sessions
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((sess) => (
          <Card key={sess.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] text-[#2563EB]">
                {sess.deviceName.includes('iPhone') ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-sans">
                  <h3 className="font-bold text-sm text-[#111827]">{sess.deviceName}</h3>
                  {sess.isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      THIS DEVICE
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6B7280]">
                  <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1" /> IP: {sess.ipAddress}</span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Last Active: {new Date(sess.lastActiveAt).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {!sess.isCurrent && (
              <Button
                onClick={() => handleRevokeSession(sess.id, sess.deviceName)}
                variant="outline"
                className="border-[#E5E7EB] text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Revoke Session
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionsPage;
