import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SystemRole } from "@/shared/types/auth";
import { toast } from 'sonner';
import { Mail, UserPlus, Upload, FileSpreadsheet, CheckCircle2, X } from 'lucide-react';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'single' | 'bulk'>('single');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<SystemRole>('FACULTY');
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Invitation Dispatched Successfully', {
        description: `Secure link sent to ${email} as role ${role}`,
      });
      setEmail('');
      onClose();
    }, 600);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText) {
      toast.error('Paste CSV content or enter emails');
      return;
    }

    const lines = csvText.split('\n').filter(Boolean);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Bulk Invitation Processing Complete`, {
        description: `Dispatched ${lines.length} invitation tokens.`,
      });
      setCsvText('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="glass-card border-white/10 p-6 max-w-lg w-full space-y-6 shadow-2xl backdrop-blur-xl bg-surface/90">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Invite Organization Users</h2>
              <p className="text-xs text-gray-400">Dispatch secure single or bulk CSV access invitations</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-surface-dark p-1 rounded-xl border border-white/5 text-xs font-semibold">
          <button
            onClick={() => setTab('single')}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'single' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Single User Invite
          </button>
          <button
            onClick={() => setTab('bulk')}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'bulk' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Bulk CSV Upload
          </button>
        </div>

        {tab === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 uppercase font-medium">User Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="professor@university.edu"
                  className="pl-10 bg-surface-dark border-white/10 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 uppercase font-medium">Assigned System Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as SystemRole)}
                className="w-full h-10 px-3 rounded-md bg-surface-dark border border-white/10 text-white text-xs"
              >
                <option value="FACULTY">Faculty / Professor</option>
                <option value="INVIGILATOR">Live Invigilator / Proctor</option>
                <option value="EXAM_CREATOR">Item Author / Exam Creator</option>
                <option value="REVIEWER">Reviewer / Evaluator</option>
                <option value="STUDENT">Candidate / Student</option>
                <option value="CAMPUS_ADMIN">Campus Administrator</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25" disabled={isLoading}>
              {isLoading ? 'Dispatching Invitation...' : 'Send Secure Invitation Link'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 uppercase font-medium">Paste CSV Lines (email, role)</Label>
              <textarea
                rows={5}
                placeholder={`john.doe@mit.edu,FACULTY\nalex.smith@mit.edu,STUDENT\nproctor@mit.edu,INVIGILATOR`}
                className="w-full p-3 rounded-lg bg-surface-dark border border-white/10 text-white font-mono text-xs focus:border-primary"
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 shadow-lg shadow-primary/25" disabled={isLoading}>
              {isLoading ? 'Processing CSV...' : 'Process Bulk Invitations'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default InvitationModal;
