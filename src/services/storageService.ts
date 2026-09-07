// Storage abstraction layer with Offline-First Sync Queue for Django REST API compatibility

export interface SyncMutation {
  id: string;
  entity: string; // 'feeding' | 'diaper' | 'sleep' | 'pumping' | 'medicine' | 'note' | 'growth' | 'reminder' | 'baby';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
  synced: boolean;
}

const STORAGE_PREFIX = 'mamanest_';
const SYNC_QUEUE_KEY = `${STORAGE_PREFIX}sync_queue`;

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const item = window.localStorage.getItem(STORAGE_PREFIX + key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      if (parsed === null || parsed === undefined) return defaultValue;
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return defaultValue;
      return parsed as T;
    } catch (e) {
      console.warn(`[StorageService] Error reading key "${key}":`, e);
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`[StorageService] Error writing key "${key}":`, e);
    }
  }

  remove(key: string): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      console.error(`[StorageService] Error removing key "${key}":`, e);
    }
  }

  clearAll(): void {
    if (!this.isBrowser()) return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (e) {
      console.error('[StorageService] Error clearing all items:', e);
    }
  }

  // --- Offline Sync Queue Abstraction for Django REST API ---
  enqueueSync(entity: string, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any): void {
    const queue = this.get<SyncMutation[]>('sync_queue', []);
    const mutation: SyncMutation = {
      id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      entity,
      action,
      payload,
      timestamp: new Date().toISOString(),
      synced: false,
    };
    queue.push(mutation);
    this.set('sync_queue', queue);
  }

  getPendingSyncCount(): number {
    const queue = this.get<SyncMutation[]>('sync_queue', []);
    return queue.filter((m) => !m.synced).length;
  }

  getSyncQueue(): SyncMutation[] {
    return this.get<SyncMutation[]>('sync_queue', []);
  }

  clearSynced(): void {
    const queue = this.get<SyncMutation[]>('sync_queue', []);
    this.set('sync_queue', queue.filter((m) => !m.synced));
  }
}

export const storageService = new StorageService();
