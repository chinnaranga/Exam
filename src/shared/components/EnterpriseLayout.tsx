import React from 'react';

export interface EnterpriseLayoutProps {
  children: React.ReactNode;
  activeRole?: 'super-admin' | 'org-admin' | 'admin' | 'faculty' | 'invigilator' | 'student';
  hideHeaderFooter?: boolean;
}

export const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({ children }) => {
  return (
    <div style={{ backgroundColor: '#F8FAFC', color: '#0F172A', width: '100%' }}>
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
};

export default EnterpriseLayout;
