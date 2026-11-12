import {
  BulkEnrollmentReport,
  BulkEnrollmentError,
} from './institutionalTypes';

export class BulkEnrollmentService {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private static readonly VALID_ACCOMMODATION_CODES = new Set([
    'TIME_PLUS_25',
    'TIME_PLUS_50',
    'TIME_PLUS_100',
    'REST_BREAKS',
    'SCREEN_READER',
    'RELAXED_GAZE',
    'HIGH_CONTRAST',
    'LARGE_FONT',
    'KEYBOARD_ONLY',
  ]);

  private enrollmentRegistry: Map<string, any[]> = new Map(); // examId -> candidates[]

  /**
   * Parses and validates raw CSV content for bulk candidate enrollment.
   */
  public processBulkEnrollmentCSV(params: {
    tenantId: string;
    csvContent: string;
    targetExamId?: string;
  }): BulkEnrollmentReport {
    const { tenantId, csvContent, targetExamId } = params;
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      return {
        batchId,
        tenantId,
        examId: targetExamId || 'UNKNOWN',
        totalRows: 0,
        validCount: 0,
        errorCount: 1,
        enrolledCandidates: [],
        errors: [{ rowNumber: 0, field: 'FILE', value: '', error: 'Uploaded CSV file is empty.' }],
      };
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

    const headerIndices: Record<string, number> = {};
    headers.forEach((h, idx) => {
      headerIndices[h.toLowerCase()] = idx;
    });

    // Verify required columns
    const requiredColumns = ['email', 'firstname', 'lastname', 'studentid'];
    const missingColumns = requiredColumns.filter((rc) => headerIndices[rc] === undefined);

    if (missingColumns.length > 0) {
      return {
        batchId,
        tenantId,
        examId: targetExamId || 'UNKNOWN',
        totalRows: lines.length - 1,
        validCount: 0,
        errorCount: 1,
        enrolledCandidates: [],
        errors: [
          {
            rowNumber: 1,
            field: 'HEADER',
            value: headerLine,
            error: `Missing required CSV column headers: ${missingColumns.join(', ')}. Required format: email, firstName, lastName, studentId, examId, accommodations, section`,
          },
        ],
      };
    }

    const emailIdx = headerIndices['email'];
    const fnIdx = headerIndices['firstname'];
    const lnIdx = headerIndices['lastname'];
    const studentIdIdx = headerIndices['studentid'];
    const examIdIdx = headerIndices['examid'];
    const accomIdx = headerIndices['accommodations'];
    const sectionIdx = headerIndices['section'];

    const seenEmailsInBatch = new Set<string>();
    const enrolledCandidates: BulkEnrollmentReport['enrolledCandidates'] = [];
    const errors: BulkEnrollmentError[] = [];
    const rejectedRows: Array<{ originalRow: string; reason: string }> = [];

    const dataRows = lines.slice(1);

    for (let i = 0; i < dataRows.length; i++) {
      const rowNumber = i + 2; // 1-based index (header is row 1)
      const rawRow = dataRows[i];
      const cols = this.parseCsvRow(rawRow);

      const email = cols[emailIdx]?.trim() || '';
      const firstName = cols[fnIdx]?.trim() || '';
      const lastName = cols[lnIdx]?.trim() || '';
      const studentId = cols[studentIdIdx]?.trim() || '';
      const rowExamId = (examIdIdx !== undefined ? cols[examIdIdx]?.trim() : '') || targetExamId || '';
      const rawAccom = accomIdx !== undefined ? cols[accomIdx]?.trim() : '';
      const section = sectionIdx !== undefined ? cols[sectionIdx]?.trim() : undefined;

      let rowHasError = false;
      const rowErrors: string[] = [];

      // 1. Mandatory Field Validation
      if (!email) {
        errors.push({ rowNumber, field: 'email', value: '', error: 'Email is required and cannot be empty.' });
        rowErrors.push('Missing email');
        rowHasError = true;
      } else if (!BulkEnrollmentService.EMAIL_REGEX.test(email)) {
        errors.push({ rowNumber, field: 'email', value: email, error: 'Invalid email address format.' });
        rowErrors.push('Invalid email format');
        rowHasError = true;
      }

      if (!firstName) {
        errors.push({ rowNumber, field: 'firstName', value: '', error: 'First name is required.' });
        rowErrors.push('Missing first name');
        rowHasError = true;
      }

      if (!lastName) {
        errors.push({ rowNumber, field: 'lastName', value: '', error: 'Last name is required.' });
        rowErrors.push('Missing last name');
        rowHasError = true;
      }

      if (!studentId) {
        errors.push({ rowNumber, field: 'studentId', value: '', error: 'Student ID is required.' });
        rowErrors.push('Missing studentId');
        rowHasError = true;
      }

      if (!rowExamId) {
        errors.push({ rowNumber, field: 'examId', value: '', error: 'Exam ID is required.' });
        rowErrors.push('Missing examId');
        rowHasError = true;
      }

      // 2. Duplicate Detection (within batch)
      const lowerEmail = email.toLowerCase();
      if (email && seenEmailsInBatch.has(lowerEmail)) {
        errors.push({
          rowNumber,
          field: 'email',
          value: email,
          error: `Duplicate candidate email detected within the same import batch: "${email}".`,
        });
        rowErrors.push('Duplicate email in batch');
        rowHasError = true;
      } else if (email) {
        seenEmailsInBatch.add(lowerEmail);
      }

      // 3. Accommodation Code Validation (if provided)
      const validAccommodations: string[] = [];
      if (rawAccom) {
        const codes = rawAccom.split(';').map((c) => c.trim().toUpperCase()).filter((c) => c.length > 0);
        for (const code of codes) {
          if (!BulkEnrollmentService.VALID_ACCOMMODATION_CODES.has(code)) {
            errors.push({
              rowNumber,
              field: 'accommodations',
              value: code,
              error: `Unrecognized accommodation code: "${code}". Valid codes: ${Array.from(
                BulkEnrollmentService.VALID_ACCOMMODATION_CODES
              ).join(', ')}`,
            });
            rowErrors.push(`Invalid accommodation code: ${code}`);
            rowHasError = true;
          } else {
            validAccommodations.push(code);
          }
        }
      }

      if (rowHasError) {
        rejectedRows.push({
          originalRow: rawRow,
          reason: rowErrors.join('; '),
        });
      } else {
        const candidateRecord = {
          candidateId: `cand_${studentId}`,
          studentId,
          email,
          name: `${firstName} ${lastName}`,
          accommodations: validAccommodations,
          section,
        };

        enrolledCandidates.push(candidateRecord);

        // Save to registry
        const list = this.enrollmentRegistry.get(rowExamId) || [];
        list.push(candidateRecord);
        this.enrollmentRegistry.set(rowExamId, list);
      }
    }

    // Generate rejected CSV if errors occurred
    let rejectedCsvData: string | undefined = undefined;
    if (rejectedRows.length > 0) {
      const rejectedHeader = `${headerLine},ErrorReason`;
      const rejectedBody = rejectedRows.map((r) => `${r.originalRow},"${r.reason}"`);
      rejectedCsvData = [rejectedHeader, ...rejectedBody].join('\n');
    }

    return {
      batchId,
      tenantId,
      examId: targetExamId || 'BATCH_IMPORT',
      totalRows: dataRows.length,
      validCount: enrolledCandidates.length,
      errorCount: errors.length,
      enrolledCandidates,
      errors,
      rejectedCsvData,
    };
  }

  public getEnrolledCandidates(examId: string) {
    return this.enrollmentRegistry.get(examId) || [];
  }

  private parseCsvRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^["']|["']$/g, ''));
    return result;
  }
}

export const bulkEnrollmentService = new BulkEnrollmentService();

