import {
  Baby,
  FeedingRecord,
  DiaperRecord,
  SleepRecord,
  PumpingRecord,
  MedicineRecord,
  BabyNote,
  GrowthRecord,
  Milestone,
  Vaccination,
  Appointment,
  Reminder,
  MomCheckIn,
  Article,
  User,
} from '../types';

export const DEMO_USER: User = {
  id: 'user-demo-1',
  email: 'sarah.mom@example.com',
  name: 'Sarah Jenkins',
  createdAt: '2026-06-01T08:00:00Z',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  settings: {
    notificationsEnabled: true,
    units: 'metric',
    theme: 'soft-warm',
    soundEnabled: true,
  },
};

// Calculate birth date ~3 months and 12 days ago
const now = new Date();
const demoBirthDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate() - 12);

export const DEMO_BABY: Baby = {
  id: 'baby-emma-1',
  userId: 'user-demo-1',
  name: 'Emma',
  gender: 'female',
  birthDate: demoBirthDate.toISOString().split('T')[0],
  birthWeight: 3.2,
  birthHeight: 49.5,
  birthHeadCircumference: 34.0,
  avatarUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&auto=format&fit=crop&q=80',
  bloodType: 'O+',
  notes: 'Born at 39 weeks. Loves soft humming and tummy time on mom\'s chest.',
};

// Format today's dates
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const createTodayTime = (hours: number, minutes: number): string => {
  const d = new Date(today);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const INITIAL_FEEDINGS: FeedingRecord[] = [
  {
    id: 'feed-1',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(8, 0),
    feedingType: 'breastfeeding',
    side: 'both',
    durationMinutes: 15,
    notes: 'Good latch on both sides. Calm and burped well.',
  },
  {
    id: 'feed-2',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(10, 45),
    feedingType: 'breastfeeding',
    side: 'right',
    durationMinutes: 10,
    notes: 'Short feed before morning nap.',
  },
  {
    id: 'feed-3',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(13, 0),
    feedingType: 'bottle',
    amountMl: 120,
    notes: 'Expressed breast milk from bottle.',
  },
  {
    id: 'feed-4',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(15, 30),
    feedingType: 'breastfeeding',
    side: 'left',
    durationMinutes: 14,
    notes: 'Nursing session after wake-up.',
  },
  {
    id: 'feed-5',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(18, 15),
    feedingType: 'breastfeeding',
    side: 'both',
    durationMinutes: 20,
    notes: 'Evening cluster feed.',
  },
  {
    id: 'feed-6',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(20, 30),
    feedingType: 'bottle',
    amountMl: 100,
    notes: 'Bedtime bottle given by Dad.',
  },
];

export const INITIAL_DIAPERS: DiaperRecord[] = [
  {
    id: 'diaper-1',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(7, 30),
    diaperType: 'wet',
    notes: 'First morning diaper.',
  },
  {
    id: 'diaper-2',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(9, 15),
    diaperType: 'dirty',
    stoolColor: 'mustard',
    stoolConsistency: 'soft',
    rashPresent: false,
    notes: 'Normal breastfed stool.',
  },
  {
    id: 'diaper-3',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(10, 30),
    diaperType: 'wet',
  },
  {
    id: 'diaper-4',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(13, 40),
    diaperType: 'both',
    stoolColor: 'yellow',
    stoolConsistency: 'soft',
  },
  {
    id: 'diaper-5',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(16, 0),
    diaperType: 'wet',
  },
  {
    id: 'diaper-6',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(18, 50),
    diaperType: 'wet',
  },
  {
    id: 'diaper-7',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(21, 0),
    diaperType: 'wet',
    notes: 'Bedtime clean diaper with barrier cream.',
  },
];

export const INITIAL_SLEEP: SleepRecord[] = [
  {
    id: 'sleep-1',
    babyId: 'baby-emma-1',
    startTime: createTodayTime(0, 30),
    endTime: createTodayTime(6, 45),
    durationMinutes: 375, // 6h 15m
    sleepType: 'night',
    quality: 'peaceful',
    notes: 'One brief wake for pacifier at 3:30 AM.',
  },
  {
    id: 'sleep-2',
    babyId: 'baby-emma-1',
    startTime: createTodayTime(9, 30),
    endTime: createTodayTime(10, 15),
    durationMinutes: 45,
    sleepType: 'nap',
    quality: 'peaceful',
    notes: 'Morning catnap in bassinet.',
  },
  {
    id: 'sleep-3',
    babyId: 'baby-emma-1',
    startTime: createTodayTime(11, 15),
    endTime: createTodayTime(12, 0),
    durationMinutes: 45,
    sleepType: 'nap',
    quality: 'peaceful',
    notes: 'Stroller nap outdoors.',
  },
  {
    id: 'sleep-4',
    babyId: 'baby-emma-1',
    startTime: createTodayTime(14, 0),
    endTime: createTodayTime(14, 35),
    durationMinutes: 35,
    sleepType: 'nap',
    quality: 'restless',
  },
];

export const INITIAL_PUMPING: PumpingRecord[] = [
  {
    id: 'pump-1',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(9, 0),
    durationMinutes: 15,
    leftAmountMl: 65,
    rightAmountMl: 60,
    totalAmountMl: 125,
    notes: 'Morning session after feeding.',
  },
];

export const INITIAL_MEDICINE: MedicineRecord[] = [
  {
    id: 'med-1',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(8, 30),
    medicineName: 'Vitamin D3 Drops',
    dosage: '400 IU (1 drop)',
    reason: 'Daily pediatric routine',
    administeredBy: 'Mom',
    notes: 'Given directly on clean nipple before feeding.',
  },
];

export const INITIAL_NOTES: BabyNote[] = [
  {
    id: 'note-1',
    babyId: 'baby-emma-1',
    timestamp: createTodayTime(10, 0),
    title: 'Emma smiled intentionally! ❤️',
    content: 'While singing the morning sunshine song, Emma locked eyes and gave the biggest open-mouth gummy grin. Melted my heart!',
    isMilestoneMemory: true,
  },
];

export const INITIAL_GROWTH: GrowthRecord[] = [
  {
    id: 'growth-1',
    babyId: 'baby-emma-1',
    date: demoBirthDate.toISOString().split('T')[0],
    weightKg: 3.2,
    heightCm: 49.5,
    headCircumferenceCm: 34.0,
    notes: 'Birth measurement at hospital.',
  },
  {
    id: 'growth-2',
    babyId: 'baby-emma-1',
    date: new Date(demoBirthDate.getTime() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 3.4,
    heightCm: 51.0,
    headCircumferenceCm: 35.0,
    notes: '2-week checkup. Regained birth weight smoothly.',
  },
  {
    id: 'growth-3',
    babyId: 'baby-emma-1',
    date: new Date(demoBirthDate.getTime() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 4.3,
    heightCm: 53.5,
    headCircumferenceCm: 36.2,
    notes: '1-month wellness exam.',
  },
  {
    id: 'growth-4',
    babyId: 'baby-emma-1',
    date: new Date(demoBirthDate.getTime() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 5.4,
    heightCm: 57.0,
    headCircumferenceCm: 38.0,
    notes: '2-month checkup with vaccines.',
  },
  {
    id: 'growth-5',
    babyId: 'baby-emma-1',
    date: todayStr,
    weightKg: 6.1,
    heightCm: 60.5,
    headCircumferenceCm: 39.4,
    notes: '3-month home check. +0.3 kg since last week.',
  },
];

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    ageRange: '3–4 Months',
    category: 'social',
    title: 'Smile more intentionally',
    description: 'Smiles spontaneously, especially at caregivers, and tries to get your attention.',
    completed: true,
    completedDate: todayStr,
    suggestedActivities: ['Gently mirror their smiles and vocalizations', 'Play peek-a-boo with your hands'],
  },
  {
    id: 'ms-2',
    ageRange: '3–4 Months',
    category: 'cognitive',
    title: 'Follow objects with their eyes',
    description: 'Tracks moving faces or colorful toys smoothly across their field of vision.',
    completed: true,
    completedDate: todayStr,
    suggestedActivities: ['Move a high-contrast rattle slowly from side to side', 'Hold colorful board books close'],
  },
  {
    id: 'ms-3',
    ageRange: '3–4 Months',
    category: 'language',
    title: 'Make more sounds and coo',
    description: 'Begins to make playful gurgling, cooing vowel sounds (ooh, aah).',
    completed: true,
    completedDate: todayStr,
    suggestedActivities: ['Pause and wait for baby to "respond" during conversations', 'Sing gentle nursery rhymes'],
  },
  {
    id: 'ms-4',
    ageRange: '3–4 Months',
    category: 'motor',
    title: 'Improve head control',
    description: 'Holds head steady without support when held upright and pushes up on elbows during tummy time.',
    completed: false,
    suggestedActivities: ['Offer 3-5 minute tummy time sessions on a play mat 3 times daily', 'Use a rolled towel under chest for support'],
  },
  {
    id: 'ms-5',
    ageRange: '3–4 Months',
    category: 'motor',
    title: 'Bring hands toward mouth',
    description: 'Explores their own hands, brings fingers to mouth, and begins opening fists.',
    completed: true,
    completedDate: todayStr,
    suggestedActivities: ['Provide safe soft textured teething mittens or rings', 'Massage fingers gently'],
  },
  {
    id: 'ms-6',
    ageRange: '5–6 Months',
    category: 'motor',
    title: 'Roll over from tummy to back',
    description: 'Discovers how to push off with arms to roll over onto back.',
    completed: false,
    suggestedActivities: ['Place enticing toys just out of reach during floor play', 'Celebrate every roll attempt'],
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    babyId: 'baby-emma-1',
    title: 'Pediatrician appointment',
    type: 'doctor',
    date: new Date(today.getTime() + 24 * 3600 * 1000).toISOString().split('T')[0], // Tomorrow
    time: '10:00',
    repeat: 'once',
    completed: false,
    notes: '3-month wellness review and weight check at Sunrise Pediatrics.',
  },
  {
    id: 'rem-2',
    babyId: 'baby-emma-1',
    title: 'Daily Vitamin D drops',
    type: 'medicine',
    date: todayStr,
    time: '09:00',
    repeat: 'daily',
    completed: true,
    notes: '400 IU one drop.',
  },
  {
    id: 'rem-3',
    babyId: 'baby-emma-1',
    title: 'Tummy time session 2',
    type: 'custom',
    date: todayStr,
    time: '15:00',
    repeat: 'daily',
    completed: false,
    notes: '5 minutes on play mat with musical mirror.',
  },
];

export const INITIAL_CHECKINS: MomCheckIn[] = [
  {
    id: 'check-1',
    date: todayStr,
    mood: 'good',
    energyLevel: 4,
    hoursSlept: 6.5,
    waterIntakeGlasses: 6,
    notes: 'Feeling much more confident with breastfeeding latch today. Went for a sunny 20-min stroller walk.',
    gratitude: 'Morning cuddles and a warm cup of herbal tea.',
    timestamp: createTodayTime(8, 45),
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Understanding Your Baby\'s Sleep Cues in the Fourth Trimester',
    category: 'Sleep',
    readingTimeMinutes: 4,
    shortDescription: 'Spotting yawning, eye-rubbing, and subtle disengagement cues before overtiredness sets in.',
    content: [
      'Newborn sleep operates in distinct ultradian rhythms, typically running in 45 to 60 minute cycles. Unlike older children and adults, newborns spend approximately 50% of their sleep in active REM sleep.',
      'Catching your baby\'s "sleep window" is key. If you wait until full crying or arched backs appear, cortisol rises, making settling much harder.',
      'Key early tired cues include looking away (gaze aversion), slower jerky movements, quietness after a burst of activity, and reddening around the eyebrows.',
    ],
    tips: [
      'Dim the lights 15 minutes before the expected nap window.',
      'Use gentle white noise or soft "shh-shh" sounds.',
      'Consistent swaddling or sleep sack creates a reassuring sleep anchor.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
  {
    id: 'art-2',
    title: 'Cluster Feeding: Why It Happens and How to Cope',
    category: 'Breastfeeding',
    readingTimeMinutes: 5,
    shortDescription: 'Why babies nurse back-to-back in early evenings, and how this boosts milk supply naturally.',
    content: [
      'Cluster feeding often occurs between 5 PM and 10 PM. It is a completely normal physiological phenomenon, usually coinciding with major growth spurts (especially around 2-3 weeks, 6 weeks, and 3 months).',
      'It does NOT mean your breast milk supply has depleted! In fact, evening milk has a higher fat content, preparing your little one for slightly longer night stretches.',
      'The constant nursing stimulates prolactin receptors in your breast tissue, signaling your body to adjust volume to your baby\'s expanding appetite.',
    ],
    tips: [
      'Set up a nursing station with water, snacks, phone charger, and a cozy throw.',
      'Enlist your partner to handle dinner and burping between sides.',
      'Trust your body—your milk responds dynamically to demand.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
  {
    id: 'art-3',
    title: 'The Golden Rules of Infant Tummy Time',
    category: 'Development',
    readingTimeMinutes: 3,
    shortDescription: 'Fun and gentle ways to build neck, shoulder, and core strength without stress or tears.',
    content: [
      'Since the "Back to Sleep" campaign rightly reduced SIDS by placing infants on their backs, supervised tummy time while awake is vital to prevent positional plagiocephaly (flat spots) and develop postural control.',
      'Start with short, frequent bursts: 1 to 2 minutes, 3 to 4 times a day right after a diaper change when baby is alert and calm.',
      'If your baby fusses on the floor, practice "chest-to-chest" tummy time while reclining comfortably on the sofa.',
    ],
    tips: [
      'Get down at your baby\'s eye level to make it an engaging social game.',
      'Place an unbreakable baby mirror in front of them.',
      'Stop when baby shows signs of frustration or fatigue.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
  {
    id: 'art-4',
    title: 'Postpartum Emotional Recovery: The "Baby Blues" vs PPD',
    category: 'Mom\'s Wellbeing',
    readingTimeMinutes: 6,
    shortDescription: 'Distinguishing normal hormonal shifts from postpartum depression, and when to seek loving care.',
    content: [
      'Up to 80% of mothers experience the "baby blues" in the first 2 weeks after birth—sudden tearfulness, mood swings, anxiety, and feeling overwhelmed due to the steep drop in estrogen and progesterone combined with sleep deprivation.',
      'Baby blues typically peak around day 4 to 5 and subside by week 2 or 3. If sadness, severe anxiety, feeling detached from your baby, or intrusive hopeless thoughts persist past 2 weeks, it may be Postpartum Depression (PPD) or Postpartum Anxiety (PPA).',
      'Remember: PPD is a medical condition, not a personal failure, and it responds exceptionally well to compassionate support, therapy, and medical guidance.',
    ],
    tips: [
      'Speak openly to your obstetrician, midwife, or primary care provider.',
      'National Maternal Mental Health Hotline (US): Call or text 1-833-943-5746 (1-833-9-HELP4MOMS).',
      'Never hesitate to tell your loved ones when you need rest or feel overwhelmed.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
  {
    id: 'art-5',
    title: 'Decoding Diaper Colors: What Is Healthy and What to Check',
    category: 'Baby Care',
    readingTimeMinutes: 4,
    shortDescription: 'A guide to newborn stool transitions from meconium to mustard yellow, and red-flag colors.',
    content: [
      'During the first week, stools transition from thick black/green meconium to transitional greenish-brown, and finally to mustard yellow with small seed-like granules in exclusively breastfed infants.',
      'Formula-fed babies often have firmer, peanut-butter-like stools that range from light tan to olive green.',
      'Red-flag colors that require immediate pediatric evaluation: chalky white or clay-colored stools (can indicate biliary issue), red/blood-streaked stools, or black tarry stools after the first week.',
    ],
    tips: [
      '6+ wet diapers a day indicates adequate hydration.',
      'Stool frequency varies widely—some breastfed infants go multiple times a day, others once every few days.',
      'When in doubt, snap a photo to show your pediatrician.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
  {
    id: 'art-6',
    title: 'Infant Safe Sleep Guidelines: Creating a Secure Haven',
    category: 'Safety',
    readingTimeMinutes: 4,
    shortDescription: 'AAP recommended guidelines for the crib, room sharing, swaddling, and room temperature.',
    content: [
      'The American Academy of Pediatrics (AAP) recommends the ABCs of safe sleep: Alone, on their Back, in a bare Crib, bassinet, or play yard.',
      'The mattress should be firm and flat with a fitted sheet. No soft bedding, loose blankets, bumper pads, or plush toys in the sleep space.',
      'Room-sharing (keeping baby\'s crib in parents\' bedroom) is recommended for at least the first 6 months, significantly reducing SIDS risk.',
    ],
    tips: [
      'Keep room temperature comfortable (68°F to 72°F / 20°C to 22°C).',
      'Dress baby in one more layer than you would wear comfortably.',
      'Cease swaddling as soon as baby shows signs of rolling.',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&auto=format&fit=crop&q=80',
    medicalReviewed: true,
  },
];

export const DEMO_ARTICLES = INITIAL_ARTICLES;

