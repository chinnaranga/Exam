import { useContext } from 'react';
import { MouseContext, MouseContextValue } from '../MouseContext';

export const useMouseRestrictions = (): MouseContextValue => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error('useMouseRestrictions must be used within a MouseProvider');
  }
  return context;
};
