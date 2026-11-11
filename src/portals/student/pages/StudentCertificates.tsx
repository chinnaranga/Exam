import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Award, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export const StudentCertificates: React.FC = () => {
  const certificates: any[] = [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Digital Credentials & SHA-256 Certificates</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Cryptographically signed digital badges issued by certified examination boards.
        </p>
      </div>

      {certificates.length === 0 ? (
        <Card className="p-12 text-center text-slate-500 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <Award className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="font-extrabold text-base text-[#0F172A]">No Digital Credentials Issued</h3>
          <p className="text-xs text-[#64748B]">You currently have no verified certificates or digital credentials issued.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {certificates.map((cert, idx) => (
            <Card key={idx} className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#1E40AF]">{cert.code}</span>
                  <h3 className="font-bold text-base text-[#0F172A]">{cert.title}</h3>
                  <p className="text-xs text-[#64748B]">{cert.issuer}</p>
                </div>
                <Award className="w-8 h-8 text-[#15803D]" />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button onClick={() => toast.success('Certificate Downloaded')} variant="outline" className="border-[#E2E8F0] text-xs font-bold w-full">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
                </Button>
                <Button onClick={() => toast.success('LinkedIn Badge Shared')} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold w-full">
                  <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share LinkedIn
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCertificates;
