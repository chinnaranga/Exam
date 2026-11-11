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
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Accessibility Check: Allow Typing & Tab Navigation inside input/textarea fields
    const target = e.target as HTMLElement | null;
    const tagName = target?.tagName || '';
    const isEditable = EDITABLE_TAG_NAMES.includes(tagName) || !!target?.isContentEditable;

    if (isEditable && SAFE_NAVIGATION_KEYS.includes(e.key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
      return;
    }

    const rules = this.policyService.getRules();
    const matchedRule = ShortcutMatcher.findMatchingRule(e, rules);

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
