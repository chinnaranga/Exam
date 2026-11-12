import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export interface QRCodeSVGProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

/**
 * High-precision, standards-compliant ISO/IEC 18004 QR Code SVG renderer.
 * Uses the industry-standard 'qrcode' engine for 100% reliable scanning
 * on all iOS Camera, Google Lens, and Android camera scanners.
 */
export const QRCodeSVG: React.FC<QRCodeSVGProps> = ({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
  fgColor = '#000000',
  bgColor = '#ffffff',
  className = '',
  title,
}) => {
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  useEffect(() => {
    if (!value) {
      setSvgMarkup('');
      return;
    }

    let isMounted = true;

    QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: level,
      margin: includeMargin ? 4 : 1,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      width: size,
    })
      .then((svg) => {
        if (isMounted) {
          setSvgMarkup(svg);
        }
      })
      .catch((err) => {
        console.error('[QRCodeSVG] QR generation failed:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, level, includeMargin, fgColor, bgColor]);

  if (!value || !svgMarkup) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-white border-2 border-[#2B2350]/20 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse ${className}`}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-xs ${className}`}
      style={{ width: size, height: size }}
      aria-label={title || `QR Code for ${value}`}
      role="img"
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default QRCodeSVG;
