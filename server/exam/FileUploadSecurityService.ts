import crypto from 'crypto';

export interface FileValidationResult {
  valid: boolean;
  fileHash: string;
  sizeBytes: number;
  detectedMimeType: string;
  virusScanPassed: boolean;
  error?: string;
}

export class FileUploadSecurityService {
  // Malicious extensions that must always be blocked
  private static readonly BLOCKED_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.sh', '.bash', '.vbs', '.js', '.ts', '.py',
    '.php', '.bin', '.dll', '.so', '.app', '.msi', '.scr', '.pif',
  ];

  /**
   * Inspects and validates an uploaded file payload (buffer or base64).
   * Enforces size limits, allowed extensions, magic number signature checking,
   * and simulated virus scanning with SHA-256 ledger hashing.
   */
  public validateUploadedFile(params: {
    fileName: string;
    fileContent: Buffer | string; // Buffer or Base64 / data URI
    allowedExtensions: string[]; // e.g. ['.pdf', '.png', '.jpg', '.jpeg']
    maxSizeBytes: number; // e.g. 10 * 1024 * 1024 (10MB)
  }): FileValidationResult {
    let buffer: Buffer;

    if (Buffer.isBuffer(params.fileContent)) {
      buffer = params.fileContent;
    } else {
      // Clean data URI prefix if present
      const base64Data = params.fileContent.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    }

    const sizeBytes = buffer.length;
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    // 1. Extension Verification
    const extMatch = params.fileName.toLowerCase().match(/\.[a-z0-9]+$/);
    const extension = extMatch ? extMatch[0] : '';

    if (FileUploadSecurityService.BLOCKED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        fileHash,
        sizeBytes,
        detectedMimeType: 'application/x-executable',
        virusScanPassed: false,
        error: `Security Violation: File extension "${extension}" is restricted for examination safety.`,
      };
    }

    const normalizedAllowed = params.allowedExtensions.map((e) => e.toLowerCase());
    if (!normalizedAllowed.includes(extension)) {
      return {
        valid: false,
        fileHash,
        sizeBytes,
        detectedMimeType: 'application/octet-stream',
        virusScanPassed: false,
        error: `File format "${extension}" is not permitted. Allowed formats: ${params.allowedExtensions.join(', ')}.`,
      };
    }

    // 2. File Size Limit
    if (sizeBytes > params.maxSizeBytes) {
      const maxMb = (params.maxSizeBytes / (1024 * 1024)).toFixed(1);
      const actualMb = (sizeBytes / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        fileHash,
        sizeBytes,
        detectedMimeType: 'application/octet-stream',
        virusScanPassed: false,
        error: `Security Violation: File size (${actualMb} MB) exceeds allowed limit (maximum allowed limit: ${maxMb} MB).`,
      };
    }

    // 3. Magic Number Byte Inspection
    const detectedMimeType = this.detectMagicNumber(buffer);

    // 4. Virus Scan Simulation (known EICAR test string or malicious pattern check)
    const bufferString = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
    if (bufferString.includes('X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*')) {
      return {
        valid: false,
        fileHash,
        sizeBytes,
        detectedMimeType,
        virusScanPassed: false,
        error: 'Security Alert: Virus/Malware Detected (malicious signature detected in file upload payload).',
      };
    }

    return {
      valid: true,
      fileHash,
      sizeBytes,
      detectedMimeType,
      virusScanPassed: true,
    };
  }

  private detectMagicNumber(buffer: Buffer): string {
    if (buffer.length >= 4) {
      // PDF: %PDF (0x25 0x50 0x44 0x46)
      if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
        return 'application/pdf';
      }
      // PNG: \x89PNG (0x89 0x50 0x4E 0x47)
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        return 'image/png';
      }
      // JPEG: \xFF\xD8\xFF (0xFF 0xD8 0xFF)
      if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return 'image/jpeg';
      }
    }
    return 'application/octet-stream';
  }
}

export const fileUploadSecurityService = new FileUploadSecurityService();
export default fileUploadSecurityService;
