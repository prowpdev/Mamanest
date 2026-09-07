import { Vaccination, VaccinationStatus } from '../types';
import { storageService } from './storageService';
import { INITIAL_VACCINATIONS } from '../data/demoData';

const VACCINATIONS_KEY = 'baby_vaccinations';

class VaccinationService {
  getVaccinations(babyId?: string): Vaccination[] {
    const all = storageService.get<Vaccination[]>(VACCINATIONS_KEY, INITIAL_VACCINATIONS) || [];
    if (!babyId) return all;
    const babyVacs = all.filter((v) => !v.babyId || v.babyId === babyId);
    return babyVacs.length > 0 ? babyVacs : all;
  }

  addVaccination(data: Omit<Vaccination, 'id'>): Vaccination {
    const all = storageService.get<Vaccination[]>(VACCINATIONS_KEY, INITIAL_VACCINATIONS) || [];
    const newVaccination: Vaccination = {
      ...data,
      id: `vac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
    all.push(newVaccination);
    storageService.set(VACCINATIONS_KEY, all);
    storageService.enqueueSync('vaccination', 'CREATE', newVaccination);
    return newVaccination;
  }

  updateVaccination(id: string, updates: Partial<Vaccination>): Vaccination | null {
    const all = storageService.get<Vaccination[]>(VACCINATIONS_KEY, INITIAL_VACCINATIONS) || [];
    let updatedItem: Vaccination | null = null;

    const updated = all.map((v) => {
      if (v.id === id) {
        updatedItem = { ...v, ...updates };
        return updatedItem;
      }
      return v;
    });

    if (updatedItem) {
      storageService.set(VACCINATIONS_KEY, updated);
      storageService.enqueueSync('vaccination', 'UPDATE', updatedItem);
    }
    return updatedItem;
  }

  updateVaccinationStatus(id: string, status: VaccinationStatus, administeredDate?: string): Vaccination | null {
    return this.updateVaccination(id, {
      status,
      administeredDate:
        status === 'completed'
          ? administeredDate || new Date().toISOString().split('T')[0]
          : undefined,
    });
  }

  deleteVaccination(id: string): boolean {
    const all = storageService.get<Vaccination[]>(VACCINATIONS_KEY, INITIAL_VACCINATIONS) || [];
    const filtered = all.filter((v) => v.id !== id);
    storageService.set(VACCINATIONS_KEY, filtered);
    storageService.enqueueSync('vaccination', 'DELETE', { id });
    return true;
  }
}

export const vaccinationService = new VaccinationService();
