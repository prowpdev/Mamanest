import React from 'react';
import { ActivityType } from '../../types';
import { useApp } from '../../context/AppContext';
import { BottomSheet } from '../common/BottomSheet';
import { FeedForm } from './FeedForm';
import { DiaperForm } from './DiaperForm';
import { SleepForm } from './SleepForm';
import { PumpForm } from './PumpForm';
import { MedicineForm } from './MedicineForm';
import { NoteForm } from './NoteForm';

const TABS: { id: ActivityType; label: string; icon: string }[] = [
  { id: 'feeding', label: 'Feed', icon: '🍼' },
  { id: 'diaper', label: 'Diaper', icon: '💧' },
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'pumping', label: 'Pump', icon: '🤱' },
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'note', label: 'Note', icon: '📝' },
];

export const LogActivitySheet: React.FC = () => {
  const { isLoggerOpen, closeLogger, activeLoggerTab, openLogger } = useApp();

  return (
    <BottomSheet
      isOpen={isLoggerOpen}
      onClose={closeLogger}
      title="Log Baby Activity"
      subtitle="Quickly record daily moments in just a few taps"
    >
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`log-tab-${t.id}`}
            onClick={() => openLogger(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeLoggerTab === t.id
                ? 'bg-rose-500 text-white shadow-xs scale-102'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Form */}
      <div className="pt-1">
        {activeLoggerTab === 'feeding' && <FeedForm onSuccess={closeLogger} />}
        {activeLoggerTab === 'diaper' && <DiaperForm onSuccess={closeLogger} />}
        {activeLoggerTab === 'sleep' && <SleepForm onSuccess={closeLogger} />}
        {activeLoggerTab === 'pumping' && <PumpForm onSuccess={closeLogger} />}
        {activeLoggerTab === 'medicine' && <MedicineForm onSuccess={closeLogger} />}
        {activeLoggerTab === 'note' && <NoteForm onSuccess={closeLogger} />}
      </div>
    </BottomSheet>
  );
};
