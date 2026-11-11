import React from 'react';
import { DESIGN_TOKENS } from '@/shared/lib/design-system/tokens';

export interface EnterpriseCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  children,
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: DESIGN_TOKENS.colors.surface,
        border: `1px solid ${DESIGN_TOKENS.colors.border}`,
        borderRadius: DESIGN_TOKENS.radii.enterprise,
        padding: DESIGN_TOKENS.spacing.space.xxl,
        boxShadow: DESIGN_TOKENS.shadows.card,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            {title && (
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: DESIGN_TOKENS.colors.text.primary }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: DESIGN_TOKENS.colors.text.secondary }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {children}
    </div>
  );
};

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, trendDirection = 'up', icon }) => {
  let trendColor = DESIGN_TOKENS.colors.success;
  if (trendDirection === 'down') trendColor = DESIGN_TOKENS.colors.error;

  return (
    <EnterpriseCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: DESIGN_TOKENS.colors.text.secondary, fontWeight: 500 }}>
            {label}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: DESIGN_TOKENS.colors.text.primary, marginTop: '0.2rem' }}>
            {value}
          </div>
          {trend && (
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: trendColor }}>
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div style={{ padding: '0.75rem', backgroundColor: DESIGN_TOKENS.colors.secondarySurface, borderRadius: DESIGN_TOKENS.radii.medium }}>
            {icon}
          </div>
        )}
      </div>
    </EnterpriseCard>
  );
};
