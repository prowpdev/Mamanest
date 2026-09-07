import React, { useState } from 'react';
import { DiaperType, StoolColor, StoolConsistency } from '../../types';
import { useApp } from '../../context/AppContext';

interface DiaperFormProps {
  onSuccess?: () => void;
}

export const DiaperForm: React.FC<DiaperFormProps> = ({ onSuccess }) => {
  const { logDiaper } = useApp();

  const [diaperType, setDiaperType] = useState<DiaperType>('wet');
  const [stoolColor, setStoolColor] = useState<StoolColor>('mustard');
  const [stoolConsistency, setStoolConsistency] = useState<StoolConsistency>('soft');
  const [rashPresent, setRashPresent] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logDiaper({
      timestamp: new Date().toISOString(),
      diaperType,
      stoolColor: diaperType !== 'wet' ? stoolColor : undefined,
      stoolConsistency: diaperType !== 'wet' ? stoolConsistency : undefined,
      rashPresent,
      notes: notes.trim() || undefined,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Diaper Type */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-2">Change Type</label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'wet', label: '💧 Wet' },
              { id: 'dirty', label: '💩 Dirty' },
              { id: 'both', label: '💧💩 Both' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              id={`diaper-type-${t.id}`}
              onClick={() => setDiaperType(t.id)}
              className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                diaperType === t.id
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {diaperType !== 'wet' && (
        <>
          {/* Stool Color */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Color</label>
            <div className="flex items-center gap-2">
              {(
                [
                  { id: 'mustard', label: 'Mustard', bg: 'bg-[#D4A31C]' },
                  { id: 'yellow', label: 'Yellow', bg: 'bg-[#F2C94C]' },
                  { id: 'green', label: 'Green', bg: 'bg-[#6B8E23]' },
                  { id: 'brown', label: 'Brown', bg: 'bg-[#8B5A2B]' },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setStoolColor(c.id)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    stoolColor === c.id
                      ? 'border-stone-800 ring-2 ring-stone-800/10 font-bold bg-white'
                      : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stool Consistency */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Consistency</label>
            <div className="grid grid-cols-4 gap-2">
              {(['liquid', 'soft', 'formed', 'hard'] as const).map((cons) => (
                <button
                  key={cons}
                  type="button"
                  onClick={() => setStoolConsistency(cons)}
                  className={`py-1.5 px-2 rounded-lg text-xs capitalize border transition-colors cursor-pointer ${
                    stoolConsistency === cons
                      ? 'bg-stone-800 text-white border-stone-800 font-medium'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  {cons}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Rash toggle */}
      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
        <div>
          <span className="text-xs font-semibold text-stone-800 block">Diaper Rash Present?</span>
          <span className="text-[11px] text-stone-500">Apply barrier cream if irritated</span>
        </div>
        <input
          type="checkbox"
          checked={rashPresent}
          onChange={(e) => setRashPresent(e.target.checked)}
          className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Notes (Optional)</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Applied zinc oxide cream"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <button
        type="submit"
        id="save-diaper-btn"
        className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Diaper Record
      </button>
    </form>
  );
};
