import { Reminder } from '../types';
import { storageService } from './storageService';
import { INITIAL_REMINDERS } from '../data/demoData';

const REMINDERS_KEY = 'baby_reminders';

class ReminderService {
  getReminders(babyId: string): Reminder[] {
    const all = storageService.get<Reminder[]>(REMINDERS_KEY, INITIAL_REMINDERS) || [];
    return all.filter((r) => r.babyId === babyId);
  }

  getUpcomingReminders(babyId: string): Reminder[] {
    const list = this.getReminders(babyId) || [];
    return list.filter((r) => !r.completed);
  }

  addReminder(reminder: Omit<Reminder, 'id'>): Reminder {
    const all = storageService.get<Reminder[]>(REMINDERS_KEY, INITIAL_REMINDERS) || [];
    const newReminder: Reminder = {
      ...reminder,
      id: `rem_${Date.now()}`,
    };
    all.unshift(newReminder);
    storageService.set(REMINDERS_KEY, all);
    storageService.enqueueSync('reminder', 'CREATE', newReminder);
    return newReminder;
  }

  toggleReminder(id: string): Reminder | null {
    const all = storageService.get<Reminder[]>(REMINDERS_KEY, INITIAL_REMINDERS) || [];
    const index = all.findIndex((r) => r.id === id);
    if (index === -1) return null;

    all[index].completed = !all[index].completed;
    storageService.set(REMINDERS_KEY, all);
    storageService.enqueueSync('reminder', 'UPDATE', all[index]);
    return all[index];
  }

  deleteReminder(id: string): boolean {
    const all = storageService.get<Reminder[]>(REMINDERS_KEY, INITIAL_REMINDERS) || [];
    const filtered = all.filter((r) => r.id !== id);
    storageService.set(REMINDERS_KEY, filtered);
    storageService.enqueueSync('reminder', 'DELETE', { id });
    return true;
  }
}

export const reminderService = new ReminderService();
