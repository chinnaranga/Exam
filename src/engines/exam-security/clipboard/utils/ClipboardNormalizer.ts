import { NormalizedClipboardEvent } from '../types/ClipboardEvent';
import { ClipboardOperationType, ClipboardPolicyAction } from '../types/ClipboardAction';

export class ClipboardNormalizer {
  public static normalize(
    e: Event,
    operationType: ClipboardOperationType,
    actionTaken: ClipboardPolicyAction,
    policyResult: string,
    contextData?: { studentId?: string; examId?: string; sessionId?: string }
  ): NormalizedClipboardEvent {
    const target = e.target as HTMLElement | null;
    const tagName = target?.tagName || 'UNKNOWN';
    const isEditable = tagName === 'INPUT' || tagName === 'TEXTAREA' || !!target?.isContentEditable;

    // Get selection length safely WITHOUT reading sensitive text contents
    let selectionLength = 0;
    if (typeof window !== 'undefined' && window.getSelection) {
      const sel = window.getSelection();
      if (sel) {
        selectionLength = sel.toString().length;
      }
    }

    let dataType = 'text/plain';
    const clipEvt = e as ClipboardEvent;
    if (clipEvt.clipboardData && clipEvt.clipboardData.types) {
      dataType = Array.from(clipEvt.clipboardData.types).join(', ') || 'text/plain';
    }

    return {
      id: `clip_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: contextData?.studentId,
      examId: contextData?.examId,
      sessionId: contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      clipboardAction: operationType,
      rawEventType: e.type,
      targetElement: {
        tagName,
        id: target?.id || undefined,
        className: typeof target?.className === 'string' ? target.className : undefined,
        isEditable,
      },
      selectionLength,
      dataType,
      actionTaken,
      policyResult,
    };
  }
}
