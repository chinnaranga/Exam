import React from 'react';
import { useConsent } from './hooks/useConsent';

export interface ConsentFooterProps {
  onProceedToNextPhase?: () => void;
}

export const ConsentFooter: React.FC<ConsentFooterProps> = ({ onProceedToNextPhase }) => {
  const { currentStep, prevStep, nextStep, submitConsent, canProceedFromStep, isCompleted } = useConsent();

  const handleNextClick = async () => {
    if (currentStep === 5) {
      await submitConsent();
    } else if (currentStep === 6) {
      if (onProceedToNextPhase) onProceedToNextPhase();
    } else {
      nextStep();
    }
  };

  const isNextDisabled = !canProceedFromStep(currentStep) && !isCompleted;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1.25rem',
        marginTop: '1.5rem',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      {/* Back Button */}
      {currentStep > 1 && currentStep < 6 && !isCompleted ? (
        <button
          type="button"
          onClick={prevStep}
          style={{
            backgroundColor: '#ffffff',
            color: '#475569',
            border: '1px solid #cbd5e1',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            fontWeight: 500,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      ) : (
        <div />
      )}

      {/* Step Indicator Text */}
      <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
        Step {currentStep} of 6
      </span>

      {/* Action Trigger Button */}
      {currentStep < 6 && (
        <button
          type="button"
          onClick={handleNextClick}
          disabled={isNextDisabled}
          style={{
            backgroundColor: isNextDisabled ? '#cbd5e1' : '#0284c7',
            color: '#ffffff',
            border: 'none',
            padding: '0.6rem 1.4rem',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: isNextDisabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          {currentStep === 5 ? 'Sign & Complete Consent' : 'Continue →'}
        </button>
      )}
    </div>
  );
};
