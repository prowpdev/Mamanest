import { GrowthRecord, Milestone } from '../types';
import { storageService } from './storageService';
import { INITIAL_GROWTH, INITIAL_MILESTONES } from '../data/demoData';

const GROWTH_KEY = 'baby_growth_records';
const MILESTONES_KEY = 'baby_milestones';

class GrowthService {
  getGrowthRecords(babyId: string): GrowthRecord[] {
    const all = storageService.get<GrowthRecord[]>(GROWTH_KEY, INITIAL_GROWTH) || [];
    return all.filter((r) => r.babyId === babyId).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  addGrowthRecord(record: Omit<GrowthRecord, 'id'>): GrowthRecord {
    const all = storageService.get<GrowthRecord[]>(GROWTH_KEY, INITIAL_GROWTH) || [];
    const newRecord: GrowthRecord = {
      ...record,
      id: `growth_${Date.now()}`,
    };
    all.push(newRecord);
    storageService.set(GROWTH_KEY, all);
    storageService.enqueueSync('growth', 'CREATE', newRecord);
    return newRecord;
  }

  deleteGrowthRecord(id: string): boolean {
    const all = storageService.get<GrowthRecord[]>(GROWTH_KEY, INITIAL_GROWTH) || [];
    const filtered = all.filter((r) => r.id !== id);
    storageService.set(GROWTH_KEY, filtered);
    storageService.enqueueSync('growth', 'DELETE', { id });
    return true;
  }

  getLatestGrowth(babyId: string): {
    latestWeight?: number;
    weightDelta?: number;
    latestHeight?: number;
    heightDelta?: number;
    latestHead?: number;
    headDelta?: number;
    lastMeasurementDate?: string;
  } {
    const records = this.getGrowthRecords(babyId);
    if (records.length === 0) return {};

    const latest = records[records.length - 1];
    const prev = records.length > 1 ? records[records.length - 2] : undefined;

    return {
      latestWeight: latest.weightKg,
      weightDelta: prev?.weightKg && latest.weightKg ? Number((latest.weightKg - prev.weightKg).toFixed(2)) : undefined,
      latestHeight: latest.heightCm,
      heightDelta: prev?.heightCm && latest.heightCm ? Number((latest.heightCm - prev.heightCm).toFixed(1)) : undefined,
      latestHead: latest.headCircumferenceCm,
      headDelta: prev?.headCircumferenceCm && latest.headCircumferenceCm ? Number((latest.headCircumferenceCm - prev.headCircumferenceCm).toFixed(1)) : undefined,
      lastMeasurementDate: latest.date,
    };
  }

  // Milestones
  getMilestones(): Milestone[] {
    return storageService.get<Milestone[]>(MILESTONES_KEY, INITIAL_MILESTONES) || [];
  }

  toggleMilestone(id: string): Milestone[] {
    const milestones = this.getMilestones();
    const updated = milestones.map((m) => {
      if (m.id === id) {
        const nextCompleted = !m.completed;
        return {
          ...m,
          completed: nextCompleted,
          completedDate: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return m;
    });

    storageService.set(MILESTONES_KEY, updated);
    return updated;
  }
}

export const growthService = new GrowthService();
