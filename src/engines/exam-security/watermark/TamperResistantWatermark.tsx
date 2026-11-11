import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface TamperResistantWatermarkProps {
  candidateId: string;
  sessionId: string;
  ipAddress?: string;
  timestamp?: number;
  onWatermarkTampered?: (details: { reason: string; timestamp: number }) => void;
  children: React.ReactNode;
}

export const TamperResistantWatermark: React.FC<TamperResistantWatermarkProps> = ({
  candidateId,
  sessionId,
  ipAddress = '127.0.0.1',
  timestamp = Date.now(),
  onWatermarkTampered,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const watermarkIdRef = useRef<string>(`assessiq-wm-${Math.random().toString(36).substring(2, 9)}`);
  const [, setRerenderKey] = useState<number>(0);
  const isRecoveringRef = useRef<boolean>(false);

  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const watermarkText = `${candidateId} • ${sessionId.slice(0, 12)} • ${ipAddress} • ${formattedDate}`;

  // Creates and styles the forensic watermark DOM element
  const createWatermarkElement = useCallback((): HTMLDivElement => {
    const wm = document.createElement('div');
    wm.id = watermarkIdRef.current;
    wm.setAttribute('data-assessiq-sentinel', 'watermark');
    wm.setAttribute('aria-hidden', 'true');

    // Build repeating SVG background pattern
    const svgPattern = `
      <svg xmlns="http://www.w3.org/2000/svg" width="380" height="180">
        <text 
          x="20" 
          y="70" 
          transform="rotate(-22 20 70)" 
          font-family="monospace, ui-monospace, sans-serif" 
          font-size="11.5px" 
          font-weight="bold" 
          fill="#2B2350" 
          fill-opacity="0.065" 
          letter-spacing="1.2px">
          ${watermarkText}
        </text>
        <text 
          x="190" 
          y="150" 
          transform="rotate(-22 190 150)" 
          font-family="monospace, ui-monospace, sans-serif" 
          font-size="10px" 
          font-weight="bold" 
          fill="#6C4DFF" 
          fill-opacity="0.045" 
          letter-spacing="1px">
          IMMUTABLE ASSESSIQ FORENSIC AUDIT
        </text>
      </svg>
    `;

    const encodedSvg = encodeURIComponent(svgPattern);
    const bgUrl = `data:image/svg+xml;utf8,${encodedSvg}`;

    wm.style.cssText = `
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      pointer-events: none !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      z-index: 999 !important;
      background-image: url("${bgUrl}") !important;
      background-repeat: repeat !important;
      background-position: 0 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      transform: none !important;
      filter: none !important;
    `;

    return wm;
  }, [watermarkText]);

  // Mount and protect watermark using MutationObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Ensure container has relative positioning
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    // Initial mount
    let currentWm = container.querySelector<HTMLDivElement>(`#${watermarkIdRef.current}`);
    if (!currentWm) {
      currentWm = createWatermarkElement();
      container.appendChild(currentWm);
    }

    // Function to re-assert watermark presence if modified or deleted
    const reassertWatermark = (reason: string) => {
      if (isRecoveringRef.current) return;
      isRecoveringRef.current = true;

      // 1. Report HIGH violation for tampering
      if (onWatermarkTampered) {
        onWatermarkTampered({
          reason: `Watermark Tampered: ${reason}`,
          timestamp: Date.now(),
        });
      }

      // 2. Re-inject into DOM immediately
      setTimeout(() => {
        if (!containerRef.current) {
          isRecoveringRef.current = false;
          return;
        }

        const existing = containerRef.current.querySelector(`#${watermarkIdRef.current}`);
        if (existing) {
          existing.remove();
        }

        watermarkIdRef.current = `assessiq-wm-${Math.random().toString(36).substring(2, 9)}`;
        const freshWm = createWatermarkElement();
        containerRef.current.appendChild(freshWm);
        setRerenderKey((prev) => prev + 1);
        isRecoveringRef.current = false;
      }, 50);
    };

    // Observer for DOM tree removal and attribute tampering
    const observer = new MutationObserver((mutations) => {
      if (isRecoveringRef.current) return;

      for (const mutation of mutations) {
        // Check for node removal
        if (mutation.type === 'childList') {
          for (const removedNode of Array.from(mutation.removedNodes)) {
            if (
              removedNode instanceof HTMLElement &&
              (removedNode.id === watermarkIdRef.current || removedNode.getAttribute('data-assessiq-sentinel') === 'watermark')
            ) {
              reassertWatermark('Node removed from DOM');
              return;
            }
          }
        }

        // Check for attribute manipulation (display: none, opacity: 0, etc.)
        if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement;
          if (target && target.id === watermarkIdRef.current) {
            const style = window.getComputedStyle(target);
            if (
              style.display === 'none' ||
              style.visibility === 'hidden' ||
              parseFloat(style.opacity || '1') < 0.2 ||
              parseInt(style.zIndex || '0', 10) < 0
            ) {
              reassertWatermark('Visibility or opacity CSS property altered');
              return;
            }
          }
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    });

    // Periodic heartbeat check ensuring watermark element is present
    const heartbeatTimer = setInterval(() => {
      if (!containerRef.current) return;
      const found = containerRef.current.querySelector(`#${watermarkIdRef.current}`);
      if (!found) {
        reassertWatermark('Periodic heartbeat detected absent watermark');
      }
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(heartbeatTimer);
      if (container) {
        const wm = container.querySelector(`#${watermarkIdRef.current}`);
        if (wm) wm.remove();
      }
    };
  }, [createWatermarkElement, onWatermarkTampered]);

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      {children}
    </div>
  );
};

export default TamperResistantWatermark;
