import React, { useRef } from 'react';
import { useConsent } from './hooks/useConsent';
import { ConsentCard } from './ConsentCard';

export const PolicyAgreement: React.FC = () => {
  const { policy, hasScrolledPolicyToBottom, markPolicyScrolled } = useConsent();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Consider scrolled to bottom when candidate is within 20px of bottom
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        markPolicyScrolled();
      }
    }
  };

  return (
    <div>
      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#475569' }}>
        Please review the institutional examination compliance policy below. You must scroll through the document before accepting.
      </p>

      {/* Policy Rules Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {policy?.rules.map((rule) => (
          <div key={rule.id} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.75rem', borderRadius: '6px' }}>
            <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>{rule.title}</h5>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{rule.description}</p>
          </div>
        ))}
      </div>

      {/* Scrollable Policy Text Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: '240px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '1rem',
          fontSize: '0.85rem',
          color: '#1e293b',
          lineHeight: 1.6,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          marginBottom: '1rem',
        }}
      >
        {policy?.policyText}
      </div>

      {/* Scroll Status Banner */}
      <div
        style={{
          padding: '0.65rem 1rem',
          borderRadius: '6px',
          fontSize: '0.85rem',
          fontWeight: 500,
          backgroundColor: hasScrolledPolicyToBottom ? '#dcfce7' : '#fef3c7',
          color: hasScrolledPolicyToBottom ? '#15803d' : '#b45309',
          border: `1px solid ${hasScrolledPolicyToBottom ? '#bbf7d0' : '#fde68a'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          {hasScrolledPolicyToBottom
            ? '✓ Policy fully reviewed. You may proceed to the Consent Checklist.'
            : '↓ Please scroll to the bottom of the policy text box above to enable continuation.'}
        </span>
        {!hasScrolledPolicyToBottom && (
          <button
            type="button"
            onClick={markPolicyScrolled}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#b45309',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            Mark as Read
          </button>
        )}
      </div>
    </div>
  );
};
