import { BrowserEventType } from './BrowserEventType';

export interface NormalizedBrowserEvent {
  id: string;
  timestamp: string;
  eventType: BrowserEventType;
  pageUrl: string;
  examId?: string;
  studentId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}
