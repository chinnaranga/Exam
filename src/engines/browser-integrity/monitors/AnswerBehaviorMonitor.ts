import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

interface InputTrackState {
  lastValue: string;
  lastTime: number;
  editCount: number;
  replacementCount: number;
}

/**
 * @class AnswerBehaviorMonitor
 * @extends BaseModule
 * @description Monitors candidate input behavior inside textareas, input fields, and contenteditable elements.
 * Tracks insertion speed, massive text replacement, and editing rate.
 * 
 * HEURISTICS & LIMITATIONS:
 * • Large insertions can occur legitimately via browser autocomplete, spellcheck autocorrect, or IME input methods.
 * • Continuous replacement occurs during heavy drafting or code refactoring.
 */
export class AnswerBehaviorMonitor extends BaseModule {
  private elementStates: WeakMap<Element, InputTrackState> = new WeakMap();

  constructor(eventBus: EventBus, sessionManager: SessionManager) {
    super('AnswerBehaviorMonitor', eventBus, sessionManager);
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    this.addDOMListener(document, 'input', this.handleInput, { passive: true });
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.removeAllDOMListeners();
  }

  private handleInput = (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const isTextarea = target.tagName === 'TEXTAREA';
    const isInput = target.tagName === 'INPUT';
    const isContentEditable = target.isContentEditable;

    if (!isTextarea && !isInput && !isContentEditable) return;

    const currentValue = isContentEditable ? target.innerText || '' : (target as HTMLInputElement).value || '';
    const now = Date.now();

    let state = this.elementStates.get(target);
    if (!state) {
      state = {
        lastValue: '',
        lastTime: now,
        editCount: 0,
        replacementCount: 0,
      };
      this.elementStates.set(target, state);
    }

    const prevValue = state.lastValue;
    const prevTime = state.lastTime;
    const charDelta = currentValue.length - prevValue.length;
    const timeDeltaMs = Math.max(1, now - prevTime);

    state.lastValue = currentValue;
    state.lastTime = now;
    state.editCount += 1;

    // 1. Detect Large Instant Insertion (> 180 chars in < 50ms)
    if (charDelta > 180 && timeDeltaMs < 60) {
      this.emitEvent({
        type: 'LargeInsertion',
        severity: 'HIGH',
        confidence: 'HIGH',
        details: {
          message: `Large text insertion detected (${charDelta} characters inserted in ${timeDeltaMs}ms).`,
          signalStrength: Math.min(1.0, charDelta / 500),
          rawEventType: 'input',
          explanation: 'A substantial block of text appeared instantaneously without normal typing intervals.',
          limitationNote: 'Browser autocomplete, spellcheck replacement, or drag-and-drop text can trigger large insertion.',
          possibleFalsePositives: ['Browser form autocomplete', 'IME CJK input composition', 'Spellcheck batch fix'],
          metadata: { charDelta, timeDeltaMs, totalLength: currentValue.length, elementType: target.tagName },
        },
      });
    }

    // 2. Detect Rapid Total Replacement (e.g. Replacing > 100 chars completely)
    if (prevValue.length > 100 && currentValue.length > 50 && charDelta < -50) {
      state.replacementCount += 1;
      this.emitEvent({
        type: 'RapidReplacement',
        severity: 'MEDIUM',
        confidence: 'MEDIUM',
        details: {
          message: `Massive text replacement / deletion detected (${Math.abs(charDelta)} chars modified).`,
          signalStrength: 0.5,
          rawEventType: 'input',
          explanation: 'Candidate replaced or deleted a substantial section of previous answer.',
          limitationNote: 'Draft refactoring or clearing a scratch response causes large deletions.',
          possibleFalsePositives: ['Answer rewrite', 'Select All + Delete'],
          metadata: { charDelta, replacementCount: state.replacementCount, elementType: target.tagName },
        },
      });
    } else {
      // Normal Answer Edit Event
      if (state.editCount % 20 === 0) { // Throttle normal edits to every 20 events
        this.emitEvent({
          type: 'AnswerEdited',
          severity: 'INFO',
          confidence: 'HIGH',
          details: {
            message: `Answer input update recorded (${currentValue.length} characters).`,
            rawEventType: 'input',
            explanation: 'Candidate actively editing response.',
            metadata: { editCount: state.editCount, currentLength: currentValue.length },
          },
        });
      }
    }
  };
}
