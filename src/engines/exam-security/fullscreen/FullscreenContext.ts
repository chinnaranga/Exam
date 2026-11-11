import { createContext } from 'react';
import { FullscreenState } from './types/FullscreenState';
import { NormalizedFullscreenEvent } from './types/FullscreenEvent';
import { FullscreenAnalyticsSummary } from './services/FullscreenAnalyticsService';

export interface FullscreenContextValue {
  fullscreenState: FullscreenState;
  isFullscreen: boolean;
  isSupported: boolean;
  lastFullscreenEvent?: NormalizedFullscreenEvent;
  recoveryAttempts: number;
  isPaused: boolean;
  analytics: FullscreenAnalyticsSummary;
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  retryRecovery: () => Promise<boolean>;
}

export const FullscreenContext = createContext<FullscreenContextValue | undefined>(undefined);
