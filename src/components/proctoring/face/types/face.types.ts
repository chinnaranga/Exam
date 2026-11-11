export type FacePresenceStatus = 'visible' | 'partially_visible' | 'no_face' | 'left_frame' | 'camera_blocked';

export type FaceQualityRating = 'excellent' | 'good' | 'fair' | 'poor';

export type VerificationStatus = 'verified' | 'failed' | 'required' | 'low_confidence' | 'unverified';

export type VerificationReason = 'initial_pre_exam' | 'periodic_check' | 'random_check' | 'manual_proctor_trigger';

export interface FaceBoundingBoxData {
  id: string;
  x: number; // Percentage or px offset
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  confidence: number; // 0..1
  visibility: number; // 0..1
}

export interface FaceDetectionResult {
  faceCount: number;
  faces: FaceBoundingBoxData[];
  primaryFace: FaceBoundingBoxData | null;
  inferenceTimeMs: number;
  fps: number;
  timestamp: string;
}

export interface FaceQualityResult {
  rating: FaceQualityRating;
  brightness: number; // 0..100
  contrast: number; // 0..100
  sharpness: number; // 0..100
  blurScore: number; // 0..100
  occlusionScore: number; // 0..100
  reasons: string[];
}

export interface FaceVerificationRecord {
  id: string;
  timestamp: string;
  reason: VerificationReason;
  status: VerificationStatus;
  similarityScore: number; // 0..100
  referenceSnapshotUrl?: string;
  currentSnapshotUrl?: string;
}

export interface CandidatePresenceTimelineItem {
  id: string;
  timestamp: string;
  status: FacePresenceStatus;
  durationMs: number;
  faceCount: number;
}

export interface FaceEvent {
  id: string;
  timestamp: string;
  module: 'FacePresence' | 'FaceDetector' | 'FaceVerification' | 'FaceQuality' | 'MultipleFace';
  type:
    | 'FaceDetected'
    | 'FaceLost'
    | 'LowConfidenceFace'
    | 'FaceMissing'
    | 'PartialFace'
    | 'FaceReturned'
    | 'CameraBlocked'
    | 'AdditionalPersonDetected'
    | 'MultipleFacesDetected'
    | 'PersonLeftFrame'
    | 'FaceVerified'
    | 'FaceVerificationFailed';
  severity: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: 'Low' | 'Medium' | 'High';
  explanation: string;
  limitations: string;
  details: Record<string, any>;
}

export interface FaceState {
  isEngineActive: boolean;
  presenceStatus: FacePresenceStatus;
  faceCount: number;
  primaryFace: FaceBoundingBoxData | null;
  quality: FaceQualityResult;
  verificationStatus: VerificationStatus;
  verificationHistory: FaceVerificationRecord[];
  presenceTimeline: CandidatePresenceTimelineItem[];
  seatedDurationMs: number;
  totalAbsenceDurationMs: number;
  fps: number;
  events: FaceEvent[];
}
