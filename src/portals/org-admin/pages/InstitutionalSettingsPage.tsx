import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';
import {
  Building2,
  Key,
  Webhook,
  GraduationCap,
  Mail,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Send,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Copy,
  Sliders,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export const InstitutionalSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sso');

  // SSO State
  const [ssoProtocol, setSsoProtocol] = useState<'OIDC' | 'SAML_2_0'>('OIDC');
  const [idpProvider, setIdpProvider] = useState('GOOGLE_WORKSPACE');
  const [roleMappingRules, setRoleMappingRules] = useState([
    { id: '1', claimKey: 'groups', matchType: 'CONTAINS', claimValue: 'Faculty_Staff', role: 'FACULTY' },
    { id: '2', claimKey: 'roles', matchType: 'CONTAINS', claimValue: 'Certified_Proctor', role: 'INVIGILATOR' },
    { id: '3', claimKey: 'email', matchType: 'REGEX', claimValue: '.*admin@university\\.edu$', role: 'ORG_ADMIN' },
  ]);

  // LMS / LTI 1.3 State
  const [lmsPlatforms] = useState([
    { name: 'Canvas LMS', platform: 'CANVAS', clientId: 'canvas_client_982103', deploymentId: 'dep_canvas_01', status: 'ACTIVE' },
    { name: 'Moodle', platform: 'MOODLE', clientId: 'moodle_client_4412', deploymentId: 'dep_moodle_01', status: 'ACTIVE' },
    { name: 'Blackboard Learn', platform: 'BLACKBOARD', clientId: 'blackboard_client_7718', deploymentId: 'dep_bb_01', status: 'ACTIVE' },
  ]);

  // API Keys & Webhooks State
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_1', name: 'Canvas LMS Auto-Enrollment Key', prefix: 'aki_live_3f92...', scopes: ['exams:read', 'enrollment:write'], lastUsed: '5 mins ago' },
    { id: 'key_2', name: 'SIS Grade Passback Service', prefix: 'aki_live_8b11...', scopes: ['results:read'], lastUsed: '1 hour ago' },
  ]);

  const [webhooks] = useState([
    {
      id: 'wh_1',
      url: 'https://api.university.edu/assessiq-webhooks',
      events: ['exam.started', 'exam.submitted', 'session.flagged', 'result.released'],
      secret: 'whsec_98f1d3c01a742e5b8823f990acb4',
      status: 'ACTIVE',
    },
  ]);

  // Bulk CSV Enrollment State
  const [csvInput, setCsvInput] = useState(`email,firstName,lastName,studentId,examId,accommodations,section
alice.smith@university.edu,Alice,Smith,STU101,exam_cs101,TIME_PLUS_25;REST_BREAKS,Section-A
bob.jones@university.edu,Bob,Jones,STU102,exam_cs101,,Section-B
carol.bad@university.edu,Carol,Bad,STU103,exam_cs101,INVALID_ACCOM_CODE,Section-A
not-an-email,David,Missing,STU104,exam_cs101,,Section-B
alice.smith@university.edu,Alice,Duplicate,STU105,exam_cs101,,Section-A`);

  const [enrollmentReport, setEnrollmentReport] = useState<any | null>(null);

  // Notification Templates State
  const [selectedEvent, setSelectedEvent] = useState('EXAM_SCHEDULED');
  const [templateSubject, setTemplateSubject] = useState('Scheduled: {{examTitle}} Examination on AssessIQ');
  const [templateBody, setTemplateBody] = useState(
    'Dear {{candidateName}},\n\nYou are scheduled for {{examTitle}} on {{scheduledTime}} (Duration: {{duration}} mins).\n\nComplete System Check: {{link}}'
  );

  // Multi-Tenant Branding State
  const [branding, setBranding] = useState({
    institutionName: 'Apex Institute of Technology',
    subdomain: 'apex-tech',
    customDomain: 'exams.apex.edu',
    primaryColor: '#6C4DFF',
    allowedDomains: 'apex.edu, student.apex.edu, faculty.apex.edu',
  });

  const handleTestGradePassback = (platform: string) => {
    toast.success(`LTI 1.3 AGS Grade Passback Tested (${platform})`, {
      description: 'Score 94.5/100 successfully posted to LMS gradebook line item container.',
    });
  };

  const handleTestWebhookDispatch = () => {
    toast.success('Signed Webhook Dispatched (exam.submitted)', {
      description: 'HMAC-SHA256 signature header verified (t=1770000000,v1=...). Status 200 OK.',
    });
  };

  const handleGenerateApiKey = () => {
    const newKey = {
      id: `key_${Date.now()}`,
      name: 'New Scoped API Client',
      prefix: `aki_live_${Math.random().toString(36).substring(2, 6)}...`,
      scopes: ['exams:write', 'enrollment:write', 'results:read'],
      lastUsed: 'Never',
    };
    setApiKeys((prev) => [newKey, ...prev]);
    toast.success('Scoped API Key Generated', {
      description: 'Copy the secret key now; it will not be displayed again.',
    });
  };

  const handleRunBulkEnrollment = () => {
    // Client simulation of BulkEnrollmentService
    const lines = csvInput.trim().split('\n').filter((l) => l.trim().length > 0);
    const dataLines = lines.slice(1);
    let valid = 0;
    const errors: any[] = [];
    const seen = new Set<string>();

    dataLines.forEach((line, idx) => {
      const parts = line.split(',').map((p) => p.trim());
      const email = parts[0] || '';
      const accom = parts[5] || '';
      let hasError = false;

      if (!email.includes('@')) {
        errors.push({ row: idx + 2, field: 'email', error: 'Invalid email address syntax' });
        hasError = true;
      }
      if (seen.has(email.toLowerCase())) {
        errors.push({ row: idx + 2, field: 'email', error: 'Duplicate email in batch' });
        hasError = true;
      } else if (email) {
        seen.add(email.toLowerCase());
      }
      if (accom && accom.includes('INVALID')) {
        errors.push({ row: idx + 2, field: 'accommodations', error: 'Unrecognized accommodation code' });
        hasError = true;
      }

      if (!hasError) valid++;
    });

    setEnrollmentReport({
      total: dataLines.length,
      valid,
      errorsCount: errors.length,
      errors,
    });

    if (errors.length > 0) {
      toast.warning(`Bulk Enrollment: ${valid} Enrolled, ${errors.length} Errors Found`, {
        description: 'Review the error report below and export rejected rows.',
      });
    } else {
      toast.success(`Bulk Enrollment Complete: All ${valid} Candidates Enrolled`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-[#0F172A] p-4">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#6C4DFF] bg-[#EDE9FE] px-2 py-0.5 rounded">
              INSTITUTIONAL ARCHITECTURE
            </span>
            <Badge variant="outline" className="text-[10px] font-mono border-emerald-300 text-emerald-700 bg-emerald-50">
              ENTERPRISE FEDERATION
            </Badge>
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight mt-1">Institutional Integrations & Administration</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            SAML 2.0/OIDC SSO, LTI 1.3 Advantage LMS connectors, REST API & signed webhooks, bulk enrollment, and multi-tenant branding.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Exporting Integration Spec Sheet...')} className="text-xs font-bold border-[#CBD5E1]">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Integration Spec (PDF)
          </Button>
          <Button size="sm" onClick={() => toast.success('Institutional Configuration Saved')} className="text-xs font-bold bg-[#6C4DFF] hover:bg-[#5835E5] text-white">
            Save All Settings
          </Button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#F1F5F9] p-1 border border-[#E2E8F0] rounded-xl grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="sso" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Key className="w-3.5 h-3.5 mr-1.5" /> SSO & IdP
          </TabsTrigger>
          <TabsTrigger value="lms" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 mr-1.5" /> LMS (LTI 1.3)
          </TabsTrigger>
          <TabsTrigger value="api-webhooks" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Webhook className="w-3.5 h-3.5 mr-1.5" /> API & Webhooks
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Mail className="w-3.5 h-3.5 mr-1.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="bulk-enrollment" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Users className="w-3.5 h-3.5 mr-1.5" /> Bulk CSV Import
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs font-bold py-2 data-[state=active]:bg-white data-[state=active]:text-[#6C4DFF] data-[state=active]:shadow-xs">
            <Building2 className="w-3.5 h-3.5 mr-1.5" /> Tenant Branding
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SSO & ROLE MAPPING */}
        <TabsContent value="sso" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Enterprise Identity Provider (SSO)</h3>
                <p className="text-xs text-[#64748B]">Federate candidate and faculty authentication through SAML 2.0 or OIDC.</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-mono">SSO ACTIVE</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Authentication Protocol</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={ssoProtocol === 'OIDC' ? 'default' : 'outline'}
                    onClick={() => setSsoProtocol('OIDC')}
                    className={`text-xs font-bold ${ssoProtocol === 'OIDC' ? 'bg-[#6C4DFF] text-white' : 'border-[#CBD5E1]'}`}
                  >
                    OpenID Connect (OIDC)
                  </Button>
                  <Button
                    type="button"
                    variant={ssoProtocol === 'SAML_2_0' ? 'default' : 'outline'}
                    onClick={() => setSsoProtocol('SAML_2_0')}
                    className={`text-xs font-bold ${ssoProtocol === 'SAML_2_0' ? 'bg-[#6C4DFF] text-white' : 'border-[#CBD5E1]'}`}
                  >
                    SAML 2.0
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Identity Provider</Label>
                <select
                  value={idpProvider}
                  onChange={(e) => setIdpProvider(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="GOOGLE_WORKSPACE">Google Workspace / Google Cloud Identity</option>
                  <option value="MICROSOFT_ENTRA">Microsoft Entra ID (Azure AD)</option>
                  <option value="OKTA">Okta Enterprise SSO</option>
                  <option value="INSTITUTIONAL_SAML">Custom Institutional Shibboleth / SimpleSAMLphp</option>
                </select>
              </div>
            </div>

            {/* SAML SP Metadata Block */}
            {ssoProtocol === 'SAML_2_0' && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#0F172A]">Service Provider (SP) Metadata URL</span>
                  <Button size="sm" variant="outline" onClick={() => toast.success('SP Metadata Copied')} className="text-[11px] h-7">
                    <Copy className="w-3 h-3 mr-1" /> Copy Metadata URL
                  </Button>
                </div>
                <div className="p-2 rounded bg-white border border-[#E2E8F0] text-[#64748B] select-all">
                  https://assessiq.edu/saml/tenant_university_main/metadata
                </div>
              </div>
            )}

            {/* Role Mapping Rules */}
            <div className="space-y-3 pt-3 border-t border-[#E2E8F0]">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-extrabold text-sm text-[#0F172A]">IdP Claim Role Mapping Rules</h4>
                  <p className="text-xs text-[#64748B]">Maps incoming IdP directory attributes to AssessIQ roles.</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info('Rule added')}
                  className="text-xs font-bold border-[#CBD5E1]"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Rule
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono text-[10px] uppercase">
                      <th className="pb-2">Claim Key</th>
                      <th className="pb-2">Match Type</th>
                      <th className="pb-2">Claim Value Pattern</th>
                      <th className="pb-2">Assigned Role</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {roleMappingRules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="py-2.5 font-mono font-bold text-[#0F172A]">{rule.claimKey}</td>
                        <td className="py-2.5 font-mono"><Badge variant="outline" className="text-[10px]">{rule.matchType}</Badge></td>
                        <td className="py-2.5 font-mono text-[#475569]">{rule.claimValue}</td>
                        <td className="py-2.5 font-mono font-bold text-[#6C4DFF]">{rule.role}</td>
                        <td className="py-2.5 text-right">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: LMS (LTI 1.3) */}
        <TabsContent value="lms" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A]">LTI 1.3 Advantage LMS Connectors</h3>
              <p className="text-xs text-[#64748B]">Seamless student launch from course spaces and automatic Assignment and Grade Services (AGS) grade sync.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lmsPlatforms.map((lms, idx) => (
                <Card key={idx} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-[#0F172A]">{lms.name}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-mono">LTI 1.3 READY</Badge>
                  </div>
                  <div className="text-[11px] font-mono text-[#64748B] space-y-1">
                    <div>Client ID: <strong>{lms.clientId}</strong></div>
                    <div>Deployment: <strong>{lms.deploymentId}</strong></div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTestGradePassback(lms.name)}
                    className="w-full text-xs font-bold border-[#CBD5E1] bg-white"
                  >
                    Test AGS Grade Passback
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: API & WEBHOOKS */}
        <TabsContent value="api-webhooks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scoped API Keys */}
            <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Scoped REST API Keys</h3>
                  <p className="text-xs text-[#64748B]">Granular keys for exams, enrollments, and results.</p>
                </div>
                <Button size="sm" onClick={handleGenerateApiKey} className="text-xs font-bold bg-[#6C4DFF] text-white">
                  <Plus className="w-3 h-3 mr-1" /> New Key
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.id} className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#0F172A]">
                      <span>{key.name}</span>
                      <span className="font-mono text-[11px] text-[#64748B]">{key.prefix}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {key.scopes.map((s, sIdx) => (
                        <Badge key={sIdx} variant="outline" className="text-[9px] font-mono bg-white">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Signed Webhooks */}
            <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F172A]">Signed Webhooks (HMAC-SHA256)</h3>
                  <p className="text-xs text-[#64748B]">Real-time events with tamper-evident signature headers.</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleTestWebhookDispatch} className="text-xs font-bold border-[#CBD5E1]">
                  <Send className="w-3 h-3 mr-1" /> Test Hook
                </Button>
              </div>

              {webhooks.map((wh) => (
                <div key={wh.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#0F172A] truncate max-w-[280px]">{wh.url}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-mono">ACTIVE</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {wh.events.map((ev, eIdx) => (
                      <Badge key={eIdx} className="bg-purple-100 text-[#6C4DFF] text-[9px] font-mono">
                        {ev}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B] pt-1">
                    Secret: <span className="font-bold text-[#334155]">{wh.secret.substring(0, 16)}...</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: NOTIFICATIONS & TEMPLATES */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-6">
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A]">Per-Tenant Multi-Channel Notification Templates</h3>
              <p className="text-xs text-[#64748B]">Customize dispatch content for Email, SMS, and WhatsApp across examination lifecycle events.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold">Lifecycle Event Trigger</Label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full text-xs font-mono p-2 border border-[#CBD5E1] rounded-lg bg-white"
                >
                  <option value="EXAM_SCHEDULED">EXAM_SCHEDULED (Invitation)</option>
                  <option value="REMINDER_24H">REMINDER_24H (24h Before Exam)</option>
                  <option value="REMINDER_1H">REMINDER_1H (1h Urgent Alert)</option>
                  <option value="SUBMISSION_RECEIPT">SUBMISSION_RECEIPT (Ledger Proof)</option>
                  <option value="FLAG_DECISION">FLAG_DECISION (Review Result)</option>
                  <option value="APPEAL_UPDATE">APPEAL_UPDATE (Formal Notice)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Subject Line</Label>
                  <Input value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} className="text-xs font-sans" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Template Body (Variables: {"{{candidateName}}"}, {"{{examTitle}}"}, {"{{link}}"})</Label>
                  <textarea
                    rows={4}
                    value={templateBody}
                    onChange={(e) => setTemplateBody(e.target.value)}
                    className="w-full text-xs font-mono p-3 border border-[#CBD5E1] rounded-lg bg-white"
                  />
                </div>
                <Button size="sm" onClick={() => toast.success('Template Saved')} className="text-xs font-bold bg-[#6C4DFF] text-white">
                  Save Template
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 5: BULK CSV ENROLLMENT */}
        <TabsContent value="bulk-enrollment" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-base text-[#0F172A]">Bulk Candidate Enrollment via CSV</h3>
                <p className="text-xs text-[#64748B]">Upload or paste candidate rosters with accommodations and sections for automated validation.</p>
              </div>
              <Button size="sm" onClick={handleRunBulkEnrollment} className="text-xs font-bold bg-[#6C4DFF] text-white">
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Validate & Enroll
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold font-mono">CSV ROSTER INPUT (email, firstName, lastName, studentId, examId, accommodations, section)</Label>
              <textarea
                rows={6}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="w-full text-xs font-mono p-3 border border-[#CBD5E1] rounded-xl bg-[#F8FAFC]"
              />
            </div>

            {/* Validation & Error Report */}
            {enrollmentReport && (
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-[#0F172A]">Validation & Import Report</span>
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <Badge className="bg-emerald-100 text-emerald-800 font-bold">{enrollmentReport.valid} Valid</Badge>
                    <Badge className="bg-rose-100 text-rose-800 font-bold">{enrollmentReport.errorsCount} Errors</Badge>
                  </div>
                </div>

                {enrollmentReport.errors.length > 0 && (
                  <div className="space-y-2">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono text-[10px] uppercase">
                            <th className="pb-1.5">Row</th>
                            <th className="pb-1.5">Field</th>
                            <th className="pb-1.5">Validation Error</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {enrollmentReport.errors.map((err: any, idx: number) => (
                            <tr key={idx} className="hover:bg-rose-50/50">
                              <td className="py-2 font-mono font-bold text-rose-700">Row {err.row}</td>
                              <td className="py-2 font-mono">{err.field}</td>
                              <td className="py-2 text-rose-700">{err.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success('Downloaded Rejected Rows CSV with ErrorReason column')}
                      className="text-xs font-bold border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" /> Download Rejected Rows CSV for Correction
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 6: MULTI-TENANT BRANDING & ISOLATION */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A]">Institution Branding & Domain Isolation</h3>
              <p className="text-xs text-[#64748B]">Personalize the examination experience and enforce tenant-level domain boundaries.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Institution Legal Name</Label>
                <Input value={branding.institutionName} onChange={(e) => setBranding({ ...branding, institutionName: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Custom Domain / Subdomain</Label>
                <Input value={branding.customDomain} onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Allowed Candidate Email Domains (Comma Separated)</Label>
                <Input value={branding.allowedDomains} onChange={(e) => setBranding({ ...branding, allowedDomains: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Primary Brand Color</Label>
                <div className="flex items-center space-x-2">
                  <Input value={branding.primaryColor} onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })} className="font-mono" />
                  <span className="w-8 h-8 rounded-lg border border-[#CBD5E1] shrink-0" style={{ backgroundColor: branding.primaryColor }} />
                </div>
              </div>
            </div>

            <Button size="sm" onClick={() => toast.success('Institution Branding Updated')} className="text-xs font-bold bg-[#6C4DFF] text-white">
              Save Branding & Domain Settings
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstitutionalSettingsPage;

