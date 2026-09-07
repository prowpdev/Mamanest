import React from 'react';
import { useApp } from '../../context/AppContext';

export const TodayOverview: React.FC = () => {
  const { todaySummary, openLogger } = useApp();

  const cards = [
    {
      id: 'stat-feeding',
      icon: '🍼',
      label: 'Feeding',
      value: `${todaySummary.feedingCount} sessions`,
      detail: todaySummary.feedingTotalMl > 0 ? `${todaySummary.feedingTotalMl} ml` : 'Tracked today',
      actionTab: 'feeding' as const,
      color: 'bg-rose-50/70 border-rose-100 text-rose-950',
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'stat-sleep',
      icon: '😴',
      label: 'Sleep',
      value: todaySummary.sleepFormatted,
      detail: 'Naps & night',
      actionTab: 'sleep' as const,
      color: 'bg-indigo-50/70 border-indigo-100 text-indigo-950',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'stat-diapers',
      icon: '💧',
      label: 'Diapers',
      value: todaySummary.diaperCount,
      detail: 'Changes logged',
      actionTab: 'diaper' as const,
      color: 'bg-amber-50/70 border-amber-100 text-amber-950',
      badgeColor: 'bg-amber-100 text-amber-700',
    },
    {
      id: 'stat-medicine',
      icon: '💊',
      label: 'Medicine',
      value: todaySummary.medicineCount,
      detail: 'Doses today',
      actionTab: 'medicine' as const,
      color: 'bg-purple-50/70 border-purple-100 text-purple-950',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
  ];

  return (
    <section aria-labelledby="today-overview-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 id="today-overview-heading" className="text-sm font-bold text-stone-800 tracking-tight">
          Today's Overview
        </h2>
        <span className="text-[11px] font-medium text-stone-500">Live sync</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((c) => (
          <div
            key={c.id}
            id={c.id}
            onClick={() => openLogger(c.actionTab)}
            className={`p-3.5 rounded-2xl border ${c.color} shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-98`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl leading-none">{c.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badgeColor}`}>
                {c.label}
              </span>
            </div>
            <div className="text-lg font-black tracking-tight font-display">{c.value}</div>
            <div className="text-[11px] text-stone-500 font-medium mt-0.5">{c.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
