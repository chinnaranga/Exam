import React from 'react';
import { ConsentProvider, useConsentContext } from './ConsentContext';
import { PrivacyNotice } from './PrivacyNotice';
import { PermissionRequest } from './PermissionRequest';
import { PolicyAgreement } from './PolicyAgreement';
import { ConsentCheckbox } from './ConsentCheckbox';
import { ConsentSummary } from './ConsentSummary';
import { ConsentFooter } from './ConsentFooter';
import { CHECKLIST_STATEMENTS } from './constants/consent.constants';
import { ConsentCard } from './ConsentCard';

export interface ConsentManagerProps {
  candidateId?: string;
  candidateName?: string;
  examId?: string;
  examName?: string;
  organizationId?: string;
  organizationName?: string;
  examDurationMinutes?: number;
  onConsentComplete?: (record: any) => void;
  onProceedToNextPhase?: () => void;
}

const ConsentManagerContent: React.FC<{ onProceedToNextPhase?: () => void }> = ({ onProceedToNextPhase }) => {
  const {
    currentStep,
    candidateName,
    candidateId,
    examName,
    organizationName,
    examDurationMinutes,
    checklist,
    toggleChecklist,
    selectAllChecklist,
  } = useConsentContext();

  const stepTitles: Record<number, string> = {
    1: 'Step 1: Examination & Candidate Welcome',
    2: 'Step 2: Privacy Notice & Data Practices',
    3: 'Step 3: Required System Permissions',
    4: 'Step 4: Institutional Policy Agreement',
    5: 'Step 5: Candidate Explicit Consent Checklist',
    6: 'Step 6: Signed Cryptographic Consent Proof',
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: '#0f172a' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0284c7', fontWeight: 700 }}>
          {stepTitles[currentStep]}
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
          AssessIQ AI Proctoring Consent Manager • All AI proctoring engines remain <strong>DISABLED</strong> until consent is signed.
        </p>
      </div>

      {/* STEP 1: WELCOME SCREEN */}
      {currentStep === 1 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <ConsentCard title="Candidate & Examination Overview">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748b' }}>Candidate Name:</span>
                <div style={{ fontWeight: 600 }}>{candidateName}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Candidate ID:</span>
                <div style={{ fontWeight: 600 }}>{candidateId}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Organization:</span>
                <div style={{ fontWeight: 600 }}>{organizationName}</div>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Exam Duration:</span>
                <div style={{ fontWeight: 600 }}>{examDurationMinutes} minutes</div>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Examination:</span>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>{examName}</div>
            </div>
          </ConsentCard>

          <ConsentCard title="AssessIQ Ethical Proctoring Commitment" variant="accent">
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.5 }}>
              Welcome! Before your examination begins, AssessIQ requires your explicit consent for video, audio, and environmental integrity monitoring.
              All data is processed strictly according to institutional compliance policies.
            </p>
          </ConsentCard>
        </div>
      )}

      {/* STEP 2: PRIVACY NOTICE */}
      {currentStep === 2 && <PrivacyNotice />}

      {/* STEP 3: PERMISSIONS */}
      {currentStep === 3 && <PermissionRequest />}

      {/* STEP 4: POLICY AGREEMENT */}
      {currentStep === 4 && <PolicyAgreement />}

      {/* STEP 5: CONSENT CHECKLIST */}
      {currentStep === 5 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              Please confirm each item below. Every required item must be checked before proceeding.
            </p>
            <button
              type="button"
              onClick={selectAllChecklist}
              style={{
                backgroundColor: '#f1f5f9',
                color: '#0284c7',
                border: '1px solid #cbd5e1',
                padding: '0.3rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Select All
            </button>
          </div>

          <ConsentCheckbox
            id="chk_cam"
            label={CHECKLIST_STATEMENTS.understandCamera}
            checked={checklist.understandCamera}
            onChange={() => toggleChecklist('understandCamera')}
          />
          <ConsentCheckbox
            id="chk_mic"
            label={CHECKLIST_STATEMENTS.understandMicrophone}
            checked={checklist.understandMicrophone}
            onChange={() => toggleChecklist('understandMicrophone')}
          />
          <ConsentCheckbox
            id="chk_ai"
            label={CHECKLIST_STATEMENTS.understandAIVideo}
            checked={checklist.understandAIVideo}
            onChange={() => toggleChecklist('understandAIVideo')}
          />
          <ConsentCheckbox
            id="chk_human"
            label={CHECKLIST_STATEMENTS.understandHumanReview}
            checked={checklist.understandHumanReview}
            onChange={() => toggleChecklist('understandHumanReview')}
          />
          <ConsentCheckbox
            id="chk_retention"
            label={CHECKLIST_STATEMENTS.understandRetention}
            checked={checklist.understandRetention}
            onChange={() => toggleChecklist('understandRetention')}
          />
          <ConsentCheckbox
            id="chk_rules"
            label={CHECKLIST_STATEMENTS.agreeExamRules}
            checked={checklist.agreeExamRules}
            onChange={() => toggleChecklist('agreeExamRules')}
          />
        </div>
      )}

      {/* STEP 6: CONSENT SUMMARY */}
      {currentStep === 6 && <ConsentSummary onProceedToEnvironmentCheck={onProceedToNextPhase} />}

      {/* Footer Navigation */}
      <ConsentFooter onProceedToNextPhase={onProceedToNextPhase} />
    </div>
  );
};

export const ConsentManager: React.FC<ConsentManagerProps> = (props) => {
  return (
    <ConsentProvider {...props}>
      <ConsentManagerContent onProceedToNextPhase={props.onProceedToNextPhase} />
    </ConsentProvider>
  );
};
