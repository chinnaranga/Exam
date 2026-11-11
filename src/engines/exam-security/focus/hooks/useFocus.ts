import { useContext } from 'react';
import { FocusContext, FocusContextValue } from '../FocusContext';

const DEFAULT_FOCUS_CONTEXT: FocusContextValue = {
  isMonitoring: false,
  analytics: {
    focusLossCount: 0,
    tabSwitchCount: 0,
    totalUnfocusedTimeSeconds: 0,
    currentFocusState: 'FOCUSED',
    focusScore: 100,
  },
  start: () => {},
  stop: () => {},
};

export const useFocus = (): FocusContextValue => {
  const context = useContext(FocusContext);
  return context || DEFAULT_FOCUS_CONTEXT;
};
