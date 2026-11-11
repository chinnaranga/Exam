import { MouseInteractionType } from '../types/MouseAction';

export class MouseActionParser {
  public static mapEventTypeToInteraction(type: string, button: number): MouseInteractionType {
    if (type === 'contextmenu') return 'CONTEXT_MENU';
    if (type === 'selectstart' || type === 'selectionchange') return 'TEXT_SELECTION';
    if (type === 'dragstart') return 'DRAG_START';
    if (type === 'dragover' || type === 'dragenter') return 'DRAG_OVER';
    if (type === 'drop') return 'DROP';
    if (type === 'wheel') return 'WHEEL';
    if (type === 'dblclick') return 'DOUBLE_CLICK';
    if (type === 'auxclick' || button === 1) return 'AUX_CLICK';
    if (type === 'click' && button === 2) return 'RIGHT_CLICK';
    if (type === 'pointerdown' || type === 'mousedown') return 'POINTER_DOWN';
    if (type === 'pointerup' || type === 'mouseup') return 'POINTER_UP';
    return 'CLICK';
  }
}
