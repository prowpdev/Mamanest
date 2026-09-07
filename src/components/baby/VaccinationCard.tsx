import React, { useState } from 'react';
import { Syringe, CheckCircle2, Calendar, MapPin, User, Edit2, Trash2, ChevronDown, Check } from 'lucide-react';
import { Vaccination, VaccinationStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateFriendly } from '../../utils/formatters';

interface VaccinationCardProps {
  vaccination: Vaccination;
  detectedStatus: VaccinationStatus;
  onStatusChange: (id: string, newStatus: VaccinationStatus, administeredDate?: string) => void;
  onEdit: (vaccination: Vaccination) => void;
  onDelete: (vaccination: Vaccination) => void;
}

export const VaccinationCard: React.FC<VaccinationCardProps> = ({
  vaccination,
  detectedStatus,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const effectiveStatus = vaccination.status || detectedStatus;
  const isCompleted = effectiveStatus === 'completed';
  const isDue = effectiveStatus === 'due';
  const isOverdue = effectiveStatus === 'overdue';

  // Container styling based on age-based status
  let containerStyle = 'bg-white border-stone-200/80 hover:border-stone-300';
  if (isCompleted) {
    containerStyle = 'bg-white/90 border-emerald-200 shadow-2xs';
  } else if (isDue) {
    containerStyle =
      'bg-gradient-to-r from-rose-50/90 via-amber-50/50 to-white border-2 border-rose-300 shadow-xs ring-2 ring-rose-100/70';
  } else if (isOverdue) {
    containerStyle =
      'bg-amber-50/60 border-2 border-amber-300/90 shadow-2xs';
  }

  const handleQuickComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompleted) {
      onStatusChange(vaccination.id, 'scheduled', undefined);
    } else {
      onStatusChange(vaccination.id, 'completed', new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div
      id={`vaccination-card-${vaccination.id}`}
      className={`rounded-2xl p-4 border transition-all relative ${containerStyle}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {vaccination.category && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
              {vaccination.category}
            </span>
          )}
          {vaccination.doseNumber && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
              {vaccination.doseNumber}
            </span>
          )}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-50 text-stone-600 border border-stone-200">
            Age: {vaccination.recommendedAge}
          </span>
        </div>

        {/* Quick Status Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            id={`status-badge-btn-${vaccination.id}`}
            onClick={() => setShowStatusPicker(!showStatusPicker)}
            className="flex items-center gap-1 cursor-pointer group"
            title="Click to change status"
            aria-label="Change vaccination status"
          >
            <StatusBadge status={effectiveStatus} pulse={isDue} />
            <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-600" />
          </button>

          {/* Inline Status Menu */}
          {showStatusPicker && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-lg border border-stone-200 p-1.5 z-20 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <span className="text-[10px] font-bold text-stone-400 px-2 py-0.5 block uppercase tracking-wider">
                Change Status
              </span>
              {(
                [
                  { value: 'due', label: 'Due Now 🔴' },
                  { value: 'scheduled', label: 'Scheduled 📅' },
                  { value: 'completed', label: 'Completed 🟢' },
                  { value: 'overdue', label: 'Overdue ⚠️' },
                  { value: 'missed', label: 'Missed ⚪' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onStatusChange(
                      vaccination.id,
                      option.value,
                      option.value === 'completed'
                        ? vaccination.administeredDate || new Date().toISOString().split('T')[0]
                        : undefined
                    );
                    setShowStatusPicker(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    effectiveStatus === option.value
                      ? 'bg-rose-50 text-rose-700'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{option.label}</span>
                  {effectiveStatus === option.value && <Check className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex items-start gap-3">
        {/* Syringe Icon / Complete Check Button */}
        <button
          type="button"
          id={`toggle-vac-${vaccination.id}`}
          onClick={handleQuickComplete}
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer shadow-2xs ${
            isCompleted
              ? 'bg-emerald-500 border border-emerald-600 text-white hover:bg-emerald-600'
              : isDue
              ? 'bg-rose-500 border border-rose-600 text-white hover:bg-rose-600 animate-pulse'
              : 'bg-stone-100 border border-stone-200 text-stone-500 hover:bg-stone-200'
          }`}
          title={isCompleted ? 'Mark not completed' : 'Mark administered (completed)'}
          aria-label={isCompleted ? 'Mark vaccine uncompleted' : 'Mark vaccine completed'}
        >
          {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : <Syringe className="w-4 h-4" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-bold leading-snug font-display ${
                isCompleted ? 'text-stone-700' : 'text-stone-900'
              }`}
            >
              {vaccination.name}
            </h4>

            {/* Actions Menu */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                id={`edit-vaccination-${vaccination.id}`}
                onClick={() => onEdit(vaccination)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Edit Vaccination"
                aria-label={`Edit ${vaccination.name}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id={`delete-vaccination-${vaccination.id}`}
                onClick={() => onDelete(vaccination)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Vaccination"
                aria-label={`Delete ${vaccination.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Details Row: Dates & Locations */}
          <div className="mt-1.5 space-y-1 text-xs text-stone-600">
            {isCompleted && vaccination.administeredDate && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Administered on {formatDateFriendly(vaccination.administeredDate)}</span>
              </div>
            )}

            {!isCompleted && vaccination.scheduledDate && (
              <div className="flex items-center gap-1.5 text-stone-600">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Scheduled for {formatDateFriendly(vaccination.scheduledDate)}</span>
              </div>
            )}

            {(vaccination.clinic || vaccination.providerName) && (
              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                {vaccination.clinic && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {vaccination.clinic}
                  </span>
                )}
                {vaccination.providerName && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-stone-400" />
                    {vaccination.providerName}
                  </span>
                )}
              </div>
            )}

            {vaccination.notes && (
              <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-100">
                "{vaccination.notes}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
