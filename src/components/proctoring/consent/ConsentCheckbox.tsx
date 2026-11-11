import React from 'react';

export interface ConsentCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Accessible enterprise checkbox component for explicit candidate confirmation.
 */
export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  required = true,
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1rem',
        backgroundColor: checked ? '#f0f9ff' : '#f8fafc',
        border: `1px solid ${checked ? '#0284c7' : '#e2e8f0'}`,
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        marginBottom: '0.75rem',
        transition: 'all 0.15s ease-in-out',
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-checked={checked}
        aria-required={required}
        style={{
          marginTop: '0.2rem',
          width: '18px',
          height: '18px',
          accentColor: '#0284c7',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: checked ? 500 : 400, lineHeight: 1.4 }}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </span>
    </label>
  );
};
