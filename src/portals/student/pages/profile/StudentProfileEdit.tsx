import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Upload, Camera, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfileEdit: React.FC = () => {
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop');
  const [preferredName, setPreferredName] = useState('Ellie');
  const [biography, setBiography] = useState('Computer Science undergraduate concentrating in Distributed Systems and LLM Acceleration.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile Updates Saved Successfully!');
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    toast.info('Avatar Removed');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#0F172A]">
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Edit Student Profile & Photo</h1>
        <p className="text-xs text-[#64748B] mt-1">Upload profile avatar, image crop, compression, and identity attributes.</p>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 border-b border-[#E2E8F0] pb-6">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-2xl object-cover border-2 border-[#E2E8F0]" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 font-mono text-xs">
                No Photo
              </div>
            )}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-bold text-xs text-[#0F172A]">Student Identity Photo</h3>
            <p className="text-[11px] text-[#64748B]">JPEG, PNG, WebP up to 5MB. Must show clear facial identity for WASM exam proctoring.</p>
            <div className="flex justify-center sm:justify-start space-x-2">
              <Button size="sm" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-3" onClick={() => toast.success('Image Upload Modal Opened')}>
                <Upload className="w-3.5 h-3.5 mr-1" /> Upload Photo
              </Button>
              {avatar && (
                <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold" onClick={handleRemoveAvatar}>
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
          <div className="space-y-1">
            <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Preferred Name / Alias</Label>
            <Input value={preferredName} onChange={(e) => setPreferredName(e.target.value)} className="bg-[#F8FAFC] border-[#E2E8F0] text-xs font-sans" />
          </div>

          <div className="space-y-1">
            <Label className="uppercase text-[#0F172A] text-[10px] font-bold">Biography & Academic Summary</Label>
            <textarea
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs font-sans text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#1E40AF]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" className="bg-[#15803D] hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2 rounded-xl">
              <Save className="w-4 h-4 mr-1.5" /> Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentProfileEdit;
