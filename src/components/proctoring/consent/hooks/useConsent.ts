import { useConsentContext } from '../ConsentContext';

/**
 * Custom hook `useConsent` providing access to consent state, permission triggers,
 * policy scroll tracking, checklist state, and submission triggers.
 */
export const useConsent = () => {
  return useConsentContext();
};
