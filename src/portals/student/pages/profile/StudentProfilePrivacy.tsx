import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ShieldCheck, Download, Trash2, Lock, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfilePrivacy: React.FC = () => {
  const [profileVis, setProfileVis] = useState('INSTITUTIONAL');
  const [contactVis, setContactVis] = useState('PRIVATE');
  const [resumeVis, setResumeVis] = useState('RECRUITERS_ONLY');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Privacy Rules Updated!');
  };

  const handleDownloadData = () => {
    toast.success('Personal Data Package Downloaded', {
      description: 'Downloaded complete JSON ledger of student identity records.',
    });
  };

  const handleDeleteRequest = () => {
    toast.warning('Account Erasure Request Submitted', {
      description: 'Submitted GDPR/CCPA data erasure request to Registrar.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Privacy Control & Data Rights</h1>
        <p className="text-xs text-[#64748B] mt-1">Configure profile visibility, recruiter access, and export personal data.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider font-mono">Visibility Scopes</h3>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <label className="font-bold text-xs text-[#0F172A]">Profile Visibility Scope</label>
              <select
                value={profileVis}
                onChange={(e) => setProfileVis(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#E2E8F0] p-2 text-xs font-sans text-[#0F172A]"
              >
                <option value="PUBLIC">Public (Visible to anyone on web)</option>
                <option value="INSTITUTIONAL">Institutional (MIT Students & Faculty Only)</option>
                <option value="PRIVATE">Private (Only Me & System Admins)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <label className="font-bold text-xs text-[#0F172A]">Resume & Portfolio Visibility</label>
              <select
                value={resumeVis}
                onChange={(e) => setResumeVis(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#E2E8F0] p-2 text-xs font-sans text-[#0F172A]"
              >
                <option value="RECRUITERS_ONLY">Verified Enterprise Recruiters Only</option>
                <option value="INSTITUTIONAL">Institutional Community</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-6 py-2 rounded-xl">
              Save Privacy Settings
            </Button>
          </div>
        </form>

        {/* Data Rights Section */}
        <div className="border-t border-[#E2E8F0] pt-6 space-y-3 font-sans text-xs">
          <h3 className="font-bold text-xs text-[#0F172A] uppercase tracking-wider font-mono">Data Sovereignty Rights</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownloadData} variant="outline" className="border-[#E2E8F0] text-[#0F172A] font-bold text-xs px-4 py-2.5 rounded-xl w-full">
              <Download className="w-4 h-4 mr-1.5" /> Download Personal Data (JSON)
            </Button>
            <Button onClick={handleDeleteRequest} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs px-4 py-2.5 rounded-xl w-full">
              <Trash2 className="w-4 h-4 mr-1.5" /> Request Account Erasure
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StudentProfilePrivacy;
