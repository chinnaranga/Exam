import { describe, it, expect, beforeEach } from 'vitest';
import { WebhookService } from '../WebhookService';
import { BulkEnrollmentService } from '../BulkEnrollmentService';
import { SsoAndRoleMappingService } from '../SsoAndRoleMappingService';
import { LtiIntegrationService } from '../LtiIntegrationService';
import { NotificationService } from '../NotificationService';
import { SignedWebhookPayload } from '../institutionalTypes';

describe('AssessIQ Webhook HMAC-SHA256 Signatures & Anti-Replay', () => {
  let webhookService: WebhookService;
  const testSecret = 'whsec_test_secret_key_8829104928174';

  beforeEach(() => {
    webhookService = new WebhookService();
  });

  it('generates valid HMAC-SHA256 signature header and verifies authentic payload', () => {
    const now = Date.now();
    const payload: SignedWebhookPayload = {
      id: 'evt_test_1',
      event: 'exam.submitted',
      timestamp: now,
      tenantId: 'tenant_university_main',
      data: {
        sessionId: 'sess_123',
        candidateId: 'cand_456',
        score: 92,
        status: 'SUBMITTED',
      },
    };

    const { signatureHeader, rawBody } = webhookService.generateWebhookSignature(payload, testSecret);

    expect(signatureHeader).toContain(`t=${now},v1=`);

    const verification = webhookService.verifyWebhookSignature({
      rawBody,
      signatureHeader,
      secret: testSecret,
      currentTime: now + 2000, // 2 seconds later
    });

    expect(verification.isValid).toBe(true);
    expect(verification.reason).toBeUndefined();
  });

  it('rejects webhook with mismatched or incorrect secret', () => {
    const now = Date.now();
    const payload: SignedWebhookPayload = {
      id: 'evt_test_2',
      event: 'session.flagged',
      timestamp: now,
      tenantId: 'tenant_university_main',
      data: { points: 6, reason: 'MULTIPLE_MONITORS' },
    };

    const { signatureHeader, rawBody } = webhookService.generateWebhookSignature(payload, testSecret);

    const verification = webhookService.verifyWebhookSignature({
      rawBody,
      signatureHeader,
      secret: 'whsec_wrong_attacker_secret',
      currentTime: now,
    });

    expect(verification.isValid).toBe(false);
    expect(verification.reason).toContain('signature mismatch');
  });

  it('rejects webhook when payload content is tampered in transit', () => {
    const now = Date.now();
    const payload: SignedWebhookPayload = {
      id: 'evt_test_3',
      event: 'result.released',
      timestamp: now,
      tenantId: 'tenant_university_main',
      data: { score: 75, grade: 'C' },
    };

    const { signatureHeader } = webhookService.generateWebhookSignature(payload, testSecret);

    // Attacker modifies score from 75 to 100
    const tamperedPayload = { ...payload, data: { score: 100, grade: 'A' } };
    const tamperedRawBody = JSON.stringify(tamperedPayload);

    const verification = webhookService.verifyWebhookSignature({
      rawBody: tamperedRawBody,
      signatureHeader,
      secret: testSecret,
      currentTime: now,
    });

    expect(verification.isValid).toBe(false);
    expect(verification.reason).toContain('signature mismatch');
  });

  it('rejects expired webhook signatures to prevent replay attacks (>300s)', () => {
    const oldTimestamp = Date.now() - 400 * 1000; // 400 seconds ago (>300s limit)
    const payload: SignedWebhookPayload = {
      id: 'evt_test_replay',
      event: 'exam.started',
      timestamp: oldTimestamp,
      tenantId: 'tenant_university_main',
      data: { sessionId: 'sess_replayed' },
    };

    const { signatureHeader, rawBody } = webhookService.generateWebhookSignature(payload, testSecret);

    const verification = webhookService.verifyWebhookSignature({
      rawBody,
      signatureHeader,
      secret: testSecret,
      toleranceSeconds: 300,
      currentTime: Date.now(),
    });

    expect(verification.isValid).toBe(false);
    expect(verification.reason).toContain('expired or out of tolerance');
  });

  it('rejects malformed signature headers', () => {
    const verification = webhookService.verifyWebhookSignature({
      rawBody: '{}',
      signatureHeader: 'invalid_format_header',
      secret: testSecret,
    });

    expect(verification.isValid).toBe(false);
    expect(verification.reason).toContain('Malformed signature header');
  });
});

describe('AssessIQ Bulk CSV Enrollment Validation & Error Reporting', () => {
  let enrollmentService: BulkEnrollmentService;

  beforeEach(() => {
    enrollmentService = new BulkEnrollmentService();
  });

  it('successfully enrolls valid candidates with accommodations and section metadata', () => {
    const validCsv = `email,firstName,lastName,studentId,examId,accommodations,section
alice@univ.edu,Alice,Smith,STU101,exam_cs101,TIME_PLUS_25;REST_BREAKS,Section-A
bob@univ.edu,Bob,Jones,STU102,exam_cs101,,Section-B
carol@univ.edu,Carol,Williams,STU103,exam_cs101,SCREEN_READER,Section-A`;

    const report = enrollmentService.processBulkEnrollmentCSV({
      tenantId: 'tenant_university_main',
      csvContent: validCsv,
      targetExamId: 'exam_cs101',
    });

    expect(report.totalRows).toBe(3);
    expect(report.validCount).toBe(3);
    expect(report.errorCount).toBe(0);
    expect(report.errors).toEqual([]);
    expect(report.enrolledCandidates.length).toBe(3);

    const alice = report.enrolledCandidates[0];
    expect(alice.email).toBe('alice@univ.edu');
    expect(alice.name).toBe('Alice Smith');
    expect(alice.accommodations).toEqual(['TIME_PLUS_25', 'REST_BREAKS']);
    expect(alice.section).toBe('Section-A');

    // Confirm stored in registry
    const registry = enrollmentService.getEnrolledCandidates('exam_cs101');
    expect(registry.length).toBe(3);
  });

  it('detects missing required CSV headers and aborts batch with explanatory error', () => {
    const invalidHeaderCsv = `user_email,given_name,family_name
test@univ.edu,Test,User`;

    const report = enrollmentService.processBulkEnrollmentCSV({
      tenantId: 'tenant_university_main',
      csvContent: invalidHeaderCsv,
    });

    expect(report.validCount).toBe(0);
    expect(report.errorCount).toBe(1);
    expect(report.errors[0].field).toBe('HEADER');
    expect(report.errors[0].error).toContain('Missing required CSV column headers');
  });

  it('identifies row-by-row errors: invalid emails, missing required fields, and duplicate emails', () => {
    const mixedCsv = `email,firstName,lastName,studentId,examId,accommodations
valid.one@univ.edu,Valid,One,STU001,exam_1,,
not-an-email,Bad,Email,STU002,exam_1,,
,Missing,Email,STU003,exam_1,,
no.firstname@univ.edu,,Smith,STU004,exam_1,,
no.lastname@univ.edu,John,,STU005,exam_1,,
no.studentid@univ.edu,No,ID,,exam_1,,
valid.one@univ.edu,Duplicate,User,STU007,exam_1,,`;

    const report = enrollmentService.processBulkEnrollmentCSV({
      tenantId: 'tenant_university_main',
      csvContent: mixedCsv,
    });

    expect(report.totalRows).toBe(7);
    expect(report.validCount).toBe(1); // Only row 2 (valid.one)
    expect(report.errorCount).toBeGreaterThanOrEqual(6);

    const badEmailErr = report.errors.find((e) => e.value === 'not-an-email');
    expect(badEmailErr).toBeDefined();
    expect(badEmailErr?.rowNumber).toBe(3);

    const dupErr = report.errors.find((e) => e.error.includes('Duplicate candidate email'));
    expect(dupErr).toBeDefined();
    expect(dupErr?.rowNumber).toBe(8);

    // Rejected CSV should be generated with ErrorReason column
    expect(report.rejectedCsvData).toBeDefined();
    expect(report.rejectedCsvData).toContain('ErrorReason');
  });

  it('validates recognized accommodation codes and flags unrecognized codes with allowed list', () => {
    const accomCsv = `email,firstName,lastName,studentId,examId,accommodations
good.accom@univ.edu,Good,Accom,STU010,exam_1,TIME_PLUS_50;HIGH_CONTRAST
bad.accom@univ.edu,Bad,Accom,STU011,exam_1,TIME_PLUS_50;UNLIMITED_INTERNET;HINTS_ALLOWED`;

    const report = enrollmentService.processBulkEnrollmentCSV({
      tenantId: 'tenant_university_main',
      csvContent: accomCsv,
    });

    expect(report.validCount).toBe(1);
    expect(report.errorCount).toBe(2);

    const hintsErr = report.errors.find((e) => e.value === 'HINTS_ALLOWED');
    expect(hintsErr).toBeDefined();
    expect(hintsErr?.error).toContain('Unrecognized accommodation code');
  });
});

describe('AssessIQ SSO Role Mapping & LTI 1.3 Integrations', () => {
  it('correctly maps institutional IdP group claims to AssessIQ system roles', () => {
    const ssoService = new SsoAndRoleMappingService();

    // Faculty mapping test
    const facultyUser = ssoService.processOidcCallback({
      tenantId: 'tenant_university_main',
      claims: {
        sub: 'idp_123',
        email: 'prof.turing@university.edu',
        name: 'Alan Turing',
        groups: ['Campus_Members', 'Faculty_Staff'],
      },
    });
    expect(facultyUser.mappedRole).toBe('FACULTY');

    // Certified Proctor mapping test
    const proctorUser = ssoService.processOidcCallback({
      tenantId: 'tenant_university_main',
      claims: {
        sub: 'idp_456',
        email: 'proctor.dijkstra@university.edu',
        name: 'Edsger Dijkstra',
        roles: ['Certified_Proctor'],
      },
    });
    expect(proctorUser.mappedRole).toBe('INVIGILATOR');

    // Default student mapping test
    const studentUser = ssoService.processOidcCallback({
      tenantId: 'tenant_university_main',
      claims: {
        sub: 'idp_789',
        email: 'student.lovelace@university.edu',
        name: 'Ada Lovelace',
        groups: ['Undergraduates_2026'],
      },
    });
    expect(studentUser.mappedRole).toBe('STUDENT');
  });

  it('processes LTI 1.3 Advantage Launch claims and formats AGS grade passback container', () => {
    const ltiService = new LtiIntegrationService();

    const launchClaims = ltiService.parseLtiLaunch({
      iss: 'https://canvas.instructure.com',
      sub: 'canvas_user_9921',
      aud: 'canvas_client_982103',
      exp: 1780000000,
      iat: 1770000000,
      nonce: 'nonce_random_12345',
      'https://purl.imsglobal.org/spec/lti/claim/resource_link': { id: 'res_assignment_42' },
      'https://purl.imsglobal.org/spec/lti/claim/context': { id: 'course_cs101', title: 'Data Structures' },
      'https://purl.imsglobal.org/spec/lti/claim/roles': ['http://purl.imsglobal.org/vocab/lis/v2/membership#Learner'],
      'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint': { lineitem: 'https://canvas.instructure.com/api/lti/courses/10/line_items/42' },
    });

    expect(launchClaims.resourceLinkId).toBe('res_assignment_42');
    expect(launchClaims.contextId).toBe('course_cs101');
    expect(launchClaims.lineItemUrl).toBe('https://canvas.instructure.com/api/lti/courses/10/line_items/42');

    // Grade passback
    const passback = ltiService.postGradePassback({
      lineItemUrl: launchClaims.lineItemUrl!,
      candidateId: launchClaims.sub,
      scoreGiven: 94.5,
      scoreMaximum: 100,
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded',
      timestamp: new Date().toISOString(),
    });

    expect(passback.success).toBe(true);
    expect(passback.passbackPayload.scoreGiven).toBe(94.5);
    expect(passback.passbackPayload.activityProgress).toBe('Completed');
    expect(passback.passbackPayload.userId).toBe('canvas_user_9921');
  });
});

describe('AssessIQ Multi-Channel Notification Template Substitution', () => {
  it('formats email, SMS, and WhatsApp notifications with dynamic variables', () => {
    const notifService = new NotificationService();

    const emailLog = notifService.dispatchNotification({
      tenantId: 'tenant_university_main',
      candidateId: 'cand_101',
      recipient: 'alice@university.edu',
      event: 'EXAM_SCHEDULED',
      channel: 'EMAIL',
      variables: {
        candidateName: 'Alice Smith',
        examTitle: 'CS 101 Final Exam',
        scheduledTime: 'Nov 15, 2026, 10:00 AM',
        duration: '90',
        link: 'https://assessiq.edu/exams/cs101',
      },
    });

    expect(emailLog.formattedSubject).toBe('Scheduled: CS 101 Final Exam Examination on AssessIQ');
    expect(emailLog.formattedBody).toContain('Dear Alice Smith');
    expect(emailLog.formattedBody).toContain('Duration: 90 mins');

    const smsLog = notifService.dispatchNotification({
      tenantId: 'tenant_university_main',
      candidateId: 'cand_101',
      recipient: '+15551234567',
      event: 'REMINDER_1H',
      channel: 'SMS',
      variables: {
        candidateName: 'Alice',
        examTitle: 'CS 101 Final Exam',
        link: 'https://assessiq.edu/run/101',
      },
    });

    expect(smsLog.formattedBody).toContain('Exam starts in 1 hour (CS 101 Final Exam)');
  });
});

