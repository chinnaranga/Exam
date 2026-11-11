import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { AuthorizationService, PermissionItem } from '@/server/auth/services/authorization.service';
import { Key, ShieldCheck, Check, X } from 'lucide-react';

export const PermissionsPage: React.FC = () => {
  const [permissions] = useState<PermissionItem[]>(() => AuthorizationService.getPermissions());

  const rolesList = ['SUPER_ADMIN', 'ORGANIZATION_ADMIN', 'FACULTY_PROFESSOR', 'PROCTOR_INVIGILATOR', 'CANDIDATE_STUDENT'];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Key className="w-3.5 h-3.5" />
          <span>Fine-Grained Permission Matrix</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Institutional Permission Matrix</h1>
        <p className="text-xs text-[#6B7280]">
          Inspect explicit action rights across modules and role scopes.
        </p>
      </div>

      <Card className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xs overflow-hidden font-mono text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFC] border-b border-[#E5E7EB] text-[#111827] text-[11px] font-bold">
                <th className="p-3.5">PERMISSION CODE</th>
                <th className="p-3.5">MODULE</th>
                <th className="p-3.5">ACTION</th>
                <th className="p-3.5">SCOPE</th>
                {rolesList.map((r, i) => (
                  <th key={i} className="p-3.5 text-center">{r.split('_')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {permissions.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFBFC]">
                  <td className="p-3.5 font-bold text-[#2563EB]">{p.code}</td>
                  <td className="p-3.5 text-[#111827] font-sans">{p.module}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      {p.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#6B7280]">{p.scope}</td>
                  <td className="p-3.5 text-center"><Check className="w-4 h-4 text-[#16A34A] mx-auto" /></td>
                  <td className="p-3.5 text-center"><Check className="w-4 h-4 text-[#16A34A] mx-auto" /></td>
                  <td className="p-3.5 text-center">
                    {p.module === 'Question Bank' ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-[#9CA3AF] mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center">
                    {p.module === 'Proctor Sentinel' ? <Check className="w-4 h-4 text-[#16A34A] mx-auto" /> : <X className="w-4 h-4 text-[#9CA3AF] mx-auto" />}
                  </td>
                  <td className="p-3.5 text-center"><X className="w-4 h-4 text-[#9CA3AF] mx-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PermissionsPage;
