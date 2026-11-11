import { createContext } from 'react';
import { MouseActionRule, MousePolicyAction } from './types/MouseAction';
import { MouseAnalyticsSummary } from './services/MouseAnalyticsEngine';

export interface MouseContextValue {
  isMonitoring: boolean;
  rules: MouseActionRule[];
  analytics: MouseAnalyticsSummary;
  start: () => void;
  stop: () => void;
  updatePolicy: (id: string, action: MousePolicyAction) => void;
}

export const MouseContext = createContext<MouseContextValue | undefined>(undefined);
