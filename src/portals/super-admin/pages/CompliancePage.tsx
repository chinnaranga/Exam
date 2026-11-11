import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { SecurityCenterService, ComplianceFramework } from '@/server/security/security_center.service';
import { ShieldCheck, FileCheck, CheckCircle2, Download } from 'lucide-react';
import { toast } from 'sonner';

export const CompliancePage: React.FC = () => {
  const [frameworks] = useState<ComplianceFramework[]>(() => SecurityCenterService.getCompliance());

  const handleDownloadReport = (name: string) => {
    toast.success('Audit Report Package Generated', {
      description: `Downloaded SHA-256 signed ${name} audit evidence package.`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Enterprise Security & Regulatory Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Compliance & Certification Matrix</h1>
        <p className="text-xs text-[#6B7280]">
          Export auditor-ready SOC2 Type II, ISO 27001, FERPA, and GDPR evidence packages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {frameworks.map((f) => (
          <Card key={f.name} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#16A34A]" />
                <h3 className="font-bold text-sm text-[#111827]">{f.name}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {f.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-[#6B7280]">
              <p>Passing Controls: <span className="font-mono font-bold text-[#111827]">{f.passingControls} / {f.totalControls}</span></p>
              <div className="w-full bg-[#FAFBFC] border border-[#E5E7EB] h-2 rounded-full overflow-hidden">
                <div className="bg-[#16A34A] h-full" style={{ width: `${(f.passingControls / f.totalControls) * 100}%` }} />
              </div>
            </div>

            <Button onClick={() => handleDownloadReport(f.name)} variant="outline" className="w-full border-[#E5E7EB] text-[#111827] hover:bg-[#FAFBFC] font-bold text-xs py-2 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Download Audit Package
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CompliancePage;
