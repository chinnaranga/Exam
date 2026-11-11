import { ClipboardActionRule } from '../types/ClipboardAction';

export const DEFAULT_RESTRICTED_CLIPBOARD_RULES: ClipboardActionRule[] = [
  { id: 'clip_copy', name: 'Clipboard Copy Operation', operationType: 'COPY', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent copying exam content to external system buffer.' },
  { id: 'clip_cut', name: 'Clipboard Cut Operation', operationType: 'CUT', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent cutting exam content.' },
  { id: 'clip_paste', name: 'Clipboard Paste Operation', operationType: 'PASTE', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent pasting external text into exam inputs.' },
  { id: 'clip_drag', name: 'Drag Clipboard Operation', operationType: 'DRAG_CLIPBOARD', action: 'BLOCK', preventDefault: true, stopPropagation: true, severity: 'HIGH', description: 'Prevent dragging content across window boundaries.' },
];
