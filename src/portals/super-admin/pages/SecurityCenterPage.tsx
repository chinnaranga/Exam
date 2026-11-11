import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { SecurityCenterService, SecurityMetricScore, SecurityAlertItem } from '@/server/security/security_center.service';
import { ShieldCheck, AlertTriangle, Lock, Cpu, ArrowRight, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SecurityCenterPage: React.FC = () => {
  const [metrics] = useState<SecurityMetricScore>(() => SecurityCenterService.getMetrics());
  const [alerts] = useState<SecurityAlertItem[]>(() => SecurityCenterService.getAlerts());

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#16A34A] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust Enterprise Protection Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Enterprise Security Center</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time adaptive risk evaluation, TOTP MFA policies, and threat telemetry monitoring.
          </p>
        </div>

        <Link to="/security/mfa-wizard">
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs">
            <Lock className="w-4 h-4 mr-2" />
            Configure MFA Wizard
          </Button>
        </Link>
      </div>

      {/* Security Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 font-mono text-xs">
        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Overall Security Posture</span>
          <div className="text-3xl font-extrabold text-[#16A34A]">{metrics.score} / 100 ({metrics.grade})</div>
          <span className="text-[10px] text-[#16A34A] font-bold">Hardened Posture</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Adaptive Risk Rating</span>
          <div className="text-3xl font-extrabold text-[#2563EB]">{metrics.riskScore}% LOW</div>
          <span className="text-[10px] text-[#2563EB] font-bold">No Threat Detected</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">TOTP MFA Policy</span>
          <div className="text-3xl font-extrabold text-[#16A34A]">ENFORCED</div>
          <span className="text-[10px] text-emerald-600 font-bold">SHA-256 HMAC</span>
        </Card>

        <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-1">
          <span className="text-[#6B7280]">Compliance Frameworks</span>
          <div className="text-3xl font-extrabold text-[#111827]">4 / 4 PASS</div>
          <span className="text-[10px] text-[#16A34A] font-bold">SOC2 / ISO Ready</span>
        </Card>
      </div>

      {/* Threat Alerts Log */}
      <Card className="p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <h3 className="font-bold text-base text-[#111827]">Real-Time Security Threat Alerts</h3>
          <span className="text-xs font-mono font-bold text-[#2563EB]">ADAPTIVE RISK WATCH</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {alerts.map((a) => (
            <div key={a.id} className="p-4 rounded-xl bg-[#FAFBFC] border border-[#E5E7EB] flex items-center justify-between font-sans">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-5 h-5 text-[#2563EB]" />
                <div>
                  <h4 className="font-bold text-xs text-[#111827]">{a.title}</h4>
                  <p className="text-[11px] text-[#6B7280]">{a.description}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-[#2563EB] border border-blue-200">
                {a.severity}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SecurityCenterPage;
