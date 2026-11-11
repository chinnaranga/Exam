import React from 'react';
import { useConsent } from './hooks/useConsent';
import { ConsentCard } from './ConsentCard';
import { PermissionState } from './types/consent.types';

export const PermissionRequest: React.FC = () => {
  const {
    permissions,
    requestCameraPermission,
    requestMicrophonePermission,
    requestNotificationPermission,
    requestFullscreenPermission,
  } = useConsent();

  const renderStatusBadge = (status: PermissionState) => {
    if (status === 'granted') {
      return (
        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          ✓ Granted
        </span>
      );
    }
    if (status === 'denied') {
      return (
        <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
          ✕ Denied
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
        ● Pending Request
      </span>
    );
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#475569' }}>
        Please grant the required system permissions below. Permissions will <strong>only</strong> be requested when you click the buttons below.
      </p>

      {/* 1. Camera Permission */}
      <ConsentCard
        title="Web Camera Feed (Required)"
        subtitle="Used for candidate presence verification and identity confirmation during the exam."
        variant={permissions.camera === 'granted' ? 'success' : permissions.camera === 'denied' ? 'warning' : 'accent'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          {renderStatusBadge(permissions.camera)}
          <button
            type="button"
            onClick={requestCameraPermission}
            style={{
              backgroundColor: permissions.camera === 'granted' ? '#f1f5f9' : '#0284c7',
              color: permissions.camera === 'granted' ? '#475569' : '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {permissions.camera === 'granted' ? 'Re-test Camera' : permissions.camera === 'denied' ? 'Retry Camera Request' : 'Grant Camera Access'}
          </button>
        </div>
      </ConsentCard>

      {/* 2. Microphone Permission */}
      <ConsentCard
        title="Microphone Audio (Required)"
        subtitle="Used to monitor ambient acoustic environment telemetry for speech or secondary audio devices."
        variant={permissions.microphone === 'granted' ? 'success' : permissions.microphone === 'denied' ? 'warning' : 'accent'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          {renderStatusBadge(permissions.microphone)}
          <button
            type="button"
            onClick={requestMicrophonePermission}
            style={{
              backgroundColor: permissions.microphone === 'granted' ? '#f1f5f9' : '#0284c7',
              color: permissions.microphone === 'granted' ? '#475569' : '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {permissions.microphone === 'granted' ? 'Re-test Microphone' : permissions.microphone === 'denied' ? 'Retry Microphone Request' : 'Grant Microphone Access'}
          </button>
        </div>
      </ConsentCard>

      {/* 3. Fullscreen Permission */}
      <ConsentCard
        title="Fullscreen Lockdown Mode (Required)"
        subtitle="Enforces continuous active window focus during testing."
        variant={permissions.fullscreen === 'granted' ? 'success' : 'accent'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          {renderStatusBadge(permissions.fullscreen)}
          <button
            type="button"
            onClick={requestFullscreenPermission}
            style={{
              backgroundColor: permissions.fullscreen === 'granted' ? '#f1f5f9' : '#0284c7',
              color: permissions.fullscreen === 'granted' ? '#475569' : '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {permissions.fullscreen === 'granted' ? 'Fullscreen Active' : 'Enable Fullscreen Mode'}
          </button>
        </div>
      </ConsentCard>

      {/* 4. Notifications Permission (Optional) */}
      <ConsentCard
        title="System Notifications (Optional)"
        subtitle="Used for receiving proctor warnings or exam time updates."
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          {renderStatusBadge(permissions.notifications)}
          <button
            type="button"
            onClick={requestNotificationPermission}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.45rem 0.9rem',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {permissions.notifications === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
          </button>
        </div>
      </ConsentCard>
    </div>
  );
};
