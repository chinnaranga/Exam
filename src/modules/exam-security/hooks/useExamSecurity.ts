import { useContext } from 'react';
import { ExamSecurityContext, ExamSecurityContextValue } from '../providers/ExamSecurityContext';

export const useExamSecurity = (): ExamSecurityContextValue => {
  const context = useContext(ExamSecurityContext);
  if (!context) {
    throw new Error('useExamSecurity must be used within an ExamSecurityProvider');
  }
  return context;
};
