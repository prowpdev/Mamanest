// Capacitor Share Abstraction Layer
// In Capacitor, this will map to:
// import { Share } from '@capacitor/share';

export interface ShareOptions {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}

class ShareService {
  private hasNativeCapacitor(): boolean {
    return typeof (window as any)?.Capacitor !== 'undefined' && typeof (window as any)?.Capacitor?.Plugins?.Share !== 'undefined';
  }

  async share(options: ShareOptions): Promise<boolean> {
    if (this.hasNativeCapacitor()) {
      try {
        await (window as any).Capacitor.Plugins.Share.share(options);
        return true;
      } catch (err) {
        console.warn('[ShareService] Capacitor Share error:', err);
      }
    }

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(options);
        return true;
      } catch (err) {
        console.warn('[ShareService] Web Share error:', err);
      }
    }

    // Fallback: Copy to clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(`${options.title}\n${options.text}\n${options.url || ''}`);
        return true;
      }
    } catch {
      // Ignored
    }

    return false;
  }
}

export const shareService = new ShareService();
