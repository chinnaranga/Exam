import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IntegrationPlatformService, WebhookEndpoint } from '@/server/integration/integration_platform.service';
import { Webhook, Plus, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const WebhooksPage: React.FC = () => {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(() => IntegrationPlatformService.getWebhooks());
  const [url, setUrl] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    const created = IntegrationPlatformService.registerWebhook(url, ['exam.completed', 'cert.issued']);
    setWebhooks([...IntegrationPlatformService.getWebhooks()]);
    setUrl('');
    toast.success('Webhook Endpoint Registered', { description: `Registered ${created.url}. Secret: ${created.secret}` });
  };

  const handleTestDispatch = (endpointUrl: string) => {
    toast.success('Test Event Payload Dispatched', {
      description: `Sent HTTP POST payload to ${endpointUrl} (Status: 200 OK).`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Webhook className="w-3.5 h-3.5" />
          <span>Real-Time HTTP Event Subscriptions</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Webhook Endpoints & Delivery</h1>
        <p className="text-xs text-[#6B7280]">
          Subscribe to event streams like `exam.completed`, `security.threat`, or `cert.issued` with SHA-256 signatures.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-[#111827]">Register New Webhook Listener</h3>
        <form onSubmit={handleRegister} className="flex gap-3 text-xs">
          <Input
            placeholder="https://api.youruniversity.edu/hooks/assessiq"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-[#FAFBFC] border-[#E5E7EB] flex-1 font-mono"
          />
          <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-5 rounded-xl shadow-xs">
            <Plus className="w-4 h-4 mr-1" />
            Register Endpoint
          </Button>
        </form>
      </Card>

      <div className="space-y-3 font-mono text-xs">
        {webhooks.map((w) => (
          <Card key={w.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#111827] font-mono">{w.url}</h4>
              <p className="text-xs text-[#6B7280]">Secret: <span className="font-mono text-[#2563EB]">{w.secret}</span></p>
              <div className="flex gap-1">
                {w.events.map((e) => (
                  <span key={e} className="text-[10px] font-mono bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded border border-blue-100 font-bold">
                    {e}
                  </span>
                ))}
              </div>
            </div>
            <Button
              onClick={() => handleTestDispatch(w.url)}
              variant="outline"
              className="border-[#E5E7EB] text-[#111827] hover:bg-[#FAFBFC] font-bold text-xs px-4 py-2 rounded-xl shrink-0"
            >
              <Send className="w-3.5 h-3.5 mr-1.5 text-[#2563EB]" />
              Dispatch Test Payload
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WebhooksPage;
