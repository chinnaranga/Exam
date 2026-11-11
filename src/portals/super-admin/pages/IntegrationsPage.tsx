import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { IntegrationPlatformService, IntegrationConnector } from '@/server/integration/integration_platform.service';
import { Layers, CheckCircle2, XCircle, RefreshCw, Power } from 'lucide-react';
import { toast } from 'sonner';

export const IntegrationsPage: React.FC = () => {
  const [connectors, setConnectors] = useState<IntegrationConnector[]>(() => IntegrationPlatformService.getConnectors());

  const handleToggle = (id: string, name: string) => {
    IntegrationPlatformService.toggleConnector(id);
    setConnectors([...IntegrationPlatformService.getConnectors()]);
    toast.success('Connector Status Updated', { description: `Updated connector state for ${name}.` });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Enterprise Connectors & OAuth Marketplace</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Third-Party Integrations</h1>
        <p className="text-xs text-[#6B7280]">
          Connect Canvas LMS, Moodle, Microsoft 365, Google Workspace, Slack, and Workday.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {connectors.map((c) => (
          <Card key={c.id} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111827]">{c.name}</h3>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                c.status === 'CONNECTED' ? 'text-[#16A34A] bg-emerald-50 border-emerald-200' : 'text-[#6B7280] bg-[#FAFBFC] border-[#E5E7EB]'
              }`}>
                {c.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <span>Category: <span className="font-mono font-bold text-[#111827]">{c.category}</span></span>
              <span>Last Sync: {new Date(c.lastSyncAt).toLocaleTimeString()}</span>
            </div>

            <Button
              onClick={() => handleToggle(c.id, c.name)}
              variant="outline"
              className={`w-full font-bold text-xs py-2 rounded-xl border-[#E5E7EB] ${
                c.status === 'CONNECTED' ? 'text-red-600 hover:bg-red-50' : 'text-[#2563EB] hover:bg-blue-50'
              }`}
            >
              <Power className="w-3.5 h-3.5 mr-2" />
              {c.status === 'CONNECTED' ? 'Disconnect Connector' : 'Connect Integration'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
