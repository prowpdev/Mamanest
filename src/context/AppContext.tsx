import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User,
  Baby,
  ActivityType,
  FeedingRecord,
  DiaperRecord,
  SleepRecord,
  PumpingRecord,
  MedicineRecord,
  BabyNote,
  UnifiedActivity,
  Reminder,
  MomCheckIn,
} from '../types';
import { authService } from '../services/authService';
import { babyService } from '../services/babyService';
import { trackingService } from '../services/trackingService';
import { reminderService } from '../services/reminderService';
import { wellbeingService } from '../services/wellbeingService';
import { storageService } from '../services/storageService';

interface ToastState {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeBaby: Baby;
  babies: Baby[];
  todaySummary: {
    feedingCount: number;
    feedingTotalMl: number;
    sleepTotalMinutes: number;
    sleepFormatted: string;
    diaperCount: number;
    medicineCount: number;
  };
  activities: UnifiedActivity[];
  notes: BabyNote[];
  reminders: Reminder[];
  todayCheckIn?: MomCheckIn;
  toast: ToastState | null;
  syncPendingCount: number;

  // Modals & Sheets state
  isLoggerOpen: boolean;
  activeLoggerTab: ActivityType;
  openLogger: (initialTab?: ActivityType) => void;
  closeLogger: () => void;

  isMamaAIOpen: boolean;
  openMamaAI: () => void;
  closeMamaAI: () => void;

  isCheckInOpen: boolean;
  openCheckIn: () => void;
  closeCheckIn: () => void;

  // Actions
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchBaby: (id: string) => void;
  createBaby: (data: Omit<Baby, 'id' | 'userId'>) => Baby;
  addBaby: (data: Omit<Baby, 'id' | 'userId'>) => Baby;
  updateBaby: (idOrBaby: string | Partial<Baby>, updates?: Partial<Baby>) => void;

  // Tracking operations
  logFeeding: (data: Omit<FeedingRecord, 'id' | 'babyId'>) => void;
  logDiaper: (data: Omit<DiaperRecord, 'id' | 'babyId'>) => void;
  logSleep: (data: Omit<SleepRecord, 'id' | 'babyId'>) => void;
  logPumping: (data: Omit<PumpingRecord, 'id' | 'babyId'>) => void;
  logMedicine: (data: Omit<MedicineRecord, 'id' | 'babyId'>) => void;
  logNote: (data: Omit<BabyNote, 'id' | 'babyId'>) => void;
  deleteActivity: (type: ActivityType, id: string) => void;

  // Reminder operations
  addReminder: (data: Omit<Reminder, 'id' | 'babyId'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Mom check-in
  saveMomCheckIn: (data: Omit<MomCheckIn, 'id' | 'timestamp'>) => void;

  // UI Toast
  showToast: (message: string, options?: { type?: 'success' | 'info' | 'error'; actionLabel?: string; onAction?: () => void }) => void;
  hideToast: () => void;

  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState(() => authService.getAuthState());
  const [babies, setBabies] = useState<Baby[]>(() => babyService.getBabies());
  const [activeBaby, setActiveBaby] = useState<Baby>(() => babyService.getActiveBaby());

  const [activities, setActivities] = useState<UnifiedActivity[]>([]);
  const [notes, setNotes] = useState<BabyNote[]>([]);
  const [todaySummary, setTodaySummary] = useState({
    feedingCount: 0,
    feedingTotalMl: 0,
    sleepTotalMinutes: 0,
    sleepFormatted: '0h 00m',
    diaperCount: 0,
    medicineCount: 0,
  });
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<MomCheckIn | undefined>(undefined);
  const [syncPendingCount, setSyncPendingCount] = useState<number>(() => storageService.getPendingSyncCount());

  // Sheets state
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);
  const [activeLoggerTab, setActiveLoggerTab] = useState<ActivityType>('feeding');
  const [isMamaAIOpen, setIsMamaAIOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  // Last deleted item for undo
  const [lastDeletedItem, setLastDeletedItem] = useState<{ type: ActivityType; payload: any } | null>(null);

  const refreshData = useCallback(() => {
    if (!activeBaby?.id) return;
    const currentActivities = trackingService.getUnifiedActivities(activeBaby.id) || [];
    setActivities(currentActivities);
    setNotes(trackingService.getNotes(activeBaby.id) || []);
    setTodaySummary(trackingService.getTodaySummary(activeBaby.id));
    setReminders(reminderService.getReminders(activeBaby.id) || []);
    setTodayCheckIn(wellbeingService.getTodayCheckIn());
    setBabies(babyService.getBabies() || []);
    setSyncPendingCount(storageService.getPendingSyncCount());
  }, [activeBaby?.id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const showToast = (
    message: string,
    options?: { type?: 'success' | 'info' | 'error'; actionLabel?: string; onAction?: () => void }
  ) => {
    const id = `toast_${Date.now()}`;
    setToast({
      id,
      message,
      type: options?.type || 'success',
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  const openLogger = (initialTab?: ActivityType) => {
    if (initialTab) setActiveLoggerTab(initialTab);
    setIsLoggerOpen(true);
  };

  const closeLogger = () => {
    setIsLoggerOpen(false);
  };

  const openMamaAI = () => setIsMamaAIOpen(true);
  const closeMamaAI = () => setIsMamaAIOpen(false);

  const openCheckIn = () => setIsCheckInOpen(true);
  const closeCheckIn = () => setIsCheckInOpen(false);

  // Auth
  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.success && res.user) {
      setAuthState(authService.getAuthState());
      refreshData();
    }
    return res;
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await authService.register(name, email, pass);
    if (res.success && res.user) {
      setAuthState(authService.getAuthState());
      refreshData();
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setAuthState({ isAuthenticated: false, user: null, token: null });
  };

  // Baby
  const switchBaby = (id: string) => {
    babyService.setActiveBaby(id);
    const baby = babyService.getActiveBaby();
    setActiveBaby(baby);
  };

  const createBaby = (data: Omit<Baby, 'id' | 'userId'>) => {
    const created = babyService.createBaby(data);
    setBabies(babyService.getBabies());
    setActiveBaby(created);
    showToast(`Baby ${created.name} added!`);
    return created;
  };

  const updateBaby = (idOrBaby: string | Partial<Baby>, updates?: Partial<Baby>) => {
    let id: string;
    let patch: Partial<Baby>;
    if (typeof idOrBaby === 'string') {
      id = idOrBaby;
      patch = updates || {};
    } else {
      id = (idOrBaby as any).id || activeBaby.id;
      patch = idOrBaby;
    }
    const updated = babyService.updateBaby(id, patch);
    if (updated) {
      setBabies(babyService.getBabies());
      if (activeBaby.id === id) {
        setActiveBaby(updated);
      }
      showToast('Profile updated!');
    }
  };

  // Logging
  const logFeeding = (data: Omit<FeedingRecord, 'id' | 'babyId'>) => {
    trackingService.addFeeding({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Feeding recorded! 🍼', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getFeedings(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('feeding', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const logDiaper = (data: Omit<DiaperRecord, 'id' | 'babyId'>) => {
    trackingService.addDiaper({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Diaper recorded! 💧', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getDiapers(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('diaper', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const logSleep = (data: Omit<SleepRecord, 'id' | 'babyId'>) => {
    trackingService.addSleep({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Sleep recorded! 😴', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getSleep(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('sleep', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const logPumping = (data: Omit<PumpingRecord, 'id' | 'babyId'>) => {
    trackingService.addPumping({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Pumping recorded! 🍼', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getPumping(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('pumping', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const logMedicine = (data: Omit<MedicineRecord, 'id' | 'babyId'>) => {
    trackingService.addMedicine({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Medicine recorded! 💊', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getMedicine(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('medicine', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const logNote = (data: Omit<BabyNote, 'id' | 'babyId'>) => {
    trackingService.addNote({ ...data, babyId: activeBaby.id });
    refreshData();
    closeLogger();
    showToast('Note saved! 📝', {
      actionLabel: 'Undo',
      onAction: () => {
        const list = trackingService.getNotes(activeBaby.id);
        if (list[0]) {
          trackingService.deleteActivity('note', list[0].id);
          refreshData();
          showToast('Undone');
        }
      },
    });
  };

  const deleteActivity = (type: ActivityType, id: string) => {
    const item = activities.find((a) => a.id === id);
    if (item) {
      setLastDeletedItem({ type, payload: item.rawPayload });
    }
    trackingService.deleteActivity(type, id);
    refreshData();
    showToast('Activity removed', {
      actionLabel: 'Undo',
      onAction: () => {
        if (lastDeletedItem) {
          if (lastDeletedItem.type === 'feeding') trackingService.addFeeding(lastDeletedItem.payload);
          if (lastDeletedItem.type === 'diaper') trackingService.addDiaper(lastDeletedItem.payload);
          if (lastDeletedItem.type === 'sleep') trackingService.addSleep(lastDeletedItem.payload);
          if (lastDeletedItem.type === 'pumping') trackingService.addPumping(lastDeletedItem.payload);
          if (lastDeletedItem.type === 'medicine') trackingService.addMedicine(lastDeletedItem.payload);
          if (lastDeletedItem.type === 'note') trackingService.addNote(lastDeletedItem.payload);
          refreshData();
          showToast('Restored activity');
        }
      },
    });
  };

  // Reminders
  const addReminder = (data: Omit<Reminder, 'id' | 'babyId'>) => {
    reminderService.addReminder({ ...data, babyId: activeBaby.id });
    refreshData();
    showToast('Reminder scheduled! ⏰');
  };

  const toggleReminder = (id: string) => {
    reminderService.toggleReminder(id);
    refreshData();
  };

  const deleteReminder = (id: string) => {
    reminderService.deleteReminder(id);
    refreshData();
    showToast('Reminder deleted');
  };

  // Mom check-in
  const saveMomCheckIn = (data: Omit<MomCheckIn, 'id' | 'timestamp'>) => {
    wellbeingService.saveCheckIn(data);
    setTodayCheckIn(wellbeingService.getTodayCheckIn());
    setIsCheckInOpen(false);
    showToast("Check-in saved! You're doing great, Mom ❤️");
  };

  return (
    <AppContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        activeBaby,
        babies,
        todaySummary,
        activities,
        notes,
        reminders,
        todayCheckIn,
        toast,
        syncPendingCount,
        isLoggerOpen,
        activeLoggerTab,
        openLogger,
        closeLogger,
        isMamaAIOpen,
        openMamaAI,
        closeMamaAI,
        isCheckInOpen,
        openCheckIn,
        closeCheckIn,
        login,
        register,
        logout,
        switchBaby,
        createBaby,
        addBaby: createBaby,
        updateBaby,
        logFeeding,
        logDiaper,
        logSleep,
        logPumping,
        logMedicine,
        logNote,
        deleteActivity,
        addReminder,
        toggleReminder,
        deleteReminder,
        saveMomCheckIn,
        showToast,
        hideToast,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
