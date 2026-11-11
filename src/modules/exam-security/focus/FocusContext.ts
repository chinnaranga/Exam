import { createContext } from 'react';
import { FocusAnalyticsSummary } from './services/FocusAnalyticsService';

export interface FocusContextValue {
  isMonitoring: boolean;
  analytics: FocusAnalyticsSummary;
  start: () => void;
  stop: () => void;
}

export const FocusContext = createContext<FocusContextValue | undefined>(undefined);
