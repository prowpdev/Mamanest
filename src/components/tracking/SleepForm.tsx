import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface SleepFormProps {
  onSuccess?: () => void;
}

export const SleepForm: React.FC<SleepFormProps> = ({ onSuccess }) => {
  const { logSleep } = useApp();

  const [sleepType, setSleepType] = useState<'nap' | 'night'>('nap');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [quality, setQuality] = useState<'peaceful' | 'fussy' | 'restless'>('peaceful');
  const [notes, setNotes] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const end = new Date();
    const start = new Date(end.getTime() - durationMinutes * 60 * 1000);

    logSleep({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationMinutes,
      sleepType,
      quality,
      notes: notes.trim() || undefined,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Nap vs Night */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-2">Sleep Category</label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'nap', label: '🌤️ Daytime Nap' },
              { id: 'night', label: '🌙 Night Sleep' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              id={`sleep-type-${t.id}`}
              onClick={() => setSleepType(t.id)}
              className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                sleepType === t.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-stone-600">Duration</label>
          <span className="text-xs font-bold text-indigo-600 font-display">
            {Math.floor(durationMinutes / 60) > 0 ? `${Math.floor(durationMinutes / 60)}h ` : ''}
            {durationMinutes % 60}m ({durationMinutes} mins)
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-2">
          {[30, 45, 60, 90, 120].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setDurationMinutes(mins)}
              className={`py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                durationMinutes === mins
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
            </button>
          ))}
        </div>

        <input
          type="range"
          min="15"
          max="480"
          step="15"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
      </div>

      {/* Quality */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Sleep Quality</label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'peaceful', label: '😌 Peaceful' },
              { id: 'restless', label: '🫨 Restless' },
              { id: 'fussy', label: '😢 Fussy' },
            ] as const
          ).map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setQuality(q.id)}
              className={`py-2 px-2 rounded-xl text-xs border transition-colors cursor-pointer ${
                quality === q.id
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Notes (Optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Fell asleep in stroller, woke up happy"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <button
        type="submit"
        id="save-sleep-btn"
        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Sleep Record
      </button>
    </form>
  );
};
