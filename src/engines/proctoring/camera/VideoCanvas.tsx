import React, { useEffect, useRef } from 'react';

export interface VideoCanvasProps {
  stream: MediaStream | null;
  isMirrored?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Enterprise HTML5 Video canvas renderer safely binding WebRTC MediaStream instances.
 */
export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  stream,
  isMirrored = true,
  className = '',
  style = {},
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: isMirrored ? 'scaleX(-1)' : 'none',
        backgroundColor: '#0f172a',
        borderRadius: '6px',
        ...style,
      }}
    />
  );
};
