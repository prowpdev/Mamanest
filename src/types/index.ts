// Core Domain Types & Interfaces for MamaNest

export type UserRole = 'admin' | 'mom' | 'partner' | 'caregiver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  status?: 'active' | 'suspended';
  setupWizardCompleted?: boolean;
  settings?: UserSettings;
  phone?: string;
  lastLoginAt?: string;
  assignedBabyIds?: string[];
  notes?: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  units: 'metric' | 'imperial'; // kg/cm vs lb/inch
  theme: 'soft-warm' | 'soft-rose' | 'soft-sage';
  soundEnabled: boolean;
}

export interface MomProfile {
  id: string;
  userId: string;
  name: string;
  dueDateOrBirthDate?: string;
  deliveryType?: 'vaginal' | 'c-section' | 'other';
  feedingPreference?: 'breastfeeding' | 'formula' | 'combo' | 'pumping';
  recoveryNotes?: string;
}

export type Gender = 'female' | 'male' | 'other';

export interface Baby {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  birthDate: string; // ISO date string
  birthWeight?: number; // kg
  birthHeight?: number; // cm
  birthHeadCircumference?: number; // cm
  avatarUrl?: string;
  bloodType?: string;
  notes?: string;
  pediatricianName?: string;
  birthWeightKg?: number;
  birthHeightCm?: number;
}

// Activity Types
export type ActivityType = 'feeding' | 'diaper' | 'sleep' | 'pumping' | 'medicine' | 'note';

export type FeedingType = 'breastfeeding' | 'bottle' | 'formula' | 'solids';
export type BreastSide = 'left' | 'right' | 'both';

export interface FeedingRecord {
  id: string;
  babyId: string;
  timestamp: string; // ISO string
  feedingType: FeedingType;
  side?: BreastSide;
  durationMinutes?: number; // for nursing
  amountMl?: number; // for bottle/formula/solids
  foodType?: string; // for solids
  notes?: string;
}

export type DiaperType = 'wet' | 'dirty' | 'both';
export type StoolConsistency = 'liquid' | 'soft' | 'formed' | 'hard';
export type StoolColor = 'yellow' | 'mustard' | 'green' | 'brown' | 'dark';

export interface DiaperRecord {
  id: string;
  babyId: string;
  timestamp: string;
  diaperType: DiaperType;
  stoolColor?: StoolColor;
  stoolConsistency?: StoolConsistency;
  rashPresent?: boolean;
  notes?: string;
}

export interface SleepRecord {
  id: string;
  babyId: string;
  startTime: string;
  endTime?: string;
  durationMinutes: number;
  sleepType: 'nap' | 'night';
  quality?: 'peaceful' | 'fussy' | 'restless';
  notes?: string;
}

export interface PumpingRecord {
  id: string;
  babyId: string;
  timestamp: string;
  durationMinutes?: number;
  leftAmountMl: number;
  rightAmountMl: number;
  totalAmountMl: number;
  notes?: string;
}

export interface MedicineRecord {
  id: string;
  babyId: string;
  timestamp: string;
  medicineName: string;
  dosage: string;
  reason?: string;
  administeredBy?: string;
  notes?: string;
}

export interface BabyNote {
  id: string;
  babyId: string;
  timestamp: string;
  title: string;
  content: string;
  isMilestoneMemory?: boolean;
  photoUrl?: string;
}

// Generic unified activity item for lists & feeds
export interface UnifiedActivity {
  id: string;
  babyId: string;
  type: ActivityType;
  timestamp: string;
  title: string;
  subtitle: string;
  detail?: string;
  iconName: string;
  badgeColor: string;
  rawPayload: FeedingRecord | DiaperRecord | SleepRecord | PumpingRecord | MedicineRecord | BabyNote;
}

// Growth Measurement Record
export interface GrowthRecord {
  id: string;
  babyId: string;
  date: string;
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  notes?: string;
}

// Developmental Milestones
export type MilestoneCategory = 'motor' | 'social' | 'cognitive' | 'language' | 'sensory' | 'other';
export type MilestoneStatus = 'due' | 'upcoming' | 'completed' | 'overdue';

export interface Milestone {
  id: string;
  babyId?: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  ageRange: string; // e.g. "0–2 Months", "3–4 Months", "5–6 Months"
  minAgeMonths?: number;
  maxAgeMonths?: number;
  targetAge?: string; // target age or date representation
  targetDate?: string; // YYYY-MM-DD
  status?: MilestoneStatus;
  completed: boolean;
  completedDate?: string;
  notes?: string;
  suggestedActivities: string[];
}

// Vaccinations & Healthcare Visits
export type VaccinationStatus = 'scheduled' | 'due' | 'upcoming' | 'completed' | 'missed' | 'overdue';

export interface Vaccination {
  id: string;
  babyId: string;
  name: string;
  category?: string;
  doseNumber?: string;
  recommendedAge: string;
  recommendedAgeMonths?: number;
  scheduledDate?: string;
  administeredDate?: string;
  status: VaccinationStatus;
  clinic?: string;
  providerName?: string;
  notes?: string;
}

export type VisitType =
  | 'Pediatric Checkup'
  | 'Vaccination'
  | 'Growth Monitoring'
  | 'Dental'
  | 'Emergency'
  | 'Sick Visit'
  | 'Follow-up'
  | 'Other';

export interface HealthcareVisit {
  id: string;
  babyId: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  visitType: VisitType;
  doctorName: string; // Healthcare provider
  clinic: string; // Clinic / Hospital
  reasonForVisit: string;
  weightKg?: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  temperatureC?: number;
  notes?: string;
  diagnosis?: string;
  followUpDate?: string;
  followUpNotes?: string;
  completed?: boolean;
  // Backward compatibility fields
  title?: string;
  location?: string;
  dateTime?: string;
}

export type Appointment = HealthcareVisit;

// Reminders
export type ReminderType = 'vaccination' | 'doctor' | 'medicine' | 'feeding' | 'custom';
export type RepeatSchedule = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Reminder {
  id: string;
  babyId: string;
  title: string;
  type: ReminderType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  repeat: RepeatSchedule;
  completed: boolean;
  notes?: string;
}

// Mom's Wellbeing
export type MomMood = 'great' | 'good' | 'okay' | 'low' | 'difficult';

export interface MomCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  mood: MomMood;
  energyLevel: number; // 1 to 5
  hoursSlept: number;
  waterIntakeGlasses?: number;
  notes?: string;
  gratitude?: string;
  timestamp: string;
}

// Educational Articles
export type ArticleCategory =
  | 'Newborn'
  | 'Feeding'
  | 'Breastfeeding'
  | 'Sleep'
  | 'Development'
  | 'Baby Care'
  | 'Safety'
  | 'Postpartum'
  | "Mom's Wellbeing";

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  shortDescription: string;
  content: string[];
  tips: string[];
  imageUrl?: string;
  medicalReviewed: boolean;
}

// AI Conversation
export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  disclaimer?: string;
  suggestedFollowUps?: string[];
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
}
