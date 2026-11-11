import React from 'react';
import { FaceBoundingBoxData } from './types/face.types';

export interface FaceBoundingBoxProps {
  faces: FaceBoundingBoxData[];
  containerWidth?: number;
  containerHeight?: number;
}

/**
 * High-precision SVG bounding box overlay rendering face detection bounds,
 * face center point, confidence badge, and face ID.
 */
export const FaceBoundingBox: React.FC<FaceBoundingBoxProps> = ({ faces }) => {
  if (faces.length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {faces.map((face, index) => {
        const isMultiple = faces.length > 1;
        const color = isMultiple ? '#ef4444' : '#0284c7';

        return (
          <div
            key={face.id || index}
            style={{
              position: 'absolute',
              left: `${face.x}%`,
              top: `${face.y}%`,
              width: `${face.width}%`,
              height: `${face.height}%`,
              border: `2px solid ${color}`,
              borderRadius: '6px',
              boxShadow: `0 0 12px ${color}88`,
              transition: 'all 0.15s ease',
            }}
          >
            {/* Center Target Dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '6px',
                height: '6px',
                backgroundColor: color,
                borderRadius: '50%',
              }}
            />

            {/* Label Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-24px',
                left: '0',
                backgroundColor: color,
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
              }}
            >
              {isMultiple ? `⚠ FACE #${index + 1}` : 'CANDIDATE FACE'}{' '}
              {Math.round(face.confidence * 100)}%
            </div>
          </div>
        );
      })}
    </div>
  );
};
