import { describe, it, expect, beforeEach } from 'vitest';
import { MobileCameraService } from '../MobileCameraService';
import { ExamSessionAuthority } from '../../integrity/ExamSessionAuthority';

describe('AssessIQ Mobile Second Camera Architecture', () => {
  let authority: ExamSessionAuthority;
  let service: MobileCameraService;

  beforeEach(() => {
    authority = new ExamSessionAuthority();
    service = new MobileCameraService(authority);

    // Initialize mock session
    authority.startSession({
      sessionId: 'sess_mobile_test',
      examId: 'exam_cs101',
      candidateId: 'cand_alice',
      durationSeconds: 3600,
    });
  });

  describe('1. One-Time Pairing Token & 2-Minute Expiration', () => {
    it('generates a valid pairing token with 2-minute expiry and pairing URL', () => {
      const now = Date.now();
      const tokenRecord = service.generatePairingToken({
        sessionId: 'sess_mobile_test',
        examId: 'exam_cs101',
        candidateId: 'cand_alice',
      });

      expect(tokenRecord.token).toBeDefined();
      expect(tokenRecord.token.startsWith('pair_')).toBe(true);
      expect(tokenRecord.status).toBe('PENDING');
      expect(tokenRecord.expiresAt).toBeGreaterThanOrEqual(now + 119_000);
      expect(tokenRecord.expiresAt).toBeLessThanOrEqual(now + 121_000);
      expect(tokenRecord.pairingUrl).toContain(`/mobile-camera?token=${tokenRecord.token}&session=sess_mobile_test`);
    });

    it('successfully claims token from mobile device within 2 minutes', () => {
      const tokenRecord = service.generatePairingToken({
        sessionId: 'sess_mobile_test',
        examId: 'exam_cs101',
        candidateId: 'cand_alice',
      });

      const claimResult = service.claimPairingToken({
        token: tokenRecord.token,
        sessionId: 'sess_mobile_test',
        deviceInfo: {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          platform: 'iOS',
          batteryLevel: 0.85,
        },
      });

      expect(claimResult.success).toBe(true);
      expect(claimResult.status?.isPaired).toBe(true);
      expect(claimResult.status?.isConnected).toBe(true);
      expect(claimResult.status?.batteryLevel).toBe(0.85);

      // Verify token record status is now CLAIMED
      const validation = service.validatePairingToken(tokenRecord.token, 'sess_mobile_test');
      expect(validation.isValid).toBe(false);
      expect(validation.reason).toContain('already been claimed');
    });

    it('rejects pairing token if 2-minute expiration window has elapsed', () => {
      const tokenRecord = service.generatePairingToken({
        sessionId: 'sess_mobile_test',
        examId: 'exam_cs101',
        candidateId: 'cand_alice',
      });

      const expiredTime = tokenRecord.createdAt + 125_000; // 2 minutes and 5 seconds later
      const claimResult = service.claimPairingToken({
        token: tokenRecord.token,
        sessionId: 'sess_mobile_test',
        currentTime: expiredTime,
      });

      expect(claimResult.success).toBe(false);
      expect(claimResult.error).toContain('Pairing token has expired');
    });

    it('rejects token if session ID does not match', () => {
      const tokenRecord = service.generatePairingToken({
        sessionId: 'sess_mobile_test',
        examId: 'exam_cs101',
        candidateId: 'cand_alice',
      });

      const claimResult = service.claimPairingToken({
        token: tokenRecord.token,
        sessionId: 'sess_wrong_attacker',
      });

      expect(claimResult.success).toBe(false);
      expect(claimResult.error).toContain('mismatch');
    });
  });

  describe('2. WebRTC Peer-to-Peer Signaling', () => {
    it('relays WebRTC offer, answer, and ICE candidates between desktop and mobile', () => {
      // 1. Mobile sends OFFER
      const offerMsg = service.postSignal({
        sessionId: 'sess_mobile_test',
        sender: 'MOBILE',
        type: 'OFFER',
        payload: { sdp: 'v=0\r\no=mobile 1234 5678...' },
      });

      // 2. Desktop polls for mobile signals
      const desktopReceived = service.pollSignals('sess_mobile_test', 'DESKTOP', 0);
      expect(desktopReceived.length).toBe(1);
      expect(desktopReceived[0].type).toBe('OFFER');
      expect(desktopReceived[0].sender).toBe('MOBILE');

      // 3. Desktop replies with ANSWER
      service.postSignal({
        sessionId: 'sess_mobile_test',
        sender: 'DESKTOP',
        type: 'ANSWER',
        payload: { sdp: 'v=0\r\no=desktop 8765 4321...' },
      });

      // 4. Mobile polls for desktop signals
      const mobileReceived = service.pollSignals('sess_mobile_test', 'MOBILE', offerMsg.timestamp);
      expect(mobileReceived.length).toBe(1);
      expect(mobileReceived[0].type).toBe('ANSWER');
      expect(mobileReceived[0].sender).toBe('DESKTOP');
    });
  });

  describe('3. Pre-Exam 360° Room Scan Hashing & Snapshots', () => {
    it('verifies room scan, computes SHA-256 frame hash, and strictly limits snapshots to at most 2', () => {
      const frameData = [
        'frame_data_corner_1_base64_sample',
        'frame_data_desk_surface_base64_sample',
        'frame_data_door_window_base64_sample',
        'frame_data_under_desk_base64_sample',
      ];

      const submittedSnapshots = [
        { flagType: 'DESK_SURFACE_CHECK', encryptedSnapshot: 'enc_snap_1' },
        { flagType: 'ROOM_DOOR_CHECK', encryptedSnapshot: 'enc_snap_2' },
        { flagType: 'EXCESS_SNAPSHOT_SHOULD_DISCARD', encryptedSnapshot: 'enc_snap_3' },
      ];

      const record = service.recordRoomScan({
        sessionId: 'sess_mobile_test',
        examId: 'exam_cs101',
        panDurationSeconds: 12,
        frameSequenceData: frameData,
        snapshots: submittedSnapshots,
      });

      expect(record.frameHash).toBeDefined();
      expect(record.frameHash.length).toBe(64); // SHA-256 hex
      expect(record.panDurationSeconds).toBe(12);

      // Must store ONLY 1-2 flagged snapshots, discarding excess
      expect(record.snapshots.length).toBe(2);
      expect(record.snapshots[0].flagType).toBe('DESK_SURFACE_CHECK');
      expect(record.snapshots[1].flagType).toBe('ROOM_DOOR_CHECK');

      // Check status updated
      const status = service.getCameraStatus('sess_mobile_test');
      expect(status?.isRoomScanCompleted).toBe(true);
      expect(status?.setupCheckPassed).toBe(true);
    });

    it('rejects room scan if pan duration is too short (<8s)', () => {
      expect(() => {
        service.recordRoomScan({
          sessionId: 'sess_mobile_test',
          examId: 'exam_cs101',
          panDurationSeconds: 4, // Too fast
          frameSequenceData: ['f1', 'f2'],
          snapshots: [],
        });
      }).toThrow('Room scan pan duration too short');
    });
  });

  describe('4. Disconnect Monitoring & Repeated Drops Escalation', () => {
    it('does not pause exam when disconnect is under 30s', () => {
      // Pair device
      const token = service.generatePairingToken({ sessionId: 'sess_mobile_test', examId: 'e', candidateId: 'c' });
      service.claimPairingToken({ token: token.token, sessionId: 'sess_mobile_test' });

      // Disconnect for 15 seconds
      const status = service.evaluateDisconnect('sess_mobile_test', Date.now() + 15_000);
      expect(status.shouldPauseExam).toBe(false);
      expect(status.repeatedDropViolation).toBe(false);
      expect(status.violationPoints).toBe(0);
    });

    it('pauses exam when phone feed disconnects for more than 30s', () => {
      const token = service.generatePairingToken({ sessionId: 'sess_mobile_test', examId: 'e', candidateId: 'c' });
      service.claimPairingToken({ token: token.token, sessionId: 'sess_mobile_test' });

      // Disconnect for 35 seconds
      const status = service.evaluateDisconnect('sess_mobile_test', Date.now() + 35_000);
      expect(status.shouldPauseExam).toBe(true);
      expect(status.repeatedDropViolation).toBe(false);
      expect(status.violationPoints).toBe(0);
      expect(status.reason).toContain('Second Camera Disconnected for 35s (>30s grace). Exam paused.');
    });

    it('escalates to MEDIUM violation (2 points) upon repeated drops (>=2 drops >30s)', () => {
      const token = service.generatePairingToken({ sessionId: 'sess_mobile_test', examId: 'e', candidateId: 'c' });
      service.claimPairingToken({ token: token.token, sessionId: 'sess_mobile_test' });

      // Drop 1 (>30s)
      service.evaluateDisconnect('sess_mobile_test', Date.now() + 32_000);

      // Reconnect
      service.recordHeartbeat('sess_mobile_test', 'MOBILE', 0.8, Date.now() + 35_000);

      // Drop 2 (>30s)
      const drop2Status = service.evaluateDisconnect('sess_mobile_test', Date.now() + 70_000);
      expect(drop2Status.shouldPauseExam).toBe(true);
      expect(drop2Status.repeatedDropViolation).toBe(true);
      expect(drop2Status.violationPoints).toBe(2); // MEDIUM violation
      expect(drop2Status.reason).toContain('Repeated Second Camera Disconnections');
    });
  });

  describe('5. Rolling +/- 10s Encrypted Evidence Clip Storage', () => {
    it('stores client-encrypted evidence snippet (+/-10s) upon flagged violation', () => {
      const clip = service.uploadEvidenceClip({
        sessionId: 'sess_mobile_test',
        violationType: 'PHONE_DETECTED_IN_HAND',
        timestamp: Date.now(),
        durationSeconds: 20, // 10s pre + 10s post
        encryptedPayload: 'aes256gcm_encrypted_binary_mock_data_7718',
        iv: '12byte_random_iv_hex',
        authTag: '16byte_authtag_hex',
      });

      expect(clip.clipId).toBeDefined();
      expect(clip.violationType).toBe('PHONE_DETECTED_IN_HAND');
      expect(clip.durationSeconds).toBe(20);

      const storedClips = service.getEvidenceClips('sess_mobile_test');
      expect(storedClips.length).toBe(1);
      expect(storedClips[0].clipId).toBe(clip.clipId);
    });
  });
});
