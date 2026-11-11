import { useContext } from 'react';
import { NavigationContext, NavigationContextValue } from '../NavigationContext';

const DEFAULT_NAVIGATION_CONTEXT: NavigationContextValue = {
  isMonitoring: false,
  logs: [],
  lastEvent: null,
  start: () => {},
  stop: () => {},
};

export const useNavigationSentinel = (): NavigationContextValue => {
  const context = useContext(NavigationContext);
  return context || DEFAULT_NAVIGATION_CONTEXT;
};
