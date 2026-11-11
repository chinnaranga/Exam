import { MouseActionRule } from '../types/MouseAction';

export const DEFAULT_RESTRICTED_MOUSE_RULES: MouseActionRule[] = [
  { id: 'context_menu', name: 'Browser Context Menu (Right Click)', interactionType: 'CONTEXT_MENU', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent opening browser context menu.' },
  { id: 'text_selection', name: 'Text Selection Engine', interactionType: 'TEXT_SELECTION', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'MEDIUM', description: 'Prevent selecting exam content outside editable editors.' },
  { id: 'drag_start', name: 'Drag Content Start', interactionType: 'DRAG_START', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent dragging content.' },
  { id: 'drop_external', name: 'Drop External Content', interactionType: 'DROP', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'CRITICAL', description: 'Prevent dropping external files/text into exam.' },
];
