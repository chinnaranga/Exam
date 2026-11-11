import { useContext } from 'react';
import { KeyboardContext, KeyboardContextValue } from '../KeyboardContext';

export const useKeyboardRestrictions = (): KeyboardContextValue => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboardRestrictions must be used within a KeyboardProvider');
  }
  return context;
};
