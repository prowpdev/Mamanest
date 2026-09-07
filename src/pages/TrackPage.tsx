import React, { useState, useMemo } from 'react';
import { Plus, Search, Trash2, Calendar, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { ActivityType } from '../types';
import { formatTimeOnly, formatDateFriendly } from '../utils/formatters';

const FILTERS: { id: ActivityType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'feeding', label: 'Feeding', icon: '🍼' },
  { id: 'diaper', label: 'Diaper', icon: '💧' },
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'pumping', label: 'Pumping', icon: '🤱' },
  { id: 'medicine', label: 'Medicine', icon: '💊' },
  { id: 'note', label: 'Notes', icon: '📝' },
];

export const TrackPage: React.FC = () => {
  const { activities, deleteActivity, openLogger } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<ActivityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = useMemo(() => {
    return (activities || []).filter((act) => {
      const matchesType = selectedFilter === 'all' || act.type === selectedFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.detail && act.detail.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [activities, selectedFilter, searchQuery]);

  // Group by date string (YYYY-MM-DD)
  const groupedActivities = useMemo(() => {
    const groups: { [date: string]: typeof activities } = {};
    filteredActivities.forEach((act) => {
      const dateKey = act.timestamp.split('T')[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(act);
    });
    return groups;
  }, [filteredActivities]);

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'feeding':
        return { emoji: '🍼', bg: 'bg-rose-100 text-rose-700' };
      case 'diaper':
        return { emoji: '💧', bg: 'bg-amber-100 text-amber-700' };
      case 'sleep':
        return { emoji: '😴', bg: 'bg-indigo-100 text-indigo-700' };
      case 'pumping':
        return { emoji: '🤱', bg: 'bg-teal-100 text-teal-700' };
      case 'medicine':
        return { emoji: '💊', bg: 'bg-purple-100 text-purple-700' };
      case 'note':
        return { emoji: '📝', bg: 'bg-emerald-100 text-emerald-700' };
    }
  };

  return (
    <div id="track-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      <PageHeader
        title="Activity Log"
        subtitle="Daily tracking history"
        showBabyPill={true}
        showMamaAIButton={true}
        showWellbeingButton={true}
      />

      <main className="px-4 py-3 space-y-3.5">
        {/* Top bar with Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs or notes..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-200 shadow-2xs"
            />
          </div>

          <button
            id="track-open-logger-btn"
            onClick={() => openLogger()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              id={`filter-pill-${f.id}`}
              onClick={() => setSelectedFilter(f.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Grouped Logs */}
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="p-8 bg-white border border-stone-200/80 rounded-2xl text-center">
            <Filter className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <h3 className="text-xs font-bold text-stone-700">No logs found</h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {searchQuery ? 'Try clearing your search terms' : 'Start logging daily baby routines'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedActivities).map(([dateKey, items]) => (
              <div key={dateKey} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {formatDateFriendly(dateKey)}
                  </h2>
                  <span className="text-[11px] text-stone-400 font-medium">
                    ({(items as typeof activities).length} records)
                  </span>
                </div>

                <div className="bg-white border border-stone-200/80 rounded-2xl divide-y divide-stone-100 overflow-hidden shadow-2xs">
                  {(items as typeof activities).map((act) => {
                    const badge = getActivityBadge(act.type);
                    const timeStr = formatTimeOnly(act.timestamp);

                    return (
                      <div
                        key={act.id}
                        id={`track-item-${act.id}`}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${badge.bg}`}
                          >
                            {badge.emoji}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-stone-900 font-display">
                                {act.title}
                              </span>
                              <span className="text-[11px] font-semibold text-stone-400">
                                {timeStr}
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

                        <button
                          onClick={() => deleteActivity(act.type, act.id)}
                          className="p-2 text-stone-300 hover:text-rose-500 rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Delete activity"
                          aria-label="Delete activity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
