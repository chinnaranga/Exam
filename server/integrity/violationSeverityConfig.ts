export type ViolationSeverityTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ViolationRuleDefinition {
  ruleId: string;
  name: string;
  severity: ViolationSeverityTier;
  points: number; // CRITICAL: 8 (instant kill), HIGH: 3, MEDIUM: 2, LOW: 1
  isInstantKill: boolean;
  alertUser: boolean; // LOW = false (log only, no user alert), others = true
  description: string;
  invigilatorAlert: boolean;
}

export interface ViolationEngineThresholds {
  overlayThreshold: number; // 4 points = full-screen critical alert overlay with countdown
  terminateThreshold: number; // 8 points = terminate and auto-submit with evidence packet
  decayIntervalMs: number; // 5 minutes (300,000 ms) of clean behavior
  decayPointsPerInterval: number; // 1 point decayed per interval
  overlayCountdownSeconds: number; // 30s countdown on critical overlay
}

export const VIOLATION_THRESHOLDS: ViolationEngineThresholds = {
  overlayThreshold: 4,
  terminateThreshold: 8,
  decayIntervalMs: 5 * 60 * 1000, // 5 minutes
  decayPointsPerInterval: 1,
  overlayCountdownSeconds: 30,
};

/**
 * Standardized Master Severity Table
 * Configured as a single, easily editable table per enterprise specification.
 */
export const VIOLATION_SEVERITY_TABLE: Record<string, ViolationRuleDefinition> = {
  // ─── CRITICAL (Instant Terminate + Lock + Notify Invigilator) ────────────────
  PROCTORING_MODULE_TAMPERING: {
    ruleId: 'PROCTORING_MODULE_TAMPERING',
    name: 'Proctoring Module Tampering',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Proctoring or telemetry worker scripts were blocked, intercepted, or modified.',
    invigilatorAlert: true,
  },
  VIRTUAL_CAMERA: {
    ruleId: 'VIRTUAL_CAMERA',
    name: 'Virtual Camera Detected',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Software-emulated video stream (OBS, ManyCam, v4l2loopback) detected.',
    invigilatorAlert: true,
  },
  VM_DETECTED: {
    ruleId: 'VM_DETECTED',
    name: 'Virtual Machine Environment',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Browser executing inside a guest virtualization sandbox (VMware, VirtualBox, QEMU).',
    invigilatorAlert: true,
  },
  REMOTE_DESKTOP: {
    ruleId: 'REMOTE_DESKTOP',
    name: 'Remote Desktop Protocol Active',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Active screen-sharing or remote management session (TeamViewer, AnyDesk, RDP).',
    invigilatorAlert: true,
  },
  SECOND_PERSON_CONFIRMED: {
    ruleId: 'SECOND_PERSON_CONFIRMED',
    name: 'Second Person Confirmed (>5s)',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Multiple biometric facial contours recognized continuously for >5 seconds.',
    invigilatorAlert: true,
  },
  IDENTITY_MISMATCH: {
    ruleId: 'IDENTITY_MISMATCH',
    name: 'Candidate Identity Mismatch',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Current candidate biometrics do not match registered check-in identity.',
    invigilatorAlert: true,
  },
  EVENT_TAMPERING: {
    ruleId: 'EVENT_TAMPERING',
    name: 'Cryptographic Event Tampering',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Invalid HMAC signature or sequence gap detected on client security events.',
    invigilatorAlert: true,
  },
  CONCURRENT_SESSION_BLOCKED: {
    ruleId: 'CONCURRENT_SESSION_BLOCKED',
    name: 'Concurrent Session Attempted',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'A second examination login was attempted for the same candidate while an active session exists.',
    invigilatorAlert: true,
  },
  AUTOSAVE_CHAIN_TAMPERED: {
    ruleId: 'AUTOSAVE_CHAIN_TAMPERED',
    name: 'Autosave Hash Chain Tampered',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Hash-chained autosave ledger failed cryptographic verification or contains broken links.',
    invigilatorAlert: true,
  },
  SECURE_CLIENT_REQUIRED: {
    ruleId: 'SECURE_CLIENT_REQUIRED',
    name: 'Secure Client Required',
    severity: 'CRITICAL',
    points: 8,
    isInstantKill: true,
    alertUser: true,
    description: 'Locked-down desktop application is mandatory for this high-stakes examination.',
    invigilatorAlert: true,
  },

  // ─── HIGH (3 Points) ────────────────────────────────────────────────────────
  FULLSCREEN_EXIT_EXTENDED: {
    ruleId: 'FULLSCREEN_EXIT_EXTENDED',
    name: 'Extended Fullscreen Exit (>10s)',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate exited fullscreen mode and failed to return within 10 seconds.',
    invigilatorAlert: true,
  },
  REVERIFY_CHALLENGE_TIMEOUT: {
    ruleId: 'REVERIFY_CHALLENGE_TIMEOUT',
    name: 'Re-Verification Timeout (>10s)',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate missed or failed to respond to the 10-second mid-exam liveness challenge.',
    invigilatorAlert: true,
  },
  REVERIFY_CHALLENGE_FAILED: {
    ruleId: 'REVERIFY_CHALLENGE_FAILED',
    name: 'Re-Verification Challenge Failed',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate attempted but failed to complete the requested mid-exam liveness challenge.',
    invigilatorAlert: true,
  },
  DEVICE_FINGERPRINT_CHANGED: {
    ruleId: 'DEVICE_FINGERPRINT_CHANGED',
    name: 'Device Fingerprint Changed',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Hardware or browser fingerprint changed mid-exam, indicating possible environment swap.',
    invigilatorAlert: true,
  },
  MULTIPLE_MONITORS: {
    ruleId: 'MULTIPLE_MONITORS',
    name: 'Secondary Display Detected',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'More than one physical monitor screen detected via Display API.',
    invigilatorAlert: true,
  },
  PHONE_DETECTED: {
    ruleId: 'PHONE_DETECTED',
    name: 'Mobile Phone in Frame',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Mobile phone or unauthorized optical device recognized in webcam frame.',
    invigilatorAlert: true,
  },
  DEVTOOLS_OPEN: {
    ruleId: 'DEVTOOLS_OPEN',
    name: 'Developer Tools Opened',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Browser DevTools console or JavaScript debugger opened during examination.',
    invigilatorAlert: true,
  },
  WATERMARK_TAMPERED: {
    ruleId: 'WATERMARK_TAMPERED',
    name: 'Forensic Watermark Removed or Tampered',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate ID/session forensic watermark overlay was removed, obscured, or modified in the DOM.',
    invigilatorAlert: true,
  },
  PRINT_SCREEN_ATTEMPT: {
    ruleId: 'PRINT_SCREEN_ATTEMPT',
    name: 'Screen Capture or Print Attempt',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate attempted to capture the screen via PrintScreen or browser print dialog.',
    invigilatorAlert: true,
  },
  SHORTCUT_RESTRICTED: {
    ruleId: 'SHORTCUT_RESTRICTED',
    name: 'Restricted Key Combination',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Restricted keyboard shortcut (Ctrl+P, Ctrl+S, Ctrl+F, Ctrl+U, or Win/Cmd combo) intercepted.',
    invigilatorAlert: true,
  },
  PICTURE_IN_PICTURE_ACTIVE: {
    ruleId: 'PICTURE_IN_PICTURE_ACTIVE',
    name: 'Picture-in-Picture Active',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Picture-in-picture floating overlay was opened or detected during the examination.',
    invigilatorAlert: true,
  },
  TIMER_THROTTLING_DETECTED: {
    ruleId: 'TIMER_THROTTLING_DETECTED',
    name: 'Timer Throttling or JS Pause Detected',
    severity: 'HIGH',
    points: 3,
    isInstantKill: false,
    alertUser: true,
    description: 'Timer throttling or execution freeze detected (>20s heartbeat/performance drift).',
    invigilatorAlert: true,
  },

  // ─── MEDIUM (2 Points) ──────────────────────────────────────────────────────
  OFFLINE_LIMIT_EXCEEDED: {
    ruleId: 'OFFLINE_LIMIT_EXCEEDED',
    name: 'Offline Limit Exceeded (>3 Mins)',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Client disconnected from proctoring telemetry for longer than the maximum 3-minute grace period.',
    invigilatorAlert: true,
  },
  TAB_SWITCH: {
    ruleId: 'TAB_SWITCH',
    name: 'Browser Tab Switch',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Candidate switched away from the active examination browser tab.',
    invigilatorAlert: false,
  },
  GAZE_AWAY_REPEATEDLY: {
    ruleId: 'GAZE_AWAY_REPEATEDLY',
    name: 'Repeated Off-Screen Gaze',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Eye gaze angle deviated off-screen repeatedly within a 60-second window.',
    invigilatorAlert: false,
  },
  VOICE_DETECTED: {
    ruleId: 'VOICE_DETECTED',
    name: 'Acoustic Voice Detected',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Human speech frequencies detected by local microphone audio analysis.',
    invigilatorAlert: false,
  },
  IP_ADDRESS_CHANGED: {
    ruleId: 'IP_ADDRESS_CHANGED',
    name: 'Client IP Address Changed',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Network IP address changed mid-session, prompting re-verification.',
    invigilatorAlert: true,
  },
  TYPING_RHYTHM_DEVIATION: {
    ruleId: 'TYPING_RHYTHM_DEVIATION',
    name: 'Typing Rhythm Deviation (>65%)',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Keystroke interval rhythm diverged significantly from pre-exam baseline (flagged for human review, never auto-terminate).',
    invigilatorAlert: true,
  },
  WINDOW_RESIZE_SNAP: {
    ruleId: 'WINDOW_RESIZE_SNAP',
    name: 'Window Snapped or Resized Abnormally',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'Browser window was resized, snapped to half-screen, or tiled during examination.',
    invigilatorAlert: true,
  },
  VPN_OR_PROXY_DETECTED: {
    ruleId: 'VPN_OR_PROXY_DETECTED',
    name: 'VPN or Proxy Interface Detected',
    severity: 'MEDIUM',
    points: 2,
    isInstantKill: false,
    alertUser: true,
    description: 'WebRTC IP leak comparison or network routing detected an active VPN/proxy tunnel.',
    invigilatorAlert: true,
  },

  // ─── LOW (1 Point, Log Only — No User Alert) ─────────────────────────────────
  FOCUS_LOSS_BRIEF: {
    ruleId: 'FOCUS_LOSS_BRIEF',
    name: 'Brief Focus Loss (<2s)',
    severity: 'LOW',
    points: 1,
    isInstantKill: false,
    alertUser: false, // Log only, no user alert
    description: 'Window temporarily lost focus for under 2 seconds (e.g. OS notification).',
    invigilatorAlert: false,
  },
  LIGHTING_ISSUES: {
    ruleId: 'LIGHTING_ISSUES',
    name: 'Sub-Optimal Lighting',
    severity: 'LOW',
    points: 1,
    isInstantKill: false,
    alertUser: false, // Log only, no user alert
    description: 'Webcam ambient lighting dropped below calibration threshold.',
    invigilatorAlert: false,
  },
  TEXT_SELECTION_ATTEMPT: {
    ruleId: 'TEXT_SELECTION_ATTEMPT',
    name: 'Text Selection Attempted',
    severity: 'LOW',
    points: 1,
    isInstantKill: false,
    alertUser: false,
    description: 'Attempted to highlight or copy protected question text.',
    invigilatorAlert: false,
  },
  DRAG_DROP_ATTEMPT: {
    ruleId: 'DRAG_DROP_ATTEMPT',
    name: 'Drag and Drop Attempted',
    severity: 'LOW',
    points: 1,
    isInstantKill: false,
    alertUser: false,
    description: 'Attempted to drag question content outside the examination interface.',
    invigilatorAlert: false,
  },
};

/**
 * Normalizes rule strings from event types (e.g. 'FocusLost' -> 'FOCUS_LOSS_BRIEF' or 'focus_loss_brief')
 */
export function resolveViolationRule(eventTypeOrRule: string): ViolationRuleDefinition {
  const normalized = eventTypeOrRule
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_');

  // Exact match
  if (VIOLATION_SEVERITY_TABLE[normalized]) {
    return VIOLATION_SEVERITY_TABLE[normalized];
  }

  // Common event type aliases
  const aliasMap: Record<string, string> = {
    // Critical
    PROCTORING_MODULE_TAMPERING: 'PROCTORING_MODULE_TAMPERING',
    VIRTUAL_CAMERA: 'VIRTUAL_CAMERA',
    VM_DETECTED: 'VM_DETECTED',
    REMOTE_DESKTOP: 'REMOTE_DESKTOP',
    SECOND_PERSON_CONFIRMED: 'SECOND_PERSON_CONFIRMED',
    MULTIPLE_FACES_CONFIRMED: 'SECOND_PERSON_CONFIRMED',
    IDENTITY_MISMATCH: 'IDENTITY_MISMATCH',
    EVENT_TAMPERING: 'EVENT_TAMPERING',
    SECURE_CLIENT_REQUIRED: 'SECURE_CLIENT_REQUIRED',
    DESKTOP_CLIENT_REQUIRED: 'SECURE_CLIENT_REQUIRED',

    // High
    FULLSCREEN_EXIT_EXTENDED: 'FULLSCREEN_EXIT_EXTENDED',
    FULLSCREEN_EXIT: 'FULLSCREEN_EXIT_EXTENDED',
    FULLSCREENEXIT: 'FULLSCREEN_EXIT_EXTENDED',
    MULTIPLE_MONITORS: 'MULTIPLE_MONITORS',
    MULTIPLE_DISPLAYS: 'MULTIPLE_MONITORS',
    PHONE_DETECTED: 'PHONE_DETECTED',
    DEVTOOLS_OPEN: 'DEVTOOLS_OPEN',
    DEVTOOLS_OPENED: 'DEVTOOLS_OPENED',
    DEVTOOLSOPEN: 'DEVTOOLS_OPEN',
    DEVTOOLS_TIMING_FLAG: 'DEVTOOLS_OPEN',
    DEBUGGER_DELAY: 'DEVTOOLS_OPEN',
    DEVTOOLS_POSSIBLE: 'DEVTOOLS_OPEN',
    PRINT_SCREEN_ATTEMPT: 'PRINT_SCREEN_ATTEMPT',
    PRINT_SCREEN: 'PRINT_SCREEN_ATTEMPT',
    PRINTSCREEN: 'PRINT_SCREEN_ATTEMPT',
    BEFOREPRINT: 'PRINT_SCREEN_ATTEMPT',
    PRINT_ATTEMPT: 'PRINT_SCREEN_ATTEMPT',
    SHORTCUT_RESTRICTED: 'SHORTCUT_RESTRICTED',
    KEYBOARD_RESTRICTED: 'SHORTCUT_RESTRICTED',
    WIN_CMD_SHORTCUT_RESTRICTED: 'SHORTCUT_RESTRICTED',
    VIEW_SOURCE_ATTEMPT: 'SHORTCUT_RESTRICTED',
    FIND_IN_PAGE_ATTEMPT: 'SHORTCUT_RESTRICTED',
    PAGE_SAVE_ATTEMPT: 'SHORTCUT_RESTRICTED',
    PICTURE_IN_PICTURE_ACTIVE: 'PICTURE_IN_PICTURE_ACTIVE',
    PICTURE_IN_PICTURE: 'PICTURE_IN_PICTURE_ACTIVE',
    PIP_DETECTED: 'PICTURE_IN_PICTURE_ACTIVE',
    TIMER_THROTTLING_DETECTED: 'TIMER_THROTTLING_DETECTED',
    TIMER_THROTTLED: 'TIMER_THROTTLING_DETECTED',
    HEARTBEAT_TIMEOUT: 'TIMER_THROTTLING_DETECTED',

    // Medium
    TAB_SWITCH: 'TAB_SWITCH',
    WINDOW_BLUR: 'TAB_SWITCH',
    FOCUS_LOST_EXTENDED: 'TAB_SWITCH',
    GAZE_AWAY_REPEATEDLY: 'GAZE_AWAY_REPEATEDLY',
    GAZE_ANOMALY: 'GAZE_AWAY_REPEATEDLY',
    VOICE_DETECTED: 'VOICE_DETECTED',
    SPEECH_DETECTED: 'VOICE_DETECTED',
    WINDOW_RESIZE_SNAP: 'WINDOW_RESIZE_SNAP',
    WINDOW_SNAP: 'WINDOW_RESIZE_SNAP',
    VIEWPORT_CHANGED: 'WINDOW_RESIZE_SNAP',
    VPN_OR_PROXY_DETECTED: 'VPN_OR_PROXY_DETECTED',
    VPN_DETECTED: 'VPN_OR_PROXY_DETECTED',
    PROXY_DETECTED: 'VPN_OR_PROXY_DETECTED',
    WEBRTC_LEAK: 'VPN_OR_PROXY_DETECTED',

    // Low
    FOCUS_LOSS_BRIEF: 'FOCUS_LOSS_BRIEF',
    FOCUS_LOST: 'FOCUS_LOSS_BRIEF',
    FOCUSLOST: 'FOCUS_LOSS_BRIEF',
    LIGHTING_ISSUES: 'LIGHTING_ISSUES',
    LOW_LIGHTING: 'LIGHTING_ISSUES',
    FACE_LIGHTING_POOR: 'LIGHTING_ISSUES',
    TEXT_SELECTION_ATTEMPT: 'TEXT_SELECTION_ATTEMPT',
    TEXT_SELECTION: 'TEXT_SELECTION_ATTEMPT',
    DRAG_DROP_ATTEMPT: 'DRAG_DROP_ATTEMPT',
    DRAG_START: 'DRAG_DROP_ATTEMPT',
    DROP: 'DRAG_DROP_ATTEMPT',
  };

  const matchedKey = aliasMap[normalized];
  if (matchedKey && VIOLATION_SEVERITY_TABLE[matchedKey]) {
    return VIOLATION_SEVERITY_TABLE[matchedKey];
  }

  // Fallback default: Low 1 point
  return {
    ruleId: normalized,
    name: eventTypeOrRule,
    severity: 'LOW',
    points: 1,
    isInstantKill: false,
    alertUser: false,
    description: 'Uncategorized system telemetry signal.',
    invigilatorAlert: false,
  };
}

