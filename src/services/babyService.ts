import { Baby } from '../types';
import { storageService } from './storageService';
import { DEMO_BABY } from '../data/demoData';

const BABIES_KEY = 'babies_list';
const ACTIVE_BABY_ID_KEY = 'active_baby_id';

class BabyService {
  getBabies(): Baby[] {
    const list = storageService.get<Baby[]>(BABIES_KEY, [DEMO_BABY]);
    if (!list || list.length === 0) {
      return [DEMO_BABY];
    }
    return list;
  }

  getActiveBaby(): Baby {
    const babies = this.getBabies();
    const activeId = storageService.get<string | null>(ACTIVE_BABY_ID_KEY, DEMO_BABY.id);
    const found = babies.find((b) => b.id === activeId);
    return found || babies[0] || DEMO_BABY;
  }

  setActiveBaby(id: string): void {
    storageService.set(ACTIVE_BABY_ID_KEY, id);
  }

  createBaby(babyData: Omit<Baby, 'id' | 'userId'>): Baby {
    const babies = this.getBabies();
    const newBaby: Baby = {
      ...babyData,
      id: `baby_${Date.now()}`,
      userId: 'user-demo-1',
    };

    babies.push(newBaby);
    storageService.set(BABIES_KEY, babies);
    storageService.set(ACTIVE_BABY_ID_KEY, newBaby.id);
    storageService.enqueueSync('baby', 'CREATE', newBaby);

    return newBaby;
  }

  updateBaby(id: string, updates: Partial<Baby>): Baby | null {
    const babies = this.getBabies();
    const index = babies.findIndex((b) => b.id === id);
    if (index === -1) return null;

    babies[index] = { ...babies[index], ...updates };
    storageService.set(BABIES_KEY, babies);
    storageService.enqueueSync('baby', 'UPDATE', babies[index]);

    return babies[index];
  }

  calculateAge(birthDateStr: string): { months: number; days: number; formatted: string; shortAge: string } {
    try {
      const birthDate = new Date(birthDateStr);
      const today = new Date();

      let months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += prevMonthDays;
      }

      if (months < 0) {
        months = 0;
        days = 0;
      }

      let formatted = '';
      if (months === 0) {
        formatted = `${days} day${days === 1 ? '' : 's'}`;
      } else if (days === 0) {
        formatted = `${months} month${months === 1 ? '' : 's'}`;
      } else {
        formatted = `${months} month${months === 1 ? '' : 's'} ${days} day${days === 1 ? '' : 's'}`;
      }

      return {
        months,
        days,
        formatted,
        shortAge: months === 0 ? `${days}d old` : `${months}m old`,
      };
    } catch {
      return { months: 3, days: 12, formatted: '3 months 12 days', shortAge: '3m old' };
    }
  }
}

export const babyService = new BabyService();
