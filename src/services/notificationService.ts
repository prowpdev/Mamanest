// Capacitor Local Notifications Abstraction Layer
// In Capacitor, this will map to:
// import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationScheduleOptions {
  id: number;
  title: string;
  body: string;
  scheduleAt?: Date;
  extra?: any;
}

class NotificationService {
  private hasNativeCapacitor(): boolean {
    return typeof (window as any)?.Capacitor !== 'undefined' && typeof (window as any)?.Capacitor?.Plugins?.LocalNotifications !== 'undefined';
  }

  async requestPermission(): Promise<boolean> {
    return this.requestPermissions();
  }

  async requestPermissions(): Promise<boolean> {
    if (this.hasNativeCapacitor()) {
      try {
        const res = await (window as any).Capacitor.Plugins.LocalNotifications.requestPermissions();
        return res.display === 'granted';
      } catch (err) {
        console.warn('[NotificationService] Capacitor permission error:', err);
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }

    return true;
  }

  async schedule(options: NotificationScheduleOptions): Promise<void> {
    if (this.hasNativeCapacitor()) {
      await (window as any).Capacitor.Plugins.LocalNotifications.schedule({
        notifications: [
          {
            id: options.id,
            title: options.title,
            body: options.body,
            schedule: options.scheduleAt ? { at: options.scheduleAt } : undefined,
            extra: options.extra,
          },
        ],
      });
      return;
    }

    // Web & Development fallback: display in console & schedule browser notification if permitted
    console.log(`[NotificationService] Scheduled mock notification: [${options.title}] ${options.body}`, options);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      if (!options.scheduleAt || options.scheduleAt.getTime() <= Date.now()) {
        new Notification(options.title, {
          body: options.body,
          icon: '/favicon.ico',
        });
      } else {
        const delay = Math.max(0, options.scheduleAt.getTime() - Date.now());
        setTimeout(() => {
          new Notification(options.title, {
            body: options.body,
            icon: '/favicon.ico',
          });
        }, Math.min(delay, 2147483647));
      }
    }
  }

  async cancel(id: number): Promise<void> {
    if (this.hasNativeCapacitor()) {
      await (window as any).Capacitor.Plugins.LocalNotifications.cancel({ notifications: [{ id }] });
      return;
    }
    console.log(`[NotificationService] Cancelled notification ID: ${id}`);
  }
}

export const notificationService = new NotificationService();
