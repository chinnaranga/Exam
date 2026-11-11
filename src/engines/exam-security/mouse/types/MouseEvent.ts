import { MouseInteractionType, MousePolicyAction } from './MouseAction';

export interface NormalizedMouseEvent {
  id: string;
  timestamp: string;
  studentId?: string;
  examId?: string;
  sessionId?: string;
  browser: string;
  operatingSystem: string;
  interactionType: MouseInteractionType;
  coordinates: {
    clientX: number;
    clientY: number;
    pageX: number;
    pageY: number;
  };
  button: number; // 0: Left, 1: Middle, 2: Right
  targetElement: {
    tagName: string;
    id?: string;
    className?: string;
    isEditable: boolean;
  };
  actionTaken: MousePolicyAction;
  policyResult: string;
}
