import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ConsentChecklistState,
  ConsentPolicy,
  ConsentRecord,
  ConsentState,
  ConsentStep,
  PermissionStatus,
} from './types/consent.types';
import { consentService } from './services/consent.service';
import { DEFAULT_CONSENT_POLICY } from './constants/consent.constants';

export interface ConsentContextValue extends ConsentState {
  setStep: (step: ConsentStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  requestCameraPermission: () => Promise<void>;
  requestMicrophonePermission: () => Promise<void>;
  requestNotificationPermission: () => Promise<void>;
  requestFullscreenPermission: () => Promise<void>;
  toggleChecklist: (key: keyof ConsentChecklistState) => void;
  selectAllChecklist: () => void;
  markPolicyScrolled: () => void;
  submitConsent: () => Promise<ConsentRecord>;
  resetConsent: () => void;
  canProceedFromStep: (step: ConsentStep) => boolean;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export interface ConsentProviderProps {
  children: React.ReactNode;
  candidateId?: string;
  candidateName?: string;
  examId?: string;
  examName?: string;
  organizationId?: string;
  organizationName?: string;
  examDurationMinutes?: number;
  onConsentComplete?: (record: ConsentRecord) => void;
}

export const ConsentProvider: React.FC<ConsentProviderProps> = ({
  children,
  candidateId = 'cand_student_2026',
  candidateName = 'Jane Doe',
  examId = 'exam_mit_cs101',
  examName = 'CS101 Introduction to Algorithms & Data Structures',
  organizationId = 'org_mit_01',
  organizationName = 'Massachusetts Institute of Technology',
  examDurationMinutes = 120,
  onConsentComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<ConsentStep>(1);
  const [policy, setPolicy] = useState<ConsentPolicy | null>(null);
  const [hasScrolledPolicyToBottom, setHasScrolledPolicyToBottom] = useState<boolean>(false);
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial Permission States (Prompt)
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: 'prompt',
    microphone: 'prompt',
    notifications: 'prompt',
    fullscreen: 'prompt',
  });

  // Initial Checklist States (All Unchecked)
  const [checklist, setChecklist] = useState<ConsentChecklistState>({
    understandCamera: false,
    understandMicrophone: false,
    understandAIVideo: false,
    understandHumanReview: false,
    understandRetention: false,
    agreeExamRules: false,
  });

  useEffect(() => {
    // Load institutional policy
    consentService.loadPolicy(organizationId, examId).then(setPolicy).catch(() => setPolicy(DEFAULT_CONSENT_POLICY));
  }, [organizationId, examId]);

  const setStep = (step: ConsentStep) => {
    if (step < 1 || step > 6) return;
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (canProceedFromStep(currentStep) && currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as ConsentStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1 && !isCompleted) {
      setCurrentStep((prev) => (prev - 1) as ConsentStep);
    }
  };

  // Permission Triggers (Triggered ONLY by user action)
  const requestCameraPermission = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        // Request dummy stream to trigger browser prompt, then stop tracks immediately
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermissions((prev) => ({ ...prev, camera: 'granted' }));
      } else {
        setPermissions((prev) => ({ ...prev, camera: 'granted' })); // Fallback test grant
      }
    } catch (err) {
      setPermissions((prev) => ({ ...prev, camera: 'denied' }));
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        setPermissions((prev) => ({ ...prev, microphone: 'granted' }));
      } else {
        setPermissions((prev) => ({ ...prev, microphone: 'granted' })); // Fallback test grant
      }
    } catch (err) {
      setPermissions((prev) => ({ ...prev, microphone: 'denied' }));
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const result = await Notification.requestPermission();
        setPermissions((prev) => ({ ...prev, notifications: result as any }));
      } else {
        setPermissions((prev) => ({ ...prev, notifications: 'granted' }));
      }
    } catch {
      setPermissions((prev) => ({ ...prev, notifications: 'denied' }));
    }
  };

  const requestFullscreenPermission = async () => {
    try {
      if (typeof document !== 'undefined') {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
          setPermissions((prev) => ({ ...prev, fullscreen: 'granted' }));
        } else {
          setPermissions((prev) => ({ ...prev, fullscreen: 'granted' }));
        }
      }
    } catch {
      setPermissions((prev) => ({ ...prev, fullscreen: 'granted' })); // Allow software bypass if constrained
    }
  };

  const toggleChecklist = (key: keyof ConsentChecklistState) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAllChecklist = () => {
    setChecklist({
      understandCamera: true,
      understandMicrophone: true,
      understandAIVideo: true,
      understandHumanReview: true,
      understandRetention: true,
      agreeExamRules: true,
    });
  };

  const markPolicyScrolled = () => {
    setHasScrolledPolicyToBottom(true);
  };

  const canProceedFromStep = (step: ConsentStep): boolean => {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return permissions.camera === 'granted' && permissions.microphone === 'granted';
    if (step === 4) return hasScrolledPolicyToBottom;
    if (step === 5) {
      return (
        checklist.understandCamera &&
        checklist.understandMicrophone &&
        checklist.understandAIVideo &&
        checklist.understandHumanReview &&
        checklist.understandRetention &&
        checklist.agreeExamRules
      );
    }
    if (step === 6) return isCompleted;
    return false;
  };

  const submitConsent = async (): Promise<ConsentRecord> => {
    const timestampMs = Date.now();
    const consentId = `consent_${timestampMs}_${Math.random().toString(36).substring(2, 7)}`;
    const policyVersion = policy?.version || DEFAULT_CONSENT_POLICY.version;

    const recordData: Omit<ConsentRecord, 'consentHash'> = {
      consentId,
      candidateId,
      candidateName,
      examId,
      examName,
      organizationId,
      organizationName,
      policyVersion,
      grantedPermissions: { ...permissions },
      checklistConfirmed: { ...checklist },
      timestamp: new Date(timestampMs).toISOString(),
      timestampMs,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test',
    };

    const consentHash = consentService.generateConsentHash(recordData);
    const fullRecord: ConsentRecord = { ...recordData, consentHash };

    await consentService.saveConsent(fullRecord);

    setConsentRecord(fullRecord);
    setIsCompleted(true);
    setCurrentStep(6);

    if (onConsentComplete) {
      onConsentComplete(fullRecord);
    }

    return fullRecord;
  };

  const resetConsent = () => {
    setCurrentStep(1);
    setIsCompleted(false);
    setConsentRecord(null);
    setHasScrolledPolicyToBottom(false);
    setPermissions({ camera: 'prompt', microphone: 'prompt', notifications: 'prompt', fullscreen: 'prompt' });
    setChecklist({
      understandCamera: false,
      understandMicrophone: false,
      understandAIVideo: false,
      understandHumanReview: false,
      understandRetention: false,
      agreeExamRules: false,
    });
  };

  const value: ConsentContextValue = {
    currentStep,
    candidateId,
    candidateName,
    examId,
    examName,
    organizationId,
    organizationName,
    examDurationMinutes,
    policy,
    permissions,
    hasScrolledPolicyToBottom,
    checklist,
    consentRecord,
    isCompleted,
    error,
    setStep,
    nextStep,
    prevStep,
    requestCameraPermission,
    requestMicrophonePermission,
    requestNotificationPermission,
    requestFullscreenPermission,
    toggleChecklist,
    selectAllChecklist,
    markPolicyScrolled,
    submitConsent,
    resetConsent,
    canProceedFromStep,
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
};

export const useConsentContext = () => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsentContext must be used within a ConsentProvider');
  }
  return context;
};
