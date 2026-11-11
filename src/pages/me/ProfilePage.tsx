import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCenterService, UserProfileData } from '@/server/identity/user_center.service';
import { User, Mail, Phone, Building2, MapPin, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileData>(() => UserCenterService.getProfile());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    UserCenterService.updateProfile(profile);
    toast.success('Identity Profile Saved', { description: 'Personal credentials and metadata updated.' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5 flex items-center space-x-4">
        <img src={profile.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[#2563EB] object-cover shadow-2xs" />
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">{profile.firstName} {profile.lastName}</h1>
          <p className="text-xs text-[#6B7280]">{profile.jobTitle} • {profile.department}</p>
        </div>
      </div>

      <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-[#111827]">Personal Profile Credentials</h3>
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">First Name</Label>
              <Input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB]" />
            </div>
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">Last Name</Label>
              <Input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">Primary Email Address</Label>
              <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB]" />
            </div>
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">Phone Number</Label>
              <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">Job Title</Label>
              <Input value={profile.jobTitle} onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB]" />
            </div>
            <div className="space-y-1">
              <Label className="uppercase text-[#111827] text-[10px]">Timezone</Label>
              <Input value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="bg-[#FAFBFC] border-[#E5E7EB] font-mono" />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs">
              <Save className="w-4 h-4 mr-2" />
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
