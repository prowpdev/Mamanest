import { HealthcareVisit } from '../types';
import { storageService } from './storageService';
import { INITIAL_VISITS } from '../data/demoData';
import { growthService } from './growthService';

const VISITS_KEY = 'baby_visits';

class VisitService {
  getVisits(babyId?: string): HealthcareVisit[] {
    const all = storageService.get<HealthcareVisit[]>(VISITS_KEY, INITIAL_VISITS) || [];
    if (!babyId) {
      return [...all].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    const babyVisits = all.filter((v) => !v.babyId || v.babyId === babyId);
    const source = babyVisits.length > 0 ? babyVisits : all;
    return [...source].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  addVisit(data: Omit<HealthcareVisit, 'id'>): HealthcareVisit {
    const all = storageService.get<HealthcareVisit[]>(VISITS_KEY, INITIAL_VISITS) || [];
    const newVisit: HealthcareVisit = {
      ...data,
      id: `visit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title || `${data.visitType} - ${data.doctorName || data.clinic}`,
    };
    all.push(newVisit);
    storageService.set(VISITS_KEY, all);
    storageService.enqueueSync('visit', 'CREATE', newVisit);

    // If measurement values provided and babyId is available, record to growth records
    if ((data.weightKg || data.heightCm || data.headCircumferenceCm) && data.babyId) {
      try {
        growthService.addGrowthRecord({
          babyId: data.babyId,
          date: data.date,
          weightKg: data.weightKg,
          heightCm: data.heightCm,
          headCircumferenceCm: data.headCircumferenceCm,
          notes: `Recorded during visit: ${data.visitType} (${data.clinic || data.doctorName})`,
        });
      } catch (err) {
        console.warn('Could not auto-add growth record from visit:', err);
      }
    }

    return newVisit;
  }

  updateVisit(id: string, updates: Partial<HealthcareVisit>): HealthcareVisit | null {
    const all = storageService.get<HealthcareVisit[]>(VISITS_KEY, INITIAL_VISITS) || [];
    let updatedItem: HealthcareVisit | null = null;

    const updated = all.map((v) => {
      if (v.id === id) {
        updatedItem = { ...v, ...updates };
        return updatedItem;
      }
      return v;
    });

    if (updatedItem) {
      storageService.set(VISITS_KEY, updated);
      storageService.enqueueSync('visit', 'UPDATE', updatedItem);
    }
    return updatedItem;
  }

  deleteVisit(id: string): boolean {
    const all = storageService.get<HealthcareVisit[]>(VISITS_KEY, INITIAL_VISITS) || [];
    const filtered = all.filter((v) => v.id !== id);
    storageService.set(VISITS_KEY, filtered);
    storageService.enqueueSync('visit', 'DELETE', { id });
    return true;
  }
}

export const visitService = new VisitService();
