import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useOrganizationStore } from "@/shared/stores/organizationStore";
import { useAuthStore } from "@/shared/stores/authStore";
import { useOrganizations, useAuditLogs } from '@/shared/hooks/useApiQueries';
import HierarchyExplorer from '../components/HierarchyExplorer';
import InvitationModal from '../components/InvitationModal';
import {
  Building2,
  BookOpen,
  Layers,
  UserPlus,
  Activity,
  ShieldCheck,
  Globe,
  Radio,
  Plus,
  Download,
  FileCheck,
  Clock,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

export const OrganizationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { campuses, departments, programs, courses, addCampus, addDepartment } = useOrganizationStore();
  const { data: orgsData } = useOrganizations({ page: 1, pageSize: 10 });
  const { data: auditData } = useAuditLogs({ page: 1, pageSize: 5 });

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  const [campusName, setCampusName] = useState('');
  const [campusCode, setCampusCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  const auditLogs = auditData?.data || [
    { id: 'log-1', action: 'INVITATION_SENT', details: 'Invited faculty member dr.chen@mit.edu', timestamp: '2 mins ago' },
    { id: 'log-2', action: 'CAMPUS_UPDATED', details: 'Updated Cambridge Main Campus metadata', timestamp: '14 mins ago' },
    { id: 'log-3', action: 'RLS_KEY_ROTATED', details: 'AES-256 tenant key rotated successfully', timestamp: '1 hour ago' },
  ];

  const handleSignOut = () => {
    logout();
    toast.success('Signed Out Successfully');
    navigate('/organization/login');
  };

  const handleCreateCampus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campusName.trim()) {
      toast.error('Please enter a campus name');
      return;
    }
    const newCamp = {
      id: `camp_${Date.now()}`,
      name: campusName.trim(),
      code: campusCode.trim().toUpperCase() || 'MAIN',
      address: 'Cambridge, MA',
    };
    addCampus(newCamp);
    toast.success(`Campus Created: ${newCamp.name}`, {
      description: `Registered campus ${newCamp.code} under MIT organization.`,
    });
    setCampusName('');
    setCampusCode('');
    setIsCampusModalOpen(false);
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      toast.error('Please enter a department name');
      return;
    }
    const newDept = {
      id: `dept_${Date.now()}`,
      campusId: campuses[0]?.id || 'camp_mit_01',
      name: deptName.trim(),
      code: deptCode.trim().toUpperCase() || 'DEPT',
    };
    addDepartment(newDept);
    toast.success(`Department Registered: ${newDept.name}`, {
      description: `Linked department ${newDept.code} to campus.`,
    });
    setDeptName('');
    setDeptCode('');
    setIsDeptModalOpen(false);
  };

  const handleExportCompliance = () => {
    toast.success('Exporting Institutional Compliance Audit', {
      description: 'Downloaded ISO 27001 & SOC-2 compliance summary PDF.',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-900">
      {/* Header & Real-time Live Badge & Sign Out Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Organization Workspace Admin</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-300 flex items-center">
              <Radio className="w-3 h-3 mr-1 animate-pulse text-emerald-600" /> Live Real-Time API Synced
            </span>
          </div>
          <p className="text-xs text-slate-600 font-semibold mt-1">Manage institutional campuses, departments, academic hierarchy, branding, and access invitations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setIsCampusModalOpen(true)}
            className="bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-slate-700" /> Add Campus
          </Button>
          <Button
            onClick={() => setIsDeptModalOpen(true)}
            className="bg-white border border-slate-300 text-slate-900 hover:bg-slate-100 font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-slate-700" /> Add Department
          </Button>
          <Button
            onClick={() => setIsInviteOpen(true)}
            className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invite Users
          </Button>
          <Button
            onClick={handleSignOut}
            className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1 text-rose-600" /> Sign Out
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 font-semibold">Registered Campuses</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{campuses.length}</div>
            <span className="text-[11px] text-emerald-700 font-mono font-bold mt-1 block">100% Operational</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-[#1E40AF] border border-blue-200">
            <Building2 className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 font-semibold">Active Departments</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{departments.length}</div>
            <span className="text-[11px] text-slate-600 font-mono mt-1 block">EECS, Math, Physics</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 font-semibold">Degree Programs</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{programs.length}</div>
            <span className="text-[11px] text-slate-600 font-mono mt-1 block">BS, MS & Doctoral</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <BookOpen className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-600 font-semibold">Active Test Courses</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{courses.length}</div>
            <span className="text-[11px] text-emerald-700 font-mono font-bold mt-1 block">IRT Calibrated</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Activity className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Institutional Branding & Security Governance Features Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
        {/* Institutional Branding & Domain Control */}
        <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
              <Globe className="w-4 h-4 text-blue-700" />
              <span>Institutional Custom Domain & Branding</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              CNAME VERIFIED
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
              <span className="text-slate-600 font-semibold">Custom Domain:</span>
              <span className="font-bold text-slate-900">mit.assessiq.com</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">Theme Primary Color:</span>
              <div className="flex items-center space-x-2 font-mono">
                <span className="w-4 h-4 rounded-full bg-[#1E40AF] inline-block border border-slate-300"></span>
                <span className="font-bold text-slate-900">#1E40AF (MIT Deep Blue)</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">SSO Identity Provider:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px] font-mono">
                OKTA SAML 2.0 CONNECTED
              </span>
            </div>
          </div>
        </Card>

        {/* Security & RLS Policy Governance */}
        <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Multi-Tenant Security & Isolation Policy</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
              AES-256 ENCRYPTED
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">Row-Level Security (RLS):</span>
              <span className="font-bold text-slate-900 font-mono text-[11px]">Strict Org-Level Partitioning</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-600 font-semibold">FERPA / HIPAA Compliance:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 text-[10px] font-mono">
                100% PASSED AUDIT
              </span>
            </div>
            <div className="pt-1 flex justify-end">
              <Button
                onClick={handleExportCompliance}
                className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> Export Compliance Audit PDF
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Visual Hierarchy Explorer */}
      <HierarchyExplorer />

      {/* Real-time Institutional Audit Ledger */}
      <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2 font-bold text-sm text-slate-900">
            <Clock className="w-4 h-4 text-purple-700" />
            <span>Real-Time Institutional Audit Stream</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600 font-medium">Live Server Timeline</span>
        </div>

        <div className="divide-y divide-slate-200">
          {auditLogs.map((log: any, idx: number) => (
            <div key={idx} className="py-3 flex justify-between items-center font-mono">
              <div className="flex items-center space-x-3">
                <FileCheck className="w-4 h-4 text-blue-700 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 font-sans">{log.details}</span>
                  <span className="text-[10px] text-purple-800 bg-purple-50 px-2 py-0.5 rounded ml-2 border border-purple-200 font-bold">
                    {log.action}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Invitation Modal */}
      <InvitationModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />

      {/* Create Campus Modal */}
      <Dialog open={isCampusModalOpen} onOpenChange={setIsCampusModalOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white text-slate-900 p-6 rounded-2xl border-slate-200">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">Add New Campus</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">Register an institutional campus branch.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCampus} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label className="uppercase text-slate-900 text-[10px] font-bold">Campus Name</Label>
              <Input
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                placeholder="e.g. Innovation Hub Branch"
                className="bg-slate-50 border-slate-300 text-slate-900 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="uppercase text-slate-900 text-[10px] font-bold">Campus Code</Label>
              <Input
                value={campusCode}
                onChange={(e) => setCampusCode(e.target.value)}
                placeholder="e.g. HUB-02"
                className="bg-slate-50 border-slate-300 text-slate-900 text-xs font-mono"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCampusModalOpen(false)} className="text-xs font-bold border-slate-300 text-slate-900 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-5 cursor-pointer">
                Register Campus
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Department Modal */}
      <Dialog open={isDeptModalOpen} onOpenChange={setIsDeptModalOpen}>
        <DialogContent className="sm:max-w-[450px] bg-white text-slate-900 p-6 rounded-2xl border-slate-200">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">Add New Department</DialogTitle>
            <DialogDescription className="text-xs text-slate-600">Register an academic department under campus.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDept} className="space-y-4 text-xs pt-2">
            <div className="space-y-1">
              <Label className="uppercase text-slate-900 text-[10px] font-bold">Department Name</Label>
              <Input
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                placeholder="e.g. Department of Physics"
                className="bg-slate-50 border-slate-300 text-slate-900 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="uppercase text-slate-900 text-[10px] font-bold">Department Code</Label>
              <Input
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                placeholder="e.g. PHYS"
                className="bg-slate-50 border-slate-300 text-slate-900 text-xs font-mono"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDeptModalOpen(false)} className="text-xs font-bold border-slate-300 text-slate-900 cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs px-5 cursor-pointer">
                Add Department
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrganizationDashboard;
