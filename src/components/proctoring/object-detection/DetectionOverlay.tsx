import React from 'react';
import { DetectedObject } from './types/object.types';

export interface DetectionOverlayProps {
  objects: DetectedObject[];
}

/**
 * Interactive SVG Bounding Box Overlay displaying colored object frames with persistent OBJ-101 labels.
 * Red = Blocked object violation
 * Yellow = Warning object
 * Green = Allowed object
 */
export const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ objects }) => {
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      {objects.map((obj) => {
        const { x, y, width, height } = obj.boundingBox;

        let strokeColor = '#166534'; // Green = Allowed
        let bgColor = 'rgba(22, 101, 52, 0.2)';
        if (obj.policyRule === 'Blocked') {
          strokeColor = '#dc2626'; // Red = Blocked
          bgColor = 'rgba(220, 38, 38, 0.25)';
        } else if (obj.policyRule === 'Warning') {
          strokeColor = '#d97706'; // Yellow = Warning
          bgColor = 'rgba(217, 119, 6, 0.25)';
        }

        return (
          <g key={obj.trackingId}>
            {/* Bounding Box Frame */}
            <rect
              x={`${x}%`}
              y={`${y}%`}
              width={`${width}%`}
              height={`${height}%`}
              fill={bgColor}
              stroke={strokeColor}
              strokeWidth="2.5"
              rx="4"
            />

            {/* OBJ Label Pill Header */}
            <foreignObject
              x={`${x}%`}
              y={`${Math.max(0, y - 8)}%`}
              width="200"
              height="30"
              style={{ overflow: 'visible' }}
            >
              <div
                style={{
                  backgroundColor: strokeColor,
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  display: 'inline-block',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {obj.trackingId}: {obj.objectType} ({obj.confidenceScore}%) [{obj.policyRule.toUpperCase()}]
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
};
