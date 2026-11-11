import { ClipboardOperationType } from '../types/ClipboardAction';

export class ClipboardActionParser {
  public static mapEventTypeToOperation(eventType: string): ClipboardOperationType {
    const lower = eventType.toLowerCase();
    if (lower.includes('copy')) return 'COPY';
    if (lower.includes('cut')) return 'CUT';
    if (lower.includes('paste')) return 'PASTE';
    if (lower.includes('drag') || lower.includes('drop')) return 'DRAG_CLIPBOARD';
    return 'COPY';
  }
}
