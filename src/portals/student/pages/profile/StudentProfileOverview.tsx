import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';
import {
  User,
  ShieldCheck,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Heart,
  Users,
  AlertCircle,
  FileText,
  Edit3,
  CheckCircle2,
  Lock,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export const StudentProfileOverview: React.FC = () => {
  const navigate = useNavigate();

  const profile = {
    fullName: 'Eleanor Claire Vance',
    preferredName: 'Ellie',
    studentId: 'STU-2026-8841',
    regNo: 'REG-MIT-2023-4190',
    universityEmail: 'student@mit.edu',
    personalEmail: 'eleanor.vance@gmail.com',
    mobile: '+1 (617) 555-0199',
    academicStatus: 'GOOD_STANDING',
    enrollmentStatus: 'FULL_TIME',
    department: 'Department of Electrical Engineering & Computer Science',
    program: 'B.S. Computer Science & Artificial Intelligence',
    batch: '2026',
    semester: 7,
    section: 'Section A',
    cgpa: 3.94,
    completionPercentage: 88,
    identityStatus: 'VERIFIED',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop',
  };

  const navTabs = [
    { label: 'Overview', path: '/student/profile' },
    { label: 'Edit Profile', path: '/student/profile/edit' },
    { label: 'Personal', path: '/student/profile/personal' },
    { label: 'Academic', path: '/student/profile/academic' },
    { label: 'Contact', path: '/student/profile/contact' },
    { label: 'Guardian', path: '/student/profile/guardian' },
    { label: 'Emergency', path: '/student/profile/emergency' },
    { label: 'Preferences', path: '/student/profile/preferences' },
    { label: 'Privacy', path: '/student/profile/privacy' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#0F172A]">
      {/* Tab Navigation Header */}
      <div className="border-b border-[#E2E8F0] pb-4 flex flex-wrap gap-2">
        {navTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              location.pathname === tab.path
                ? 'bg-[#1E40AF] text-white shadow-2xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Profile Header Hero Card */}
      <Card className="p-8 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E40AF] to-indigo-900 text-white shadow-xl relative overflow-hidden border-none">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-[#0F172A]">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {profile.enrollmentStatus} • {profile.academicStatus}
                </span>
                <span className="text-[10px] font-mono text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 font-bold">
                  ID: {profile.studentId}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight">{profile.fullName}</h1>
              <p className="text-xs text-blue-100 font-sans">{profile.program} • Semester {profile.semester}</p>
              <p className="text-[11px] text-blue-200 font-mono">MIT Department of EECS • Batch {profile.batch}</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-3 shrink-0">
            <Button
              onClick={() => navigate('/student/profile/edit')}
              className="bg-white hover:bg-blue-50 text-[#1E40AF] font-bold text-xs px-5 py-2 rounded-xl shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Edit Identity Profile
            </Button>
            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono text-blue-200 uppercase font-bold">Identity Verification</span>
              <div className="text-xs font-extrabold text-emerald-400 flex items-center justify-end">
                <ShieldCheck className="w-4 h-4 mr-1" /> VERIFIED STUDENT
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Completion & Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex justify-between items-center font-bold">
            <span className="text-[#0F172A]">Profile Completion</span>
            <span className="text-[#1E40AF] font-mono">{profile.completionPercentage}%</span>
          </div>
          <Progress value={profile.completionPercentage} className="h-2 bg-[#F1F5F9]" />
          <p className="text-[11px] text-[#64748B]">All mandatory academic identity fields verified by MIT Registrar.</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Current Cumulative CGPA</span>
          <div className="text-2xl font-extrabold text-[#0F172A]">{profile.cgpa} / 4.0</div>
          <span className="text-[10px] text-[#15803D] font-bold">HONORS DEAN'S LIST</span>
        </Card>

        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2">
          <span className="text-[#64748B] font-mono">Registration Number</span>
          <div className="text-lg font-extrabold font-mono text-[#1E40AF]">{profile.regNo}</div>
          <span className="text-[10px] text-[#64748B]">Permanent MIT Ledger ID</span>
        </Card>
      </div>

      {/* Primary Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* Contact Info Card */}
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-sm text-[#0F172A]">Primary Contact Details</h3>
            <Link to="/student/profile/contact" className="text-[#1E40AF] font-bold hover:underline">Manage Contact</Link>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3 text-[#0F172A]">
              <Mail className="w-4 h-4 text-[#1E40AF] shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-[#64748B]">UNIVERSITY EMAIL</p>
                <p className="font-bold">{profile.universityEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[#0F172A]">
              <Mail className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-[#64748B]">PERSONAL EMAIL</p>
                <p className="font-bold">{profile.personalEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-[#0F172A]">
              <Phone className="w-4 h-4 text-[#15803D] shrink-0" />
              <div>
                <p className="font-mono text-[10px] text-[#64748B]">MOBILE NUMBER</p>
                <p className="font-bold">{profile.mobile}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Linked Identity Documents */}
        <Card className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
            <h3 className="font-bold text-sm text-[#0F172A]">Linked Identity Documents</h3>
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
          </div>
          <div className="space-y-2.5">
            {[
              { title: 'MIT Official Student ID Card', verified: true },
              { title: 'MIT Official Admission Letter', verified: true },
              { title: 'Government Passport Proof', verified: true },
            ].map((doc, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#1E40AF]" />
                  <span className="font-semibold text-[#0F172A]">{doc.title}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfileOverview;
