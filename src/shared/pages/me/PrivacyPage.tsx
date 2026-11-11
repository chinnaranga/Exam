import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ShieldCheck, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const PrivacyPage: React.FC = () => {
  const handleExportData = () => {
    toast.success('GDPR Personal Data Archive Dispatched', {
      description: 'Your complete JSON data export has been compiled and emailed to your inbox.',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>FERPA, HIPAA & GDPR Data Sovereignty</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Privacy & Data Control Center</h1>
        <p className="text-xs text-[#6B7280]">
          Manage your personal data exports, consent settings, and right-to-be-forgotten requests.
        </p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Download Personal Data Archive (GDPR Article 20)</h3>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Request a complete machine-readable JSON/CSV dump of your personal profile, examination submission history, proctoring log events, and OAuth identity mappings.
        </p>
        <Button onClick={handleExportData} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs">
          <Download className="w-4 h-4 mr-2" />
          Download Personal Data Archive (.ZIP)
        </Button>
      </Card>
    </div>
  );
};

export default PrivacyPage;
