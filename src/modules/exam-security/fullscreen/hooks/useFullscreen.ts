import { useContext } from 'react';
import { FullscreenContext, FullscreenContextValue } from '../FullscreenContext';

export const useFullscreen = (): FullscreenContextValue => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};
