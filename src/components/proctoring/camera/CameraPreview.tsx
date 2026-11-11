import React from 'react';
import { useCamera } from './hooks/useCamera';
import { VideoCanvas } from './VideoCanvas';
import { CameraStatus } from './CameraStatus';

export const CameraPreview: React.FC = () => {
  const {
    stream,
    connection,
    permission,
    isMirrored,
    isFullscreen,
    isStreaming,
    currentResolution,
    toggleMirror,
    toggleFullscreen,
    startCamera,
    stopCamera,
  } = useCamera();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '70vh' : '320px',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #334155',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Live Video Canvas Stream */}
      {isStreaming ? (
        <VideoCanvas stream={stream} isMirrored={isMirrored} />
      ) : (
        <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>📷</span>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>
            {permission === 'denied' ? 'Camera Permission Denied' : 'Camera Stream Offline'}
          </p>
          <button
            type="button"
            onClick={() => startCamera()}
            style={{
              backgroundColor: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Start Camera Preview
          </button>
        </div>
      )}

      {/* Top Left Status & Overlay Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center', zIndex: 10 }}>
        <CameraStatus connection={connection} />
        {currentResolution && isStreaming && (
          <span style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#cbd5e1', border: '1px solid #475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            {currentResolution.width}x{currentResolution.height} @ {currentResolution.fps}fps
          </span>
        )}
      </div>

      {/* Bottom Right Control Bar */}
      {isStreaming && (
        <div style={{ position: 'absolute', bottom: '12px', right: '12px', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
          <button
            type="button"
            onClick={toggleMirror}
            title="Toggle Mirror View"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: '1px solid #475569',
              padding: '0.35rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {isMirrored ? '↔ Unmirror' : '⇄ Mirror'}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen Preview"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: '1px solid #475569',
              padding: '0.35rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            {isFullscreen ? '⤢ Collapse' : '⤢ Fullscreen'}
          </button>

          <button
            type="button"
            onClick={stopCamera}
            style={{
              backgroundColor: 'rgba(185, 28, 28, 0.85)',
              color: '#ffffff',
              border: '1px solid #ef4444',
              padding: '0.35rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            Stop Stream
          </button>
        </div>
      )}
    </div>
  );
};
