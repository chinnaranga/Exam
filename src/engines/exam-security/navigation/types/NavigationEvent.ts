export type NavigationEventType =
  | 'TAB_SWITCH'
  | 'WINDOW_SWITCH'
  | 'WINDOW_MINIMIZED'
  | 'WINDOW_BLURRED'
  | 'BROWSER_RESIZED'
  | 'BROWSER_ZOOMED'
  | 'BROWSER_REFRESH_ATTEMPT'
  | 'BACK_BUTTON_ATTEMPT'
  | 'MULTIPLE_TABS_DETECTED';

export interface NormalizedNavigationEvent {
  id: string;
  type: NavigationEventType;
  timestamp: string;
  studentId?: string;
  examId?: string;
  details: string;
  devicePixelRatio?: number;
  innerWidth?: number;
  innerHeight?: number;
}
