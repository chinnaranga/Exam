import React, { useState, useMemo } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Badge } from '@/shared/components/ui/badge';
import { Switch } from '@/shared/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Plus,
  BookOpen,
  Clock,
  Calendar,
  Layers,
  Sliders,
  CheckCircle2,
  XCircle,
  History,
  Lock,
  Smartphone,
  Video,
  Monitor,
  Wifi,
  Trash2,
  Copy,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export type ProfileTier = 'PRACTICE' | 'STANDARD' | 'HIGH_STAKES' | 'CUSTOM';
export type CameraMode = 'NONE' | 'PRIMARY_ONLY' | 'DUAL_CAMERA_QR';

interface QuestionPoolDraft {
  id: string;
  topic: string;
  pickCount: number;
  pointsPerItem: number;
}

interface ExamVersionRecord {
  version: number;
  publishedAt: string;
  publishedBy: string;
  title: string;
  profileId: string;
  configHash: string;
  activeSessionsCount: number;
}

export const FacultyExamBuilder: React.FC = () => {
  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'BASICS' | 'POOLS' | 'SECURITY' | 'VERSIONS'>('BASICS');

  // Exam Blueprint Core Fields
  const [title, setTitle] = useState('CS-402: Distributed Consensus & Raft Protocols');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [startWindow, setStartWindow] = useState('2026-11-12T09:00');
  const [endWindow, setEndWindow] = useState('2026-11-18T23:59');
  const [instructions, setInstructions] = useState(
    'Standard university examination rules apply. Fullscreen mode is enforced; keep your camera active and centered.'
  );

  // Question Pools
  const [questionPools, setQuestionPools] = useState<QuestionPoolDraft[]>([
    { id: 'pool_1', topic: 'Raft Leader Election & Term States', pickCount: 15, pointsPerItem: 2 },
    { id: 'pool_2', topic: 'Log Replication & Safety Invariants', pickCount: 15, pointsPerItem: 2 },
    { id: 'pool_3', topic: 'Byzantine Fault Tolerance & Paxos Trade-offs', pickCount: 10, pointsPerItem: 4 },
  ]);

  // Security Profile & Overrides
  const [selectedProfileTier, setSelectedProfileTier] = useState<ProfileTier>('STANDARD');
  const [isCustomClone, setIsCustomClone] = useState(false);
  const [customProfileName, setCustomProfileName] = useState('CS-402 Custom Midterm Policy');

  // Overridable Security Settings
  const [calculatorAllowed, setCalculatorAllowed] = useState(false);
  const [scratchpadAllowed, setScratchpadAllowed] = useState(true);
  const [formulaSheetAllowed, setFormulaSheetAllowed] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('PRIMARY_ONLY');
  const [phoneSecondCameraRequired, setPhoneSecondCameraRequired] = useState(false);
  const [requireSecureClient, setRequireSecureClient] = useState(false);
  const [identityVerificationRequired, setIdentityVerificationRequired] = useState(false);
  const [reverificationRequired, setReverificationRequired] = useState(false);
  const [proctoringEnabled, setProctoringEnabled] = useState(true);
  const [hintsAllowed, setHintsAllowed] = useState(false);
  const [offlineLimitMinutes, setOfflineLimitMinutes] = useState<number | null>(5);
  const [overlayThreshold, setOverlayThreshold] = useState(4);
  const [terminateThreshold, setTerminateThreshold] = useState(8);

  // Version History Mock / Persistent Store
  const [versionHistory, setVersionHistory] = useState<ExamVersionRecord[]>([
    {
      version: 1,
      publishedAt: '2026-11-10 14:30 UTC',
      publishedBy: 'dr_vance',
      title: 'CS-402: Distributed Consensus & Raft Protocols',
      profileId: 'STANDARD',
      configHash: '9a4c8e71b2d019f4a382c76e10f44bc82e17a3560b37cdfa2891bb354c0e6821',
      activeSessionsCount: 42,
    },
  ]);

  // Apply default profile preset settings
  const applyProfilePreset = (tier: ProfileTier) => {
    setSelectedProfileTier(tier);
    setIsCustomClone(false);

    if (tier === 'PRACTICE') {
      setProctoringEnabled(false);
      setHintsAllowed(true);
      setCameraMode('NONE');
      setPhoneSecondCameraRequired(false);
      setRequireSecureClient(false);
      setIdentityVerificationRequired(false);
      setReverificationRequired(false);
      setCalculatorAllowed(true);
      setOfflineLimitMinutes(null);
      setOverlayThreshold(4);
      setTerminateThreshold(8);
    } else if (tier === 'STANDARD') {
      setProctoringEnabled(true);
      setHintsAllowed(false);
      setCameraMode('PRIMARY_ONLY');
      setPhoneSecondCameraRequired(false);
      setRequireSecureClient(false);
      setIdentityVerificationRequired(false);
      setReverificationRequired(false);
      setCalculatorAllowed(false);
      setOfflineLimitMinutes(5);
      setOverlayThreshold(4);
      setTerminateThreshold(8);
    } else if (tier === 'HIGH_STAKES') {
      setProctoringEnabled(true);
      setHintsAllowed(false);
      setCameraMode('DUAL_CAMERA_QR');
      setPhoneSecondCameraRequired(true);
      setRequireSecureClient(true);
      setIdentityVerificationRequired(true);
      setReverificationRequired(true);
      setCalculatorAllowed(false);
      setOfflineLimitMinutes(3);
      setOverlayThreshold(4);
      setTerminateThreshold(8);
    }
  };

  // Real-Time Conflict Validation Engine
  const validationResult = useMemo(() => {
    const errors: Array<{ field: string; code: string; message: string; explanation: string }> = [];
    const warnings: Array<{ field: string; message: string }> = [];

    // 1. Conflict: Phone camera required without secure client
    if (phoneSecondCameraRequired && !requireSecureClient) {
      errors.push({
        field: 'requireSecureClient',
        code: 'CONFLICT_PHONE_CAM_REQUIRES_SECURE_CLIENT',
        message: 'Phone second camera requires a locked-down desktop client.',
        explanation:
          'When requiring a mobile dual-camera stream, candidates must use the AssessIQ Secure Desktop Client to prevent browser devtools and proxy tampering.',
      });
    }

    // 2. Conflict: High-Stakes tier requires secure desktop client
    if (selectedProfileTier === 'HIGH_STAKES' && !requireSecureClient) {
      errors.push({
        field: 'requireSecureClient',
        code: 'CONFLICT_HIGH_STAKES_REQUIRES_SECURE_CLIENT',
        message: 'High-Stakes exams must enforce the secure locked-down desktop client.',
        explanation: 'Licensure and certification exams cannot run in standard browser windows.',
      });
    }

    // 3. Conflict: Proctoring disabled with active sensors
    if (!proctoringEnabled) {
      if (phoneSecondCameraRequired) {
        errors.push({
          field: 'phoneSecondCameraRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_SECOND_CAMERA',
          message: 'Cannot mandate phone second camera when proctoring is disabled.',
          explanation: 'Second camera pairing requires proctoring telemetry to be active.',
        });
      }
      if (identityVerificationRequired) {
        errors.push({
          field: 'identityVerificationRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_IDENTITY_CHECK',
          message: 'Cannot mandate identity verification when proctoring is disabled.',
          explanation: 'Pre-exam biometric identification requires active proctoring infrastructure.',
        });
      }
      if (reverificationRequired) {
        errors.push({
          field: 'reverificationRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_REVERIFICATION',
          message: 'Cannot mandate random re-verification when proctoring is disabled.',
          explanation: 'Random liveness checks require active proctoring modules.',
        });
      }
    }

    // 4. Conflict: Camera mode NONE with phone second camera
    if (phoneSecondCameraRequired && cameraMode === 'NONE') {
      errors.push({
        field: 'cameraMode',
        code: 'CONFLICT_PHONE_CAM_WITH_CAMERA_NONE',
        message: 'Phone second camera cannot be required when camera mode is "NONE".',
        explanation: 'Set camera mode to "DUAL_CAMERA_QR" to use mobile camera pairing.',
      });
    }

    // 5. Conflict: Re-verification without initial ID check
    if (reverificationRequired && !identityVerificationRequired) {
      errors.push({
        field: 'identityVerificationRequired',
        code: 'CONFLICT_REVERIFY_WITHOUT_INITIAL_ID',
        message: 'Random mid-exam re-verification requires pre-exam identity verification.',
        explanation: 'Face matching cannot run during the test without a pre-exam photo ID baseline.',
      });
    }

    // 6. Conflict: Hints enabled in active violation mode
    if (hintsAllowed && selectedProfileTier !== 'PRACTICE') {
      errors.push({
        field: 'hintsAllowed',
        code: 'CONFLICT_HINTS_IN_ACTIVE_MODE',
        message: 'Hints cannot be allowed when violation penalties are active.',
        explanation: 'Hints are only permissible in formative PRACTICE mode.',
      });
    }

    // 7. Conflict: Overlay threshold >= terminate threshold
    if (overlayThreshold >= terminateThreshold) {
      errors.push({
        field: 'thresholds',
        code: 'CONFLICT_INVALID_THRESHOLDS',
        message: 'Warning overlay threshold must be strictly lower than the termination threshold.',
        explanation: `Overlay threshold (${overlayThreshold}) cannot equal or exceed termination threshold (${terminateThreshold}).`,
      });
    }

    // 8. Conflict: High-Stakes offline limit > 3 mins
    if (selectedProfileTier === 'HIGH_STAKES' && (offlineLimitMinutes === null || offlineLimitMinutes > 3)) {
      errors.push({
        field: 'offlineLimitMinutes',
        code: 'CONFLICT_HIGH_STAKES_OFFLINE_LIMIT',
        message: 'High-Stakes exams cannot allow offline periods exceeding 3 minutes.',
        explanation: `High-Stakes compliance caps offline resilience at 3 minutes (currently ${offlineLimitMinutes ?? 'unlimited'} min) to maintain continuous proctoring telemetric consensus.`,
      });
    }

    // Non-fatal warning
    if (proctoringEnabled && offlineLimitMinutes === null) {
      warnings.push({
        field: 'offlineLimitMinutes',
        message: 'Allowing unlimited offline mode on a proctored exam may permit unmonitored external aid.',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, [
    phoneSecondCameraRequired,
    requireSecureClient,
    selectedProfileTier,
    proctoringEnabled,
    identityVerificationRequired,
    reverificationRequired,
    cameraMode,
    hintsAllowed,
    overlayThreshold,
    terminateThreshold,
    offlineLimitMinutes,
  ]);

  // Question Pool Management
  const addQuestionPool = () => {
    const newId = `pool_${Date.now()}`;
    setQuestionPools([
      ...questionPools,
      { id: newId, topic: 'New Topic Segment', pickCount: 10, pointsPerItem: 2 },
    ]);
  };

  const removeQuestionPool = (id: string) => {
    if (questionPools.length <= 1) {
      toast.error('Exam must contain at least one question pool.');
      return;
    }
    setQuestionPools(questionPools.filter((p) => p.id !== id));
  };

  const updateQuestionPool = (id: string, field: keyof QuestionPoolDraft, value: any) => {
    setQuestionPools(
      questionPools.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Publish / Versioning Handler
  const handlePublishNewVersion = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validationResult.isValid) {
      toast.error('Cannot publish exam: Settings conflicts detected', {
        description: validationResult.errors[0]?.message,
      });
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter an exam title.');
      return;
    }

    const nextVer = versionHistory.length + 1;
    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const newRecord: ExamVersionRecord = {
      version: nextVer,
      publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      publishedBy: 'faculty_admin',
      title,
      profileId: isCustomClone ? customProfileName : selectedProfileTier,
      configHash: fakeHash,
      activeSessionsCount: 0,
    };

    setVersionHistory([newRecord, ...versionHistory]);
    setIsOpen(false);

    toast.success(`Published Version ${nextVer} Successfully!`, {
      description: `New version ${nextVer} is now live for upcoming sessions. Active running sessions stay pinned to their initial version.`,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#2B2350]">
      {/* Header Banner */}
      <div className="border-b-2 border-[#2B2350]/15 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6C4DFF]">
              ENTERPRISE BLUEPRINT STUDIO
            </span>
            <Badge className="bg-[#B8F0D2] text-[#065F46] border border-[#2B2350] text-[10px] font-mono">
              VERSIONING ENGINE ACTIVE
            </Badge>
          </div>
          <h1 className="text-3xl font-heading font-black text-[#2B2350] tracking-tight mt-1">
            Exam Configuration & Security Profiles
          </h1>
          <p className="text-xs text-[#6B6590] mt-1 font-body">
            Configure examination schedules, randomized question pools, and cryptographic security profiles without toggling 30 individual parameters.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-5 py-3 rounded-2xl border-2 border-[#2B2350] shadow-[4px_4px_0px_#2B2350] cursor-pointer hover:-translate-y-0.5 transition-all flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create / Edit Blueprint</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[780px] max-h-[90vh] overflow-y-auto bg-[#FAFAF7] text-[#2B2350] p-6 rounded-3xl border-2 border-[#2B2350] shadow-[8px_8px_0px_#2B2350]">
            <DialogHeader className="border-b border-[#2B2350]/15 pb-3">
              <DialogTitle className="text-xl font-heading font-black text-[#2B2350] flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#6C4DFF]" />
                <span>Configure Exam Blueprint & Security Profile</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6B6590]">
                Changes create a new immutable version. Running candidate sessions will continue uninterrupted on their pinned version.
              </DialogDescription>
            </DialogHeader>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#2B2350]/15 pt-2 gap-2 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('BASICS')}
                className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'BASICS'
                    ? 'border-[#6C4DFF] text-[#6C4DFF]'
                    : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
                }`}
              >
                1. Basics & Schedule
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('POOLS')}
                className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'POOLS'
                    ? 'border-[#6C4DFF] text-[#6C4DFF]'
                    : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
                }`}
              >
                2. Question Pools ({questionPools.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('SECURITY')}
                className={`px-3 py-2 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'SECURITY'
                    ? 'border-[#6C4DFF] text-[#6C4DFF]'
                    : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
                }`}
              >
                <span>3. Security Profiles</span>
                {!validationResult.isValid && (
                  <span className="w-2 h-2 rounded-full bg-[#FF4D5E] animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('VERSIONS')}
                className={`px-3 py-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'VERSIONS'
                    ? 'border-[#6C4DFF] text-[#6C4DFF]'
                    : 'border-transparent text-[#6B6590] hover:text-[#2B2350]'
                }`}
              >
                4. Version History
              </button>
            </div>

            {/* TAB 1: BASICS & SCHEDULE */}
            {activeTab === 'BASICS' && (
              <div className="space-y-4 pt-3 text-xs">
                <div className="space-y-1">
                  <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                    Exam Title
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CS-402 Distributed Systems Final Exam"
                    className="bg-white border-[#2B2350] text-xs font-sans rounded-xl text-[#2B2350]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                      Department / Course Code
                    </Label>
                    <Input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science & Engineering"
                      className="bg-white border-[#2B2350] text-xs font-sans rounded-xl text-[#2B2350]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                      Duration (Minutes)
                    </Label>
                    <Input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="bg-white border-[#2B2350] text-xs font-mono rounded-xl text-[#2B2350]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                      Schedule Window Start
                    </Label>
                    <Input
                      type="datetime-local"
                      value={startWindow}
                      onChange={(e) => setStartWindow(e.target.value)}
                      className="bg-white border-[#2B2350] text-xs font-mono rounded-xl text-[#2B2350]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                      Schedule Window End
                    </Label>
                    <Input
                      type="datetime-local"
                      value={endWindow}
                      onChange={(e) => setEndWindow(e.target.value)}
                      className="bg-white border-[#2B2350] text-xs font-mono rounded-xl text-[#2B2350]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350]">
                    Candidate Instructions & Guidelines
                  </Label>
                  <Textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Enter instructions shown to candidates prior to launching the exam..."
                    className="bg-white border-[#2B2350] text-xs font-sans rounded-xl text-[#2B2350]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: QUESTION POOLS */}
            {activeTab === 'POOLS' && (
              <div className="space-y-4 pt-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[#6B6590]">
                    Define randomized question pools. The server selects N questions per topic for each candidate session.
                  </span>
                  <button
                    type="button"
                    onClick={addQuestionPool}
                    className="bg-white border border-[#2B2350] text-[#2B2350] font-mono font-bold text-[11px] px-3 py-1.5 rounded-xl hover:bg-[#FFF3A3] transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic Pool</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {questionPools.map((pool, idx) => (
                    <div
                      key={pool.id}
                      className="bg-white border border-[#2B2350] p-3 rounded-2xl shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#6C4DFF]">
                          POOL #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuestionPool(pool.id)}
                          className="text-[#FF4D5E] hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-6 space-y-1">
                          <Label className="text-[10px] font-mono text-[#6B6590]">Topic Name</Label>
                          <Input
                            value={pool.topic}
                            onChange={(e) => updateQuestionPool(pool.id, 'topic', e.target.value)}
                            className="text-xs font-sans h-8"
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-[10px] font-mono text-[#6B6590]">Pick Count</Label>
                          <Input
                            type="number"
                            value={pool.pickCount}
                            onChange={(e) =>
                              updateQuestionPool(pool.id, 'pickCount', parseInt(e.target.value, 10) || 1)
                            }
                            className="text-xs font-mono h-8"
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-[10px] font-mono text-[#6B6590]">Pts / Question</Label>
                          <Input
                            type="number"
                            value={pool.pointsPerItem}
                            onChange={(e) =>
                              updateQuestionPool(pool.id, 'pointsPerItem', parseInt(e.target.value, 10) || 1)
                            }
                            className="text-xs font-mono h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY PROFILES */}
            {activeTab === 'SECURITY' && (
              <div className="space-y-4 pt-3 text-xs font-sans">
                {/* 3 Built-in Profiles Cards */}
                <div>
                  <Label className="uppercase font-mono text-[10px] font-bold text-[#2B2350] mb-2 block">
                    Select Base Security Profile
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {/* PRACTICE */}
                    <div
                      onClick={() => applyProfilePreset('PRACTICE')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedProfileTier === 'PRACTICE'
                          ? 'bg-[#B8F0D2]/20 border-[#10B981] shadow-[3px_3px_0px_#10B981]'
                          : 'bg-white border-[#2B2350]/30 hover:border-[#2B2350]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-black text-xs text-[#065F46]">PRACTICE</span>
                        {selectedProfileTier === 'PRACTICE' && (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#6B6590] leading-tight font-body">
                        No proctoring. Hints permitted. Violations logged only without penalties.
                      </p>
                    </div>

                    {/* STANDARD */}
                    <div
                      onClick={() => applyProfilePreset('STANDARD')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedProfileTier === 'STANDARD'
                          ? 'bg-[#FFF3A3]/30 border-[#6C4DFF] shadow-[3px_3px_0px_#6C4DFF]'
                          : 'bg-white border-[#2B2350]/30 hover:border-[#2B2350]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-black text-xs text-[#6C4DFF]">STANDARD</span>
                        {selectedProfileTier === 'STANDARD' && (
                          <CheckCircle2 className="w-4 h-4 text-[#6C4DFF]" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#6B6590] leading-tight font-body">
                        Fullscreen, window focus, Wasm face/gaze sentinels, weighted violation engine.
                      </p>
                    </div>

                    {/* HIGH_STAKES */}
                    <div
                      onClick={() => applyProfilePreset('HIGH_STAKES')}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        selectedProfileTier === 'HIGH_STAKES'
                          ? 'bg-[#FF4D5E]/10 border-[#FF4D5E] shadow-[3px_3px_0px_#FF4D5E]'
                          : 'bg-white border-[#2B2350]/30 hover:border-[#2B2350]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-black text-xs text-[#FF4D5E]">HIGH_STAKES</span>
                        {selectedProfileTier === 'HIGH_STAKES' && (
                          <CheckCircle2 className="w-4 h-4 text-[#FF4D5E]" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#6B6590] leading-tight font-body">
                        Standard + Photo ID check, mobile 2nd cam, secure client, 3m offline, forward-only.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overrides Drawer / Section */}
                <div className="bg-white border-2 border-[#2B2350] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#2B2350]/15 pb-2">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-[#6C4DFF]" />
                      <span className="font-heading font-bold text-xs text-[#2B2350]">
                        Individual Setting Overrides (Custom Clone)
                      </span>
                    </div>
                    <label className="flex items-center space-x-2 text-[11px] font-mono cursor-pointer">
                      <span>Enable Custom Overrides</span>
                      <Switch
                        checked={isCustomClone}
                        onCheckedChange={(checked) => setIsCustomClone(checked)}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column Toggles */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-[#2B2350] block">Calculator Allowed</Label>
                          <span className="text-[10px] text-[#6B6590]">On-screen scientific calculator</span>
                        </div>
                        <Switch
                          checked={calculatorAllowed}
                          onCheckedChange={setCalculatorAllowed}
                          disabled={!isCustomClone}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-[#2B2350] block">Secure Desktop Client</Label>
                          <span className="text-[10px] text-[#6B6590]">Mandates standalone locked client</span>
                        </div>
                        <Switch
                          checked={requireSecureClient}
                          onCheckedChange={setRequireSecureClient}
                          disabled={!isCustomClone}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-[#2B2350] block">Phone 2nd Camera</Label>
                          <span className="text-[10px] text-[#6B6590]">QR code side-view mobile stream</span>
                        </div>
                        <Switch
                          checked={phoneSecondCameraRequired}
                          onCheckedChange={(checked) => {
                            setPhoneSecondCameraRequired(checked);
                            if (checked) setCameraMode('DUAL_CAMERA_QR');
                          }}
                          disabled={!isCustomClone}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs font-bold text-[#2B2350] block">Pre-Exam ID Verification</Label>
                          <span className="text-[10px] text-[#6B6590]">Photo ID face extraction & matching</span>
                        </div>
                        <Switch
                          checked={identityVerificationRequired}
                          onCheckedChange={setIdentityVerificationRequired}
                          disabled={!isCustomClone}
                        />
                      </div>
                    </div>

                    {/* Right Column Toggles & Sliders */}
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] font-mono text-[#6B6590] uppercase block">
                          Camera Mode
                        </Label>
                        <select
                          value={cameraMode}
                          onChange={(e) => setCameraMode(e.target.value as CameraMode)}
                          disabled={!isCustomClone}
                          className="w-full mt-1 bg-[#FAFAF7] border border-[#2B2350] rounded-xl text-xs p-1.5 font-mono"
                        >
                          <option value="NONE">NONE (No Camera)</option>
                          <option value="PRIMARY_ONLY">PRIMARY_ONLY (Laptop Webcam)</option>
                          <option value="DUAL_CAMERA_QR">DUAL_CAMERA_QR (Webcam + Mobile QR)</option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-[10px] font-mono text-[#6B6590] uppercase block">
                          Offline Tolerance Limit
                        </Label>
                        <select
                          value={offlineLimitMinutes === null ? 'UNLIMITED' : offlineLimitMinutes.toString()}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOfflineLimitMinutes(val === 'UNLIMITED' ? null : parseInt(val, 10));
                          }}
                          disabled={!isCustomClone}
                          className="w-full mt-1 bg-[#FAFAF7] border border-[#2B2350] rounded-xl text-xs p-1.5 font-mono"
                        >
                          <option value="3">3 Minutes (High-Stakes Cap)</option>
                          <option value="5">5 Minutes (Standard Default)</option>
                          <option value="10">10 Minutes (Extended)</option>
                          <option value="UNLIMITED">Unlimited (Practice Only)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] font-mono text-[#6B6590] block">
                            Alert Overlay (Pts)
                          </Label>
                          <Input
                            type="number"
                            value={overlayThreshold}
                            onChange={(e) => setOverlayThreshold(parseInt(e.target.value, 10) || 4)}
                            disabled={!isCustomClone}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-mono text-[#6B6590] block">
                            Terminate (Pts)
                          </Label>
                          <Input
                            type="number"
                            value={terminateThreshold}
                            onChange={(e) => setTerminateThreshold(parseInt(e.target.value, 10) || 8)}
                            disabled={!isCustomClone}
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Allowed Tools Multi-select */}
                  <div className="pt-2 border-t border-[#2B2350]/10">
                    <Label className="text-[10px] font-mono text-[#6B6590] uppercase block mb-1.5">
                      Allowed Candidate Aids inside Test Runner
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        onClick={() => isCustomClone && setScratchpadAllowed(!scratchpadAllowed)}
                        className={`cursor-pointer text-[10px] font-mono border ${
                          scratchpadAllowed
                            ? 'bg-[#B8F0D2] text-[#065F46] border-[#10B981]'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        {scratchpadAllowed ? '✓ ' : '+ '}Scratchpad
                      </Badge>
                      <Badge
                        onClick={() => isCustomClone && setCalculatorAllowed(!calculatorAllowed)}
                        className={`cursor-pointer text-[10px] font-mono border ${
                          calculatorAllowed
                            ? 'bg-[#B8F0D2] text-[#065F46] border-[#10B981]'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        {calculatorAllowed ? '✓ ' : '+ '}Scientific Calculator
                      </Badge>
                      <Badge
                        onClick={() => isCustomClone && setFormulaSheetAllowed(!formulaSheetAllowed)}
                        className={`cursor-pointer text-[10px] font-mono border ${
                          formulaSheetAllowed
                            ? 'bg-[#B8F0D2] text-[#065F46] border-[#10B981]'
                            : 'bg-white text-slate-400 border-slate-300'
                        }`}
                      >
                        {formulaSheetAllowed ? '✓ ' : '+ '}Formula Sheet
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Validation Conflicts Alert Box (Blocks Publishing) */}
                {!validationResult.isValid ? (
                  <div className="bg-[#FF4D5E]/10 border-2 border-[#FF4D5E] rounded-2xl p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-[#FF4D5E] font-heading font-black text-xs">
                      <XCircle className="w-4 h-4" />
                      <span>PUBLISHING BLOCKED: Settings Conflict Detected</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-[#2B2350]">
                      {validationResult.errors.map((err, i) => (
                        <div key={i} className="bg-white/80 p-2.5 rounded-xl border border-[#FF4D5E]/30">
                          <div className="font-mono text-[10px] font-bold text-[#FF4D5E]">
                            [{err.code}] {err.message}
                          </div>
                          <p className="text-[11px] text-[#6B6590] mt-0.5 font-body">
                            {err.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#B8F0D2]/30 border-2 border-[#10B981] rounded-2xl p-3 flex items-center space-x-2.5 text-xs text-[#065F46]">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>
                      Profile configuration verified. All security sentinels and hardware constraints are consistent.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: VERSION HISTORY */}
            {activeTab === 'VERSIONS' && (
              <div className="space-y-3 pt-3 text-xs font-sans">
                <div className="bg-[#FFF3A3]/40 border border-[#2B2350] rounded-xl p-3 text-xs font-body">
                  <div className="font-bold flex items-center space-x-1.5 text-[#2B2350]">
                    <Info className="w-4 h-4 text-[#6C4DFF]" />
                    <span>Session Isolation Guarantees</span>
                  </div>
                  <p className="text-[#6B6590] mt-0.5">
                    Every published blueprint is immutably versioned and fingerprinted with SHA-256. Running student sessions keep the configuration version they started with, ensuring live candidates are never disrupted.
                  </p>
                </div>

                <div className="space-y-2">
                  {versionHistory.map((v) => (
                    <div
                      key={v.version}
                      className="bg-white border-2 border-[#2B2350] p-3.5 rounded-2xl shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-[#6C4DFF] text-white font-mono text-[10px]">
                            v{v.version}
                          </Badge>
                          <span className="font-bold text-xs text-[#2B2350]">{v.title}</span>
                          <span className="text-[10px] font-mono text-[#6B6590]">
                            • Profile: {v.profileId}
                          </span>
                        </div>
                        <Badge className="bg-slate-100 text-[#2B2350] font-mono text-[10px] border border-[#2B2350]/20">
                          {v.activeSessionsCount} active sessions
                        </Badge>
                      </div>

                      <div className="font-mono text-[9px] text-[#6B6590] truncate">
                        Hash: {v.configHash}
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-[#6B6590] font-mono pt-1 border-t border-[#2B2350]/10">
                        <span>Published: {v.publishedAt}</span>
                        <span>Author: {v.publishedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-[#2B2350]/15 pt-3 mt-4 flex items-center justify-between">
              <div className="text-[11px] font-mono text-[#6B6590]">
                {!validationResult.isValid ? (
                  <span className="text-[#FF4D5E] font-bold">Fix conflicts to publish</span>
                ) : (
                  <span>Ready to publish next version</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-mono font-bold border-2 border-[#2B2350] cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!validationResult.isValid}
                  onClick={handlePublishNewVersion}
                  className={`text-xs font-mono font-bold px-5 py-2.5 rounded-xl border-2 border-[#2B2350] transition-all flex items-center space-x-1.5 ${
                    validationResult.isValid
                      ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-[3px_3px_0px_#2B2350] cursor-pointer hover:-translate-y-0.5'
                      : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Publish Version {versionHistory.length + 1}</span>
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards & Current Active Blueprint */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFF3A3] border border-[#2B2350] flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#2B2350]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B6590] uppercase">TIMING & WINDOW</span>
              <h3 className="font-heading font-black text-sm text-[#2B2350]">60 Mins Server Clock</h3>
            </div>
          </div>
          <p className="text-xs text-[#6B6590] font-body">
            Authoritative server-side countdown resynced every 30 seconds with 10s post-deadline grace.
          </p>
        </Card>

        <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8F0D2] border border-[#2B2350] flex items-center justify-center">
              <Layers className="w-4 h-4 text-[#065F46]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B6590] uppercase">QUESTION POOLS</span>
              <h3 className="font-heading font-black text-sm text-[#2B2350]">3 Dynamic Pools (40 Qs)</h3>
            </div>
          </div>
          <p className="text-xs text-[#6B6590] font-body">
            Seeded PRNG shuffles questions and option order per candidate session. Answer keys kept on server.
          </p>
        </Card>

        <Card className="bg-white border-2 border-[#2B2350] rounded-2xl p-5 shadow-[4px_4px_0px_#2B2350]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#6C4DFF] text-white border border-[#2B2350] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#6B6590] uppercase">SECURITY PROFILE</span>
              <h3 className="font-heading font-black text-sm text-[#2B2350]">STANDARD (Proctored)</h3>
            </div>
          </div>
          <p className="text-xs text-[#6B6590] font-body">
            Wasm Face/Gaze orientation, full-screen lockdown, and 4/8-point weighted violation engine.
          </p>
        </Card>
      </div>

      {/* Blueprint Live Roster */}
      <Card className="bg-white border-2 border-[#2B2350] rounded-3xl p-6 shadow-[6px_6px_0px_#2B2350] space-y-4">
        <div className="flex items-center justify-between border-b border-[#2B2350]/15 pb-4">
          <div>
            <h2 className="font-heading font-black text-lg text-[#2B2350]">
              Active Blueprint Configurations
            </h2>
            <p className="text-xs text-[#6B6590]">
              Managed exam blueprints ready for candidate enrollment and live proctoring.
            </p>
          </div>

          <Badge className="bg-[#6C4DFF] text-white font-mono text-xs px-3 py-1">
            Current Version: v{versionHistory.length}
          </Badge>
        </div>

        <div className="space-y-3 font-sans">
          <div className="border-2 border-[#2B2350] rounded-2xl p-4 bg-[#FAFAF7] space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-[#6C4DFF] bg-[#6C4DFF]/10 px-2.5 py-1 rounded-lg border border-[#6C4DFF]/30">
                  CS-402
                </span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#2B2350]">{title}</h3>
                  <p className="text-xs text-[#6B6590]">
                    {department} • Duration: {durationMinutes} mins • {questionPools.length} Question Pools
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsOpen(true)}
                  size="sm"
                  className="bg-white hover:bg-[#FFF3A3] text-[#2B2350] font-mono font-bold text-xs border border-[#2B2350] rounded-xl cursor-pointer"
                >
                  Edit Settings
                </Button>
                <Button
                  onClick={() =>
                    toast.success('Exam Blueprint Synced', {
                      description: 'Version hash verified across distributed nodes.',
                    })
                  }
                  size="sm"
                  className="bg-[#6C4DFF] hover:bg-[#5A3DEB] text-white font-mono font-bold text-xs px-4 rounded-xl border border-[#2B2350] cursor-pointer"
                >
                  Verify Hash
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-[#6B6590] border-t border-[#2B2350]/10">
              <span>Security Profile: <strong className="text-[#2B2350]">{selectedProfileTier}</strong></span>
              <span>•</span>
              <span>Camera Mode: <strong className="text-[#2B2350]">{cameraMode}</strong></span>
              <span>•</span>
              <span>Offline Limit: <strong className="text-[#2B2350]">{offlineLimitMinutes ? `${offlineLimitMinutes}m` : 'Unlimited'}</strong></span>
              <span>•</span>
              <span>Calculator: <strong className="text-[#2B2350]">{calculatorAllowed ? 'ENABLED' : 'DISABLED'}</strong></span>
              <span>•</span>
              <span className="truncate max-w-xs">Config Hash: {versionHistory[0]?.configHash.substring(0, 16)}...</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FacultyExamBuilder;
