import { ClipboardPolicyService } from './ClipboardPolicyService';
import { ClipboardDispatcher } from './ClipboardDispatcher';
import { ClipboardAnalyticsService } from './ClipboardAnalyticsService';
import { CopyProtectionService } from './CopyProtectionService';
import { CutProtectionService } from './CutProtectionService';
import { PasteProtectionService } from './PasteProtectionService';
import { DragClipboardProtectionService } from './DragClipboardProtectionService';

export class ClipboardListener {
  private isListening = false;
  public readonly policyService: ClipboardPolicyService;
  public readonly dispatcher: ClipboardDispatcher;
  public readonly analyticsService: ClipboardAnalyticsService;

  public readonly copyService: CopyProtectionService;
  public readonly cutService: CutProtectionService;
  public readonly pasteService: PasteProtectionService;
  public readonly dragService: DragClipboardProtectionService;

  constructor(policyService: ClipboardPolicyService, dispatcher: ClipboardDispatcher) {
    this.policyService = policyService;
    this.dispatcher = dispatcher;
    this.analyticsService = new ClipboardAnalyticsService();

    this.copyService = new CopyProtectionService(this.policyService, this.dispatcher);
    this.cutService = new CutProtectionService(this.policyService, this.dispatcher);
    this.pasteService = new PasteProtectionService(this.policyService, this.dispatcher);
    this.dragService = new DragClipboardProtectionService(this.policyService, this.dispatcher);
  }

  public setContextData(data?: { studentId?: string; examId?: string; sessionId?: string }): void {
    this.copyService.setContextData(data);
    this.cutService.setContextData(data);
    this.pasteService.setContextData(data);
    this.dragService.setContextData(data);
  }

  public start(): void {
    if (this.isListening) return;
    this.isListening = true;

    this.copyService.start();
    this.cutService.start();
    this.pasteService.start();
    this.dragService.start();
  }

  public stop(): void {
    if (!this.isListening) return;
    this.isListening = false;

    this.copyService.stop();
    this.cutService.stop();
    this.pasteService.stop();
    this.dragService.stop();
  }
}
