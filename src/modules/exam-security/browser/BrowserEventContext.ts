import { createContext } from 'react';
import { NormalizedBrowserEvent } from './types/BrowserEvent';

export interface BrowserEventContextValue {
  isMonitoring: boolean;
  lastEvent?: NormalizedBrowserEvent;
  eventCount: number;
  startMonitoring: () => void;
  stopMonitoring: () => void;
}

export const BrowserEventContext = createContext<BrowserEventContextValue | undefined>(undefined);
