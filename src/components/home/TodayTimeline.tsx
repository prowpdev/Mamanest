import React from 'react';
import { Trash2, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeOnly } from '../../utils/formatters';
import { ActivityType } from '../../types';

interface TodayTimelineProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  limit = 5,
  showViewAll = true,
  onViewAll,
}) => {
  const { activities, deleteActivity } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = (activities || []).filter((a) => a?.timestamp?.startsWith(todayStr));
  const displayedActivities = limit ? todayActivities.slice(0, limit) : todayActivities;

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'feeding':
        return { emoji: '🍼', bg: 'bg-rose-100/70 text-rose-700 border-rose-200/60' };
      case 'diaper':
        return { emoji: '💧', bg: 'bg-amber-100/70 text-amber-700 border-amber-200/60' };
      case 'sleep':
        return { emoji: '😴', bg: 'bg-indigo-100/70 text-indigo-700 border-indigo-200/60' };
      case 'pumping':
        return { emoji: '🤱', bg: 'bg-teal-100/70 text-teal-700 border-teal-200/60' };
      case 'medicine':
        return { emoji: '💊', bg: 'bg-purple-100/70 text-purple-700 border-purple-200/60' };
      case 'note':
        return { emoji: '📝', bg: 'bg-emerald-100/70 text-emerald-700 border-emerald-200/60' };
    }
  };

  return (
    <section aria-labelledby="today-timeline-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 id="today-timeline-heading" className="text-sm font-bold text-stone-800 tracking-tight">
          Today's Timeline
        </h2>
        {showViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all ({todayActivities.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {todayActivities.length === 0 ? (
        <div className="p-6 bg-white border border-stone-200/70 rounded-2xl text-center">
          <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-stone-700">No activities logged yet today</p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Use the quick buttons above to record baby's first activity!
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/70 rounded-2xl divide-y divide-stone-100 overflow-hidden shadow-2xs">
          {displayedActivities.map((act) => {
            const badge = getActivityBadge(act.type);
            const timeFormatted = formatTimeOnly(act.timestamp);

            return (
              <div
                key={act.id}
                id={`timeline-item-${act.id}`}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border ${badge.bg} shrink-0`}
                  >
                    {badge.emoji}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900 font-display">
                        {act.title}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-400">
                        {timeFormatted}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 truncate mt-0.5">{act.subtitle}</p>

                    {act.detail && (
                      <p className="text-[11px] text-stone-400 italic truncate mt-0.5">
                        "{act.detail}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => deleteActivity(act.type, act.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Delete log"
                    aria-label="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
