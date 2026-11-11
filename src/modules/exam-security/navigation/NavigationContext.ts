import { createContext } from 'react';
import { NormalizedNavigationEvent } from './types/NavigationEvent';

export interface NavigationContextValue {
  isMonitoring: boolean;
  logs: NormalizedNavigationEvent[];
  lastEvent: NormalizedNavigationEvent | null;
  start: () => void;
  stop: () => void;
}

export const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);
