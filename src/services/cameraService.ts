// Capacitor Camera Abstraction Layer
// In Capacitor, this will map to:
// import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

class CameraService {
  private hasNativeCapacitor(): boolean {
    return typeof (window as any)?.Capacitor !== 'undefined' && typeof (window as any)?.Capacitor?.Plugins?.Camera !== 'undefined';
  }

  async takePhoto(): Promise<string | null> {
    return this.takeOrPickPhoto();
  }

  async takeOrPickPhoto(): Promise<string | null> {
    if (this.hasNativeCapacitor()) {
      try {
        const image = await (window as any).Capacitor.Plugins.Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: 'dataUrl',
          source: 'CAMERA',
        });
        return image.dataUrl || null;
      } catch (err) {
        console.warn('[CameraService] Capacitor Camera error:', err);
        return null;
      }
    }

    // Web fallback: Trigger HTML file input for camera/gallery
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };

      input.click();
    });
  }
}

export const cameraService = new CameraService();
