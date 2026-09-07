import React, { useState, useMemo } from 'react';
import {
  Syringe,
  Plus,
  ShieldCheck,
  Search,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Vaccination, VaccinationStatus } from '../../types';
import { VaccinationCard } from './VaccinationCard';
import { VaccinationForm } from './VaccinationForm';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { calculateBabyAge, detectVaccinationStatus } from '../../utils/ageCalculator';

type VacFilterOption = 'all' | 'due' | 'upcoming' | 'completed' | 'overdue' | 'missed';

export const VaccinationsTab: React.FC = () => {
  const {
    activeBaby,
    vaccinations,
    addVaccination,
    updateVaccination,
    updateVaccinationStatus,
    deleteVaccination,
  } = useApp();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVac, setEditingVac] = useState<Vaccination | null>(null);
  const [deletingVac, setDeletingVac] = useState<Vaccination | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<VacFilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate baby age
  const babyAge = useMemo(
    () => calculateBabyAge(activeBaby?.birthDate || new Date().toISOString()),
    [activeBaby?.birthDate]
  );

  // Baby-specific vaccinations
  const babyVaccinations = useMemo(() => {
    return vaccinations.filter((v) => !v.babyId || v.babyId === activeBaby.id);
  }, [vaccinations, activeBaby.id]);

  // Detected status for each vaccination
  const vacStatusMap = useMemo(() => {
    const map = new Map<string, VaccinationStatus>();
    babyVaccinations.forEach((v) => {
      // If user explicitly set completed or missed, honor it; otherwise detect based on age
      if (v.status === 'completed' || v.status === 'missed') {
        map.set(v.id, v.status);
      } else {
        map.set(v.id, detectVaccinationStatus(v, babyAge.totalMonths));
      }
    });
    return map;
  }, [babyVaccinations, babyAge.totalMonths]);

  // Summary statistics
  const stats = useMemo(() => {
    let completed = 0;
    let due = 0;
    let upcoming = 0;
    let overdue = 0;
    let missed = 0;

    babyVaccinations.forEach((v) => {
      const st = vacStatusMap.get(v.id) || 'scheduled';
      if (st === 'completed') completed++;
      else if (st === 'due') due++;
      else if (st === 'overdue') overdue++;
      else if (st === 'upcoming' || st === 'scheduled') upcoming++;
      else if (st === 'missed') missed++;
    });

    return {
      total: babyVaccinations.length,
      completed,
      due,
      upcoming,
      overdue,
      missed,
    };
  }, [babyVaccinations, vacStatusMap]);

  // Filtered vaccination list
  const filteredVaccinations = useMemo(() => {
    return babyVaccinations.filter((v) => {
      const st = vacStatusMap.get(v.id) || 'scheduled';

      if (statusFilter !== 'all') {
        if (statusFilter === 'upcoming') {
          if (st !== 'upcoming' && st !== 'scheduled') return false;
        } else if (st !== statusFilter) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.name.toLowerCase().includes(q);
        const matchCat = v.category?.toLowerCase().includes(q);
        const matchAge = v.recommendedAge?.toLowerCase().includes(q);
        const matchClinic = v.clinic?.toLowerCase().includes(q);
        if (!matchName && !matchCat && !matchAge && !matchClinic) return false;
      }

      return true;
    });
  }, [babyVaccinations, vacStatusMap, statusFilter, searchQuery]);

  // Form actions
  const handleOpenAdd = () => {
    setEditingVac(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (v: Vaccination) => {
    setEditingVac(v);
    setIsFormOpen(true);
  };

  const handleSaveVaccination = (data: Omit<Vaccination, 'id'> | Vaccination) => {
    if ('id' in data) {
      updateVaccination(data.id, data);
    } else {
      addVaccination(data);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingVac) {
      deleteVaccination(deletingVac.id);
      setDeletingVac(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white rounded-3xl shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immunization Schedule</span>
            </div>
            <h3 className="text-xl font-bold font-display mt-0.5">CDC / AAP Guidelines</h3>
            <p className="text-xs text-stone-300 mt-1">
              {activeBaby.name} is {babyAge.formattedAge} ({babyAge.ageBand})
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-2xl font-black font-display leading-none block text-emerald-400">
              {stats.completed}/{stats.total}
            </span>
            <span className="text-[11px] text-stone-300 font-medium">Protected</span>
          </div>
        </div>

        {/* Due now alert bar */}
        {stats.due > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping inline-block" />
              <span>
                {stats.due} {stats.due === 1 ? 'vaccine' : 'vaccines'} due now for {activeBaby.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFilter('due')}
              className="text-[11px] font-bold underline text-white hover:text-rose-200 cursor-pointer"
            >
              View Due
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
            Completed
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
            Overdue
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
            placeholder="Search vaccines or clinic..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200/80 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Add Vaccination Button */}
        <button
          type="button"
          id="add-vaccination-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vaccination</span>
        </button>
      </div>

      {/* Filter notification */}
      {statusFilter !== 'all' && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-stone-100 text-xs text-stone-600">
          <span>
            Filtering by <strong>{statusFilter}</strong> ({filteredVaccinations.length} records)
          </span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Show All
          </button>
        </div>
      )}

      {/* Guidance Note */}
      <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-600 leading-relaxed">
          <strong>Clinic Tip:</strong> Tap the check or syringe icon on any card to quickly record vaccination administration, or use the status menu to mark custom dates and clinics.
        </p>
      </div>

      {/* Vaccination Cards List */}
      <div className="space-y-2.5">
        {filteredVaccinations.length > 0 ? (
          filteredVaccinations.map((vac) => (
            <VaccinationCard
              key={vac.id}
              vaccination={vac}
              detectedStatus={vacStatusMap.get(vac.id) || 'scheduled'}
              onStatusChange={updateVaccinationStatus}
              onEdit={handleOpenEdit}
              onDelete={(v) => setDeletingVac(v)}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white border border-stone-200/80 rounded-2xl space-y-2">
            <Syringe className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-700 font-display">No vaccination records found</p>
            <p className="text-[11px] text-stone-400">Add custom vaccinations or adjust your filters above.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl mt-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Vaccination Record</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Vaccination Modal */}
      <VaccinationForm
        isOpen={isFormOpen}
        initialVaccination={editingVac}
        babyId={activeBaby.id}
        onSave={handleSaveVaccination}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVac(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={!!deletingVac}
        title="Delete Vaccination Record?"
        message={`Are you sure you want to remove "${deletingVac?.name}"?`}
        confirmLabel="Delete Record"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVac(null)}
      />
    </div>
  );
};
