import { useContext } from 'react';
import { BrowserEventContext, BrowserEventContextValue } from '../BrowserEventContext';

export const useBrowserEvents = (): BrowserEventContextValue => {
  const context = useContext(BrowserEventContext);
  if (!context) {
    throw new Error('useBrowserEvents must be used within a BrowserEventProvider');
  }
  return context;
};
