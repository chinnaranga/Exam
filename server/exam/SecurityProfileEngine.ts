import fs from 'fs';
import path from 'path';

export type ProfileTier = 'PRACTICE' | 'STANDARD' | 'HIGH_STAKES' | 'CUSTOM';
export type CameraMode = 'NONE' | 'PRIMARY_ONLY' | 'DUAL_CAMERA_QR';
export type ViolationsMode = 'LOG_ONLY' | 'ACTIVE';

export interface SecurityProfileThresholds {
  overlayThreshold: number; // default 4 points
  terminateThreshold: number; // default 8 points
  decayIntervalMs: number; // default 300,000 ms (5 mins)
  decayPointsPerInterval: number; // default 1 pt
}

export interface SecurityProfileSettings {
  // Master switches
  proctoringEnabled: boolean;
  hintsAllowed: boolean;
  violationsMode: ViolationsMode;

  // Layer 1 & 2 Station restrictions
  fullscreenRequired: boolean;
  focusTracking: boolean;
  faceGazeTracking: boolean;
  cameraMode: CameraMode;
  phoneSecondCameraRequired: boolean;

  // Identity & Verification
  identityVerificationRequired: boolean;
  reverificationRequired: boolean;
  reverificationIntervalCount: number;
  typingBaselineRequired: boolean;

  // Environment & Hardware
  requireSecureClient: boolean;
  offlineLimitMinutes: number | null; // null = unlimited

  // Section & Watermarking
  forwardOnlyNavigation: boolean;
  lockSectionOnComplete: boolean;
  watermarkOverlay: boolean;

  // Candidate Tools
  calculatorAllowed: boolean;
  scratchpadAllowed: boolean;
  allowedTools: string[];

  // Thresholds & Decay
  thresholds: SecurityProfileThresholds;

  // Optional custom severity overrides for ViolationEngine
  severityOverrides?: Record<string, { points: number; isInstantKill?: boolean; alertUser?: boolean }>;
}

export interface SecurityProfile {
  id: string;
  name: string;
  tier: ProfileTier;
  description: string;
  settings: SecurityProfileSettings;
  isBuiltIn?: boolean;
  parentProfileId?: string; // If cloned
  createdAt?: number;
  updatedAt?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  explanation: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface CandidateRuleItem {
  category: string;
  icon: string;
  title: string;
  bullets: string[];
  isRestricted?: boolean;
}

export interface CandidateRulesSummary {
  examTitle: string;
  durationMinutes: number;
  tier: ProfileTier;
  tierBadge: string;
  plainLanguageSummary: string;
  rules: CandidateRuleItem[];
  checklist: Array<{ id: string; label: string; required: boolean }>;
}

export class SecurityProfileEngine {
  private profilesMap: Map<string, SecurityProfile> = new Map();
  private configFilePath: string;

  constructor(customConfigPath?: string) {
    this.configFilePath =
      customConfigPath ||
      path.resolve(__dirname, 'config/builtInSecurityProfiles.json');
    this.loadBuiltInProfiles();
  }

  /**
   * Loads built-in profiles from JSON configuration file
   */
  public loadBuiltInProfiles(): void {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const raw = fs.readFileSync(this.configFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.profiles)) {
          for (const p of parsed.profiles) {
            this.profilesMap.set(p.id, {
              ...p,
              isBuiltIn: true,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
          return;
        }
      }
    } catch {
      // Fallback to programmatic defaults if file system is inaccessible
    }

    // Default Fallback
    this.registerFallbackDefaults();
  }

  private registerFallbackDefaults(): void {
    const practice: SecurityProfile = {
      id: 'PRACTICE',
      name: 'Practice & Formative Assessment',
      tier: 'PRACTICE',
      description: 'Zero-friction learning mode without proctoring.',
      isBuiltIn: true,
      settings: {
        proctoringEnabled: false,
        hintsAllowed: true,
        violationsMode: 'LOG_ONLY',
        fullscreenRequired: false,
        focusTracking: false,
        faceGazeTracking: false,
        cameraMode: 'NONE',
        phoneSecondCameraRequired: false,
        identityVerificationRequired: false,
        reverificationRequired: false,
        reverificationIntervalCount: 0,
        typingBaselineRequired: false,
        requireSecureClient: false,
        offlineLimitMinutes: null,
        forwardOnlyNavigation: false,
        lockSectionOnComplete: false,
        watermarkOverlay: false,
        calculatorAllowed: true,
        scratchpadAllowed: true,
        allowedTools: ['CALCULATOR', 'SCRATCHPAD', 'FORMULA_SHEET'],
        thresholds: {
          overlayThreshold: 4,
          terminateThreshold: 8,
          decayIntervalMs: 300000,
          decayPointsPerInterval: 1,
        },
      },
    };

    const standard: SecurityProfile = {
      id: 'STANDARD',
      name: 'Standard Academic Proctored Examination',
      tier: 'STANDARD',
      description: 'Standard proctored examination with single webcam & fullscreen lockdown.',
      isBuiltIn: true,
      settings: {
        proctoringEnabled: true,
        hintsAllowed: false,
        violationsMode: 'ACTIVE',
        fullscreenRequired: true,
        focusTracking: true,
        faceGazeTracking: true,
        cameraMode: 'PRIMARY_ONLY',
        phoneSecondCameraRequired: false,
        identityVerificationRequired: false,
        reverificationRequired: false,
        reverificationIntervalCount: 0,
        typingBaselineRequired: false,
        requireSecureClient: false,
        offlineLimitMinutes: 5,
        forwardOnlyNavigation: false,
        lockSectionOnComplete: false,
        watermarkOverlay: true,
        calculatorAllowed: false,
        scratchpadAllowed: true,
        allowedTools: ['SCRATCHPAD'],
        thresholds: {
          overlayThreshold: 4,
          terminateThreshold: 8,
          decayIntervalMs: 300000,
          decayPointsPerInterval: 1,
        },
      },
    };

    const highStakes: SecurityProfile = {
      id: 'HIGH_STAKES',
      name: 'High-Stakes Certification & Licensure',
      tier: 'HIGH_STAKES',
      description: 'Maximum integrity certification with dual-camera and identity verification.',
      isBuiltIn: true,
      settings: {
        proctoringEnabled: true,
        hintsAllowed: false,
        violationsMode: 'ACTIVE',
        fullscreenRequired: true,
        focusTracking: true,
        faceGazeTracking: true,
        cameraMode: 'DUAL_CAMERA_QR',
        phoneSecondCameraRequired: true,
        identityVerificationRequired: true,
        reverificationRequired: true,
        reverificationIntervalCount: 3,
        typingBaselineRequired: true,
        requireSecureClient: true,
        offlineLimitMinutes: 3,
        forwardOnlyNavigation: true,
        lockSectionOnComplete: true,
        watermarkOverlay: true,
        calculatorAllowed: false,
        scratchpadAllowed: true,
        allowedTools: ['SCRATCHPAD'],
        thresholds: {
          overlayThreshold: 4,
          terminateThreshold: 8,
          decayIntervalMs: 300000,
          decayPointsPerInterval: 1,
        },
      },
    };

    this.profilesMap.set(practice.id, practice);
    this.profilesMap.set(standard.id, standard);
    this.profilesMap.set(highStakes.id, highStakes);
  }

  /**
   * Retrieves all available security profiles (built-in + cloned)
   */
  public listProfiles(): SecurityProfile[] {
    return Array.from(this.profilesMap.values());
  }

  /**
   * Gets a specific profile by ID
   */
  public getProfile(id: string): SecurityProfile | undefined {
    return this.profilesMap.get(id);
  }

  /**
   * Clones a base profile and applies individual admin overrides
   */
  public cloneProfile(
    baseProfileId: string,
    overrides: {
      name?: string;
      description?: string;
      settings?: Partial<SecurityProfileSettings>;
    },
    customId?: string
  ): SecurityProfile {
    const base = this.getProfile(baseProfileId);
    if (!base) {
      throw new Error(`Base security profile with ID "${baseProfileId}" not found.`);
    }

    const clonedId = customId || `CUSTOM_${base.tier}_${Date.now()}`;
    const mergedSettings: SecurityProfileSettings = {
      ...base.settings,
      ...(overrides.settings || {}),
      thresholds: {
        ...base.settings.thresholds,
        ...(overrides.settings?.thresholds || {}),
      },
      allowedTools: overrides.settings?.allowedTools
        ? [...overrides.settings.allowedTools]
        : [...base.settings.allowedTools],
      severityOverrides: {
        ...(base.settings.severityOverrides || {}),
        ...(overrides.settings?.severityOverrides || {}),
      },
    };

    const clonedProfile: SecurityProfile = {
      id: clonedId,
      name: overrides.name || `${base.name} (Custom Clone)`,
      tier: 'CUSTOM',
      description: overrides.description || `Custom clone based on ${base.name}.`,
      isBuiltIn: false,
      parentProfileId: base.id,
      settings: mergedSettings,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.profilesMap.set(clonedProfile.id, clonedProfile);
    return clonedProfile;
  }

  /**
   * Validates profile settings for fatal conflicts and warnings.
   * Blocks publishing if settings conflict.
   */
  public validateProfile(
    profile: SecurityProfile | { tier?: ProfileTier; settings: SecurityProfileSettings }
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const settings = profile.settings;
    const tier = 'tier' in profile ? profile.tier : 'CUSTOM';

    // 1. HIGH_STAKES Client Mandate Conflict
    // Phone camera required but secure client disabled
    if (settings.phoneSecondCameraRequired && !settings.requireSecureClient) {
      errors.push({
        field: 'requireSecureClient',
        code: 'CONFLICT_PHONE_CAM_REQUIRES_SECURE_CLIENT',
        message: 'Phone second camera requires a locked-down desktop client.',
        explanation:
          'When requiring a mobile second camera, candidates must use the AssessIQ Secure Desktop Client to prevent browser devtools and proxy tampering.',
      });
    }

    // High stakes tier must enforce secure client
    if (tier === 'HIGH_STAKES' && !settings.requireSecureClient) {
      errors.push({
        field: 'requireSecureClient',
        code: 'CONFLICT_HIGH_STAKES_REQUIRES_SECURE_CLIENT',
        message: 'High-Stakes exams must enforce the secure locked-down desktop client.',
        explanation:
          'Licensure and certification exams cannot run in standard browser windows without client-level hardware isolation.',
      });
    }

    // 2. Proctoring Disabled with Sensor Toggles
    if (!settings.proctoringEnabled) {
      if (settings.faceGazeTracking) {
        errors.push({
          field: 'faceGazeTracking',
          code: 'CONFLICT_PROCTORING_DISABLED_FACE_TRACKING',
          message: 'Cannot enable facial/gaze tracking when proctoring is disabled.',
          explanation: 'Enable master proctoring before activating facial orientation sentinels.',
        });
      }
      if (settings.phoneSecondCameraRequired) {
        errors.push({
          field: 'phoneSecondCameraRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_SECOND_CAMERA',
          message: 'Cannot mandate phone second camera when proctoring is disabled.',
          explanation: 'Second camera pairing requires proctoring telemetry to be active.',
        });
      }
      if (settings.identityVerificationRequired) {
        errors.push({
          field: 'identityVerificationRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_IDENTITY_CHECK',
          message: 'Cannot mandate identity verification when proctoring is disabled.',
          explanation: 'Pre-exam biometric identification requires active proctoring infrastructure.',
        });
      }
      if (settings.reverificationRequired) {
        errors.push({
          field: 'reverificationRequired',
          code: 'CONFLICT_PROCTORING_DISABLED_REVERIFICATION',
          message: 'Cannot mandate random re-verification when proctoring is disabled.',
          explanation: 'Random liveness checks require active proctoring modules.',
        });
      }
    }

    // 3. Camera Mode vs Phone Second Camera Mismatch
    if (settings.phoneSecondCameraRequired && settings.cameraMode === 'NONE') {
      errors.push({
        field: 'cameraMode',
        code: 'CONFLICT_PHONE_CAM_WITH_CAMERA_NONE',
        message: 'Phone second camera cannot be required when camera mode is "NONE".',
        explanation: 'Set camera mode to "DUAL_CAMERA_QR" to use mobile camera pairing.',
      });
    }

    // 4. Re-verification without Baseline Identity Check
    if (settings.reverificationRequired && !settings.identityVerificationRequired) {
      errors.push({
        field: 'identityVerificationRequired',
        code: 'CONFLICT_REVERIFY_WITHOUT_INITIAL_ID',
        message: 'Random mid-exam re-verification requires pre-exam identity verification.',
        explanation:
          'The system cannot verify face matching during the exam if no pre-exam ID baseline was captured.',
      });
    }

    // 5. Hints in Active Violations Mode
    if (settings.hintsAllowed && settings.violationsMode === 'ACTIVE') {
      errors.push({
        field: 'hintsAllowed',
        code: 'CONFLICT_HINTS_IN_ACTIVE_MODE',
        message: 'Hints cannot be allowed when violation penalties are active.',
        explanation:
          'Hints are only permissible in formative PRACTICE mode with violations set to LOG_ONLY.',
      });
    }

    // 6. Threshold Logic Conflict
    if (settings.thresholds.overlayThreshold >= settings.thresholds.terminateThreshold) {
      errors.push({
        field: 'thresholds.overlayThreshold',
        code: 'CONFLICT_INVALID_THRESHOLDS',
        message: 'Warning overlay threshold must be lower than the termination threshold.',
        explanation: `Overlay threshold (${settings.thresholds.overlayThreshold}) cannot equal or exceed termination threshold (${settings.thresholds.terminateThreshold}).`,
      });
    }

    // 7. High-Stakes Offline Limit Rule
    if (tier === 'HIGH_STAKES') {
      if (settings.offlineLimitMinutes === null || settings.offlineLimitMinutes > 3) {
        errors.push({
          field: 'offlineLimitMinutes',
          code: 'CONFLICT_HIGH_STAKES_OFFLINE_LIMIT',
          message: 'High-Stakes exams cannot allow offline periods exceeding 3 minutes.',
          explanation:
            `High-Stakes compliance caps offline resilience at 3 minutes (currently ${settings.offlineLimitMinutes ?? 'unlimited'} min) to maintain continuous telemetric consensus.`,
        });
      }
    }

    // Non-fatal Warnings
    if (settings.proctoringEnabled && !settings.watermarkOverlay) {
      warnings.push({
        field: 'watermarkOverlay',
        code: 'WARN_NO_WATERMARK',
        message: 'Traceable candidate watermark is disabled on a proctored exam.',
      });
    }

    if (settings.fullscreenRequired && !settings.focusTracking) {
      warnings.push({
        field: 'focusTracking',
        code: 'WARN_FULLSCREEN_WITHOUT_FOCUS',
        message: 'Focus loss detection is disabled while fullscreen is required.',
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generates a plain-language summary of the exam rules for candidates
   */
  public generateCandidateRulesSummary(
    profile: SecurityProfile,
    examTitle: string,
    durationMinutes: number
  ): CandidateRulesSummary {
    const s = profile.settings;
    const rules: CandidateRuleItem[] = [];

    // 1. Duration & Timing
    rules.push({
      category: 'TIMING',
      icon: 'Clock',
      title: 'Assessment Duration & Server Clock',
      bullets: [
        `You have ${durationMinutes} minutes to complete this assessment.`,
        'The timer is governed by the server; it continues counting even if your browser tab is refreshed.',
        'When time expires, your answers are automatically submitted with a 10-second network grace window.',
      ],
    });

    // 2. Camera & Biometrics
    if (!s.proctoringEnabled) {
      rules.push({
        category: 'MONITORING',
        icon: 'EyeOff',
        title: 'Formative Learning Mode',
        bullets: [
          'No camera or microphone monitoring is active for this assessment.',
          'Take your time to practice and review conceptual explanations.',
        ],
      });
    } else {
      const camBullets: string[] = [];
      if (s.cameraMode === 'DUAL_CAMERA_QR' || s.phoneSecondCameraRequired) {
        camBullets.push(
          'Dual Camera Setup: Primary laptop webcam monitors your face; your mobile phone is paired via QR code to monitor your hands and workspace from the side.'
        );
      } else {
        camBullets.push(
          'Single Webcam Monitoring: Keep your face centered, well-lit, and visible in the webcam preview at all times.'
        );
      }

      if (s.identityVerificationRequired) {
        camBullets.push(
          'Identity Check: You must present a valid government or university photo ID before entering the exam.'
        );
      }
      if (s.reverificationRequired) {
        camBullets.push(
          'Random Re-verification: 2 to 3 times during the exam, a quick 10-second prompt will verify your liveness (e.g. smile or blink).'
        );
      }

      rules.push({
        category: 'MONITORING',
        icon: 'Video',
        title: 'Video & Biometric Proctoring',
        bullets: camBullets,
      });
    }

    // 3. Screen & Navigation
    const screenBullets: string[] = [];
    if (s.fullscreenRequired) {
      screenBullets.push('Mandatory Fullscreen: Exiting fullscreen or switching tabs for >10 seconds triggers security violation points.');
    }
    if (s.forwardOnlyNavigation) {
      screenBullets.push(
        'Forward-Only Navigation: Once you complete a question section and proceed, that section is locked and you cannot return.'
      );
    }
    if (s.watermarkOverlay) {
      screenBullets.push(
        'Traceable Watermark: Your candidate ID is subtly watermarked across the exam canvas to protect intellectual property.'
      );
    }
    rules.push({
      category: 'WORKSPACE',
      icon: 'Monitor',
      title: 'Screen & Environment Lockdown',
      bullets: screenBullets.length > 0 ? screenBullets : ['Standard browser window is permitted.'],
      isRestricted: s.fullscreenRequired || s.forwardOnlyNavigation,
    });

    // 4. Tools & Aids
    const toolsBullets: string[] = [];
    if (s.hintsAllowed) {
      toolsBullets.push('Hints are enabled for this session.');
    }
    if (s.calculatorAllowed) {
      toolsBullets.push('On-screen scientific calculator is provided.');
    } else {
      toolsBullets.push('Calculators are not permitted for this examination.');
    }
    if (s.scratchpadAllowed) {
      toolsBullets.push('Digital scratchpad is accessible inside the test runner.');
    }
    toolsBullets.push('Strictly Prohibited: External search engines, generative AI assistants, notes, and unapproved personnel.');
    rules.push({
      category: 'TOOLS',
      icon: 'Tool',
      title: 'Permitted Tools & Prohibited Aids',
      bullets: toolsBullets,
    });

    // 5. Offline & Network
    const netBullets: string[] = [];
    if (s.offlineLimitMinutes !== null) {
      netBullets.push(
        `Offline Resilience: Answers autosave locally with cryptographic signatures. You may stay disconnected for up to ${s.offlineLimitMinutes} minutes before the exam pauses.`
      );
    } else {
      netBullets.push('Offline mode is supported throughout the assessment.');
    }
    rules.push({
      category: 'NETWORK',
      icon: 'Wifi',
      title: 'Network & Autosave Policies',
      bullets: netBullets,
    });

    // 6. Violations & Consequences
    if (s.violationsMode === 'ACTIVE') {
      rules.push({
        category: 'INTEGRITY',
        icon: 'ShieldAlert',
        title: 'Violation Points & Termination Policy',
        bullets: [
          `Warning Threshold: Reaching ${s.thresholds.overlayThreshold} points displays a full-screen security alert.`,
          `Termination Threshold: Reaching ${s.thresholds.terminateThreshold} points immediately locks and auto-submits your exam for proctor review.`,
          'Decay: 1 violation point decays for every 5 minutes of clean behavior.',
          'Critical Actions: DevTools, virtual cameras, second persons, and screen sharing cause instant termination.',
        ],
        isRestricted: true,
      });
    }

    // Concise Plain Language Summary
    let plainLanguageSummary = '';
    if (profile.tier === 'PRACTICE') {
      plainLanguageSummary =
        'This is an unproctored practice session. You may take your time, view hints, and practice questions without penalties.';
    } else if (profile.tier === 'STANDARD') {
      plainLanguageSummary =
        'This is a standard proctored exam. Remain in fullscreen with your camera on and face visible. Avoid switching tabs or using unauthorized aids.';
    } else {
      plainLanguageSummary =
        'This is a high-stakes exam requiring dual-camera monitoring and the secure desktop client. Ensure your room is quiet and your mobile camera is paired before proceeding.';
    }

    const checklist = [
      { id: 'env', label: 'My testing room is quiet, well-lit, and private.', required: true },
      { id: 'screen', label: 'I understand that exiting fullscreen or switching tabs will be flagged.', required: s.fullscreenRequired },
      { id: 'camera', label: 'My webcam (and mobile camera, if required) is functioning properly.', required: s.proctoringEnabled },
      { id: 'rules', label: 'I agree to the assessment guidelines and honor code.', required: true },
    ];

    return {
      examTitle,
      durationMinutes,
      tier: profile.tier,
      tierBadge: profile.name,
      plainLanguageSummary,
      rules,
      checklist,
    };
  }
}

export const securityProfileEngine = new SecurityProfileEngine();
