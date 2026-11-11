import { FullscreenStateService } from './FullscreenStateService';
import { FullscreenPolicyService } from './FullscreenPolicyService';
import { FullscreenDispatcher } from './FullscreenDispatcher';
import { FullscreenRecoveryService } from './FullscreenRecoveryService';
import { FullscreenAnalyticsService } from './FullscreenAnalyticsService';
import { BrowserCompatibility } from '../utils/BrowserCompatibility';
import { FullscreenNormalizer } from '../utils/FullscreenNormalizer';
import { FullscreenState } from '../types/FullscreenState';

export class FullscreenService {
  private isListening = false;
  public readonly stateService: FullscreenStateService;
  public readonly policyService: FullscreenPolicyService;
  public readonly dispatcher: FullscreenDispatcher;
  public readonly recoveryService: FullscreenRecoveryService;
  public readonly analyticsService: FullscreenAnalyticsService;

  private contextData?: {
    studentId?: string;
    examId?: string;
    sessionId?: string;
    currentQuestion?: number;
    timeLeftSeconds?: number;
  };

  constructor(policyService: FullscreenPolicyService, dispatcher: FullscreenDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
    this.stateService = new FullscreenStateService();
    this.recoveryService = new FullscreenRecoveryService(this.policyService);
    this.analyticsService = new FullscreenAnalyticsService();
  }

  public setContextData(data?: {
    studentId?: string;
    examId?: string;
    sessionId?: string;
    currentQuestion?: number;
    timeLeftSeconds?: number;
  }): void {
    this.contextData = data;
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    document.addEventListener('fullscreenchange', this.handleDOMFullscreenChange);
    document.addEventListener('webkitfullscreenchange', this.handleDOMFullscreenChange);
    document.addEventListener('mozfullscreenchange', this.handleDOMFullscreenChange);
    document.addEventListener('MSFullscreenChange', this.handleDOMFullscreenChange);
    window.addEventListener('resize', this.handleWindowResize);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    document.removeEventListener('fullscreenchange', this.handleDOMFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', this.handleDOMFullscreenChange);
    document.removeEventListener('mozfullscreenchange', this.handleDOMFullscreenChange);
    document.removeEventListener('MSFullscreenChange', this.handleDOMFullscreenChange);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  public async requestFullscreen(): Promise<void> {
    const rule = this.policyService.getRule();
    this.emitStateChange('ENTERING', 'Student or System requested fullscreen activation', rule.description);
    try {
      await BrowserCompatibility.requestFullscreen();
    } catch (err: any) {
      this.emitStateChange('ERROR', err.message || 'Fullscreen request denied', 'ERROR');
      throw err;
    }
  }

  public async exitFullscreen(): Promise<void> {
    try {
      await BrowserCompatibility.exitFullscreen();
    } catch (err: any) {
      console.error('Exit fullscreen error:', err);
    }
  }

  private handleDOMFullscreenChange = () => {
    const isFS = BrowserCompatibility.isCurrentlyFullscreen();
    const newState: FullscreenState = isFS ? 'ACTIVE' : 'EXITING';
    this.stateService.setState(newState);

    const rule = this.policyService.getRule();
    if (!isFS) {
      this.recoveryService.handleExit();
    }

    this.emitStateChange(newState, isFS ? 'DOM fullscreen enabled' : 'Browser fullscreen exited', rule.description);
  };

  private handleWindowResize = () => {
    if (this.stateService.getState() === 'ACTIVE' && !BrowserCompatibility.isCurrentlyFullscreen()) {
      this.handleDOMFullscreenChange();
    }
  };

  private emitStateChange(state: FullscreenState, reason: string, policyResult: string): void {
    const rule = this.policyService.getRule();
    const normalized = FullscreenNormalizer.normalize(
      state,
      reason,
      policyResult,
      state === 'EXITING' ? rule.actionOnExit : undefined,
      this.contextData
    );
    this.analyticsService.recordEvent(normalized);
    this.dispatcher.dispatch(normalized, rule);
  }
}
