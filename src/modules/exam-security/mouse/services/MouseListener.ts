import { MousePolicyService } from './MousePolicyService';
import { MouseDispatcher } from './MouseDispatcher';
import { MouseAnalyticsEngine } from './MouseAnalyticsEngine';
import { ContextMenuProtectionService } from './ContextMenuProtectionService';
import { TextSelectionProtectionService } from './TextSelectionProtectionService';
import { DragDropProtectionService } from './DragDropProtectionService';
import { MouseActionParser } from '../utils/MouseActionParser';
import { MouseEventNormalizer } from '../utils/MouseEventNormalizer';

export class MouseListener {
  private isListening = false;
  public readonly policyService: MousePolicyService;
  public readonly dispatcher: MouseDispatcher;
  public readonly analyticsEngine: MouseAnalyticsEngine;

  public readonly contextMenuService: ContextMenuProtectionService;
  public readonly selectionService: TextSelectionProtectionService;
  public readonly dragDropService: DragDropProtectionService;

  private contextData?: { studentId?: string; examId?: string; sessionId?: string };

  constructor(policyService: MousePolicyService, dispatcher: MouseDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
    this.analyticsEngine = new MouseAnalyticsEngine();

    this.contextMenuService = new ContextMenuProtectionService(this.policyService, this.dispatcher);
    this.selectionService = new TextSelectionProtectionService(this.policyService, this.dispatcher);
    this.dragDropService = new DragDropProtectionService(this.policyService, this.dispatcher);
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.contextData = data;
    this.contextMenuService.setContextData(data);
    this.selectionService.setContextData(data);
    this.dragDropService.setContextData(data);
  }

  public start(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    this.contextMenuService.start();
    this.selectionService.start();
    this.dragDropService.start();

    document.addEventListener('click', this.handleGenericMouse, true);
    document.addEventListener('dblclick', this.handleGenericMouse, true);
    document.addEventListener('wheel', this.handleGenericMouse, true);
  }

  public stop(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    this.contextMenuService.stop();
    this.selectionService.stop();
    this.dragDropService.stop();

    document.removeEventListener('click', this.handleGenericMouse, true);
    document.removeEventListener('dblclick', this.handleGenericMouse, true);
    document.removeEventListener('wheel', this.handleGenericMouse, true);
  }

  private handleGenericMouse = (e: MouseEvent | WheelEvent) => {
    const interactionType = MouseActionParser.mapEventTypeToInteraction(e.type, (e as MouseEvent).button || 0);
    const rule = this.policyService.getRuleForInteraction(interactionType);
    const action = rule ? rule.action : 'ALLOW';
    const result = rule ? rule.description : 'Unrestricted mouse interaction';

    const normalized = MouseEventNormalizer.normalize(e, interactionType, action, result, this.contextData);
    this.analyticsEngine.recordEvent(normalized);
    this.dispatcher.dispatch(normalized, rule);
  };
}
