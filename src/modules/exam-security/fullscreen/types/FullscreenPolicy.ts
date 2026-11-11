// Fullscreen Policy & Action Definitions

export type FullscreenPolicyRequirement = 'OPTIONAL' | 'REQUIRED' | 'STRICT' | 'DISABLED';

export type FullscreenPolicyAction = 'ALLOW' | 'WARN' | 'PAUSE' | 'BLOCK_RESUME' | 'TERMINATE';

export interface FullscreenPolicyRule {
  id: string;
  name: string;
  requirement: FullscreenPolicyRequirement;
  actionOnExit: FullscreenPolicyAction;
  maxRecoveryAttempts: number;
  pauseExamOnExit: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
