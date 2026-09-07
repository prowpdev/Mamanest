import React, { useState, useEffect } from 'react';
import { X, Calendar, Stethoscope, Scale } from 'lucide-react';
import { HealthcareVisit, VisitType } from '../../types';

interface VisitFormProps {
  isOpen: boolean;
  initialVisit?: HealthcareVisit | null;
  babyId: string;
  defaultDoctorName?: string;
  onSave: (data: Omit<HealthcareVisit, 'id'> | HealthcareVisit) => void;
  onClose: () => void;
}

const VISIT_TYPES: VisitType[] = [
  'Pediatric Checkup',
  'Vaccination',
  'Growth Monitoring',
  'Dental',
  'Emergency',
  'Sick Visit',
  'Follow-up',
  'Other',
];

export const VisitForm: React.FC<VisitFormProps> = ({
  isOpen,
  initialVisit,
  babyId,
  defaultDoctorName = 'Dr. Evelyn Martinez, MD',
  onSave,
  onClose,
}) => {
  const isEditing = !!initialVisit;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [visitType, setVisitType] = useState<VisitType>('Pediatric Checkup');
  const [doctorName, setDoctorName] = useState(defaultDoctorName);
  const [clinic, setClinic] = useState('Sunrise Pediatrics, Suite 204');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState('');
  const [temperatureC, setTemperatureC] = useState('');
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialVisit) {
      setDate(initialVisit.date || new Date().toISOString().split('T')[0]);
      setTime(initialVisit.time || '10:00');
      setVisitType(initialVisit.visitType || 'Pediatric Checkup');
      setDoctorName(initialVisit.doctorName || defaultDoctorName);
      setClinic(initialVisit.clinic || 'Sunrise Pediatrics, Suite 204');
      setReasonForVisit(initialVisit.reasonForVisit || initialVisit.title || '');
      setWeightKg(initialVisit.weightKg !== undefined ? String(initialVisit.weightKg) : '');
      setHeightCm(initialVisit.heightCm !== undefined ? String(initialVisit.heightCm) : '');
      setHeadCircumferenceCm(
        initialVisit.headCircumferenceCm !== undefined ? String(initialVisit.headCircumferenceCm) : ''
      );
      setTemperatureC(initialVisit.temperatureC !== undefined ? String(initialVisit.temperatureC) : '');
      setNotes(initialVisit.notes || '');
      setDiagnosis(initialVisit.diagnosis || '');
      setFollowUpDate(initialVisit.followUpDate || '');
      setFollowUpNotes(initialVisit.followUpNotes || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00');
      setVisitType('Pediatric Checkup');
      setDoctorName(defaultDoctorName);
      setClinic('Sunrise Pediatrics, Suite 204');
      setReasonForVisit('');
      setWeightKg('');
      setHeightCm('');
      setHeadCircumferenceCm('');
      setTemperatureC('');
      setNotes('');
      setDiagnosis('');
      setFollowUpDate('');
      setFollowUpNotes('');
    }
    setErrors({});
  }, [initialVisit, isOpen, defaultDoctorName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!date.trim()) {
      newErrors.date = 'Visit date is required';
    }
    if (!reasonForVisit.trim()) {
      newErrors.reasonForVisit = 'Please provide the reason for this visit';
    }
    if (!doctorName.trim()) {
      newErrors.doctorName = 'Healthcare provider name is required';
    }
    if (!clinic.trim()) {
      newErrors.clinic = 'Clinic or hospital name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      babyId,
      date,
      time: time || undefined,
      visitType,
      doctorName: doctorName.trim(),
      clinic: clinic.trim(),
      reasonForVisit: reasonForVisit.trim(),
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      headCircumferenceCm: headCircumferenceCm ? parseFloat(headCircumferenceCm) : undefined,
      temperatureC: temperatureC ? parseFloat(temperatureC) : undefined,
      notes: notes.trim() || undefined,
      diagnosis: diagnosis.trim() || undefined,
      followUpDate: followUpDate || undefined,
      followUpNotes: followUpNotes.trim() || undefined,
      completed: new Date(date) <= new Date(),
      title: `${visitType} - ${doctorName.trim()}`,
    };

    if (isEditing && initialVisit) {
      onSave({
        ...initialVisit,
        ...payload,
      });
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-form-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/80 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 id="visit-form-title" className="text-base font-bold text-stone-900 font-display">
                {isEditing ? 'Edit Healthcare Visit' : 'Add Healthcare Visit'}
              </h3>
              <p className="text-xs text-stone-500">Clinical appointment, well-child exam & checkups</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Date, Time & Visit Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="visit-date" className="block text-xs font-bold text-stone-700 mb-1">
                Visit Date *
              </label>
              <input
                id="visit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 ${
                  errors.date ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-rose-200'
                }`}
              />
              {errors.date && <p className="text-[11px] text-rose-500 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="visit-time" className="block text-xs font-bold text-stone-700 mb-1">
                Time (Optional)
              </label>
              <input
                id="visit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label htmlFor="visit-type-select" className="block text-xs font-bold text-stone-700 mb-1">
                Visit Type *
              </label>
              <select
                id="visit-type-select"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitType)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {VISIT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reason for visit */}
          <div>
            <label htmlFor="visit-reason" className="block text-xs font-bold text-stone-700 mb-1">
              Reason for Visit *
            </label>
            <input
              id="visit-reason"
              type="text"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
              placeholder="e.g. 4-Month Well-Child Exam & Developmental Review"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 ${
                errors.reasonForVisit
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-stone-200 focus:ring-rose-200'
              }`}
            />
            {errors.reasonForVisit && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.reasonForVisit}</p>
            )}
          </div>

          {/* Provider & Clinic Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="visit-doctor" className="block text-xs font-bold text-stone-700 mb-1">
                Healthcare Provider *
              </label>
              <input
                id="visit-doctor"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Evelyn Martinez, MD"
                className={`w-full px-3.5 py-2 rounded-xl border text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 ${
                  errors.doctorName
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-stone-200 focus:ring-rose-200'
                }`}
              />
              {errors.doctorName && <p className="text-[11px] text-rose-500 mt-1">{errors.doctorName}</p>}
            </div>

            <div>
              <label htmlFor="visit-clinic" className="block text-xs font-bold text-stone-700 mb-1">
                Clinic / Hospital *
              </label>
              <input
                id="visit-clinic"
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="e.g. Sunrise Pediatrics, Suite 204"
                className={`w-full px-3.5 py-2 rounded-xl border text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 ${
                  errors.clinic ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-rose-200'
                }`}
              />
              {errors.clinic && <p className="text-[11px] text-rose-500 mt-1">{errors.clinic}</p>}
            </div>
          </div>

          {/* Measurements Section (Syncs with growth tracking) */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Scale className="w-3.5 h-3.5 text-rose-500" />
              <span>Baby's Measurements (Optional)</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Values entered here are also safely saved to your Baby's growth charts.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label htmlFor="visit-weight" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Weight (kg)
                </label>
                <input
                  id="visit-weight"
                  type="number"
                  step="0.01"
                  min="0"
                  max="30"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="e.g. 6.2"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 bg-white"
                />
              </div>

              <div>
                <label htmlFor="visit-height" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Height / Length (cm)
                </label>
                <input
                  id="visit-height"
                  type="number"
                  step="0.1"
                  min="0"
                  max="150"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="e.g. 61.0"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 bg-white"
                />
              </div>

              <div>
                <label htmlFor="visit-head" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Head Circ. (cm)
                </label>
                <input
                  id="visit-head"
                  type="number"
                  step="0.1"
                  min="0"
                  max="80"
                  value={headCircumferenceCm}
                  onChange={(e) => setHeadCircumferenceCm(e.target.value)}
                  placeholder="e.g. 39.5"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 bg-white"
                />
              </div>

              <div>
                <label htmlFor="visit-temp" className="block text-[11px] font-medium text-stone-600 mb-1">
                  Temp (°C)
                </label>
                <input
                  id="visit-temp"
                  type="number"
                  step="0.1"
                  min="30"
                  max="45"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(e.target.value)}
                  placeholder="e.g. 36.8"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Observations / Diagnosis */}
          <div>
            <label htmlFor="visit-diagnosis" className="block text-xs font-bold text-stone-700 mb-1">
              Doctor's Observations / Diagnosis (Optional)
            </label>
            <textarea
              id="visit-diagnosis"
              rows={2}
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Thriving infant. Strong neck control and steady weight gain."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="visit-notes" className="block text-xs font-bold text-stone-700 mb-1">
              General Notes & Parent Questions (Optional)
            </label>
            <textarea
              id="visit-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Asked about sleep stretches and daytime tummy time stamina..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Follow-up Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="visit-followup-date" className="block text-xs font-bold text-stone-700 mb-1">
                Follow-up Date (Optional)
              </label>
              <input
                id="visit-followup-date"
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label htmlFor="visit-followup-notes" className="block text-xs font-bold text-stone-700 mb-1">
                Follow-up Plan / Instructions (Optional)
              </label>
              <input
                id="visit-followup-notes"
                type="text"
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                placeholder="e.g. 6-Month routine checkup & solid food guidance"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-visit-form-btn"
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Add Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
