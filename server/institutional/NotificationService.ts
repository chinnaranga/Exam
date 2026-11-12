import {
  NotificationChannel,
  NotificationEvent,
  NotificationTemplate,
  NotificationDispatchLog,
} from './institutionalTypes';

export class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map(); // key = tenantId::event::channel
  private dispatchLogs: NotificationDispatchLog[] = [];

  constructor() {
    this.seedDefaultTemplates('tenant_university_main');
  }

  public registerTemplate(template: NotificationTemplate): void {
    const key = `${template.tenantId}::${template.event}::${template.channel}`;
    this.templates.set(key, template);
  }

  public getTemplate(
    tenantId: string,
    event: NotificationEvent,
    channel: NotificationChannel
  ): NotificationTemplate | undefined {
    return this.templates.get(`${tenantId}::${event}::${channel}`);
  }

  public getAllTemplates(tenantId?: string): NotificationTemplate[] {
    const list = Array.from(this.templates.values());
    if (tenantId) return list.filter((t) => t.tenantId === tenantId);
    return list;
  }

  /**
   * Dispatches a notification using tenant's configured template and variable substitution.
   */
  public dispatchNotification(params: {
    tenantId: string;
    candidateId: string;
    recipient: string; // email address or E.164 phone number
    event: NotificationEvent;
    channel: NotificationChannel;
    variables: Record<string, string>;
  }): NotificationDispatchLog {
    const { tenantId, candidateId, recipient, event, channel, variables } = params;

    let template = this.getTemplate(tenantId, event, channel);
    if (!template) {
      // Fallback to default template if custom not set
      template = this.getDefaultTemplate(event, channel);
    }

    const formattedSubject = template.subject
      ? this.replaceVariables(template.subject, variables)
      : undefined;
    const formattedBody = this.replaceVariables(template.body, variables);

    const log: NotificationDispatchLog = {
      dispatchId: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      tenantId,
      candidateId,
      recipient,
      event,
      channel,
      formattedSubject,
      formattedBody,
      dispatchedAt: Date.now(),
      status: 'DELIVERED',
    };

    this.dispatchLogs.push(log);
    return log;
  }

  public getDispatchLogs(tenantId?: string): NotificationDispatchLog[] {
    if (tenantId) return this.dispatchLogs.filter((l) => l.tenantId === tenantId);
    return [...this.dispatchLogs];
  }

  private replaceVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
    });
  }

  private seedDefaultTemplates(tenantId: string): void {
    // 1. Exam Schedule (Email)
    this.registerTemplate({
      id: `tmpl_${tenantId}_sched_email`,
      tenantId,
      event: 'EXAM_SCHEDULED',
      channel: 'EMAIL',
      subject: 'Scheduled: {{examTitle}} Examination on AssessIQ',
      body: 'Dear {{candidateName}},\n\nYou are scheduled to sit for {{examTitle}} on {{scheduledTime}} (Duration: {{duration}} mins).\n\nPlease complete your System Check in advance: {{link}}\n\nRegards,\nAssessIQ Examination Services',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'scheduledTime', 'duration', 'link'],
    });

    // 2. 24-Hour Reminder (Email & WhatsApp)
    this.registerTemplate({
      id: `tmpl_${tenantId}_rem24_email`,
      tenantId,
      event: 'REMINDER_24H',
      channel: 'EMAIL',
      subject: 'Reminder: 24 Hours Until {{examTitle}}',
      body: 'Hello {{candidateName}},\n\nYour exam {{examTitle}} begins tomorrow at {{scheduledTime}}. Ensure your camera, microphone, and quiet room are ready: {{link}}',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'scheduledTime', 'link'],
    });

    this.registerTemplate({
      id: `tmpl_${tenantId}_rem24_wa`,
      tenantId,
      event: 'REMINDER_24H',
      channel: 'WHATSAPP',
      body: 'AssessIQ Alert: Hi {{candidateName}}, your {{examTitle}} exam is in 24 hours at {{scheduledTime}}. Check setup: {{link}}',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'scheduledTime', 'link'],
    });

    // 3. 1-Hour Reminder (SMS)
    this.registerTemplate({
      id: `tmpl_${tenantId}_rem1_sms`,
      tenantId,
      event: 'REMINDER_1H',
      channel: 'SMS',
      body: 'AssessIQ: Exam starts in 1 hour ({{examTitle}}). Please log in now: {{link}}',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'link'],
    });

    // 4. Submission Receipt (Email)
    this.registerTemplate({
      id: `tmpl_${tenantId}_receipt_email`,
      tenantId,
      event: 'SUBMISSION_RECEIPT',
      channel: 'EMAIL',
      subject: 'Receipt: Submission Confirmed for {{examTitle}}',
      body: 'Dear {{candidateName}},\n\nYour exam submission for {{examTitle}} has been received and anchored on our cryptographic audit ledger at {{submittedAt}}.\n\nConfirmation Code: {{ledgerHash}}\nView status: {{link}}',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'submittedAt', 'ledgerHash', 'link'],
    });

    // 5. Flag Decision Notice (Email)
    this.registerTemplate({
      id: `tmpl_${tenantId}_decision_email`,
      tenantId,
      event: 'FLAG_DECISION',
      channel: 'EMAIL',
      subject: 'Review Update: Quality & Integrity Decision for {{examTitle}}',
      body: 'Dear {{candidateName}},\n\nThe academic review committee has completed verification for your session in {{examTitle}}.\n\nDecision: {{decision}}\nReview Notes: {{notes}}\n\nIf you wish to request a formal appeal, you have until {{appealDeadline}}.',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'decision', 'notes', 'appealDeadline'],
    });

    // 6. Appeal Update Notice (Email)
    this.registerTemplate({
      id: `tmpl_${tenantId}_appeal_email`,
      tenantId,
      event: 'APPEAL_UPDATE',
      channel: 'EMAIL',
      subject: 'Appeal Status Update: {{examTitle}}',
      body: 'Dear {{candidateName}},\n\nYour appeal regarding {{examTitle}} has been updated.\n\nStatus: {{appealStatus}}\nFindings: {{findings}}',
      isActive: true,
      variables: ['candidateName', 'examTitle', 'appealStatus', 'findings'],
    });
  }

  private getDefaultTemplate(event: NotificationEvent, channel: NotificationChannel): NotificationTemplate {
    return {
      id: 'default_fallback',
      tenantId: 'default',
      event,
      channel,
      subject: 'AssessIQ Notification: {{examTitle}}',
      body: 'Hello {{candidateName}}, update for {{examTitle}}.',
      isActive: true,
      variables: ['candidateName', 'examTitle'],
    };
  }
}

export const notificationService = new NotificationService();

