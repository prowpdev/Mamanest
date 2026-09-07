import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Baby as BabyIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bell,
  Calendar,
  Smile,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';

export const SetupWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeBaby, updateBaby, completeSetupWizard, showToast } = useApp();

  const [step, setStep] = useState<number>(1);

  // Step 1: Mother / Parent Focus
  const [parentName, setParentName] = useState<string>(user?.name || '');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'feeding',
    'sleep',
    'wellbeing',
  ]);

  // Step 2: Baby Profile Setup
  const [babyName, setBabyName] = useState<string>(activeBaby?.name || 'Emma');
  const [gender, setGender] = useState<Gender>(activeBaby?.gender || 'female');
  const [birthDate, setBirthDate] = useState<string>(
    activeBaby?.birthDate || new Date().toISOString().split('T')[0]
  );
  const [birthWeight, setBirthWeight] = useState<string>(
    activeBaby?.birthWeight ? String(activeBaby.birthWeight) : '3.3'
  );
  const [birthHeight, setBirthHeight] = useState<string>(
    activeBaby?.birthHeight ? String(activeBaby.birthHeight) : '50'
  );
  const [pediatrician, setPediatrician] = useState<string>(
    activeBaby?.pediatricianName || 'Dr. Emily Vance, MD'
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    activeBaby?.avatarUrl ||
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'
  );

  // Step 3: Schedule & Gentle Reminders
  const [feedInterval, setFeedInterval] = useState<string>('2.5');
  const [checkInTime, setCheckInTime] = useState<string>('20:00');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dailyDigest, setDailyDigest] = useState<boolean>(true);

  const prioritiesList = [
    { id: 'feeding', title: 'Feeding & Nursing', desc: 'Breast, bottle, pumping logs', emoji: '🍼' },
    { id: 'sleep', title: 'Sleep & Wake Windows', desc: 'Naps, night sleep, soothing cues', emoji: '😴' },
    { id: 'diaper', title: 'Diapers & Hydration', desc: 'Wet/dirty output monitoring', emoji: '💧' },
    { id: 'wellbeing', title: 'Mother Wellbeing', desc: 'Emotional check-ins & recovery', emoji: '🌸' },
    { id: 'milestones', title: 'Growth & Milestones', desc: 'Pediatric charts and memory notes', emoji: '⭐' },
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&q=80&w=400',
  ];

  const togglePriority = (id: string) => {
    if (selectedPriorities.includes(id)) {
      if (selectedPriorities.length > 1) {
        setSelectedPriorities(selectedPriorities.filter((p) => p !== id));
      }
    } else {
      setSelectedPriorities([...selectedPriorities, id]);
    }
  };

  const handleFinishWizard = () => {
    // Update baby with wizard input
    if (activeBaby?.id) {
      updateBaby(activeBaby.id, {
        name: babyName.trim() || 'Emma',
        gender,
        birthDate,
        birthWeight: parseFloat(birthWeight) || 3.3,
        birthHeight: parseFloat(birthHeight) || 50,
        pediatricianName: pediatrician.trim(),
        avatarUrl: selectedAvatar,
      });
    }

    completeSetupWizard();
    showToast('Setup complete! Welcome to MamaNest 💕');
    navigate('/');
  };

  const handleSkip = () => {
    completeSetupWizard();
    showToast('Guide skipped. You can revisit this anytime in Settings!');
    navigate('/');
  };

  return (
    <main
      id="setup-wizard-screen"
      className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-4 max-w-md mx-auto"
    >
      {/* Top Bar with Step Progress */}
      <header className="pt-2 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-4 h-4 fill-white stroke-none" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 font-display block">MamaNest Setup Guide</span>
              <span className="text-[10px] text-stone-500">Step {step} of 4</span>
            </div>
          </div>

          <button
            id="wizard-skip-btn"
            onClick={handleSkip}
            className="text-xs font-semibold text-stone-400 hover:text-stone-700 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Skip Guide
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-rose-500' : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Main Step Content */}
      <div className="my-auto py-2">
        {/* STEP 1: Mother / Parent Welcome & Focus */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-rose-500" />
                Personalized Nest Guide
              </span>
              <h1 className="text-2xl font-black text-stone-900 font-display">
                Welcome, {parentName || 'Mama'}!
              </h1>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Let's tailor MamaNest to your family's daily rhythms so you feel calm, supported, and organized.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  How should MamaNest address you?
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g., Sarah, Mama, Michael"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  What are your top priorities this month?
                </label>
                <div className="space-y-2">
                  {prioritiesList.map((item) => {
                    const isChecked = selectedPriorities.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => togglePriority(item.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-rose-50/70 border-rose-300 text-stone-900 shadow-2xs'
                            : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{item.emoji}</span>
                          <div>
                            <span className="text-xs font-bold block">{item.title}</span>
                            <span className="text-[11px] text-stone-500">{item.desc}</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            isChecked
                              ? 'bg-rose-500 border-rose-500 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Baby Profile Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                <BabyIcon className="w-3 h-3 text-amber-600" />
                Baby Profile
              </span>
              <h2 className="text-2xl font-black text-stone-900 font-display">
                Tell us about your little one
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                We'll calculate age-appropriate wake windows, feeding milestones, and vaccination reminders.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-3.5">
              {/* Avatar presets */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Choose Avatar / Photo</label>
                <div className="flex items-center justify-center gap-3">
                  {avatarOptions.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative rounded-2xl overflow-hidden p-0.5 border-2 transition-transform cursor-pointer ${
                        selectedAvatar === url ? 'border-rose-500 scale-105' : 'border-transparent opacity-70'
                      }`}
                    >
                      <img
                        src={url}
                        alt="Baby avatar option"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Baby's Name</label>
                <input
                  type="text"
                  required
                  value={babyName}
                  onChange={(e) => setBabyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                  >
                    <option value="female">Baby Girl</option>
                    <option value="male">Baby Boy</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Birth Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={birthWeight}
                    onChange={(e) => setBirthWeight(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Birth Length (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={birthHeight}
                    onChange={(e) => setBirthHeight(e.target.value)}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pediatrician Name (Optional)</label>
                <input
                  type="text"
                  value={pediatrician}
                  onChange={(e) => setPediatrician(e.target.value)}
                  placeholder="e.g. Dr. Emily Vance, MD"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Daily Rhythm & Notifications */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-teal-600" />
                Rhythm & Gentle Alerts
              </span>
              <h2 className="text-2xl font-black text-stone-900 font-display">
                Set your daily cadence
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                MamaNest provides gentle nudges without stress or alarm-clock fatigue.
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Feeding Reminder Cadence
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '2.5 hrs', val: '2.5' },
                    { label: '3.0 hrs', val: '3' },
                    { label: 'On-Demand', val: '0' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setFeedInterval(opt.val)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        feedInterval === opt.val
                          ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mom Mindful Check-in Prompt
                </label>
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-100 shrink-0" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-stone-800 block">Evening Wellness Check</span>
                    <span className="text-[10px] text-stone-500">Track postpartum mood, energy & hydration</span>
                  </div>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-1 divide-y divide-stone-100">
                <label className="flex items-center justify-between cursor-pointer pt-2">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Gentle Sound & Chimes</span>
                    <span className="text-[10px] text-stone-400">Soft acoustic feedback upon saving logs</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer pt-2">
                  <div>
                    <span className="text-xs font-bold text-stone-800 block">Daily Morning Digest</span>
                    <span className="text-[10px] text-stone-400">Wake-window summary & pediatrician tips</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="w-4 h-4 accent-rose-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Quick Tour & Ready to Launch */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-200">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-stone-900 font-display">
                You're All Set!
              </h2>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Here is a quick look at your MamaNest companion superpowers:
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-2xs space-y-2.5">
              <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-start gap-3">
                <div className="p-2 bg-rose-500 text-white rounded-xl text-xs font-bold">1</div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">One-Tap Quick Logging</h3>
                  <p className="text-[11px] text-stone-600">
                    Tap the middle <strong>Track (+)</strong> button to record feeds, diapers, or sleep in under 3 seconds.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl text-xs font-bold">2</div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Baby Profile & Growth Charts</h3>
                  <p className="text-[11px] text-stone-600">
                    Track weight percentiles, pediatric milestones, and store cute photo milestones safely.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-3">
                <div className="p-2 bg-teal-500 text-white rounded-xl text-xs font-bold">3</div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Mother Care & Check-In</h3>
                  <p className="text-[11px] text-stone-600">
                    Because your physical and emotional wellbeing is just as important as baby care.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                <div className="p-2 bg-purple-600 text-white rounded-xl text-xs font-bold">4</div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900">Mama AI Clinical Guidance</h3>
                  <p className="text-[11px] text-stone-600">
                    Friendly, evidence-based answers at 2:00 AM whenever you have newborn questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <footer className="pt-4 pb-2 space-y-2">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              id="wizard-prev-btn"
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="py-3 px-4 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {step < 4 ? (
            <button
              id="wizard-next-btn"
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="wizard-finish-btn"
              type="button"
              onClick={handleFinishWizard}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Complete Setup & Enter Nest</span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
};
