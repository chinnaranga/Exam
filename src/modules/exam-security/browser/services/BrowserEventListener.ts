import { NormalizedBrowserEvent } from '../types/BrowserEvent';
import { EventNormalizer } from '../utils/EventNormalizer';

type EventCallback = (event: NormalizedBrowserEvent) => void;

export class BrowserEventListener {
  private isListening = false;
  private callback?: EventCallback;
  private contextData?: { examId?: string; studentId?: string; sessionId?: string };

  private lastScrollTime = 0;
  private lastResizeTime = 0;
  private throttleIntervalMs = 200;

  constructor(contextData?: { examId?: string; studentId?: string; sessionId?: string }) {
    this.contextData = contextData;
  }

  public setContextData(data?: { examId?: string; studentId?: string; sessionId?: string }): void {
    this.contextData = data;
  }

  public start(callback: EventCallback): void {
    if (this.isListening) return;
    this.isListening = true;
    this.callback = callback;

    if (typeof window === 'undefined') return;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('popstate', this.handlePopState);
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('copy', this.handleClipboard);
    document.addEventListener('paste', this.handleClipboard);
  }

  public stop(): void {
    if (!this.isListening) return;
    this.isListening = false;
    this.callback = undefined;

    if (typeof window === 'undefined') return;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('popstate', this.handlePopState);
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('copy', this.handleClipboard);
    document.removeEventListener('paste', this.handleClipboard);
  }

  private emit(eventType: any, metadata?: Record<string, any>): void {
    if (!this.callback) return;
    const normalized = EventNormalizer.normalize(eventType, metadata, this.contextData);
    this.callback(normalized);
  }

  private handleVisibilityChange = () => {
    const isHidden = document.hidden;
    this.emit(isHidden ? 'PAGE_HIDDEN' : 'PAGE_VISIBLE', { hidden: isHidden });
  };

  private handleFocus = () => {
    this.emit('WINDOW_FOCUS');
  };

  private handleBlur = () => {
    this.emit('WINDOW_BLUR');
  };

  private handleResize = () => {
    const now = Date.now();
    if (now - this.lastResizeTime >= this.throttleIntervalMs) {
      this.lastResizeTime = now;
      this.emit('WINDOW_RESIZE', { innerWidth: window.innerWidth, innerHeight: window.innerHeight });
    }
  };

  private handleScroll = () => {
    const now = Date.now();
    if (now - this.lastScrollTime >= this.throttleIntervalMs) {
      this.lastScrollTime = now;
      this.emit('WINDOW_SCROLL', { scrollX: window.scrollX, scrollY: window.scrollY });
    }
  };

  private handleOnline = () => {
    this.emit('WINDOW_ONLINE');
  };

  private handleOffline = () => {
    this.emit('WINDOW_OFFLINE');
  };

  private handleFullscreenChange = () => {
    const isFullscreen = !!document.fullscreenElement;
    this.emit('FULLSCREEN_CHANGE', { isFullscreen });
  };

  private handleBeforeUnload = (e: BeforeUnloadEvent) => {
    this.emit('BEFORE_UNLOAD');
  };

  private handleHashChange = () => {
    this.emit('HASH_CHANGE', { newUrl: window.location.href });
  };

  private handlePopState = () => {
    this.emit('POP_STATE', { newUrl: window.location.href });
  };

  private handleKeydown = (e: KeyboardEvent) => {
    this.emit('KEYBOARD_EVENT', { key: e.key, code: e.code, altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey });
  };

  private handleContextMenu = (e: MouseEvent) => {
    this.emit('CONTEXT_MENU', { x: e.clientX, y: e.clientY });
  };

  private handleClipboard = (e: ClipboardEvent) => {
    this.emit('CLIPBOARD_EVENT', { type: e.type });
  };
}
