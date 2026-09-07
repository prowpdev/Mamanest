import { MomCheckIn } from '../types';
import { storageService } from './storageService';
import { INITIAL_CHECKINS } from '../data/demoData';

const CHECKINS_KEY = 'mom_checkins';

const AFFIRMATIONS = [
  "You're doing an amazing job, Mom ❤️ Every cuddle and comforting breath matters.",
  "Taking care of yourself is taking care of your baby. Give yourself grace today.",
  "Slow down and breathe. You and your baby are learning this dance together.",
  "Small moments of peace add up. Celebrate keeping your baby safe and loved.",
  "Trust your maternal instinct. You are the exact mother your baby needs.",
];

class WellbeingService {
  getCheckIns(): MomCheckIn[] {
    return storageService.get<MomCheckIn[]>(CHECKINS_KEY, INITIAL_CHECKINS);
  }

  getTodayCheckIn(): MomCheckIn | undefined {
    const todayStr = new Date().toISOString().split('T')[0];
    const all = this.getCheckIns();
    return all.find((c) => c.date === todayStr);
  }

  saveCheckIn(checkIn: Omit<MomCheckIn, 'id' | 'timestamp'>): MomCheckIn {
    const all = this.getCheckIns();
    const existingIndex = all.findIndex((c) => c.date === checkIn.date);

    const record: MomCheckIn = {
      ...checkIn,
      id: existingIndex >= 0 ? all[existingIndex].id : `check_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = record;
    } else {
      all.unshift(record);
    }

    storageService.set(CHECKINS_KEY, all);
    storageService.enqueueSync('mom_checkin', existingIndex >= 0 ? 'UPDATE' : 'CREATE', record);
    return record;
  }

  getRandomAffirmation(): string {
    const index = Math.floor(Math.random() * AFFIRMATIONS.length);
    return AFFIRMATIONS[index];
  }
}

export const wellbeingService = new WellbeingService();
