import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrganizationStore } from '@/stores/organizationStore';
import { toast } from 'sonner';
import { Settings, ShieldCheck, Clock, Globe, Lock, Save } from 'lucide-react';

export const WorkspaceSettings: React.FC = () => {
  const { workspace, updateWorkspace } = useOrganizationStore();
  const [workspaceName, setWorkspaceName] = useState(workspace?.workspaceName || 'MIT Enterprise Assessment Hub');
  const [timezone, setTimezone] = useState(workspace?.timezone || 'America/New_York');
  const [dateFormat, setDateFormat] = useState(workspace?.dateFormat || 'YYYY-MM-DD');
  const [mfaRequired, setMfaRequired] = useState(workspace?.mfaPolicyRequired ?? true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkspace({
      workspaceName,
      timezone,
      dateFormat,
      mfaPolicyRequired: mfaRequired,
    });
    toast.success('Workspace Settings Saved', {
      description: 'Enterprise localization, MFA enforcement & timezone parameters updated.',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Workspace Administration & Security</h1>
        <p className="text-sm text-gray-400 mt-1">Configure workspace defaults, localization, MFA enforcement policies, and audit retention</p>
      </div>

      <Card className="glass-card p-6 border-white/10 space-y-6">
        <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">General Workspace Parameters</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs text-gray-300 uppercase font-medium">Workspace Title</Label>
            <Input
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="bg-surface-dark border-white/10 text-white font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-300 uppercase font-medium">Default Timezone</Label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface-dark border border-white/10 text-white text-xs"
              >
                <option value="America/New_York">Eastern Time (America/New_York)</option>
                <option value="America/Chicago">Central Time (America/Chicago)</option>
                <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
                <option value="Europe/London">Greenwich Mean Time (Europe/London)</option>
                <option value="Asia/Tokyo">Japan Standard Time (Asia/Tokyo)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-300 uppercase font-medium">Date Display Format</Label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface-dark border border-white/10 text-white text-xs"
              >
                <option value="YYYY-MM-DD">ISO Standard (YYYY-MM-DD)</option>
                <option value="MM/DD/YYYY">US Standard (MM/DD/YYYY)</option>
                <option value="DD/MM/YYYY">UK/EU Standard (DD/MM/YYYY)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-dark border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-white font-bold text-xs">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Enforce Mandatory MFA for All Faculty & Admin Roles</span>
              </div>
              <p className="text-[11px] text-gray-400">Require TOTP or WebAuthn authenticator app validation on every login attempt.</p>
            </div>

            <input
              type="checkbox"
              checked={mfaRequired}
              onChange={(e) => setMfaRequired(e.target.checked)}
              className="w-5 h-5 rounded bg-surface border-white/20 text-primary focus:ring-0 cursor-pointer"
            />
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold shadow-lg shadow-primary/25">
            <Save className="w-4 h-4 mr-2" />
            Save Workspace Configuration
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default WorkspaceSettings;
