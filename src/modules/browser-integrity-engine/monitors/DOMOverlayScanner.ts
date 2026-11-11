import { BaseModule } from '../core/BaseModule';
import { EventBus } from '../core/EventBus';
import { SessionManager } from '../core/SessionManager';

export interface DOMOverlayScannerOptions {
  scanIntervalMs?: number;
  ignoredSelectors?: string[];
}

/**
 * @class DOMOverlayScanner
 * @extends BaseModule
 * @description Inspects the DOM every 2 seconds to identify suspicious overlay elements, hidden iframe layers,
 * floating assist widgets, abnormal z-index stacks, and unexpected Shadow DOM roots.
 * 
 * DETECTIONS:
 * • Large fixed overlays (position: fixed covering >50% of viewport)
 * • Viewport-covering absolute elements
 * • pointer-events: none transparent layers
 * • Unexpected Shadow DOM roots
 * • Abnormal z-index values (z-index >= 9999)
 * • Fullscreen transparent layers (opacity <= 0.05 or transparent background)
 * • Hidden iframe overlays (display: none, visibility: hidden, opacity: 0, 0/1px bounds)
 * • Floating assist widgets (AI prompt extensions, automated assistance tools)
 * 
 * HEURISTIC LIMITATIONS & FALSE POSITIVE MITIGATION:
 * • Legitimate UI design libraries (Radix, Headless UI, Shadcn, Material UI) use high z-index modals and fixed overlays.
 * • An allowlist filter automatically ignores known AssessIQ elements, native <dialog> tags, and standard ARIA modals/tooltips.
 */
export class DOMOverlayScanner extends BaseModule {
  private scanIntervalMs: number;
  private ignoredSelectors: string[];
  private scanIntervalId: ReturnType<typeof setInterval> | null = null;

  // Track already reported elements by standard path/ID to reduce event spam
  private reportedSignatures: Set<string> = new Set();

  constructor(
    eventBus: EventBus,
    sessionManager: SessionManager,
    options?: DOMOverlayScannerOptions
  ) {
    super('DOMOverlayScanner', eventBus, sessionManager);
    this.scanIntervalMs = options?.scanIntervalMs || 2000;
    this.ignoredSelectors = options?.ignoredSelectors || [
      '[data-assessiq-ui]',
      '[id^="assessiq-"]',
      '[class*="assessiq-"]',
      '[role="dialog"]',
      '[role="alertdialog"]',
      '[role="tooltip"]',
      '[aria-modal="true"]',
      'dialog',
      '.toast',
      '.sonner-toast',
      '#portal-root',
    ];
  }

  public start(): void {
    if (this.isRunning || typeof window === 'undefined') return;
    this.isRunning = true;

    // Run initial scan immediately
    this.scanDOM();

    // Schedule periodic scan every 2 seconds
    this.scanIntervalId = setInterval(() => {
      if (this.isRunning) {
        this.scanDOM();
      }
    }, this.scanIntervalMs);
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (this.scanIntervalId) {
      clearInterval(this.scanIntervalId);
      this.scanIntervalId = null;
    }
  }

  /**
   * Main DOM inspection loop.
   */
  private scanDOM(): void {
    if (typeof document === 'undefined') return;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const minOverlayWidth = viewportWidth * 0.5;
    const minOverlayHeight = viewportHeight * 0.5;

    // 1. Query elements for Overlay inspection
    const candidateElements = Array.from(
      document.querySelectorAll<HTMLElement>('div, section, main, article, iframe, span, form, [style]')
    );

    candidateElements.forEach((el) => {
      // Skip ignored AssessIQ UI or modal elements
      if (this.isIgnoredElement(el)) return;

      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);

      // Unique element signature for de-duplication
      const signature = this.getElementSignature(el, rect, style);

      // A. Check Hidden Iframes
      if (el.tagName.toLowerCase() === 'iframe') {
        this.inspectIframe(el as HTMLIFrameElement, rect, style, signature);
        return;
      }

      // B. Check Large Fixed Overlays
      if (style.position === 'fixed' && rect.width >= minOverlayWidth && rect.height >= minOverlayHeight) {
        if (!this.reportedSignatures.has(`fixed_${signature}`)) {
          this.reportedSignatures.add(`fixed_${signature}`);
          this.emitEvent({
            type: 'LargeFixedElement',
            severity: 'MEDIUM',
            confidence: 'MEDIUM',
            details: {
              message: `Large fixed overlay detected (${Math.round(rect.width)}x${Math.round(rect.height)}px).`,
              signalStrength: 0.6,
              explanation: 'Fixed position DOM element spans over 50% of the active viewport area.',
              limitationNote: 'Legitimate UI modals, notification banners, or cookie consents trigger this rule.',
              possibleFalsePositives: ['Framework modal backdrop', 'Cookie banner', 'Global loading overlay'],
              metadata: {
                tagName: el.tagName,
                id: el.id,
                className: el.className,
                width: rect.width,
                height: rect.height,
                zIndex: style.zIndex,
                pointerEvents: style.pointerEvents,
              },
            },
          });
        }
      }

      // C. Check pointer-events: none / Fullscreen Transparent Overlays
      if (
        (style.position === 'fixed' || style.position === 'absolute') &&
        rect.width >= minOverlayWidth &&
        rect.height >= minOverlayHeight
      ) {
        const isTransparent = parseFloat(style.opacity) <= 0.05 || style.backgroundColor === 'transparent' || style.backgroundColor === 'rgba(0, 0, 0, 0)';
        const isPointerNone = style.pointerEvents === 'none';

        if (isPointerNone || (isTransparent && style.position === 'fixed')) {
          if (!this.reportedSignatures.has(`overlay_${signature}`)) {
            this.reportedSignatures.add(`overlay_${signature}`);
            this.emitEvent({
              type: 'OverlayDetected',
              severity: isPointerNone ? 'HIGH' : 'MEDIUM',
              confidence: 'MEDIUM',
              details: {
                message: `Suspicious transparent or pointer-events:none overlay detected.`,
                signalStrength: isPointerNone ? 0.8 : 0.6,
                explanation: isPointerNone
                  ? 'Large overlay spanning viewport with pointer-events:none (potential clickjacking or screen grab widget).'
                  : 'Large transparent fixed layer spanning examination area.',
                limitationNote: 'Custom mouse particle effects or full-page drag-drop backdrops use pointer-events:none.',
                possibleFalsePositives: ['Drag-and-drop backdrop layer', 'Tooltip container element'],
                metadata: {
                  tagName: el.tagName,
                  id: el.id,
                  className: el.className,
                  position: style.position,
                  pointerEvents: style.pointerEvents,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                },
              },
            });
          }
        }
      }

      // D. Check Abnormal z-index
      const parsedZIndex = parseInt(style.zIndex, 10);
      if (!isNaN(parsedZIndex) && parsedZIndex >= 9999) {
        if (!this.reportedSignatures.has(`zindex_${signature}`)) {
          this.reportedSignatures.add(`zindex_${signature}`);
          this.emitEvent({
            type: 'OverlayDetected',
            severity: 'LOW',
            confidence: 'LOW',
            details: {
              message: `Abnormally high z-index detected (z-index: ${parsedZIndex}).`,
              signalStrength: 0.3,
              explanation: 'Element specifies extreme z-index stacking layer.',
              limitationNote: 'UI component libraries frequently use z-index 9999 or 2147483647 for popovers.',
              possibleFalsePositives: ['Shadcn/Radix popovers', 'Toast notifications', 'Dropdown menus'],
              metadata: { tagName: el.tagName, id: el.id, zIndex: parsedZIndex },
            },
          });
        }
      }

      // E. Check Dynamic Assist Widgets
      this.inspectAssistWidgets(el, style, rect, signature);
    });

    // 2. Query for Unexpected Shadow DOM Roots
    this.scanShadowRoots();
  }

  /**
   * Inspect <iframe> elements for hidden or covert overlay properties.
   */
  private inspectIframe(
    iframe: HTMLIFrameElement,
    rect: DOMRect,
    style: CSSStyleDeclaration,
    signature: string
  ): void {
    const isHiddenStyle =
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      parseFloat(style.opacity) === 0;
    const isTinyBounds = rect.width <= 1 || rect.height <= 1;
    const isCovertPosition = style.position === 'fixed' || style.position === 'absolute';

    if ((isHiddenStyle || isTinyBounds) && isCovertPosition) {
      if (!this.reportedSignatures.has(`iframe_${signature}`)) {
        this.reportedSignatures.add(`iframe_${signature}`);
        this.emitEvent({
          type: 'HiddenIframe',
          severity: 'HIGH',
          confidence: 'HIGH',
          details: {
            message: `Hidden iframe overlay detected (Src: "${iframe.src || 'blank'}").`,
            signalStrength: 0.85,
            explanation: 'Covert positioning combined with hidden CSS visibility or 0/1px dimensions detected on <iframe> element.',
            limitationNote: 'Analytics scripts or single-sign-on (SSO) silent token refreshers create hidden iframes.',
            possibleFalsePositives: ['SSO silent refresh iframe', 'Google Analytics iframe', 'Payment gateway token frame'],
            metadata: {
              src: iframe.src,
              id: iframe.id,
              width: rect.width,
              height: rect.height,
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
            },
          },
        });
      }
    }
  }

  /**
   * Scan elements for unexpected dynamic Shadow DOM roots.
   */
  private scanShadowRoots(): void {
    if (typeof document === 'undefined') return;

    const allElements = document.querySelectorAll<HTMLElement>('*');
    allElements.forEach((el) => {
      if (this.isIgnoredElement(el)) return;

      if (el.shadowRoot) {
        const sig = `shadow_${el.tagName}_${el.id}_${el.className}`;
        if (!this.reportedSignatures.has(sig)) {
          this.reportedSignatures.add(sig);
          this.emitEvent({
            type: 'SuspiciousShadowRoot',
            severity: 'MEDIUM',
            confidence: 'MEDIUM',
            details: {
              message: `Attached Shadow DOM root detected on <${el.tagName.toLowerCase()}> element.`,
              signalStrength: 0.7,
              explanation: 'Shadow DOM root node found attached to page element.',
              limitationNote: 'Browser extensions, Web Components, and video players natively use Shadow DOM.',
              possibleFalsePositives: ['Grammarly extension widget', 'Web Components', 'Custom HTML5 video controls'],
              metadata: {
                tagName: el.tagName,
                id: el.id,
                className: el.className,
                shadowMode: el.shadowRoot.mode,
              },
            },
          });
        }
      }
    });
  }

  /**
   * Detect floating assistance tools / AI helper widgets.
   */
  private inspectAssistWidgets(
    el: HTMLElement,
    style: CSSStyleDeclaration,
    rect: DOMRect,
    signature: string
  ): void {
    if (style.position !== 'fixed' && style.position !== 'absolute') return;

    const classAndId = `${el.className} ${el.id} ${el.getAttribute('data-extension-id') || ''}`.toLowerCase();
    const assistKeywords = ['ai-assist', 'chatgpt', 'copilot', 'grammarly', 'solver', 'helper-widget', 'overlay-assistant'];

    const matchedKeyword = assistKeywords.find((kw) => classAndId.includes(kw));

    if (matchedKeyword) {
      if (!this.reportedSignatures.has(`assist_${signature}`)) {
        this.reportedSignatures.add(`assist_${signature}`);
        this.emitEvent({
          type: 'OverlayDetected',
          severity: 'HIGH',
          confidence: 'HIGH',
          details: {
            message: `Floating assist widget detected matching keyword "${matchedKeyword}".`,
            signalStrength: 0.9,
            explanation: 'Floating element attributes match known third-party browser helper or AI assistance extension.',
            limitationNote: 'Permitted browser spellcheckers or translation widgets may match keywords.',
            possibleFalsePositives: ['Permitted browser translation widget', 'Spellchecker extension'],
            metadata: {
              matchedKeyword,
              tagName: el.tagName,
              id: el.id,
              className: el.className,
              rect: { width: rect.width, height: rect.height },
            },
          },
        });
      }
    }
  }

  /**
   * Helper to check if an element matches allowlist/ignored selectors.
   */
  private isIgnoredElement(el: HTMLElement): boolean {
    for (const selector of this.ignoredSelectors) {
      try {
        if (el.matches(selector) || el.closest(selector)) {
          return true;
        }
      } catch {
        // Ignore invalid CSS selector syntax if provided by user options
      }
    }
    return false;
  }

  /**
   * Create a unique identifier string for DOM elements to prevent repetitive event spamming.
   */
  private getElementSignature(el: HTMLElement, rect: DOMRect, style: CSSStyleDeclaration): string {
    return `${el.tagName}_${el.id}_${el.className}_${Math.round(rect.left)}_${Math.round(rect.top)}_${style.zIndex}`;
  }
}
