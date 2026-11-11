// Mouse Policy & Action Definitions

export type MousePolicyAction = 'ALLOW' | 'WARN' | 'BLOCK' | 'IGNORE';

export type MouseInteractionType =
  | 'CLICK'
  | 'DOUBLE_CLICK'
  | 'RIGHT_CLICK'
  | 'AUX_CLICK'
  | 'CONTEXT_MENU'
  | 'TEXT_SELECTION'
  | 'DRAG_START'
  | 'DRAG_OVER'
  | 'DROP'
  | 'WHEEL'
  | 'POINTER_DOWN'
  | 'POINTER_UP';

export interface MouseActionRule {
  id: string;
  name: string;
  interactionType: MouseInteractionType;
  action: MousePolicyAction;
  preventDefault: boolean;
  stopPropagation: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
}
