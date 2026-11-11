import React from 'react';

export interface ConsentCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'warning' | 'success';
  className?: string;
}

/**
 * Healthcare-grade enterprise card container inspired by Microsoft / Epic Systems / Oracle Health UI design guidelines.
 * No glassmorphism, no bright gradients, clean 1px borders and high legibility typography.
 */
export const ConsentCard: React.FC<ConsentCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'default',
  className = '',
}) => {
  const getBorderColor = () => {
    if (variant === 'accent') return '#0284c7';
    if (variant === 'warning') return '#d97706';
    if (variant === 'success') return '#16a34a';
    return '#cbd5e1';
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: `1px solid ${getBorderColor()}`,
        borderRadius: '8px',
        padding: '1.25rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        marginBottom: '1rem',
      }}
      className={className}
    >
      {(title || icon) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', borderBottom: subtitle ? 'none' : '1px solid #f1f5f9', paddingBottom: subtitle ? '0' : '0.5rem' }}>
          {icon && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>}
          <div>
            {title && <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{title}</h3>}
            {subtitle && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
