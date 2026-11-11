import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { AuthorizationService, PolicyDefinition } from '@/server/auth/services/authorization.service';
import { ABACPolicyEngine } from '@/server/identity/abac.policy';
import { ShieldCheck, Play, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export const PoliciesPage: React.FC = () => {
  const [policies] = useState<PolicyDefinition[]>(() => AuthorizationService.getPolicies());

  // ABAC Simulator State
  const [simRole, setSimRole] = useState('ORGANIZATION_ADMIN');
  const [simRisk, setSimRisk] = useState('0.10');
  const [simIp, setSimIp] = useState('192.168.1.100');
  const [simResult, setSimResult] = useState<{ allowed: boolean; reason: string } | null>(null);

  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    const result = ABACPolicyEngine.evaluate({
      userId: 'sim-user-01',
      tenantId: 'tenant-mit-01',
      userRoles: [simRole],
      clientIp: simIp,
      deviceRiskScore: parseFloat(simRisk) || 0.0,
      timeOfDayMinutes: 720,
    });

    setSimResult(result);
    if (result.allowed) {
      toast.success('Access Allowed', { description: result.reason });
    } else {
      toast.error('Access Denied', { description: result.reason });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-mono font-bold uppercase border border-purple-200 mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>ABAC Policy Engine & Real-Time Simulator</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Attribute-Based Access Control (ABAC)</h1>
        <p className="text-xs text-[#6B7280]">
          Evaluate dynamic policies considering client IP ranges, time windows, and client device risk scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Policies */}
        <div className="lg:col-span-7 space-y-4 font-mono text-xs">
          <h3 className="font-bold text-sm text-[#111827] font-sans">Active Institutional Policies</h3>
          {policies.map((p) => (
            <Card key={p.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-2">
              <div className="flex items-center justify-between font-sans">
                <h4 className="font-bold text-sm text-[#111827]">{p.name}</h4>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  p.effect === 'ALLOW' ? 'bg-emerald-50 text-[#16A34A] border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  EFFECT: {p.effect}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] font-sans leading-relaxed">{p.description}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-[#6B7280] border-t border-[#F1F5F9]">
                <span>Max Device Risk Threshold: <code className="text-[#111827] font-bold">{p.maxRiskScore}</code></span>
                <span>{p.isSystem ? 'SYSTEM POLICY' : 'CUSTOM POLICY'}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Right: Real-Time ABAC Policy Simulator */}
        <div className="lg:col-span-5">
          <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-[#2563EB] font-bold text-sm">
              <Play className="w-4 h-4" />
              <span>Real-Time ABAC Simulator</span>
            </div>

            <form onSubmit={handleRunSimulation} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <Label className="uppercase text-[#111827] text-[10px]">Test User Role</Label>
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value)}
                  className="w-full h-9 rounded-md border border-[#E5E7EB] bg-[#FAFBFC] px-3 text-xs text-[#111827]"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN</option>
                  <option value="FACULTY_PROFESSOR">FACULTY_PROFESSOR</option>
                  <option value="CANDIDATE_STUDENT">CANDIDATE_STUDENT</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="uppercase text-[#111827] text-[10px]">Device Risk Score (0.0 to 1.0)</Label>
                <Input
                  type="number"
                  step="0.05"
                  value={simRisk}
                  onChange={(e) => setSimRisk(e.target.value)}
                  className="bg-[#FAFBFC] border-[#E5E7EB] text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="uppercase text-[#111827] text-[10px]">Client IP Address</Label>
                <Input
                  value={simIp}
                  onChange={(e) => setSimIp(e.target.value)}
                  className="bg-[#FAFBFC] border-[#E5E7EB] text-xs"
                />
              </div>

              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2 rounded-lg text-xs">
                Run Policy Evaluation
              </Button>
            </form>

            {simResult && (
              <div className={`p-4 rounded-xl border space-y-1 text-xs font-mono ${
                simResult.allowed ? 'bg-emerald-50 border-emerald-200 text-[#16A34A]' : 'bg-red-50 border-red-200 text-red-600'
              }`}>
                <div className="flex items-center font-bold font-sans">
                  {simResult.allowed ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <AlertTriangle className="w-4 h-4 mr-1.5" />}
                  <span>{simResult.allowed ? 'EVALUATION PASSED (ACCESS ALLOWED)' : 'EVALUATION DENIED'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{simResult.reason}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
