import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthorizationService, RoleDefinition } from '@/server/auth/services/authorization.service';
import { ShieldCheck, Plus, Trash2, Key, Users, CheckCircle2, Lock } from 'lucide-react';
import { toast } from 'sonner';

export const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>(() => AuthorizationService.getRoles());
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleScope, setNewRoleScope] = useState<'SYSTEM' | 'TENANT' | 'ORGANIZATION' | 'DEPARTMENT'>('ORGANIZATION');

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const created = AuthorizationService.createRole({
      name: newRoleName.toUpperCase().replace(/\s+/g, '_'),
      description: newRoleDesc || 'Custom institutional role.',
      scope: newRoleScope,
    });

    setRoles([...AuthorizationService.getRoles()]);
    setNewRoleName('');
    setNewRoleDesc('');
    toast.success('Custom Role Created', {
      description: `Role ${created.name} registered with ${created.scope} scope.`,
    });
  };

  const handleDeleteRole = (id: string, name: string) => {
    const success = AuthorizationService.deleteRole(id);
    if (success) {
      setRoles([...AuthorizationService.getRoles()]);
      toast.success('Role Deleted', { description: `Role ${name} removed.` });
    } else {
      toast.error('Cannot Delete System Role');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>RBAC Role Hierarchy & Scope Management</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Institutional RBAC Roles</h1>
        <p className="text-xs text-[#6B7280]">
          Define system, tenant, organization, and department scoped roles with explicit permission sets.
        </p>
      </div>

      {/* Role Creation Form */}
      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#111827]">Create Custom Institutional Role</h3>
        <form onSubmit={handleCreateRole} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Role Name</Label>
            <Input
              placeholder="SENIOR_EVALUATOR"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="bg-[#FAFBFC] border-[#E5E7EB] text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Role Scope</Label>
            <select
              value={newRoleScope}
              onChange={(e) => setNewRoleScope(e.target.value as any)}
              className="w-full h-9 rounded-md border border-[#E5E7EB] bg-[#FAFBFC] px-3 text-xs font-mono text-[#111827]"
            >
              <option value="SYSTEM">SYSTEM</option>
              <option value="TENANT">TENANT</option>
              <option value="ORGANIZATION">ORGANIZATION</option>
              <option value="DEPARTMENT">DEPARTMENT</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label className="uppercase text-[#111827] text-[10px]">Description</Label>
            <Input
              placeholder="Scope description..."
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              className="bg-[#FAFBFC] border-[#E5E7EB] text-xs"
            />
          </div>

          <div className="flex items-end">
            <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Create Role
            </Button>
          </div>
        </form>
      </Card>

      {/* Roles List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {roles.map((r) => (
          <Card key={r.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between font-sans">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-sm text-[#111827] font-mono">{r.name}</span>
                  {r.isCustom && (
                    <span className="text-[9px] font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      CUSTOM
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#6B7280] bg-[#FAFBFC] px-2 py-0.5 rounded border border-[#E5E7EB]">
                  SCOPE: {r.scope}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] font-sans leading-relaxed">{r.description}</p>
            </div>

            <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
              <span className="text-[#16A34A] font-bold">{r.permissionsCount} Permissions Assigned</span>
              {r.isCustom && (
                <Button
                  onClick={() => handleDeleteRole(r.id, r.name)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 text-[11px] p-1.5 rounded-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
