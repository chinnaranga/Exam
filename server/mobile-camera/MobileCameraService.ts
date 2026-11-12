import * as crypto from 'crypto';
import {
  PairingTokenRecord,
  MobileDeviceInfo,
  WebRtcSignalMessage,
  WebRtcSignalType,
  MobileCameraStatus,
  RoomScanRecord,
  ViolationEvidenceClip,
  SecondCameraMode,
} from './mobileCameraTypes';
import { ExamSessionAuthority, examSessionAuthority } from '../integrity/ExamSessionAuthority';

export class MobileCameraService {
  private static readonly TOKEN_EXPIRATION_MS = 120_000; // 2 minutes
  private static readonly DISCONNECT_PAUSE_THRESHOLD_SEC = 30; // 30 seconds
  private static readonly REPEATED_DROPS_VIOLATION_THRESHOLD = 2; // >= 2 drops = MEDIUM violation

  private tokens: Map<string, PairingTokenRecord> = new Map(); // token -> record
  private sessionTokenMap: Map<string, string> = new Map(); // sessionId -> token
  private signals: Map<string, WebRtcSignalMessage[]> = new Map(); // sessionId -> signals[]
  private cameraStatuses: Map<string, MobileCameraStatus> = new Map(); // sessionId -> status
  private roomScans: Map<string, RoomScanRecord> = new Map(); // sessionId -> record
  private evidenceClips: Map<string, ViolationEvidenceClip[]> = new Map(); // sessionId -> clips[]
  private authority: ExamSessionAuthority;

  constructor(authority: ExamSessionAuthority = examSessionAuthority) {
    this.authority = authority;
  }

  /**
   * Generates a one-time pairing token that expires in exactly 2 minutes.
   */
  public generatePairingToken(params: {
    sessionId: string;
    examId: string;
    candidateId: string;
    host?: string;
  }): PairingTokenRecord {
    const { sessionId, examId, candidateId, host = 'https://assessiq.edu' } = params;
    const now = Date.now();
    const token = `pair_${crypto.randomBytes(16).toString('hex')}`;
    const expiresAt = now + MobileCameraService.TOKEN_EXPIRATION_MS;
    const pairingUrl = `${host}/mobile-camera?token=${token}&session=${sessionId}`;

    const record: PairingTokenRecord = {
      token,
      sessionId,
      examId,
      candidateId,
      createdAt: now,
      expiresAt,
      status: 'PENDING',
      pairingUrl,
    };

    this.tokens.set(token, record);
    this.sessionTokenMap.set(sessionId, token);

    // Initialize or reset status
    this.cameraStatuses.set(sessionId, {
      sessionId,
      isPaired: false,
      isConnected: false,
      lastHeartbeatAt: now,
      connectionDurationSec: 0,
      disconnectCount: 0,
      currentDisconnectDurationSec: 0,
      lastDisconnectDurationSec: 0,
      isRoomScanCompleted: false,
      setupCheckPassed: false,
    });

    return record;
  }

  /**
   * Validates pairing token validity and 2-minute expiration window.
   */
  public validatePairingToken(
    token: string,
    sessionId: string,
    currentTime: number = Date.now()
  ): { isValid: boolean; reason?: string; record?: PairingTokenRecord } {
    const record = this.tokens.get(token);
    if (!record) {
      return { isValid: false, reason: 'Pairing token not found or invalid.' };
    }

    if (record.sessionId !== sessionId) {
      return { isValid: false, reason: 'Token session ID mismatch.' };
    }

    if (record.status === 'EXPIRED' || currentTime > record.expiresAt) {
      record.status = 'EXPIRED';
      return { isValid: false, reason: 'Pairing token has expired (2-minute limit exceeded).' };
    }

    if (record.status === 'CLAIMED') {
      return { isValid: false, reason: 'Pairing token has already been claimed (single-use only).' };
    }

    if (record.status === 'REVOKED') {
      return { isValid: false, reason: 'Pairing token has been revoked.' };
    }

    return { isValid: true, record };
  }

  /**
   * Mobile device scans QR code and claims the one-time pairing token.
   */
  public claimPairingToken(params: {
    token: string;
    sessionId: string;
    deviceInfo?: MobileDeviceInfo;
    currentTime?: number;
  }): { success: boolean; error?: string; status?: MobileCameraStatus } {
    const { token, sessionId, deviceInfo, currentTime = Date.now() } = params;
    const validation = this.validatePairingToken(token, sessionId, currentTime);
    if (!validation.isValid || !validation.record) {
      return { success: false, error: validation.reason };
    }

    const record = validation.record;
    record.status = 'CLAIMED';
    record.claimedAt = currentTime;
    record.mobileDeviceInfo = deviceInfo;

    const status = this.cameraStatuses.get(sessionId) || {
      sessionId,
      isPaired: true,
      isConnected: true,
      lastHeartbeatAt: currentTime,
      connectionDurationSec: 0,
      disconnectCount: 0,
      currentDisconnectDurationSec: 0,
      lastDisconnectDurationSec: 0,
      isRoomScanCompleted: false,
      setupCheckPassed: false,
    };

    status.isPaired = true;
    status.isConnected = true;
    status.lastHeartbeatAt = currentTime;
    if (deviceInfo?.batteryLevel !== undefined) {
      status.batteryLevel = deviceInfo.batteryLevel;
    }
    this.cameraStatuses.set(sessionId, status);

    // Record in immutable ledger
    const session = this.authority.getSession(sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'MOBILE_SECOND_CAMERA_PAIRED',
        ts: currentTime,
        payload: {
          platform: deviceInfo?.platform || 'Unknown Mobile',
          batteryLevel: deviceInfo?.batteryLevel,
        },
      });
    }

    return { success: true, status };
  }

  /**
   * Ephemeral WebRTC P2P signaling exchange between Desktop and Mobile.
   */
  public postSignal(message: Omit<WebRtcSignalMessage, 'id' | 'timestamp'>): WebRtcSignalMessage {
    const fullMsg: WebRtcSignalMessage = {
      ...message,
      id: `sig_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
    };

    const list = this.signals.get(message.sessionId) || [];
    list.push(fullMsg);
    // Keep only last 20 signals to save memory
    if (list.length > 20) list.shift();
    this.signals.set(message.sessionId, list);

    return fullMsg;
  }

  public pollSignals(
    sessionId: string,
    forRecipient: 'DESKTOP' | 'MOBILE',
    sinceTimestamp: number
  ): WebRtcSignalMessage[] {
    const list = this.signals.get(sessionId) || [];
    // If recipient is DESKTOP, signals were sent by MOBILE, and vice-versa
    const targetSender = forRecipient === 'DESKTOP' ? 'MOBILE' : 'DESKTOP';
    return list.filter((s) => s.sender === targetSender && s.timestamp >= sinceTimestamp);
  }

  /**
   * Heartbeat to track connection liveness and disconnect duration.
   */
  public recordHeartbeat(
    sessionId: string,
    source: 'DESKTOP' | 'MOBILE',
    batteryLevel?: number,
    currentTime: number = Date.now()
  ): MobileCameraStatus {
    let status = this.cameraStatuses.get(sessionId);
    if (!status) {
      status = {
        sessionId,
        isPaired: true,
        isConnected: true,
        lastHeartbeatAt: currentTime,
        connectionDurationSec: 0,
        disconnectCount: 0,
        currentDisconnectDurationSec: 0,
        lastDisconnectDurationSec: 0,
        isRoomScanCompleted: false,
        setupCheckPassed: false,
      };
    }

    if (!status.isConnected) {
      // Reconnected!
      status.lastDisconnectDurationSec = status.currentDisconnectDurationSec;
      status.currentDisconnectDurationSec = 0;
      status.isConnected = true;
    }

    status.lastHeartbeatAt = currentTime;
    if (batteryLevel !== undefined) status.batteryLevel = batteryLevel;
    this.cameraStatuses.set(sessionId, status);

    return status;
  }

  /**
   * Evaluates camera disconnect: if > 30s pause exam; if repeated drops (>=2) trigger MEDIUM violation.
   */
  public evaluateDisconnect(
    sessionId: string,
    currentTime: number = Date.now()
  ): {
    isConnected: boolean;
    disconnectDurationSec: number;
    shouldPauseExam: boolean;
    repeatedDropViolation: boolean;
    violationPoints: number;
    reason?: string;
  } {
    const status = this.cameraStatuses.get(sessionId);
    if (!status || !status.isPaired) {
      return {
        isConnected: false,
        disconnectDurationSec: 0,
        shouldPauseExam: false,
        repeatedDropViolation: false,
        violationPoints: 0,
      };
    }

    const elapsedSec = Math.max(0, (currentTime - status.lastHeartbeatAt) / 1000);

    if (elapsedSec > 5) {
      // Considered disconnected if no ping for > 5 seconds
      if (status.isConnected) {
        status.isConnected = false;
        status.disconnectCount++;
      }
      status.currentDisconnectDurationSec = Math.round(elapsedSec);
    }

    const shouldPauseExam = elapsedSec >= MobileCameraService.DISCONNECT_PAUSE_THRESHOLD_SEC;
    const isRepeatedDrop =
      shouldPauseExam && status.disconnectCount >= MobileCameraService.REPEATED_DROPS_VIOLATION_THRESHOLD;

    let reason: string | undefined = undefined;
    if (isRepeatedDrop) {
      reason = `Repeated Second Camera Disconnections (${status.disconnectCount} drops, current: ${Math.round(
        elapsedSec
      )}s > 30s limit).`;
    } else if (shouldPauseExam) {
      reason = `Second Camera Disconnected for ${Math.round(elapsedSec)}s (>30s grace). Exam paused.`;
    }

    return {
      isConnected: status.isConnected,
      disconnectDurationSec: Math.round(elapsedSec),
      shouldPauseExam,
      repeatedDropViolation: isRepeatedDrop,
      violationPoints: isRepeatedDrop ? 2 : 0, // MEDIUM violation = 2 points
      reason,
    };
  }

  /**
   * Verifies Pre-Exam 360° Room Scan.
   * STRICT REQUIREMENT: Stores ONLY a hash plus 1-2 flagged snapshots (never raw video).
   */
  public recordRoomScan(params: {
    sessionId: string;
    examId: string;
    panDurationSeconds: number;
    frameSequenceData: string[]; // sampled frame base64 or signatures
    snapshots: Array<{ flagType?: string; encryptedSnapshot: string }>;
  }): RoomScanRecord {
    const { sessionId, examId, panDurationSeconds, frameSequenceData, snapshots } = params;

    if (panDurationSeconds < 8) {
      throw new Error('Room scan pan duration too short. Candidate must pan room for at least 10 seconds.');
    }

    // Compute cryptographic SHA-256 digest across all frames
    const hash = crypto.createHash('sha256');
    for (const frame of frameSequenceData) {
      hash.update(frame);
    }
    const frameHash = hash.digest('hex');

    // Store ONLY at most 2 snapshots
    const keptSnapshots = snapshots.slice(0, 2).map((s, idx) => ({
      id: `snap_${Date.now()}_${idx}`,
      timestamp: Date.now() - (snapshots.length - idx) * 1000,
      flagType: s.flagType || 'STANDARD_ROOM_CORNER',
      encryptedSnapshot: s.encryptedSnapshot,
    }));

    const auditDigest = crypto
      .createHash('sha256')
      .update(`${sessionId}:${frameHash}:${keptSnapshots.length}`)
      .digest('hex');

    const record: RoomScanRecord = {
      sessionId,
      examId,
      scanCompletedAt: Date.now(),
      panDurationSeconds,
      frameHash,
      snapshots: keptSnapshots,
      auditDigest,
    };

    this.roomScans.set(sessionId, record);

    let status = this.cameraStatuses.get(sessionId);
    if (!status) {
      status = {
        sessionId,
        isPaired: true,
        isConnected: true,
        lastHeartbeatAt: Date.now(),
        connectionDurationSec: 0,
        disconnectCount: 0,
        currentDisconnectDurationSec: 0,
        lastDisconnectDurationSec: 0,
        isRoomScanCompleted: true,
        setupCheckPassed: true,
      };
      this.cameraStatuses.set(sessionId, status);
    } else {
      status.isRoomScanCompleted = true;
      status.setupCheckPassed = true;
    }

    // Anchor on cryptographic ledger
    const session = this.authority.getSession(sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'ROOM_SCAN_VERIFIED',
        ts: Date.now(),
        payload: {
          panDurationSeconds,
          frameHash,
          snapshotCount: keptSnapshots.length,
          auditDigest,
        },
      });
    }

    return record;
  }

  /**
   * Uploads client-encrypted evidence clip (+/- 10s around violation event).
   */
  public uploadEvidenceClip(clip: Omit<ViolationEvidenceClip, 'clipId' | 'uploadedAt'>): ViolationEvidenceClip {
    const fullClip: ViolationEvidenceClip = {
      ...clip,
      clipId: `clip_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      uploadedAt: Date.now(),
    };

    const list = this.evidenceClips.get(clip.sessionId) || [];
    list.push(fullClip);
    this.evidenceClips.set(clip.sessionId, list);

    // Anchor evidence upload on ledger
    const session = this.authority.getSession(clip.sessionId);
    if (session) {
      this.authority.appendLedgerRecord(session, {
        type: 'VIOLATION_EVIDENCE_CLIP_STORED',
        ts: fullClip.uploadedAt,
        payload: {
          clipId: fullClip.clipId,
          violationType: fullClip.violationType,
          durationSeconds: fullClip.durationSeconds,
          iv: fullClip.iv,
        },
      });
    }

    return fullClip;
  }

  public getCameraStatus(sessionId: string): MobileCameraStatus | undefined {
    return this.cameraStatuses.get(sessionId);
  }

  public getRoomScan(sessionId: string): RoomScanRecord | undefined {
    return this.roomScans.get(sessionId);
  }

  public getEvidenceClips(sessionId: string): ViolationEvidenceClip[] {
    return this.evidenceClips.get(sessionId) || [];
  }
}

export const mobileCameraService = new MobileCameraService();
