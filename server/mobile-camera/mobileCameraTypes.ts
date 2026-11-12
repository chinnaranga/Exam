/**
 * AssessIQ Mobile Second Camera Architecture Types
 * Covers: 2-minute pairing tokens, WebRTC P2P signaling, setup placement verification,
 * room scan hashing, 30s disconnect enforcement, and rolling +/-10s encrypted evidence.
 */

export type SecondCameraMode = 'OFF' | 'OPTIONAL' | 'REQUIRED';

export type PairingTokenStatus = 'PENDING' | 'CLAIMED' | 'EXPIRED' | 'REVOKED';

export interface MobileDeviceInfo {
  userAgent: string;
  platform: string;
  screenResolution?: string;
  batteryLevel?: number;
}

export interface PairingTokenRecord {
  token: string;
  sessionId: string;
  examId: string;
  candidateId: string;
  createdAt: number;
  expiresAt: number; // 2 minutes from creation (createdAt + 120_000)
  status: PairingTokenStatus;
  claimedAt?: number;
  pairingUrl: string;
  mobileDeviceInfo?: MobileDeviceInfo;
}

export type WebRtcSignalType = 'OFFER' | 'ANSWER' | 'CANDIDATE';

export interface WebRtcSignalMessage {
  id: string;
  sessionId: string;
  sender: 'DESKTOP' | 'MOBILE';
  type: WebRtcSignalType;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface MobileCameraStatus {
  sessionId: string;
  isPaired: boolean;
  isConnected: boolean;
  lastHeartbeatAt: number;
  connectionDurationSec: number;
  disconnectCount: number;
  currentDisconnectDurationSec: number;
  lastDisconnectDurationSec: number;
  batteryLevel?: number;
  isRoomScanCompleted: boolean;
  setupCheckPassed: boolean;
}

export interface RoomScanRecord {
  sessionId: string;
  examId: string;
  scanCompletedAt: number;
  panDurationSeconds: number;
  frameHash: string; // SHA-256 of sampled frame sequence
  snapshots: Array<{
    id: string;
    timestamp: number;
    flagType?: string; // e.g. "DESK_EDGE_CHECK", "SECONDARY_DEVICE_SUSPECT"
    encryptedSnapshot: string;
  }>;
  auditDigest: string;
}

export interface ViolationEvidenceClip {
  clipId: string;
  sessionId: string;
  violationType: string;
  timestamp: number;
  durationSeconds: number; // ~20s (+/- 10s around event)
  encryptedPayload: string; // Client-encrypted WebM/MP4 buffer
  iv: string;
  authTag: string;
  uploadedAt: number;
}

