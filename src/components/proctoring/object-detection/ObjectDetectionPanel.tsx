import React from 'react';
import { useObjectDetectionEngine } from './hooks/useObjectDetectionEngine';

export const ObjectDetectionPanel: React.FC = () => {
  const { fps, isGpuAccelerated, detectedObjects, isEngineActive, startEngine, stopEngine } = useObjectDetectionEngine();

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
          Object Detection Engine Diagnostics & Acceleration
        </h4>
        <button
          type="button"
          onClick={() => (isEngineActive ? stopEngine() : startEngine())}
          style={{
            backgroundColor: isEngineActive ? '#f1f5f9' : '#0284c7',
            color: isEngineActive ? '#475569' : '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {isEngineActive ? 'Pause Inference' : 'Resume Inference'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Inference FPS:</span>
          <div style={{ fontWeight: 700, color: '#0284c7' }}>{fps} FPS</div>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Target: 5–10 FPS</span>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>GPU Acceleration:</span>
          <div style={{ fontWeight: 700, color: isGpuAccelerated ? '#166534' : '#b45309' }}>
            {isGpuAccelerated ? 'WebGL / WebGPU Active' : 'CPU WebAssembly Fallback'}
          </div>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Active Detections:</span>
          <div style={{ fontWeight: 700, color: detectedObjects.length > 0 ? '#b91c1c' : '#166534' }}>
            {detectedObjects.length} objects
          </div>
        </div>
      </div>
    </div>
  );
};
