import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfileContact: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Contact & Residential Information</h1>
        <p className="text-xs text-[#64748B] mt-1">Official communication emails, phone numbers, and verified addresses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 font-bold text-sm text-[#0F172A]">
            <MapPin className="w-4 h-4 text-[#1E40AF]" />
            <span>Current Campus Address</span>
          </div>
          <p className="font-bold text-xs text-[#0F172A]">77 Massachusetts Avenue, Random Hall 410</p>
          <p className="text-[#64748B] font-mono">Cambridge, MA 02139 • United States</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-[#E2E8F0] pb-2 font-bold text-sm text-[#0F172A]">
            <MapPin className="w-4 h-4 text-purple-700" />
            <span>Permanent Residence</span>
          </div>
          <p className="font-bold text-xs text-[#0F172A]">450 Beacon Street, Apt 3B</p>
          <p className="text-[#64748B] font-mono">Boston, MA 02115 • United States</p>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfileContact;
