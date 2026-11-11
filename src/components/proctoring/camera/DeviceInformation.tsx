import React from 'react';
import { useCamera } from './hooks/useCamera';

export const DeviceInformation: React.FC = () => {
  const { availableDevices, selectedDeviceId, currentResolution } = useCamera();

  const activeDevice = availableDevices.find((d) => d.deviceId === selectedDeviceId);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';

  let browserName = 'Browser';
  if (/chrome/i.test(userAgent)) browserName = 'Google Chrome';
  else if (/firefox/i.test(userAgent)) browserName = 'Mozilla Firefox';
  else if (/safari/i.test(userAgent)) browserName = 'Apple Safari';
  else if (/edg/i.test(userAgent)) browserName = 'Microsoft Edge';

  let osName = 'Operating System';
  if (/mac/i.test(userAgent)) osName = 'macOS';
  else if (/win/i.test(userAgent)) osName = 'Windows';
  else if (/linux/i.test(userAgent)) osName = 'Linux';

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
        Hardware & System Environment Details
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Camera Device:</span>
          <div style={{ fontWeight: 600, color: '#0f172a', wordBreak: 'break-word' }}>
            {activeDevice?.label || 'Not Selected'}
          </div>
        </div>

        <div>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Facing Mode:</span>
          <div style={{ fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
            {activeDevice?.facingMode || 'User (Front)'}
          </div>
        </div>

        <div>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Browser & OS:</span>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>
            {browserName} on {osName}
          </div>
        </div>

        <div>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Active Stream Spec:</span>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>
            {currentResolution ? `${currentResolution.width}x${currentResolution.height} @ ${currentResolution.fps}fps` : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  );
};
