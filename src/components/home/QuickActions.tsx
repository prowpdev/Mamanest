import React from 'react';
import { ActivityType } from '../../types';
import { useApp } from '../../context/AppContext';

export const QuickActions: React.FC = () => {
  const { openLogger } = useApp();

  const actions: { id: ActivityType; label: string; icon: string; bg: string; border: string; text: string }[] = [
    { id: 'feeding', label: 'Feed', icon: '🍼', bg: 'bg-rose-50 hover:bg-rose-100/80', border: 'border-rose-200/70', text: 'text-rose-900' },
    { id: 'diaper', label: 'Diaper', icon: '💧', bg: 'bg-amber-50 hover:bg-amber-100/80', border: 'border-amber-200/70', text: 'text-amber-900' },
    { id: 'sleep', label: 'Sleep', icon: '😴', bg: 'bg-indigo-50 hover:bg-indigo-100/80', border: 'border-indigo-200/70', text: 'text-indigo-900' },
    { id: 'pumping', label: 'Pump', icon: '🤱', bg: 'bg-teal-50 hover:bg-teal-100/80', border: 'border-teal-200/70', text: 'text-teal-900' },
    { id: 'medicine', label: 'Medicine', icon: '💊', bg: 'bg-purple-50 hover:bg-purple-100/80', border: 'border-purple-200/70', text: 'text-purple-900' },
    { id: 'note', label: 'Note', icon: '📝', bg: 'bg-emerald-50 hover:bg-emerald-100/80', border: 'border-emerald-200/70', text: 'text-emerald-900' },
  ];

  return (
    <section aria-labelledby="quick-actions-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 id="quick-actions-heading" className="text-sm font-bold text-stone-800 tracking-tight flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-black">+</span>
          Add Activity
        </h2>
        <span className="text-[11px] text-stone-400">Tap to log</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((act) => (
          <button
            key={act.id}
            id={`quick-act-${act.id}`}
            onClick={() => openLogger(act.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${act.border} ${act.bg} shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer min-h-[76px]`}
          >
            <span className="text-2xl mb-1 filter drop-shadow-xs">{act.icon}</span>
            <span className={`text-xs font-bold ${act.text} font-display`}>{act.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
