import { createContext } from 'react';
import { NormalizedClipboardEvent } from './types/ClipboardEvent';
import { ClipboardActionRule, ClipboardPolicyAction } from './types/ClipboardAction';
import { ClipboardAnalyticsSummary } from './services/ClipboardAnalyticsService';

export interface ClipboardContextValue {
  isClipboardMonitoring: boolean;
  lastClipboardEvent?: NormalizedClipboardEvent;
  clipboardEventCount: number;
  rules: ClipboardActionRule[];
  analytics: ClipboardAnalyticsSummary;
  startClipboardMonitoring: () => void;
  stopClipboardMonitoring: () => void;
  updatePolicy: (id: string, action: ClipboardPolicyAction) => void;
}

export const ClipboardContext = createContext<ClipboardContextValue | undefined>(undefined);
