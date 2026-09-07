import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

interface PumpFormProps {
  onSuccess?: () => void;
}

export const PumpForm: React.FC<PumpFormProps> = ({ onSuccess }) => {
  const { logPumping } = useApp();

  const [leftAmount, setLeftAmount] = useState<number>(60);
  const [rightAmount, setRightAmount] = useState<number>(60);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [notes, setNotes] = useState<string>('');

  const totalAmount = leftAmount + rightAmount;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    logPumping({
      timestamp: new Date().toISOString(),
      durationMinutes,
      leftAmountMl: leftAmount,
      rightAmountMl: rightAmount,
      totalAmountMl: totalAmount,
      notes: notes.trim() || undefined,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Total Display */}
      <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs text-teal-800 font-semibold block">Total Expressed Milk</span>
          <span className="text-[11px] text-teal-600">Left: {leftAmount}ml • Right: {rightAmount}ml</span>
        </div>
        <div className="text-2xl font-black text-teal-700 font-display">
          {totalAmount} <span className="text-sm font-semibold">ml</span>
        </div>
      </div>

      {/* Left Breast Amount */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-600">Left Breast (ml)</label>
          <span className="text-xs font-bold text-teal-700">{leftAmount} ml</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={leftAmount}
          onChange={(e) => setLeftAmount(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer"
        />
      </div>

      {/* Right Breast Amount */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-600">Right Breast (ml)</label>
          <span className="text-xs font-bold text-teal-700">{rightAmount} ml</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={rightAmount}
          onChange={(e) => setRightAmount(Number(e.target.value))}
          className="w-full accent-teal-600 cursor-pointer"
        />
      </div>

      {/* Duration */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-600">Pumping Time</label>
          <span className="text-xs font-bold text-stone-700">{durationMinutes} min</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[10, 15, 20, 25].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDurationMinutes(d)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                durationMinutes === d
                  ? 'bg-stone-800 text-white border-stone-800'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {d}m
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
          placeholder="e.g. Stored in freezer bag #4"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <button
        type="submit"
        id="save-pump-btn"
        className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Pumping Record
      </button>
    </form>
  );
};
