import {
  ActivityType,
  FeedingRecord,
  DiaperRecord,
  SleepRecord,
  PumpingRecord,
  MedicineRecord,
  BabyNote,
  UnifiedActivity,
} from '../types';
import { storageService } from './storageService';
import {
  INITIAL_FEEDINGS,
  INITIAL_DIAPERS,
  INITIAL_SLEEP,
  INITIAL_PUMPING,
  INITIAL_MEDICINE,
  INITIAL_NOTES,
} from '../data/demoData';

const FEEDINGS_KEY = 'track_feedings';
const DIAPERS_KEY = 'track_diapers';
const SLEEP_KEY = 'track_sleep';
const PUMPING_KEY = 'track_pumping';
const MEDICINE_KEY = 'track_medicine';
const NOTES_KEY = 'track_notes';

class TrackingService {
  // Feedings
  getFeedings(babyId: string): FeedingRecord[] {
    const all = storageService.get<FeedingRecord[]>(FEEDINGS_KEY, INITIAL_FEEDINGS) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addFeeding(record: Omit<FeedingRecord, 'id'>): FeedingRecord {
    const all = storageService.get<FeedingRecord[]>(FEEDINGS_KEY, INITIAL_FEEDINGS) || [];
    const newRecord: FeedingRecord = {
      ...record,
      id: `feed_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(FEEDINGS_KEY, all);
    storageService.enqueueSync('feeding', 'CREATE', newRecord);
    return newRecord;
  }

  // Diapers
  getDiapers(babyId: string): DiaperRecord[] {
    const all = storageService.get<DiaperRecord[]>(DIAPERS_KEY, INITIAL_DIAPERS) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addDiaper(record: Omit<DiaperRecord, 'id'>): DiaperRecord {
    const all = storageService.get<DiaperRecord[]>(DIAPERS_KEY, INITIAL_DIAPERS) || [];
    const newRecord: DiaperRecord = {
      ...record,
      id: `diaper_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(DIAPERS_KEY, all);
    storageService.enqueueSync('diaper', 'CREATE', newRecord);
    return newRecord;
  }

  // Sleep
  getSleep(babyId: string): SleepRecord[] {
    const all = storageService.get<SleepRecord[]>(SLEEP_KEY, INITIAL_SLEEP) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addSleep(record: Omit<SleepRecord, 'id'>): SleepRecord {
    const all = storageService.get<SleepRecord[]>(SLEEP_KEY, INITIAL_SLEEP) || [];
    const newRecord: SleepRecord = {
      ...record,
      id: `sleep_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(SLEEP_KEY, all);
    storageService.enqueueSync('sleep', 'CREATE', newRecord);
    return newRecord;
  }

  // Pumping
  getPumping(babyId: string): PumpingRecord[] {
    const all = storageService.get<PumpingRecord[]>(PUMPING_KEY, INITIAL_PUMPING) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addPumping(record: Omit<PumpingRecord, 'id'>): PumpingRecord {
    const all = storageService.get<PumpingRecord[]>(PUMPING_KEY, INITIAL_PUMPING) || [];
    const newRecord: PumpingRecord = {
      ...record,
      id: `pump_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(PUMPING_KEY, all);
    storageService.enqueueSync('pumping', 'CREATE', newRecord);
    return newRecord;
  }

  // Medicine
  getMedicine(babyId: string): MedicineRecord[] {
    const all = storageService.get<MedicineRecord[]>(MEDICINE_KEY, INITIAL_MEDICINE) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addMedicine(record: Omit<MedicineRecord, 'id'>): MedicineRecord {
    const all = storageService.get<MedicineRecord[]>(MEDICINE_KEY, INITIAL_MEDICINE) || [];
    const newRecord: MedicineRecord = {
      ...record,
      id: `med_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(MEDICINE_KEY, all);
    storageService.enqueueSync('medicine', 'CREATE', newRecord);
    return newRecord;
  }

  // Notes
  getNotes(babyId: string): BabyNote[] {
    const all = storageService.get<BabyNote[]>(NOTES_KEY, INITIAL_NOTES) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  addNote(record: Omit<BabyNote, 'id'>): BabyNote {
    const all = storageService.get<BabyNote[]>(NOTES_KEY, INITIAL_NOTES) || [];
    const newRecord: BabyNote = {
      ...record,
      id: `note_${Date.now()}`,
    };
    all.unshift(newRecord);
    storageService.set(NOTES_KEY, all);
    storageService.enqueueSync('note', 'CREATE', newRecord);
    return newRecord;
  }

  // Generic delete activity
  deleteActivity(type: ActivityType, id: string): boolean {
    const keyMap: Record<ActivityType, string> = {
      feeding: FEEDINGS_KEY,
      diaper: DIAPERS_KEY,
      sleep: SLEEP_KEY,
      pumping: PUMPING_KEY,
      medicine: MEDICINE_KEY,
      note: NOTES_KEY,
    };
    const key = keyMap[type];
    if (!key) return false;

    const list = storageService.get<any[]>(key, []) || [];
    const filtered = list.filter((item) => item.id !== id);
    storageService.set(key, filtered);
    storageService.enqueueSync(type, 'DELETE', { id });
    return true;
  }

  // Today's unified timeline items
  getUnifiedActivities(babyId: string, filterType?: ActivityType | 'all', filterDateStr?: string): UnifiedActivity[] {
    const feedings = this.getFeedings(babyId);
    const diapers = this.getDiapers(babyId);
    const sleeps = this.getSleep(babyId);
    const pumpings = this.getPumping(babyId);
    const medicines = this.getMedicine(babyId);
    const notes = this.getNotes(babyId);

    const unified: UnifiedActivity[] = [];

    // Feeding conversions
    feedings.forEach((f) => {
      let subtitle = '';
      if (f.feedingType === 'breastfeeding') {
        const sideText = f.side ? `${f.side.charAt(0).toUpperCase() + f.side.slice(1)} side` : '';
        const durText = f.durationMinutes ? `${f.durationMinutes} min` : '';
        subtitle = [sideText, durText].filter(Boolean).join(' • ') || 'Nursing session';
      } else if (f.amountMl) {
        subtitle = `${f.amountMl} ml bottle`;
      } else {
        subtitle = `${f.feedingType}`;
      }

      unified.push({
        id: f.id,
        babyId: f.babyId,
        type: 'feeding',
        timestamp: f.timestamp,
        title: f.feedingType === 'breastfeeding' ? 'Breastfeeding' : f.feedingType === 'bottle' ? 'Bottle feed' : 'Formula',
        subtitle,
        detail: f.notes,
        iconName: 'Baby',
        badgeColor: 'bg-rose-50 text-rose-600 border-rose-100',
        rawPayload: f,
      });
    });

    // Diaper conversions
    diapers.forEach((d) => {
      let title = 'Diaper change';
      if (d.diaperType === 'wet') title = 'Wet diaper';
      if (d.diaperType === 'dirty') title = 'Dirty diaper';
      if (d.diaperType === 'both') title = 'Wet & dirty diaper';

      const details = [
        d.stoolColor ? `${d.stoolColor} color` : null,
        d.stoolConsistency ? `${d.stoolConsistency} texture` : null,
        d.rashPresent ? 'rash care' : null,
      ]
        .filter(Boolean)
        .join(' • ');

      unified.push({
        id: d.id,
        babyId: d.babyId,
        type: 'diaper',
        timestamp: d.timestamp,
        title,
        subtitle: details || 'Clean change',
        detail: d.notes,
        iconName: 'Droplet',
        badgeColor: 'bg-amber-50 text-amber-600 border-amber-100',
        rawPayload: d,
      });
    });

    // Sleep conversions
    sleeps.forEach((s) => {
      const hours = Math.floor(s.durationMinutes / 60);
      const mins = s.durationMinutes % 60;
      const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

      unified.push({
        id: s.id,
        babyId: s.babyId,
        type: 'sleep',
        timestamp: s.startTime,
        title: s.sleepType === 'night' ? 'Night sleep' : 'Nap',
        subtitle: durationStr,
        detail: s.notes,
        iconName: 'Moon',
        badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        rawPayload: s,
      });
    });

    // Pumping conversions
    pumpings.forEach((p) => {
      unified.push({
        id: p.id,
        babyId: p.babyId,
        type: 'pumping',
        timestamp: p.timestamp,
        title: 'Breast pump',
        subtitle: `${p.totalAmountMl} ml total (L: ${p.leftAmountMl}ml, R: ${p.rightAmountMl}ml)`,
        detail: p.notes,
        iconName: 'Activity',
        badgeColor: 'bg-teal-50 text-teal-600 border-teal-100',
        rawPayload: p,
      });
    });

    // Medicine conversions
    medicines.forEach((m) => {
      unified.push({
        id: m.id,
        babyId: m.babyId,
        type: 'medicine',
        timestamp: m.timestamp,
        title: m.medicineName,
        subtitle: m.dosage,
        detail: m.notes || m.reason,
        iconName: 'Pill',
        badgeColor: 'bg-purple-50 text-purple-600 border-purple-100',
        rawPayload: m,
      });
    });

    // Notes conversions
    notes.forEach((n) => {
      unified.push({
        id: n.id,
        babyId: n.babyId,
        type: 'note',
        timestamp: n.timestamp,
        title: n.title,
        subtitle: n.isMilestoneMemory ? 'Milestone memory ❤️' : 'Daily note',
        detail: n.content,
        iconName: 'FileText',
        badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        rawPayload: n,
      });
    });

    // Sort by timestamp descending
    let sorted = unified.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filterType && filterType !== 'all') {
      sorted = sorted.filter((item) => item.type === filterType);
    }

    if (filterDateStr) {
      sorted = sorted.filter((item) => item.timestamp.startsWith(filterDateStr));
    }

    return sorted;
  }

  // Today's overview stats
  getTodaySummary(babyId: string): {
    feedingCount: number;
    feedingTotalMl: number;
    sleepTotalMinutes: number;
    sleepFormatted: string;
    diaperCount: number;
    medicineCount: number;
  } {
    const todayStr = new Date().toISOString().split('T')[0];

    const todayFeedings = this.getFeedings(babyId).filter((f) => f.timestamp.startsWith(todayStr));
    const todayDiapers = this.getDiapers(babyId).filter((d) => d.timestamp.startsWith(todayStr));
    const todaySleep = this.getSleep(babyId).filter((s) => s.startTime.startsWith(todayStr));
    const todayMed = this.getMedicine(babyId).filter((m) => m.timestamp.startsWith(todayStr));

    let totalSleepMins = 0;
    todaySleep.forEach((s) => (totalSleepMins += s.durationMinutes));

    const hours = Math.floor(totalSleepMins / 60);
    const mins = totalSleepMins % 60;
    const sleepFormatted = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    let totalMl = 0;
    todayFeedings.forEach((f) => {
      if (f.amountMl) totalMl += f.amountMl;
    });

    return {
      feedingCount: todayFeedings.length,
      feedingTotalMl: totalMl,
      sleepTotalMinutes: totalSleepMins,
      sleepFormatted: totalSleepMins > 0 ? sleepFormatted : '0h 00m',
      diaperCount: todayDiapers.length,
      medicineCount: todayMed.length,
    };
  }
}

export const trackingService = new TrackingService();
