import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Globe, Clock, Moon, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfilePreferences: React.FC = () => {
  const [language, setLanguage] = useState('en-US');
  const [timezone, setTimezone] = useState('America/New_York');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [timeFormat, setTimeFormat] = useState('24H');
  const [theme, setTheme] = useState('LIGHT');
  const [emailNotify, setEmailNotify] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Preferences Updated Successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">System Preferences & Accessibility</h1>
        <p className="text-xs text-[#64748B] mt-1">Locale settings, timezones, date formatting, and exam notification preferences.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Preferred Language</Label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 text-xs font-sans text-[#0F172A]"
              >
                <option value="en-US">English (United States)</option>
                <option value="es-ES">Spanish (Español)</option>
                <option value="zh-CN">Mandarin (Simplified)</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Institutional Timezone</Label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 text-xs font-sans text-[#0F172A]"
              >
                <option value="America/New_York">Eastern Time (US & Canada) - EST</option>
                <option value="America/Los_Angeles">Pacific Time (US & Canada) - PST</option>
                <option value="Europe/London">Greenwich Mean Time - GMT</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-[#0F172A]">Exam Notifications via Email</h4>
              <p className="text-[11px] text-[#64748B]">Receive automated proctor reminders and result scorecards.</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotify}
              onChange={(e) => setEmailNotify(e.target.checked)}
              className="w-4 h-4 rounded text-[#1E40AF]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-6 py-2 rounded-xl">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfilePreferences;
