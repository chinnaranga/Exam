import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';
import { FocusMonitor } from '../monitors/FocusMonitor';
import { MouseAnalyzer } from '../monitors/MouseAnalyzer';
import { KeyboardAnalyzer } from '../monitors/KeyboardAnalyzer';
import { ClipboardMonitor } from '../monitors/ClipboardMonitor';
import { AnswerBehaviorMonitor } from '../monitors/AnswerBehaviorMonitor';
import { IntegrityEvent } from '../types/IntegrityEvent';

describe('Phase 2 Behavioral Telemetry Modules Unit Tests', () => {
  let eventBus: EventBus;
  let sessionManager: SessionManager;
  let emittedEvents: IntegrityEvent[];

  beforeEach(() => {
    eventBus = new EventBus();
    sessionManager = new SessionManager({ candidateId: 'test_cand_01', examId: 'test_exam_402' });
    emittedEvents = [];

    eventBus.subscribe('*', (evt) => {
      emittedEvents.push(evt);
    });
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('FocusMonitor', () => {
    it('should initialize, emit FocusLost on blur, and clean up on destroy', () => {
      const monitor = new FocusMonitor(eventBus, sessionManager);
      monitor.start();

      // Trigger blur event
      window.dispatchEvent(new Event('blur'));

      expect(emittedEvents.length).toBeGreaterThan(0);
      const blurEvt = emittedEvents.find((e) => e.type === 'FocusLost');
      expect(blurEvt).toBeDefined();
      expect(blurEvt?.module).toBe('FocusMonitor');
      expect(blurEvt?.severity).toBe('MEDIUM');
      expect(blurEvt?.confidence).toBe('HIGH');

      // Cleanup
      monitor.destroy();
      emittedEvents = [];
      window.dispatchEvent(new Event('blur'));
      expect(emittedEvents.length).toBe(0); // Proves no listener memory leak
    });
  });

  describe('MouseAnalyzer', () => {
    it('should track context menu and click events without throwing', () => {
      const analyzer = new MouseAnalyzer(eventBus, sessionManager);
      analyzer.start();

      window.dispatchEvent(new MouseEvent('contextmenu', { clientX: 100, clientY: 200 }));

      const ctxEvt = emittedEvents.find((e) => e.type === 'ContextMenuAttempted');
      expect(ctxEvt).toBeDefined();
      expect(ctxEvt?.details.metadata?.x).toBe(100);

      analyzer.destroy();
    });
  });

  describe('KeyboardAnalyzer', () => {
    it('should detect paste shortcut (Ctrl+V) and emit RapidPasteShortcut event without storing text', () => {
      const analyzer = new KeyboardAnalyzer(eventBus, sessionManager);
      analyzer.start();

      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', code: 'KeyV', ctrlKey: true }));

      const pasteEvt = emittedEvents.find((e) => e.type === 'RapidPasteShortcut');
      expect(pasteEvt).toBeDefined();
      expect(pasteEvt?.module).toBe('KeyboardAnalyzer');
      expect(pasteEvt?.details.metadata?.pasteShortcutCount).toBe(1);

      analyzer.destroy();
    });
  });

  describe('ClipboardMonitor', () => {
    it('should track copy and paste events metadata without text content', () => {
      const monitor = new ClipboardMonitor(eventBus, sessionManager);
      monitor.start();

      document.dispatchEvent(new Event('copy'));

      const copyEvt = emittedEvents.find((e) => e.type === 'CopyDetected');
      expect(copyEvt).toBeDefined();
      expect(copyEvt?.details.metadata?.sourceElementType).toBeDefined();

      monitor.destroy();
    });
  });

  describe('AnswerBehaviorMonitor', () => {
    it('should detect large instant insertions on textarea input', () => {
      const monitor = new AnswerBehaviorMonitor(eventBus, sessionManager);
      monitor.start();

      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      // 1. Initial short input
      textarea.value = 'a';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      // 2. Sudden large paste insertion
      textarea.value = 'a'.repeat(300);
      textarea.dispatchEvent(new Event('input', { bubbles: true }));

      const largeEvt = emittedEvents.find((e) => e.type === 'LargeInsertion');
      expect(largeEvt).toBeDefined();
      expect(largeEvt?.severity).toBe('HIGH');
      expect(largeEvt?.details.metadata?.charDelta).toBe(299);

      document.body.removeChild(textarea);
      monitor.destroy();
    });
  });
});
