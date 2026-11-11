import { KeyboardPolicyService } from './KeyboardPolicyService';
import { KeyboardDispatcher } from './KeyboardDispatcher';
import { ShortcutMatcher } from '../utils/ShortcutMatcher';
import { KeyCombinationParser } from '../utils/KeyCombinationParser';
import { EDITABLE_TAG_NAMES, SAFE_NAVIGATION_KEYS } from '../constants/AllowedKeys';
import { NormalizedKeyboardEvent } from '../types/KeyboardEvent';

export class KeyboardListener {
  private isListening = false;
  private policyService: KeyboardPolicyService;
  private dispatcher: KeyboardDispatcher;
  private contextData?: { studentId?: string; examId?: string; sessionId?: string };

  constructor(policyService: KeyboardPolicyService, dispatcher: KeyboardDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.contextData = data;
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('keyup', this.handleKeyUp, true);
    window.addEventListener('beforeprint', this.handleBeforePrint, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('keyup', this.handleKeyUp, true);
    window.removeEventListener('beforeprint', this.handleBeforePrint, true);
  }

  private handleBeforePrint = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const normalized: NormalizedKeyboardEvent = {
      id: `print_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: this.contextData?.studentId,
      examId: this.contextData?.examId,
      sessionId: this.contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      shortcutPressed: 'Ctrl/Cmd+P or Print',
      rawKey: 'Print',
      rawCode: 'Print',
      modifiers: { ctrl: true, shift: false, alt: false, meta: true },
      actionTaken: 'BLOCK',
      policyResult: 'Prevent printing examination question sheets.',
      isRepeat: false,
      targetTagName: 'window',
      isEditableTarget: false,
    };
    this.dispatcher.dispatch(normalized, {
      id: 'print_attempt',
      name: 'Print Page Intercepted',
      keyCombination: 'Ctrl+P',
      action: 'BLOCK',
      preventDefault: true,
      stopPropagation: true,
      severity: 'HIGH',
      description: 'Prevent printing examination question sheets.',
    });
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
      e.preventDefault();
      e.stopPropagation();
      this.clearClipboardBuffer();
    }
  };

  private clearClipboardBuffer(): void {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('');
      }
    } catch {
      // Ignore clipboard permission constraints
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Check for PrintScreen immediately
    if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
      e.preventDefault();
      e.stopPropagation();
      this.clearClipboardBuffer();

      const normalized: NormalizedKeyboardEvent = {
        id: `prtscn_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date().toISOString(),
        studentId: this.contextData?.studentId,
        examId: this.contextData?.examId,
        sessionId: this.contextData?.sessionId,
        browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
        operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
        shortcutPressed: 'PrintScreen',
        rawKey: e.key,
        rawCode: e.code,
        modifiers: { ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey },
        actionTaken: 'BLOCK',
        policyResult: 'PrintScreen screen capture blocked.',
        isRepeat: e.repeat,
        targetTagName: (e.target as HTMLElement)?.tagName || '',
        isEditableTarget: false,
      };

      this.dispatcher.dispatch(normalized, {
        id: 'printscreen_attempt',
        name: 'PrintScreen Capture',
        keyCombination: 'PrintScreen',
        action: 'BLOCK',
        preventDefault: true,
        stopPropagation: true,
        severity: 'HIGH',
        description: 'Prevent full screen capture attempt.',
      });
      return;
    }

    // Accessibility Check: Allow Typing & Tab Navigation inside input/textarea fields
    const target = e.target as HTMLElement | null;
    const tagName = target?.tagName || '';
    const isEditable = EDITABLE_TAG_NAMES.includes(tagName) || !!target?.isContentEditable;

    if (isEditable && SAFE_NAVIGATION_KEYS.includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      return;
    }

    const rules = this.policyService.getRules();
    let matchedRule = ShortcutMatcher.findMatchingRule(e, rules);

    // Fallback: If user presses any Win/Cmd key combo outside editable fields, intercept it
    if (!matchedRule && (e.metaKey || e.key === 'Meta') && !isEditable) {
      matchedRule = {
        id: 'win_cmd_combo',
        name: `Win/Cmd Shortcut (${e.key})`,
        keyCombination: `Meta+${e.key.toUpperCase()}`,
        action: 'BLOCK',
        preventDefault: true,
        stopPropagation: true,
        severity: 'HIGH',
        description: 'Operating system Meta/Windows/Cmd shortcut blocked.',
      };
    }

    if (!matchedRule || matchedRule.action === 'DISABLED' || matchedRule.action === 'IGNORE') {
      return;
    }

    // Intercept & Prevent Default
    if (matchedRule.preventDefault) {
      e.preventDefault();
    }
    if (matchedRule.stopPropagation) {
      e.stopPropagation();
    }

    // Prevent duplicate flooding on holding key down
    if (e.repeat && matchedRule.action !== 'BLOCK') {
      return;
    }

    const parsed = KeyCombinationParser.parseEvent(e);
    const normalized: NormalizedKeyboardEvent = {
      id: `kbd_evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      studentId: this.contextData?.studentId,
      examId: this.contextData?.examId,
      sessionId: this.contextData?.sessionId,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      operatingSystem: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
      shortcutPressed: KeyCombinationParser.formatToString(parsed),
      rawKey: e.key,
      rawCode: e.code,
      modifiers: {
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
      },
      actionTaken: matchedRule.action,
      policyResult: matchedRule.description,
      isRepeat: e.repeat,
      targetTagName: tagName,
      isEditableTarget: isEditable,
    };

    this.dispatcher.dispatch(normalized, matchedRule);
  };
}
