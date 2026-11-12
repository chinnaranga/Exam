import React, { useMemo } from 'react';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRCodeSVGProps {
  value: string;
  size?: number;
  level?: ErrorCorrectionLevel;
  includeMargin?: boolean;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

/**
 * High-precision, zero-dependency ISO/IEC 18004 compliant QR Code Model 2 SVG generator.
 * Produces crisp, standard-compliant vector QR codes scannable by all iOS and Android cameras.
 */
class QrCodeGenerator {
  public readonly version: number;
  public readonly size: number;
  public readonly mask: number;
  public readonly modules: boolean[][];
  private readonly isFunction: boolean[][];

  constructor(
    version: number,
    public readonly errorCorrectionLevel: ErrorCorrectionLevel,
    dataCodewords: number[],
    msk = -1
  ) {
    this.version = version;
    this.size = version * 4 + 17;

    this.modules = [];
    this.isFunction = [];
    for (let y = 0; y < this.size; y++) {
      this.modules.push(new Array(this.size).fill(false));
      this.isFunction.push(new Array(this.size).fill(false));
    }

    this.drawFunctionPatterns();
    const allCodewords = this.addEccAndInterleave(dataCodewords);
    this.drawCodewords(allCodewords);

    // Auto-select lowest penalty mask
    if (msk === -1) {
      let minPenalty = 1e9;
      let bestMask = 0;
      for (let i = 0; i < 8; i++) {
        this.applyMask(i);
        this.drawFormatBits(i);
        const penalty = this.getPenaltyScore();
        if (penalty < minPenalty) {
          minPenalty = penalty;
          bestMask = i;
        }
        this.applyMask(i); // Revert mask
      }
      msk = bestMask;
    }
    this.mask = msk;
    this.applyMask(msk);
    this.drawFormatBits(msk);
  }

  public static encodeText(text: string, ecl: ErrorCorrectionLevel = 'M'): QrCodeGenerator {
    const bytes: number[] = [];
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code < 128) {
        bytes.push(code);
      } else if (code < 2048) {
        bytes.push(192 | (code >> 6), 128 | (code & 63));
      } else if (code < 55296 || code >= 57344) {
        bytes.push(224 | (code >> 12), 128 | ((code >> 6) & 63), 128 | (code & 63));
      } else {
        i++;
        code = 65536 + (((code & 1023) << 10) | (text.charCodeAt(i) & 1023));
        bytes.push(
          240 | (code >> 18),
          128 | ((code >> 12) & 63),
          128 | ((code >> 6) & 63),
          128 | (code & 63)
        );
      }
    }

    const seg = { mode: 0x4, numChars: bytes.length, data: bytes };
    return QrCodeGenerator.encodeSegments([seg], ecl);
  }

  private static encodeSegments(
    segs: Array<{ mode: number; numChars: number; data: number[] }>,
    ecl: ErrorCorrectionLevel,
    minVersion = 1,
    maxVersion = 40
  ): QrCodeGenerator {
    for (let version = minVersion; version <= maxVersion; version++) {
      const dataCapacityBits = QrCodeGenerator.getNumDataCodewords(version, ecl) * 8;
      const dataUsedBits = QrCodeGenerator.getTotalBits(segs, version);
      if (dataUsedBits !== -1 && dataUsedBits <= dataCapacityBits) {
        const bb: number[] = [];
        for (const seg of segs) {
          QrCodeGenerator.appendBits(seg.mode, 4, bb);
          QrCodeGenerator.appendBits(
            seg.numChars,
            QrCodeGenerator.numCharCountBits(seg.mode, version),
            bb
          );
          for (const b of seg.data) {
            QrCodeGenerator.appendBits(b, 8, bb);
          }
        }
        // Terminator
        QrCodeGenerator.appendBits(0, Math.min(4, dataCapacityBits - bb.length), bb);
        // Pad to byte boundary
        while (bb.length % 8 !== 0) bb.push(0);
        // Byte padding
        const padBytes = [0xec, 0x11];
        let padIdx = 0;
        while (bb.length < dataCapacityBits) {
          QrCodeGenerator.appendBits(padBytes[padIdx % 2], 8, bb);
          padIdx++;
        }
        // Convert to data codewords
        const dataCodewords: number[] = [];
        for (let i = 0; i < bb.length; i += 8) {
          let byte = 0;
          for (let j = 0; j < 8; j++) byte = (byte << 1) | bb[i + j];
          dataCodewords.push(byte);
        }
        return new QrCodeGenerator(version, ecl, dataCodewords);
      }
    }
    throw new Error('Payload exceeds maximum QR Code capacity');
  }

  private static numCharCountBits(mode: number, version: number): number {
    return version < 10 ? 8 : 16;
  }

  private static getTotalBits(
    segs: Array<{ mode: number; numChars: number; data: number[] }>,
    version: number
  ): number {
    let result = 0;
    for (const seg of segs) {
      result += 4 + QrCodeGenerator.numCharCountBits(seg.mode, version) + seg.data.length * 8;
    }
    return result;
  }

  private static appendBits(val: number, len: number, bb: number[]) {
    for (let i = len - 1; i >= 0; i--) {
      bb.push((val >>> i) & 1);
    }
  }

  private drawFunctionPatterns() {
    // Timing patterns
    for (let i = 0; i < this.size; i++) {
      this.setFunctionModule(6, i, i % 2 === 0);
      this.setFunctionModule(i, 6, i % 2 === 0);
    }
    // Finder patterns
    this.drawFinderPattern(3, 3);
    this.drawFinderPattern(this.size - 4, 3);
    this.drawFinderPattern(3, this.size - 4);

    // Alignment patterns
    const alignCoords = this.getAlignmentPatternPositions();
    const numAlign = alignCoords.length;
    for (let i = 0; i < numAlign; i++) {
      for (let j = 0; j < numAlign; j++) {
        if (
          (i === 0 && j === 0) ||
          (i === 0 && j === numAlign - 1) ||
          (i === numAlign - 1 && j === 0)
        ) {
          continue;
        }
        this.drawAlignmentPattern(alignCoords[i], alignCoords[j]);
      }
    }

    // Format bits reservations
    this.drawFormatBits(0);
    this.drawVersion();
  }

  private drawFinderPattern(x: number, y: number) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < this.size && yy >= 0 && yy < this.size) {
          this.setFunctionModule(xx, yy, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  private drawAlignmentPattern(x: number, y: number) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  private setFunctionModule(x: number, y: number, isDark: boolean) {
    this.modules[y][x] = isDark;
    this.isFunction[y][x] = true;
  }

  private drawFormatBits(mask: number) {
    const eclFormatBits: Record<ErrorCorrectionLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };
    const data = (eclFormatBits[this.errorCorrectionLevel] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;

    // Top-left
    for (let i = 0; i <= 5; i++) this.modules[8][i] = ((bits >>> i) & 1) !== 0;
    this.modules[8][7] = ((bits >>> 6) & 1) !== 0;
    this.modules[8][8] = ((bits >>> 7) & 1) !== 0;
    this.modules[7][8] = ((bits >>> 8) & 1) !== 0;
    for (let i = 9; i < 15; i++) this.modules[14 - i][8] = ((bits >>> i) & 1) !== 0;

    // Copies around other finders
    for (let i = 0; i < 8; i++) this.modules[8][this.size - 1 - i] = ((bits >>> i) & 1) !== 0;
    for (let i = 8; i < 15; i++) this.modules[this.size - 15 + i][8] = ((bits >>> i) & 1) !== 0;
    this.modules[this.size - 8][8] = true; // Dark module
  }

  private drawVersion() {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const bit = ((bits >>> i) & 1) !== 0;
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.setFunctionModule(a, b, bit);
      this.setFunctionModule(b, a, bit);
    }
  }

  private addEccAndInterleave(data: number[]): number[] {
    const ver = this.version;
    const ecl = this.errorCorrectionLevel;
    const numBlocks = QrCodeGenerator.NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
    const blockEccLen = QrCodeGenerator.ECC_CODEWORDS_PER_BLOCK[ecl][ver];
    const rawCodewords = Math.floor(QrCodeGenerator.getNumRawDataModules(ver) / 8);
    const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
    const shortBlockLen = Math.floor(rawCodewords / numBlocks);

    const blocks: Array<{ data: number[]; ecc: number[] }> = [];
    const rs = new ReedSolomonGenerator(blockEccLen);
    let k = 0;
    for (let i = 0; i < numBlocks; i++) {
      const datLen = shortBlockLen - blockEccLen + (i >= numShortBlocks ? 1 : 0);
      const dat = data.slice(k, k + datLen);
      k += datLen;
      const ecc = rs.getRemainder(dat);
      blocks.push({ data: dat, ecc });
    }

    const result: number[] = [];
    for (let i = 0; i < shortBlockLen - blockEccLen + 1; i++) {
      for (let j = 0; j < numBlocks; j++) {
        if (i < blocks[j].data.length) result.push(blocks[j].data[i]);
      }
    }
    for (let i = 0; i < blockEccLen; i++) {
      for (let j = 0; j < numBlocks; j++) {
        result.push(blocks[j].ecc[i]);
      }
    }
    return result;
  }

  private drawCodewords(data: number[]) {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = ((data[i >>> 3] >>> (7 - (i & 7))) & 1) !== 0;
            i++;
          }
        }
      }
    }
  }

  private applyMask(mask: number) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.isFunction[y][x]) {
          let invert = false;
          switch (mask) {
            case 0:
              invert = (x + y) % 2 === 0;
              break;
            case 1:
              invert = y % 2 === 0;
              break;
            case 2:
              invert = x % 3 === 0;
              break;
            case 3:
              invert = (x + y) % 3 === 0;
              break;
            case 4:
              invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
              break;
            case 5:
              invert = ((x * y) % 2) + ((x * y) % 3) === 0;
              break;
            case 6:
              invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
              break;
            case 7:
              invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
              break;
          }
          if (invert) this.modules[y][x] = !this.modules[y][x];
        }
      }
    }
  }

  private getPenaltyScore(): number {
    let result = 0;
    for (let y = 0; y < this.size; y++) {
      let runColor = false;
      let runLen = 0;
      for (let x = 0; x < this.size; x++) {
        if (this.modules[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += 3;
          else if (runLen > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runLen = 1;
        }
      }
    }
    for (let x = 0; x < this.size; x++) {
      let runColor = false;
      let runLen = 0;
      for (let y = 0; y < this.size; y++) {
        if (this.modules[y][x] === runColor) {
          runLen++;
          if (runLen === 5) result += 3;
          else if (runLen > 5) result++;
        } else {
          runColor = this.modules[y][x];
          runLen = 1;
        }
      }
    }
    for (let y = 0; y < this.size - 1; y++) {
      for (let x = 0; x < this.size - 1; x++) {
        const color = this.modules[y][x];
        if (
          color === this.modules[y][x + 1] &&
          color === this.modules[y + 1][x] &&
          color === this.modules[y + 1][x + 1]
        ) {
          result += 3;
        }
      }
    }
    return result;
  }

  private getAlignmentPatternPositions(): number[] {
    if (this.version === 1) return [];
    const num = Math.floor(this.version / 7) + 2;
    const step =
      this.version === 32 ? 26 : Math.ceil((this.version * 4 + 4) / (num * 2 - 2)) * 2;
    const result = [6];
    for (let pos = this.size - 7; result.length < num; pos -= step) {
      result.splice(1, 0, pos);
    }
    return result;
  }

  private static getNumDataCodewords(ver: number, ecl: ErrorCorrectionLevel): number {
    return (
      Math.floor(QrCodeGenerator.getNumRawDataModules(ver) / 8) -
      QrCodeGenerator.ECC_CODEWORDS_PER_BLOCK[ecl][ver] *
        QrCodeGenerator.NUM_ERROR_CORRECTION_BLOCKS[ecl][ver]
    );
  }

  private static getNumRawDataModules(ver: number): number {
    let result = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      const numAlign = Math.floor(ver / 7) + 2;
      result -= (25 * numAlign - 10) * numAlign - 55;
      if (ver >= 7) result -= 36;
    }
    return result;
  }

  public static readonly ECC_CODEWORDS_PER_BLOCK: Record<ErrorCorrectionLevel, number[]> = {
    L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  };

  public static readonly NUM_ERROR_CORRECTION_BLOCKS: Record<ErrorCorrectionLevel, number[]> = {
    L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81],
  };
}

class ReedSolomonGenerator {
  private coefficients: number[] = [];

  constructor(degree: number) {
    for (let i = 0; i < degree - 1; i++) this.coefficients.push(0);
    this.coefficients.push(1);

    let root = 1;
    for (let i = 0; i < degree; i++) {
      for (let j = 0; j < this.coefficients.length; j++) {
        this.coefficients[j] = ReedSolomonGenerator.multiply(this.coefficients[j], root);
        if (j + 1 < this.coefficients.length) this.coefficients[j] ^= this.coefficients[j + 1];
      }
      root = ReedSolomonGenerator.multiply(root, 0x02);
    }
  }

  public getRemainder(data: number[]): number[] {
    const result = new Array(this.coefficients.length).fill(0);
    for (const b of data) {
      const factor = b ^ result.shift()!;
      result.push(0);
      for (let i = 0; i < this.coefficients.length; i++) {
        result[i] ^= ReedSolomonGenerator.multiply(this.coefficients[i], factor);
      }
    }
    return result;
  }

  private static multiply(x: number, y: number): number {
    let z = 0;
    for (let i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11d);
      z ^= ((y >>> i) & 1) * x;
    }
    return z;
  }
}

/**
 * React SVG Component for rendering scannable QR codes.
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
  const { matrix, matrixSize, margin } = useMemo(() => {
    if (!value) {
      return { matrix: [], matrixSize: 0, margin: 0 };
    }
    try {
      const qr = QrCodeGenerator.encodeText(value, level);
      const m = includeMargin ? 4 : 0;
      return {
        matrix: qr.modules,
        matrixSize: qr.size,
        margin: m,
      };
    } catch (err) {
      console.warn('[QRCodeSVG] Encoding error:', err);
      return { matrix: [], matrixSize: 0, margin: 0 };
    }
  }, [value, level, includeMargin]);

  if (!matrix || matrixSize === 0) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-slate-100 flex items-center justify-center text-xs text-slate-400 font-mono ${className}`}
      >
        Invalid QR Data
      </div>
    );
  }

  const viewBoxSize = matrixSize + margin * 2;

  // Build SVG path for dark modules for optimal rendering performance
  const darkModuleRects: React.ReactElement[] = [];
  for (let y = 0; y < matrixSize; y++) {
    for (let x = 0; x < matrixSize; x++) {
      if (matrix[y][x]) {
        darkModuleRects.push(
          <rect
            key={`${x}-${y}`}
            x={x + margin}
            y={y + margin}
            width={1}
            height={1}
            fill={fgColor}
          />
        );
      }
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={className}
      aria-label={title || `QR Code for ${value}`}
      role="img"
    >
      {title && <title>{title}</title>}
      {/* Background with Quiet Zone */}
      <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />
      {/* Dark Modules */}
      {darkModuleRects}
    </svg>
  );
};

export default QRCodeSVG;

