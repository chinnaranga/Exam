import { FullscreenPolicyRule } from '../types/FullscreenPolicy';

export const DEFAULT_FULLSCREEN_POLICY_RULE: FullscreenPolicyRule = {
  id: 'fs_mandatory_policy',
  name: 'Enterprise Fullscreen Lock Policy',
  requirement: 'REQUIRED',
  actionOnExit: 'PAUSE',
  maxRecoveryAttempts: 3,
  pauseExamOnExit: true,
  severity: 'HIGH',
  description: 'Mandatory fullscreen lock-down mode for candidate assessment integrity.',
};
