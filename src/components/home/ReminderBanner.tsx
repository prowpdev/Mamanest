import React from 'react';
import { Calendar, ArrowRight, Bell, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatDateFriendly } from '../../utils/formatters';

export const ReminderBanner: React.FC = () => {
  const navigate = useNavigate();
  const { reminders, toggleReminder } = useApp();

  const upcoming = reminders.find((r) => !r.completed);

  if (!upcoming) return null;

  const friendlyDate = formatDateFriendly(upcoming.date);

  return (
    <div
      id="upcoming-reminder-card"
      className="p-4 bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-orange-50/70 border border-rose-200/80 rounded-2xl shadow-xs"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider">
          <Bell className="w-3.5 h-3.5" />
          <span>Upcoming Reminder</span>
        </div>
        <button
          onClick={() => navigate('/reminders')}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 shadow-2xs shrink-0 mt-0.5">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-display leading-tight">
              {upcoming.title}
            </h3>
            <p className="text-xs font-semibold text-stone-600 mt-0.5">
              {friendlyDate} • {upcoming.time}
            </p>
            {upcoming.notes && (
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{upcoming.notes}</p>
            )}
          </div>
        </div>

        <button
          id={`done-reminder-${upcoming.id}`}
          onClick={() => toggleReminder(upcoming.id)}
          className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-400 hover:text-emerald-600 border border-stone-200/70 shadow-2xs transition-colors shrink-0 cursor-pointer"
          title="Mark as completed"
          aria-label="Mark as completed"
        >
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
