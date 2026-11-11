import React from 'react';
import { Card } from '@/components/ui/card';
import { NotificationItem } from '@/types/codingDashboard';
import { Bell, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface Props {
  notifications: NotificationItem[];
  isLoading?: boolean;
}

export const RecentNotificationsPanel: React.FC<Props> = ({ notifications, isLoading = false }) => {
  return (
    <Card className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-purple-600" />
          <h3 className="font-extrabold text-sm text-[#0F172A] uppercase font-mono">
            Section 11: System & Cluster Notifications
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
          LIVE INFRASTRUCTURE ALERTS
        </span>
      </div>

      <div className="space-y-3 font-sans text-xs">
        {isLoading ? (
          <div className="p-4 text-center text-slate-400 font-mono">Loading notifications...</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
              <span className="mt-0.5">
                {notif.type === 'ERROR' ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : notif.type === 'WARNING' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                ) : notif.type === 'SUCCESS' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600" />
                )}
              </span>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0F172A]">{notif.title}</h4>
                  <span className="text-[10px] font-mono text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentNotificationsPanel;
