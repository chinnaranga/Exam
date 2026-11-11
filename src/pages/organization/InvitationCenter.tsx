import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InvitationModal from '@/components/organization/InvitationModal';
import { UserPlus, Mail, CheckCircle2, Clock, Trash2, Send, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const InvitationCenter: React.FC = () => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [invitations, setInvitations] = useState([
    { id: 'inv_1', email: 'prof.smith@mit.edu', role: 'FACULTY', status: 'PENDING', sentAt: '2 hours ago', expiresAt: 'in 7 days' },
    { id: 'inv_2', email: 'invigilator.pro@mit.edu', role: 'INVIGILATOR', status: 'PENDING', sentAt: '5 hours ago', expiresAt: 'in 7 days' },
    { id: 'inv_3', email: 'student.leader@mit.edu', role: 'STUDENT', status: 'ACCEPTED', sentAt: '1 day ago', expiresAt: 'Accepted' },
  ]);

  const handleRevoke = (id: string, email: string) => {
    setInvitations((prev) => prev.filter((item) => item.id !== id));
    toast.success(`Invitation Revoked`, {
      description: `Access link for ${email} has been invalidated.`,
    });
  };

  const handleResend = (email: string) => {
    toast.success(`Invitation Resent`, {
      description: `Dispatched fresh security token to ${email}.`,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Organization Invitation Center</h1>
          <p className="text-sm text-gray-400 mt-1">Track pending user access links, bulk invitations, and single role assignments</p>
        </div>

        <Button onClick={() => setIsInviteOpen(true)} className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs py-2 px-4 shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4 mr-2" />
          Dispatch New Invitation
        </Button>
      </div>

      <Card className="glass-card p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-gray-400">
          <span>USER EMAIL</span>
          <span>ASSIGNED ROLE</span>
          <span>STATUS</span>
          <span>EXPIRES</span>
          <span>ACTIONS</span>
        </div>

        <div className="space-y-2">
          {invitations.map((inv) => (
            <div key={inv.id} className="p-3.5 rounded-xl bg-surface-dark/70 border border-white/5 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-white font-semibold">{inv.email}</span>
              </div>

              <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                {inv.role}
              </span>

              <span className={`font-bold ${inv.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {inv.status}
              </span>

              <span className="text-gray-400 text-[11px]">{inv.expiresAt}</span>

              <div className="flex items-center space-x-2">
                {inv.status === 'PENDING' && (
                  <button onClick={() => handleResend(inv.email)} className="p-1.5 rounded hover:bg-white/10 text-blue-400" title="Resend Email">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => handleRevoke(inv.id, inv.email)} className="p-1.5 rounded hover:bg-white/10 text-red-400" title="Revoke Invitation">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <InvitationModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};

export default InvitationCenter;
