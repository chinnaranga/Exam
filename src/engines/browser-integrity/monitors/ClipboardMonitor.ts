import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

/**
 * @class ClipboardMonitor
 * @extends BaseModule
 * @description Monitors client clipboard operations (copy, cut, paste).
 * STRICT PRIVACY GUARANTEE: NEVER inspects or stores clipboard text content. Only metadata (character count, element tag) is recorded.
 * 
 * HEURISTICS & LIMITATIONS:
 * • Character count is estimated from selection length or clipboard payload length metadata.
 * • Pasting text inside code editors or essay questions is often legitimate.
 */
export class ClipboardMonitor extends BaseModule {
  public copyCount: number = 0;
  public cutCount: number = 0;
  public pasteCount: number = 0;

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('ClipboardMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.addDOMListener(document, 'copy', this.handleCopy, { passive: true });
    this.addDOMListener(document, 'cut', this.handleCut, { passive: true });
    this.addDOMListener(document, 'paste', this.handlePaste, { passive: true });
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.removeAllDOMListeners();
  }

  private handleCopy = (e: Event) => {
    this.copyCount += 1;
    const target = e.target as HTMLElement;
    const selection = typeof window !== 'undefined' ? window.getSelection()?.toString() : '';
    const charCount = selection ? selection.length : 0;

    this.emitEvent({
      type: 'CopyDetected',
      severity: 'LOW',
      confidence: 'HIGH',
      details: {
        message: `Copy operation detected (~${charCount} chars).`,
        rawEventType: 'copy',
        explanation: 'Candidate copied content from the examination page.',
        metadata: {
          copyCount: this.copyCount,
          estimatedCharCount: charCount,
          sourceElementType: target ? target.tagName : 'UNKNOWN',
        },
      },
    });
  };

  private handleCut = (e: Event) => {
    this.cutCount += 1;
    const target = e.target as HTMLElement;

    this.emitEvent({
      type: 'CutDetected',
      severity: 'LOW',
      confidence: 'HIGH',
      details: {
        message: 'Cut operation detected.',
        rawEventType: 'cut',
        explanation: 'Candidate cut content from an editable input field.',
        metadata: {
          cutCount: this.cutCount,
          sourceElementType: target ? target.tagName : 'UNKNOWN',
        },
      },
    });
  };

  private handlePaste = (e: Event) => {
    this.pasteCount += 1;
    const clipEvt = e as ClipboardEvent;
    const target = clipEvt.target as HTMLElement;
    const pastedText = clipEvt.clipboardData?.getData('text/plain') || '';
    const charCount = pastedText.length;

    const severity = charCount > 300 ? 'HIGH' : charCount > 50 ? 'MEDIUM' : 'LOW';

    this.emitEvent({
      type: 'PasteDetected',
      severity,
      confidence: 'HIGH',
      details: {
        message: `Paste operation detected (~${charCount} characters inserted).`,
        signalStrength: Math.min(1.0, charCount / 500),
        rawEventType: 'paste',
        explanation: `Candidate pasted text payload into ${target ? target.tagName : 'input'}.`,
        limitationNote: 'Candidate may be pasting permitted code blocks or draft text prepared in scratchpad.',
        possibleFalsePositives: ['Pasting permitted reference code', 'Pasting scratchpad draft'],
        metadata: {
          pasteCount: this.pasteCount,
          estimatedCharCount: charCount,
          targetElementType: target ? target.tagName : 'UNKNOWN',
        },
      },
    });
  };
}
