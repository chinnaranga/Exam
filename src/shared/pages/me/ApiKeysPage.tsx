import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { UserCenterService, ApiKeyItem } from '@/server/identity/user_center.service';
import { Key, Plus, Trash2, ShieldCheck, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const ApiKeysPage: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyItem[]>(() => UserCenterService.getApiKeys());
  const [keyName, setKeyName] = useState('');

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    const created = UserCenterService.createApiKey(keyName, ['exams:read', 'results:write']);
    setKeys([...UserCenterService.getApiKeys()]);
    setKeyName('');
    toast.success('Personal Access Token Generated', {
      description: `Token "${created.name}" created. Keep your secret key secure.`,
    });
  };

  const handleRevokeKey = (id: string, name: string) => {
    UserCenterService.revokeApiKey(id);
    setKeys([...UserCenterService.getApiKeys()]);
    toast.success('API Key Revoked', { description: `Revoked token "${name}".` });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6 font-sans text-[#111827]">
      <div className="border-b border-[#E5E7EB] pb-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-bold uppercase border border-blue-100 mb-2">
          <Key className="w-3.5 h-3.5" />
          <span>Developer API & Personal Access Tokens</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">API Keys & Access Tokens</h1>
        <p className="text-xs text-[#6B7280]">
          Generate scoped API keys to integrate external Canvas LMS, Moodle, or CI/CD automated grading pipelines.
        </p>
      </div>

      <Card className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-[#111827]">Generate New Personal Access Token</h3>
        <form onSubmit={handleCreateKey} className="flex gap-3 text-xs">
          <Input
            placeholder="e.g. Canvas LMS Gradebook Integration Token"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="bg-[#FAFBFC] border-[#E5E7EB] flex-1"
          />
          <Button type="submit" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-5 rounded-xl shadow-xs">
            <Plus className="w-4 h-4 mr-1" />
            Generate Token
          </Button>
        </form>
      </Card>

      <div className="space-y-3 font-mono text-xs">
        {keys.map((k) => (
          <Card key={k.id} className="p-4 rounded-xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#111827]">{k.name}</h4>
              <p className="font-mono text-xs text-[#2563EB]">{k.tokenMasked}</p>
              <div className="flex gap-2 text-[10px] font-mono text-[#6B7280]">
                <span>Created: {k.createdAt}</span>
                <span>Expires: {k.expiresAt}</span>
              </div>
            </div>
            <Button
              onClick={() => handleRevokeKey(k.id, k.name)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Revoke Key
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiKeysPage;
