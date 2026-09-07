import React, { useState } from 'react';
import { Heart, PhoneCall, Sparkles } from 'lucide-react';
import { MomMood } from '../../types';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { wellbeingService } from '../../services/wellbeingService';

export const MomCheckInSheet: React.FC = () => {
  const { isCheckInOpen, closeCheckIn, saveMomCheckIn, todayCheckIn } = useApp();

  const [mood, setMood] = useState<MomMood>(todayCheckIn?.mood || 'good');
  const [energyLevel, setEnergyLevel] = useState<number>(todayCheckIn?.energyLevel || 3);
  const [hoursSlept, setHoursSlept] = useState<number>(todayCheckIn?.hoursSlept || 6);
  const [notes, setNotes] = useState<string>(todayCheckIn?.notes || '');
  const [gratitude, setGratitude] = useState<string>(todayCheckIn?.gratitude || '');

  const todayStr = new Date().toISOString().split('T')[0];

  const moods: { id: MomMood; label: string; emoji: string; color: string }[] = [
    { id: 'great', label: 'Great', emoji: '😊', color: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
    { id: 'good', label: 'Good', emoji: '🙂', color: 'bg-teal-50 border-teal-300 text-teal-800' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: 'bg-amber-50 border-amber-300 text-amber-800' },
    { id: 'low', label: 'Low', emoji: '😔', color: 'bg-orange-50 border-orange-300 text-orange-800' },
    { id: 'difficult', label: 'Difficult', emoji: '😣', color: 'bg-rose-50 border-rose-300 text-rose-800' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMomCheckIn({
      date: todayStr,
      mood,
      energyLevel,
      hoursSlept,
      notes: notes.trim() || undefined,
      gratitude: gratitude.trim() || undefined,
    });
  };

  const isDistressed = mood === 'low' || mood === 'difficult';

  return (
    <BottomSheet
      isOpen={isCheckInOpen}
      onClose={closeCheckIn}
      title="Mom's Daily Check-in ❤️"
      subtitle="Your wellbeing matters just as much as baby's"
      maxHeight="max-h-[92vh]"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Affirmation snippet */}
        <div className="p-3.5 bg-rose-50/80 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-rose-900">
          <Sparkles className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-xs font-medium leading-relaxed italic">
            "{wellbeingService.getRandomAffirmation()}"
          </p>
        </div>

        {/* Mood Selector */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-2">
            How are you feeling today, Mom?
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                id={`mood-btn-${m.id}`}
                onClick={() => setMood(m.id)}
                className={`py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  mood === m.id
                    ? `${m.color} ring-2 ring-rose-400 shadow-2xs font-bold`
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[10px] truncate">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Supportive Emergency/Helpline notice if low or difficult */}
        {isDistressed && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs font-display">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>We're holding space for you, Mom ❤️</span>
            </div>
            <p className="text-[11px] text-rose-900 leading-relaxed">
              Motherhood can be exhausting and emotionally overwhelming. If you feel persistently anxious, sad, or need a listening ear, please speak with your doctor or reach out to compassionate support:
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Maternal Mental Health Helpline: 1-833-943-5746 (Call/Text, 24/7)</span>
            </div>
          </div>
        )}

        {/* Energy Level 1-5 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-700">Energy Level (1–5)</label>
            <span className="text-xs font-bold text-rose-600">
              {energyLevel === 1
                ? 'Exhausted'
                : energyLevel === 2
                ? 'Tired'
                : energyLevel === 3
                ? 'Moderate'
                : energyLevel === 4
                ? 'Good'
                : 'Energized'}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEnergyLevel(lvl)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  energyLevel === lvl
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Hours Slept */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-stone-700">Total Sleep You Got (Hours)</label>
            <span className="text-xs font-bold text-rose-600">{hoursSlept} hours</span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            step="0.5"
            value={hoursSlept}
            onChange={(e) => setHoursSlept(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            How was your day? (Notes)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share feelings, challenges, or baby wins..."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white resize-none"
          />
        </div>

        {/* Gratitude */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            One Small Thing You're Grateful For Today ✨
          </label>
          <input
            type="text"
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="e.g. A hot cup of tea, baby's morning smile"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          id="save-checkin-btn"
          className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
        >
          Save Daily Check-in
        </button>
      </form>
    </BottomSheet>
  );
};
