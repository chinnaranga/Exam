import { useState } from 'react';
import { faceVerificationService } from '../services/faceVerification.service';
import { FaceVerificationRecord, VerificationReason, VerificationStatus } from '../types/face.types';

/**
 * Custom hook `useFaceVerification` managing pre-exam reference snapshot capture
 * and non-continuous identity verification checks.
 */
export const useFaceVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [history, setHistory] = useState<FaceVerificationRecord[]>([]);

  const captureReferenceSnapshot = async (candidateId: string) => {
    await faceVerificationService.captureReferenceSnapshot(candidateId);
  };

  const runVerification = (reason: VerificationReason = 'manual_proctor_trigger'): FaceVerificationRecord => {
    const record = faceVerificationService.verifyFace(reason);
    setVerificationStatus(record.status);
    setHistory(faceVerificationService.getVerificationHistory());
    return record;
  };

  return {
    verificationStatus,
    history,
    captureReferenceSnapshot,
    runVerification,
    hasReference: faceVerificationService.hasReferenceSnapshot(),
  };
};
