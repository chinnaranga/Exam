import { useContext } from 'react';
import { ClipboardContext, ClipboardContextValue } from '../ClipboardContext';

export const useClipboardProtection = (): ClipboardContextValue => {
  const context = useContext(ClipboardContext);
  if (!context) {
    throw new Error('useClipboardProtection must be used within a ClipboardProvider');
  }
  return context;
};
