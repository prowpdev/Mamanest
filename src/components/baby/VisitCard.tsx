import React from 'react';
import {
  Calendar,
  User,
  MapPin,
  Scale,
  Ruler,
  Activity,
  Thermometer,
  FileText,
  Clock,
  Edit2,
  Trash2,
  Stethoscope,
  Syringe,
  Smile,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { HealthcareVisit, VisitType } from '../../types';
import { formatDateFriendly } from '../../utils/formatters';

interface VisitCardProps {
  visit: HealthcareVisit;
  isLatest?: boolean;
  onEdit: (visit: HealthcareVisit) => void;
  onDelete: (visit: HealthcareVisit) => void;
}

const VISIT_TYPE_CONFIG: Record<
  VisitType,
  { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
> = {
  'Pediatric Checkup': {
    label: 'Well-Child Checkup',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: <Stethoscope className="w-3.5 h-3.5" />,
  },
  Vaccination: {
    label: 'Vaccination Visit',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: <Syringe className="w-3.5 h-3.5" />,
  },
  'Growth Monitoring': {
    label: 'Growth Monitoring',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: <Scale className="w-3.5 h-3.5" />,
  },
  Dental: {
    label: 'Pediatric Dental',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    icon: <Smile className="w-3.5 h-3.5" />,
  },
  Emergency: {
    label: 'Emergency Care',
    bg: 'bg-rose-100',
    text: 'text-rose-900',
    border: 'border-rose-300',
    icon: <AlertCircle className="w-3.5 h-3.5" />,
  },
  'Sick Visit': {
    label: 'Sick Visit',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: <Thermometer className="w-3.5 h-3.5" />,
  },
  'Follow-up': {
    label: 'Follow-up Exam',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Other: {
    label: 'Clinical Visit',
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    border: 'border-stone-200',
    icon: <Activity className="w-3.5 h-3.5" />,
  },
};

export const VisitCard: React.FC<VisitCardProps> = ({ visit, isLatest = false, onEdit, onDelete }) => {
  const typeConfig = VISIT_TYPE_CONFIG[visit.visitType] || VISIT_TYPE_CONFIG.Other;

  const hasMeasurements =
    visit.weightKg !== undefined ||
    visit.heightCm !== undefined ||
    visit.headCircumferenceCm !== undefined ||
    visit.temperatureC !== undefined;

  const isFutureVisit = new Date(visit.date) > new Date();

  return (
    <div
      id={`visit-card-${visit.id}`}
      className={`rounded-2xl p-4 border transition-all relative ${
        isFutureVisit
          ? 'bg-gradient-to-br from-rose-50/70 to-amber-50/50 border-rose-200 shadow-2xs'
          : 'bg-white border-stone-200/80 shadow-2xs hover:border-stone-300'
      }`}
    >
      {/* Header bar: Type badge + Date + Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}
          >
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
          </span>

          {isLatest && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Latest Visit
            </span>
          )}

          {isFutureVisit && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-2xs">
              Upcoming
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id={`edit-visit-${visit.id}`}
            onClick={() => onEdit(visit)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Edit Visit"
            aria-label="Edit Visit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id={`delete-visit-${visit.id}`}
            onClick={() => onDelete(visit)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Visit"
            aria-label="Delete Visit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Date & Reason */}
      <div className="mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>{formatDateFriendly(visit.date)}</span>
          {visit.time && <span className="text-stone-400">• {visit.time}</span>}
        </div>

        <h4 className="text-sm font-bold text-stone-900 font-display mt-0.5 leading-snug">
          {visit.reasonForVisit || visit.title || `${visit.visitType} Consultation`}
        </h4>
      </div>

      {/* Provider & Clinic */}
      <div className="space-y-1 text-xs text-stone-600 mb-3">
        {visit.doctorName && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-medium text-stone-800">{visit.doctorName}</span>
          </div>
        )}
        {visit.clinic && (
          <div className="flex items-center gap-1.5 text-stone-500">
            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>{visit.clinic}</span>
          </div>
        )}
      </div>

      {/* Measurements Grid (if recorded) */}
      {hasMeasurements && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-center mb-3">
          {visit.weightKg !== undefined && (
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">Weight</span>
              <span className="text-xs font-bold text-stone-800 font-display">{visit.weightKg} kg</span>
            </div>
          )}
          {visit.heightCm !== undefined && (
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">Length</span>
              <span className="text-xs font-bold text-stone-800 font-display">{visit.heightCm} cm</span>
            </div>
          )}
          {visit.headCircumferenceCm !== undefined && (
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">Head Circ.</span>
              <span className="text-xs font-bold text-stone-800 font-display">
                {visit.headCircumferenceCm} cm
              </span>
            </div>
          )}
          {visit.temperatureC !== undefined && (
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">Temp</span>
              <span className="text-xs font-bold text-stone-800 font-display">{visit.temperatureC} °C</span>
            </div>
          )}
        </div>
      )}

      {/* Observations / Diagnosis */}
      {visit.diagnosis && (
        <div className="mb-2 text-xs text-stone-700 bg-rose-50/50 p-2 rounded-xl border border-rose-100/80">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
            Observations / Diagnosis
          </span>
          <p className="leading-relaxed">{visit.diagnosis}</p>
        </div>
      )}

      {/* Notes */}
      {visit.notes && (
        <div className="text-xs text-stone-600 mb-2">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-0.5">
            Visit Notes
          </span>
          <p className="leading-relaxed italic bg-stone-50/60 p-2 rounded-xl border border-stone-100">
            "{visit.notes}"
          </p>
        </div>
      )}

      {/* Follow-up Section */}
      {(visit.followUpDate || visit.followUpNotes) && (
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-start gap-1.5 text-xs text-stone-600">
          <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
          <div className="min-w-0">
            {visit.followUpDate && (
              <span className="font-bold text-stone-800">
                Follow-up: {formatDateFriendly(visit.followUpDate)}
              </span>
            )}
            {visit.followUpNotes && <p className="text-[11px] text-stone-500 mt-0.5">{visit.followUpNotes}</p>}
          </div>
        </div>
      )}
    </div>
  );
};
