import React, { useState, useMemo } from 'react';
import {
  Plus,
  AlertCircle,
  BookOpen,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Milestone, MilestoneCategory, MilestoneStatus } from '../../types';
import { MilestoneCard } from './MilestoneCard';
import { MilestoneForm } from './MilestoneForm';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { calculateBabyAge, detectMilestoneStatus } from '../../utils/ageCalculator';

type StatusFilterOption = 'all' | 'due' | 'upcoming' | 'completed' | 'overdue';

export const MilestonesTracker: React.FC = () => {
  const { activeBaby, milestones, addMilestone, updateMilestone, deleteMilestone, toggleMilestone } =
    useApp();

  // Dialog & Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [deletingMilestone, setDeletingMilestone] = useState<Milestone | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all');
  const [categoryFilter, setCategoryFilter] = useState<MilestoneCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Baby's exact age
  const babyAge = useMemo(
    () => calculateBabyAge(activeBaby?.birthDate || new Date().toISOString()),
    [activeBaby?.birthDate]
  );

  // Filter and process milestones
  const babyMilestones = useMemo(() => {
    return milestones.filter((m) => !m.babyId || m.babyId === activeBaby.id);
  }, [milestones, activeBaby.id]);

  // Detected status map for each milestone
  const milestoneStatuses = useMemo(() => {
    const map = new Map<string, 'due' | 'upcoming' | 'completed' | 'overdue'>();
    babyMilestones.forEach((m) => {
      map.set(m.id, detectMilestoneStatus(m, babyAge.totalMonths));
    });
    return map;
  }, [babyMilestones, babyAge.totalMonths]);

  // Statistics
  const stats = useMemo(() => {
    let completed = 0;
    let due = 0;
    let upcoming = 0;
    let overdue = 0;

    babyMilestones.forEach((m) => {
      const st = milestoneStatuses.get(m.id) || 'due';
      if (st === 'completed') completed++;
      else if (st === 'due') due++;
      else if (st === 'overdue') overdue++;
      else if (st === 'upcoming') upcoming++;
    });

    return {
      total: babyMilestones.length,
      completed,
      due,
      upcoming,
      overdue,
    };
  }, [babyMilestones, milestoneStatuses]);

  // Filtered list
  const filteredMilestones = useMemo(() => {
    return babyMilestones.filter((m) => {
      const st = milestoneStatuses.get(m.id) || 'due';

      // Status filter
      if (statusFilter !== 'all' && st !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && m.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchCat = m.category.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [babyMilestones, milestoneStatuses, statusFilter, categoryFilter, searchQuery]);

  // Handler functions
  const handleOpenAdd = () => {
    setEditingMilestone(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Milestone) => {
    setEditingMilestone(m);
    setIsFormOpen(true);
  };

  const handleSaveMilestone = (data: Omit<Milestone, 'id'> | Milestone) => {
    if ('id' in data) {
      updateMilestone(data.id, data);
    } else {
      addMilestone(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingMilestone) {
      deleteMilestone(deletingMilestone.id);
      setDeletingMilestone(null);
    }
  };

  const thingsToTry = [
    { title: 'Tummy Time Play', desc: 'Place colorful toys just out of reach to encourage gentle reaching and pushing up.' },
    { title: 'Narrate Your Day', desc: 'Speak warmly and wait for coos or babbling to promote foundational language.' },
    { title: 'Visual Tracking', desc: 'Slowly track high-contrast toys or safe mirrors across their field of vision.' },
    { title: 'Social Smiles & Songs', desc: 'Sing gentle lullabies with face-to-face smiles to build emotional bonding.' },
  ];

  return (
    <div className="space-y-4">
      {/* Age Stage Banner */}
      <div className="p-4 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white rounded-3xl shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-100 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current Developmental Stage</span>
            </div>
            <h3 className="text-xl font-bold font-display mt-0.5">{babyAge.ageBand}</h3>
            <p className="text-xs text-rose-100 mt-1">
              {activeBaby.name} is {babyAge.formattedAge}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black font-display leading-none block">
              {stats.completed}/{stats.total}
            </span>
            <span className="text-[11px] text-rose-100 font-medium">Achieved</span>
          </div>
        </div>

        {/* Action Required Banner if milestones due now */}
        {stats.due > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping inline-block" />
              <span>
                {stats.due} {stats.due === 1 ? 'milestone' : 'milestones'} active for this stage
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFilter('due')}
              className="text-[11px] font-bold underline text-amber-200 hover:text-white cursor-pointer"
            >
              View Active
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'due' ? 'all' : 'due')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'due'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200'
              : 'bg-white border-stone-200/80 hover:border-stone-300'
          }`}
        >
          <span className="text-xs font-bold text-rose-600 font-display block">{stats.due}</span>
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mt-0.5 truncate">
            Due Now
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'upcoming'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
              : 'bg-white border-stone-200/80 hover:border-stone-300'
          }`}
        >
          <span className="text-xs font-bold text-amber-600 font-display block">{stats.upcoming}</span>
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mt-0.5 truncate">
            Upcoming
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'completed'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-white border-stone-200/80 hover:border-stone-300'
          }`}
        >
          <span className="text-xs font-bold text-emerald-600 font-display block">{stats.completed}</span>
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mt-0.5 truncate">
            Achieved
          </span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'all' : 'overdue')}
          className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
            statusFilter === 'overdue'
              ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-stone-200/80 hover:border-stone-300'
          }`}
        >
          <span className="text-xs font-bold text-amber-700 font-display block">{stats.overdue}</span>
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mt-0.5 truncate">
            Past Stage
          </span>
        </button>
      </div>

      {/* Action Header & Search */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Add Milestone Button */}
        <button
          type="button"
          id="add-milestone-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Categories' },
            { id: 'motor', label: '🏃 Motor' },
            { id: 'social', label: '💛 Social' },
            { id: 'cognitive', label: '🧠 Cognitive' },
            { id: 'language', label: '💬 Language' },
            { id: 'sensory', label: '✨ Sensory' },
          ] as const
        ).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Filter Notification Bar */}
      {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery.trim()) && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-100 text-xs text-stone-600">
          <span>
            Showing {filteredMilestones.length} of {babyMilestones.length} milestones
          </span>
          <button
            type="button"
            onClick={() => {
              setStatusFilter('all');
              setCategoryFilter('all');
              setSearchQuery('');
            }}
            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Pediatric Guidance Note */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>Pediatric Insight:</strong> Milestones represent typical developmental windows. Every baby masters skills on their own gentle timetable. Consult your pediatrician with specific questions.
        </p>
      </div>

      {/* Milestone List */}
      <div className="space-y-2.5">
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              detectedStatus={milestoneStatuses.get(milestone.id) || 'due'}
              onToggle={toggleMilestone}
              onEdit={handleOpenEdit}
              onDelete={(m) => setDeletingMilestone(m)}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200/80 rounded-2xl space-y-2">
            <Sparkles className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-700 font-display">No milestones match your filter</p>
            <p className="text-[11px] text-stone-400">Try selecting all categories or create a custom milestone!</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Milestone</span>
            </button>
          </div>
        )}
      </div>

      {/* Things You Can Try Together */}
      <div className="p-4 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-display">
            Developmental Activities to Try
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {thingsToTry.map((item, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-xs font-bold text-stone-800 block mb-0.5">
                • {item.title}
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Add/Edit Modal */}
      <MilestoneForm
        isOpen={isFormOpen}
        initialMilestone={editingMilestone}
        babyId={activeBaby.id}
        onSave={handleSaveMilestone}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMilestone(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingMilestone}
        title="Delete Milestone?"
        message={`Are you sure you want to delete "${deletingMilestone?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Milestone"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMilestone(null)}
      />
    </div>
  );
};
