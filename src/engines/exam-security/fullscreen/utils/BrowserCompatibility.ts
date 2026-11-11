export class BrowserCompatibility {
  public static isFullscreenSupported(): boolean {
    if (typeof document === 'undefined') return false;
    const doc = document as any;
    return !!(
      doc.fullscreenEnabled ||
      doc.webkitFullscreenEnabled ||
      doc.mozFullScreenEnabled ||
      doc.msFullscreenEnabled
    );
  }

  public static isCurrentlyFullscreen(): boolean {
    if (typeof document === 'undefined') return false;
    const doc = document as any;
    return !!(
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  public static async requestFullscreen(element?: HTMLElement): Promise<void> {
    if (typeof document === 'undefined') return;
    const elem = (element || document.documentElement) as any;

    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      await elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen();
    } else {
      throw new Error('Fullscreen API unsupported on this device.');
    }
  }

  public static async exitFullscreen(): Promise<void> {
    if (typeof document === 'undefined') return;
    const doc = document as any;

    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
    }
  }
}
