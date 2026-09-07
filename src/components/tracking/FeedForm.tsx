import React, { useState } from 'react';
import { BreastSide, FeedingType } from '../../types';
import { useApp } from '../../context/AppContext';

interface FeedFormProps {
  onSuccess?: () => void;
}

export const FeedForm: React.FC<FeedFormProps> = ({ onSuccess }) => {
  const { logFeeding } = useApp();

  const [feedType, setFeedType] = useState<FeedingType>('breastfeeding');
  const [side, setSide] = useState<BreastSide>('both');
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [amountMl, setAmountMl] = useState<number>(120);
  const [notes, setNotes] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logFeeding({
      timestamp: new Date().toISOString(),
      feedingType: feedType,
      side: feedType === 'breastfeeding' ? side : undefined,
      durationMinutes: feedType === 'breastfeeding' ? durationMinutes : undefined,
      amountMl: feedType !== 'breastfeeding' ? amountMl : undefined,
      notes: notes.trim() || undefined,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Feeding Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-2">Feeding Method</label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'breastfeeding', label: '🤱 Nursing' },
              { id: 'bottle', label: '🍼 Bottle' },
              { id: 'formula', label: '🥣 Formula' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              id={`feed-type-${t.id}`}
              onClick={() => setFeedType(t.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                feedType === t.id
                  ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {feedType === 'breastfeeding' && (
        <>
          {/* Side Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">Breast Side</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'left', label: 'Left' },
                  { id: 'both', label: 'Both' },
                  { id: 'right', label: 'Right' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  id={`feed-side-${s.id}`}
                  onClick={() => setSide(s.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    side === s.id
                      ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-600">Nursing Duration</label>
              <span className="text-xs font-bold text-rose-600 font-display">{durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-2">
              {[5, 10, 15, 20, 25, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-stone-800 text-white border-stone-800'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {feedType !== 'breastfeeding' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-stone-600">Amount (ml)</label>
            <span className="text-xs font-bold text-rose-600 font-display">{amountMl} ml</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {[60, 90, 120, 150, 180].map((ml) => (
              <button
                key={ml}
                type="button"
                onClick={() => setAmountMl(ml)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  amountMl === ml
                    ? 'bg-stone-800 text-white border-stone-800'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {ml}ml
              </button>
            ))}
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={amountMl}
            onChange={(e) => setAmountMl(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Notes (Optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Great latch, burped easily"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      <button
        type="submit"
        id="save-feed-btn"
        className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Feed Record
      </button>
    </form>
  );
};
