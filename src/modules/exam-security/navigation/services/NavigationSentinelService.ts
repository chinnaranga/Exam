import { NormalizedNavigationEvent, NavigationEventType } from '../types/NavigationEvent';

type NavigationEventCallback = (event: NormalizedNavigationEvent) => void;

function getTabSessionId(): string {
  if (typeof sessionStorage === 'undefined') return 'tab_single';
  let tid = sessionStorage.getItem('assessiq_tab_id');
  if (!tid) {
    tid = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    sessionStorage.setItem('assessiq_tab_id', tid);
  }
  return tid;
}

export class NavigationSentinelService {
  private isListening = false;
  private callback?: NavigationEventCallback;
  private broadcastChannel?: BroadcastChannel;
  private lastRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  private contextData?: { examId?: string; studentId?: string };

  private tabId = getTabSessionId();
  private heartbeatTimer?: any;
  private multiTabCheckTimer?: any;
  private lastMultiTabTriggerTime = 0;

  constructor(contextData?: { examId?: string; studentId?: string }) {
    this.contextData = contextData;
  }

  public setContextData(data?: { examId?: string; studentId?: string }): void {
    this.contextData = data;
  }

  public start(callback: NavigationEventCallback): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;
    this.callback = callback;

    // Refresh tabId from sessionStorage
    this.tabId = getTabSessionId();

    // 1. Prevent Browser Back Button & Lock History Navigation
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', this.handlePopState);

    // 2. Prevent Accidental Reload & Refresh
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    // 3. Tab Switch, Window Switch, Blur, Minimize
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('focus', this.handleFocus);

    // 4. Browser Resize & Zoom Detection
    window.addEventListener('resize', this.handleResize);

    // 5. Multi-Tab & Multi-Window Storage & BroadcastChannel Sentinel
    this.initMultiTabDetection();
  }

  private initMultiTabDetection(): void {
    if (typeof window === 'undefined') return;

    // Clean stale keys from localStorage
    this.cleanStaleTabKeys();

    // Register heartbeat for current tab
    const sendHeartbeat = () => {
      localStorage.setItem(`assessiq_tab_${this.tabId}`, Date.now().toString());
    };
    sendHeartbeat();
    this.heartbeatTimer = setInterval(sendHeartbeat, 1000);

    // Storage Event Listener for instant cross-tab/window detection
    window.addEventListener('storage', this.handleStorageEvent);

    // BroadcastChannel for instant cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('assessiq_global_presence');
      this.broadcastChannel.onmessage = (msg) => {
        if (msg.data?.type === 'PING_PRESENCE') {
          this.broadcastChannel?.postMessage({ type: 'PONG_PRESENCE', sender: this.tabId });
        } else if (msg.data?.type === 'PONG_PRESENCE' && msg.data?.sender !== this.tabId) {
          this.triggerMultiTabAlert('Another active browser tab or window detected.');
        }
      };
      // Ping other tabs
      this.broadcastChannel.postMessage({ type: 'PING_PRESENCE', sender: this.tabId });
    }

    // Periodic Multi-Tab Pulse Check
    this.multiTabCheckTimer = setInterval(() => {
      this.checkActiveTabsCount();
    }, 1200);
  }

  private cleanStaleTabKeys(): void {
    if (typeof localStorage === 'undefined') return;
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('assessiq_tab_')) {
        const val = parseInt(localStorage.getItem(key) || '0', 10);
        if (now - val > 3000) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }

  private checkActiveTabsCount(): void {
    if (typeof localStorage === 'undefined') return;
    const now = Date.now();
    let otherActiveTabs = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('assessiq_tab_') && key !== `assessiq_tab_${this.tabId}`) {
        const val = parseInt(localStorage.getItem(key) || '0', 10);
        if (now - val < 3000) {
          otherActiveTabs += 1;
        }
      }
    }

    if (otherActiveTabs > 0) {
      this.triggerMultiTabAlert(`Detected ${otherActiveTabs + 1} active AssessIQ browser tabs/windows.`);
    }
  }

  private handleStorageEvent = (e: StorageEvent) => {
    if (e.key && e.key.startsWith('assessiq_tab_') && e.key !== `assessiq_tab_${this.tabId}`) {
      const val = parseInt(e.newValue || '0', 10);
      if (Date.now() - val < 3000) {
        this.triggerMultiTabAlert('New browser tab or window opened.');
      }
    }
  };

  private triggerMultiTabAlert(reason: string): void {
    const now = Date.now();
    // Throttle multi-tab alert to at most once every 4 seconds to avoid event flooding
    if (now - this.lastMultiTabTriggerTime > 4000) {
      this.lastMultiTabTriggerTime = now;
      this.emit('MULTIPLE_TABS_DETECTED', reason);
    }
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    this.callback = undefined;

    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('storage', this.handleStorageEvent);

    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.multiTabCheckTimer) clearInterval(this.multiTabCheckTimer);

    localStorage.removeItem(`assessiq_tab_${this.tabId}`);

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = undefined;
    }
  }

  private handlePopState = (e: PopStateEvent) => {
    window.history.pushState(null, '', window.location.href);
    this.emit('BACK_BUTTON_ATTEMPT', 'Browser back button click intercepted and disabled.');
  };

  private handleBeforeUnload = (e: BeforeUnloadEvent) => {
    localStorage.removeItem(`assessiq_tab_${this.tabId}`);
    this.emit('BROWSER_REFRESH_ATTEMPT', 'Accidental page reload / refresh attempted.');
    e.preventDefault();
    e.returnValue = 'Warning: Leaving or refreshing will pause your examination session.';
    return e.returnValue;
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.emit('TAB_SWITCH', 'Student switched tab or minimized window.');
      this.emit('WINDOW_MINIMIZED', 'Document hidden / window minimized.');
    }
  };

  private handleBlur = () => {
    this.emit('WINDOW_BLURRED', 'Window focus lost / window switched.');
    this.emit('WINDOW_SWITCH', 'Student switched focus to another desktop application window.');
  };

  private handleFocus = () => {
    // Window focus restored
  };

  private handleResize = () => {
    const currentRatio = window.devicePixelRatio;
    if (Math.abs(currentRatio - this.lastRatio) > 0.05) {
      this.emit('BROWSER_ZOOMED', `Browser zoom scale changed: ${(currentRatio * 100).toFixed(0)}%`);
      this.lastRatio = currentRatio;
    }

    this.emit('BROWSER_RESIZED', `Browser dimension resized: ${window.innerWidth}x${window.innerHeight}`);
  };

  private emit(type: NavigationEventType, details: string): void {
    if (!this.callback) return;
    const evt: NormalizedNavigationEvent = {
      id: `nav_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      type,
      timestamp: new Date().toISOString(),
      studentId: this.contextData?.studentId,
      examId: this.contextData?.examId,
      details,
      devicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      innerWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
      innerHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
    };
    this.callback(evt);
  }
}
