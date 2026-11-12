import React, { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  Lock,
  Cpu,
  Server,
  EyeOff,
  Clock,
  AlertTriangle,
  FileText,
  KeyRound,
  Building2,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export const PrivacyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TRANSPARENCY' | 'DSR' | 'DPIA' | 'KEY_ROTATION'>('TRANSPARENCY');

  // DSR Submission Modal/State
  const [dsrType, setDsrType] = useState<'ACCESS' | 'CORRECTION' | 'DELETION'>('ACCESS');
  const [dsrDetails, setDsrDetails] = useState('');
  const [submittedDSRs, setSubmittedDSRs] = useState([
    {
      id: 'DSR-2026-904',
      type: 'ACCESS',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'IN_REVIEW',
      slaDaysRemaining: 27,
      isOverdue: false,
    },
    {
      id: 'DSR-2025-112',
      type: 'CORRECTION',
      submittedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: 'COMPLETED',
      slaDaysRemaining: 0,
      isOverdue: false,
    },
  ]);

  const handleDownloadPersonalArchive = () => {
    const exportBundle = {
      exportFormat: 'AssessIQ GDPR Article 15 Data Subject Export',
      candidateId: 'cand_student_2026',
      generatedAt: new Date().toISOString(),
      institution: 'Global University Examination Authority',
      dataSovereigntyFramework: 'GDPR (EU 2016/679) & FERPA (34 CFR Part 99)',
      consentRecord: {
        version: 'v2.2-compliance-2026',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        categories: {
          camera: true,
          microphone: true,
          biometrics: true,
          keystrokeData: true,
          roomScan: false,
          phoneCamera: false,
        },
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
      proctoringTelemetrySummary: {
        totalExamSessions: 3,
        averageIntegrityScore: 98.4,
        rawBiometricSnapshotsStored: 6,
        retentionPurgeDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessiq_gdpr_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('GDPR Personal Data Archive Exported', {
      description: 'Your complete JSON data bundle has been generated and downloaded.',
    });
  };

  const handleExportDpiaMarkdown = () => {
    const markdownContent = `# AssessIQ Data Protection Impact Assessment (DPIA) Data Inventory
**Institution:** University Examination Authority  
**Framework:** GDPR (Regulation EU 2016/679), FERPA (34 CFR Part 99)  
**Encryption Standard:** AES-256-GCM Per-Tenant Envelope Encryption with Annual Key Rotation  

## 1. Processing Architecture
- **In-Browser Local (Wasm):** High-FPS webcam stream, face mesh landmarking, audio FFT decibels, gaze vectors.
- **Server Encrypted at Rest:** Periodic low-res snapshots (AES-256-GCM), HMAC-signed telemetry events, hash-chained ledger.
- **Never Collected:** Continuous full-motion video cloud streaming, browsing history, GPS tracking, third-party data broker sharing.

## 2. Retention Schedules
- Evidence Clips: 14 Days
- Periodic Snapshots: 30 Days
- ID Verification Images: 7 Days (Purged immediately post-onboarding)
- Keystroke Rhythm Templates: 90 Days
- Audit Ledgers: 365 Days (1 Academic Year)
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessiq_dpia_inventory_2026.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('DPIA Report Exported', {
      description: 'Downloaded DPIA Markdown compliance inventory.',
    });
  };

  const handleDsrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dsrDetails.trim()) {
      toast.error('Please specify request details.');
      return;
    }

    const newDsr = {
      id: `DSR-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: dsrType,
      submittedAt: new Date().toLocaleDateString(),
      status: 'SUBMITTED',
      slaDaysRemaining: 30,
      isOverdue: false,
    };

    setSubmittedDSRs([newDsr, ...submittedDSRs]);
    setDsrDetails('');
    toast.success('Data Subject Request Submitted', {
      description: `Request ${newDsr.id} logged with 30-day statutory SLA deadline.`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 font-sans text-[#2B2350]">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-[#10B981] text-xs font-mono font-bold uppercase border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR, FERPA & HIPAA Biometric Compliance</span>
          </div>
          <h1 className="text-2xl font-black text-[#2B2350]">Privacy & Compliance Control Center</h1>
          <p className="text-xs text-slate-500 font-medium">
            Transparent data governance: local vs. cloud processing boundaries, statutory DSR rights, and cryptographic audits.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleDownloadPersonalArchive}
            className="bg-[#6C4DFF] hover:bg-[#5839ee] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download My Data (JSON)</span>
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs font-mono font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('TRANSPARENCY')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'TRANSPARENCY'
              ? 'border-[#6C4DFF] text-[#6C4DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Local vs. Cloud Transparency</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DSR')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'DSR'
              ? 'border-[#6C4DFF] text-[#6C4DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Data Subject Requests (DSR)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DPIA')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'DPIA'
              ? 'border-[#6C4DFF] text-[#6C4DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>DPIA Data Inventory</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('KEY_ROTATION')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'KEY_ROTATION'
              ? 'border-[#6C4DFF] text-[#6C4DFF]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Encryption & Key Rotation</span>
        </button>
      </div>

      {/* TAB 1: TRANSPARENCY (Local vs. Cloud) */}
      {activeTab === 'TRANSPARENCY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: In-Browser Local RAM (Wasm) */}
            <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200">
                <Cpu className="w-4 h-4" />
                <span>Runs Locally in Browser RAM</span>
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Zero Continuous Cloud Streaming</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Webcam Video Stream:</strong> Processed on-device using client WebAssembly (MediaPipe face mesh). Raw video is discarded after each 33ms frame.
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ambient Audio Monitoring:</strong> Web Audio FFT decibel volume analysis runs in client memory. No continuous microphone upload.
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Gaze Vector Calculation:</strong> Eye geometry ratios computed locally to determine forward screen attention.
                  </span>
                </li>
              </ul>
            </Card>

            {/* Box 2: Encrypted at Rest on Server */}
            <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-200">
                <Server className="w-4 h-4" />
                <span>Sent to Server (Encrypted at Rest)</span>
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Protected Telemetry & Answers</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Encrypted Periodic Snapshots:</strong> Low-res (320x240) JPEG captures taken every few minutes, encrypted with per-tenant AES-256-GCM.
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>HMAC-Signed Telemetry:</strong> Cryptographic violation events (fullscreen exits, secondary monitors, tab blurs).
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Hash-Chained Answers:</strong> Responses committed into an immutable SHA-256 audit ledger.
                  </span>
                </li>
              </ul>
            </Card>

            {/* Box 3: What is NEVER Collected */}
            <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg w-fit border border-rose-200">
                <EyeOff className="w-4 h-4" />
                <span>What is NEVER Collected</span>
              </div>
              <h3 className="font-bold text-sm text-[#0F172A]">Strict Anti-Spyware Guarantee</h3>
              <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <li className="flex items-start space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Continuous Raw Video:</strong> We never record, upload, or store 60-fps full-motion video streams.
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Personal Files or History:</strong> No access to desktop files, bookmarks, search history, or applications outside the browser window.
                  </span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Third-Party Sharing:</strong> Biometric embeddings are never sold or shared with third-party brokers or advertisers.
                  </span>
                </li>
              </ul>
            </Card>
          </div>

          {/* Institutional Alternative Process Notice */}
          <Card className="p-6 rounded-2xl bg-purple-50/50 border border-purple-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#6C4DFF]">
              <Building2 className="w-4 h-4" />
              <span>Right to Non-Automated Examination</span>
            </div>
            <h4 className="text-sm font-bold text-[#2B2350]">Institutional Alternative Testing Process</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Under institutional policy and GDPR Article 22, candidates who decline electronic proctoring consent are guaranteed an equitable alternative:
            </p>
            <div className="p-4 bg-white rounded-xl border border-purple-200 text-xs space-y-1.5 font-mono">
              <div><strong>Facility:</strong> University Testing & Disability Accommodations Center (Hall B, Room 204)</div>
              <div><strong>Format:</strong> In-person testing session administered by university proctor staff</div>
              <div><strong>Contact:</strong> <a href="mailto:testing-accommodations@institution.edu" className="text-[#6C4DFF] underline">testing-accommodations@institution.edu</a></div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: DATA SUBJECT REQUESTS (DSR) */}
      {activeTab === 'DSR' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Submit Request Form (5 Cols) */}
            <Card className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-[#0F172A]">Submit Data Subject Request</h3>
                <p className="text-xs text-slate-500 font-mono">Statutory 30-day fulfillment SLA (GDPR Art. 12)</p>
              </div>

              <form onSubmit={handleDsrSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Request Type</label>
                  <select
                    value={dsrType}
                    onChange={(e) => setDsrType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6C4DFF]"
                  >
                    <option value="ACCESS">ACCESS (Export all personal telemetry & audit logs)</option>
                    <option value="CORRECTION">CORRECTION (Rectify biographical or profile attributes)</option>
                    <option value="DELETION">DELETION / ERASURE (Right to be Forgotten)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Specific Request Details</label>
                  <textarea
                    rows={4}
                    value={dsrDetails}
                    onChange={(e) => setDsrDetails(e.target.value)}
                    placeholder="Describe specific sessions, attributes to correct, or scope of request..."
                    className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#6C4DFF]"
                  />
                </div>

                <Button type="submit" className="w-full bg-[#6C4DFF] hover:bg-[#5b3ce6] text-white font-bold py-2.5 rounded-xl">
                  Submit Formal DSR Request
                </Button>
              </form>
            </Card>

            {/* Existing Requests & SLA Status (7 Cols) */}
            <Card className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#0F172A]">Active Data Requests & Deadlines</h3>
                <span className="text-xs font-mono text-slate-500">{submittedDSRs.length} Requests Logged</span>
              </div>

              <div className="space-y-3">
                {submittedDSRs.map((dsr) => (
                  <div
                    key={dsr.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#0F172A]">{dsr.id}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {dsr.type}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Submitted: {dsr.submittedAt}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          dsr.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dsr.status}
                      </span>
                      {dsr.status !== 'COMPLETED' && (
                        <div className="text-[11px] font-mono text-[#6C4DFF] flex items-center justify-end space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{dsr.slaDaysRemaining} days remaining</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: DPIA DATA INVENTORY */}
      {activeTab === 'DPIA' && (
        <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">DPIA-Ready Data Element Catalog</h3>
              <p className="text-xs text-slate-500 font-mono">Article 30 Record of Processing Activities</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportDpiaMarkdown}
              className="border-slate-300 text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export DPIA Markdown
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Lawful Basis</th>
                  <th className="p-3">Processing Tier</th>
                  <th className="p-3">Retention</th>
                  <th className="p-3">Disposal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">Real-Time Webcam</td>
                  <td className="p-3 text-slate-600">Head pose & gaze tracking</td>
                  <td className="p-3 font-mono text-emerald-700">CONSENT</td>
                  <td className="p-3 font-mono text-blue-700">Client RAM (Wasm)</td>
                  <td className="p-3 text-slate-600">~33ms (Immediate discard)</td>
                  <td className="p-3 text-slate-600">Garbage collected</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">Ambient Audio (FFT)</td>
                  <td className="p-3 text-slate-600">Detect room speech</td>
                  <td className="p-3 font-mono text-emerald-700">CONSENT</td>
                  <td className="p-3 font-mono text-blue-700">Client RAM (Wasm)</td>
                  <td className="p-3 text-slate-600">100ms rolling window</td>
                  <td className="p-3 text-slate-600">Cyclic overwrite</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">Periodic Snapshots</td>
                  <td className="p-3 text-slate-600">Visual evidence audit</td>
                  <td className="p-3 font-mono text-emerald-700">CONTRACT</td>
                  <td className="p-3 font-mono text-purple-700">Server (AES-256-GCM)</td>
                  <td className="p-3 text-slate-600">30 Days</td>
                  <td className="p-3 text-slate-600">Cryptographic purge job</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">ID Verification Image</td>
                  <td className="p-3 text-slate-600">Impersonation prevention</td>
                  <td className="p-3 font-mono text-emerald-700">CONSENT</td>
                  <td className="p-3 font-mono text-purple-700">Server (AES-256-GCM)</td>
                  <td className="p-3 text-slate-600">7 Days post-exam</td>
                  <td className="p-3 text-slate-600">Cryptographic zero-fill</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">Keystroke Dynamics</td>
                  <td className="p-3 text-slate-600">Ghost-writing detection</td>
                  <td className="p-3 font-mono text-emerald-700">LEGITIMATE_INTEREST</td>
                  <td className="p-3 font-mono text-purple-700">Server (AES-256-GCM)</td>
                  <td className="p-3 text-slate-600">90 Days</td>
                  <td className="p-3 text-slate-600">Scheduled retention purge</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-[#0F172A]">Cryptographic Ledger</td>
                  <td className="p-3 text-slate-600">Integrity & accreditation</td>
                  <td className="p-3 font-mono text-emerald-700">LEGAL_OBLIGATION</td>
                  <td className="p-3 font-mono text-purple-700">SHA-256 Chain + AES</td>
                  <td className="p-3 text-slate-600">365 Days</td>
                  <td className="p-3 text-slate-600">Cold archive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: ENCRYPTION & KEY ROTATION */}
      {activeTab === 'KEY_ROTATION' && (
        <Card className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0F172A]">Cryptographic Architecture & Key Rotation</h3>
            <p className="text-xs text-slate-500 font-mono">FIPS 140-3 & AES-256-GCM Authenticated Envelope Encryption</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-[#2B2350] flex items-center space-x-1.5">
                <KeyRound className="w-4 h-4 text-[#6C4DFF]" />
                <span>Per-Tenant Envelope Isolation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Each educational institution maintains an isolated 256-bit AES master key ring. Data at rest is encrypted with individual 96-bit initialization vectors (IVs) and verified via 128-bit GCM authentication tags.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="font-bold text-[#2B2350] flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#6C4DFF]" />
                <span>Zero-Downtime Key Rotation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Key versions (v1, v2...) are preserved in an encrypted keystore. Legacy evidence remains securely decryptable during the 30-day appeal window without mass re-encryption delays.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrivacyPage;
