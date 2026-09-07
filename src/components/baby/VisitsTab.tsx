import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Stethoscope,
  Search,
  Filter,
  Clock,
  Sparkles,
  MapPin,
  User,
  Scale,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthcareVisit, VisitType } from '../../types';
import { VisitCard } from './VisitCard';
import { VisitForm } from './VisitForm';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { formatDateFriendly } from '../../utils/formatters';

export const VisitsTab: React.FC = () => {
  const { activeBaby, visits, addVisit, updateVisit, deleteVisit } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<HealthcareVisit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<HealthcareVisit | null>(null);

  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Baby-specific visits, sorted chronologically with most recent first
  const sortedVisits = useMemo(() => {
    const list = visits.filter((v) => !v.babyId || v.babyId === activeBaby.id);
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [visits, activeBaby.id]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let completed = 0;

    sortedVisits.forEach((v) => {
      if (new Date(v.date) > now && !v.completed) {
        upcoming++;
      } else {
        completed++;
      }
    });

    return {
      total: sortedVisits.length,
      upcoming,
      completed,
    };
  }, [sortedVisits]);

  // Filtered visits
  const filteredVisits = useMemo(() => {
    return sortedVisits.filter((v) => {
      if (filterType !== 'all') {
        if (filterType === 'upcoming') {
          if (new Date(v.date) <= new Date()) return false;
        } else if (filterType === 'completed') {
          if (new Date(v.date) > new Date()) return false;
        } else if (v.visitType !== filterType) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = v.title?.toLowerCase().includes(q);
        const matchReason = v.reasonForVisit?.toLowerCase().includes(q);
        const matchDoctor = v.doctorName?.toLowerCase().includes(q);
        const matchClinic = v.clinic?.toLowerCase().includes(q);
        const matchDiagnosis = v.diagnosis?.toLowerCase().includes(q);
        if (!matchTitle && !matchReason && !matchDoctor && !matchClinic && !matchDiagnosis) {
          return false;
        }
      }

      return true;
    });
  }, [sortedVisits, filterType, searchQuery]);

  const handleOpenAdd = () => {
    setEditingVisit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (v: HealthcareVisit) => {
    setEditingVisit(v);
    setIsFormOpen(true);
  };

  const handleSaveVisit = (data: Omit<HealthcareVisit, 'id'> | HealthcareVisit) => {
    if ('id' in data) {
      updateVisit(data.id, data);
    } else {
      addVisit(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingVisit) {
      deleteVisit(deletingVisit.id);
      setDeletingVisit(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white rounded-3xl shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-100 uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Healthcare & Clinical Visits</span>
            </div>
            <h3 className="text-xl font-bold font-display mt-0.5">Medical Timeline</h3>
            <p className="text-xs text-rose-100 mt-1">
              {activeBaby.pediatricianName || 'Dr. Evelyn Martinez, MD'} • Sunrise Pediatrics
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black font-display leading-none block">
              {stats.total}
            </span>
            <span className="text-[11px] text-rose-100 font-medium">Total Visits</span>
          </div>
        </div>

        {stats.upcoming > 0 && (
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-white animate-ping inline-block" />
              <span>
                {stats.upcoming} upcoming appointment scheduled
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFilterType('upcoming')}
              className="text-[11px] font-bold underline text-amber-100 hover:text-white cursor-pointer"
            >
              View Upcoming
            </button>
          </div>
        )}
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
            placeholder="Search visits, doctor, notes..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Add Visit Button */}
        <button
          type="button"
          id="add-visit-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Visit</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {(
          [
            { id: 'all', label: 'All Visits' },
            { id: 'upcoming', label: '📅 Upcoming' },
            { id: 'completed', label: '✓ Completed' },
            { id: 'Pediatric Checkup', label: '🩺 Well-Child' },
            { id: 'Vaccination', label: '💉 Vaccination' },
            { id: 'Growth Monitoring', label: '📏 Growth' },
            { id: 'Sick Visit', label: '🌡️ Sick Visit' },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filterType === f.id
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Filter Notification */}
      {filterType !== 'all' && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-100 text-xs text-stone-600">
          <span>
            Showing {filteredVisits.length} of {sortedVisits.length} visits
          </span>
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Timeline List of Visits */}
      <div className="relative space-y-3 pl-3 before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-stone-200/70">
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit, idx) => (
            <div key={visit.id} className="relative flex items-start gap-3">
              {/* Timeline Indicator Dot */}
              <div
                className={`w-4 h-4 rounded-full border-2 border-white shrink-0 mt-3.5 z-10 shadow-xs ${
                  new Date(visit.date) > new Date()
                    ? 'bg-rose-500 ring-2 ring-rose-200'
                    : 'bg-stone-400'
                }`}
              />

              {/* Visit Card */}
              <div className="flex-1 min-w-0">
                <VisitCard
                  visit={visit}
                  isLatest={idx === 0}
                  onEdit={handleOpenEdit}
                  onDelete={(v) => setDeletingVisit(v)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200/80 rounded-2xl space-y-2 ml-4">
            <Stethoscope className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-700 font-display">No healthcare visits found</p>
            <p className="text-[11px] text-stone-400">Record pediatric checkups, sick visits, and doctor consultations.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Visit</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Visit Form Modal */}
      <VisitForm
        isOpen={isFormOpen}
        initialVisit={editingVisit}
        babyId={activeBaby.id}
        defaultDoctorName={activeBaby.pediatricianName || 'Dr. Evelyn Martinez, MD'}
        onSave={handleSaveVisit}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVisit(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingVisit}
        title="Delete Healthcare Visit?"
        message={`Are you sure you want to remove the visit record for ${
          deletingVisit?.reasonForVisit || deletingVisit?.visitType
        } on ${deletingVisit ? formatDateFriendly(deletingVisit.date) : ''}?`}
        confirmLabel="Delete Visit"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVisit(null)}
      />
    </div>
  );
};
