import { NormalizedMouseEvent } from '../types/MouseEvent';
import { MouseInteractionType, MousePolicyAction } from '../types/MouseAction';
import { ALLOWED_EDITABLE_TAGS, ALLOWED_EDITOR_CLASSES } from '../constants/AllowedMouseActions';

export class MouseEventNormalizer {
  public static isTargetEditable(element: HTMLElement | null): boolean {
    if (!element) return false;
    const tagName = element.tagName.toUpperCase();
    if (ALLOWED_EDITABLE_TAGS.includes(tagName)) return true;
    if (element.isContentEditable) return true;

    const className = element.className || '';
    if (typeof className === 'string') {
      return ALLOWED_EDITOR_CLASSES.some((cls) => className.includes(cls));
    }
    return false;
  }

  public static normalize(
    e: Event,
    interactionType: MouseInteractionType,
    actionTaken: MousePolicyAction,
    policyResult: string,
    contextData?: { studentId?: string; examId?: string; sessionId?: string }
  ): NormalizedMouseEvent {
    const mouseEvt = e as MouseEvent;
    const target = e.target as HTMLElement | null;

    return {
      id: `mouse_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: contextData?.studentId,
      examId: contextData?.examId,
      sessionId: contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      interactionType,
      coordinates: {
        clientX: mouseEvt.clientX || 0,
        clientY: mouseEvt.clientY || 0,
        pageX: mouseEvt.pageX || 0,
        pageY: mouseEvt.pageY || 0,
      },
      button: mouseEvt.button !== undefined ? mouseEvt.button : 0,
      targetElement: {
        tagName: target?.tagName || 'UNKNOWN',
        id: target?.id || undefined,
        className: typeof target?.className === 'string' ? target.className : undefined,
        isEditable: this.isTargetEditable(target),
      },
      actionTaken,
      policyResult,
    };
  }
}
