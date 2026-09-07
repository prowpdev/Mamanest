import React, { useState, useEffect } from 'react';
import { X, Syringe } from 'lucide-react';
import { Vaccination, VaccinationStatus } from '../../types';
import { parseVaccinationAgeToMonths } from '../../utils/ageCalculator';

interface VaccinationFormProps {
  isOpen: boolean;
  initialVaccination?: Vaccination | null;
  babyId: string;
  onSave: (data: Omit<Vaccination, 'id'> | Vaccination) => void;
  onClose: () => void;
}

const AGE_OPTIONS = [
  'Birth',
  '1 Month',
  '2 Months',
  '4 Months',
  '6 Months',
  '9 Months',
  '12 Months',
  '15 Months',
  '18 Months',
  '2 Years',
  '4–6 Years',
];

const CATEGORY_OPTIONS = [
  'Combined Infant Immunization',
  'Hepatitis B (HepB)',
  'Rotavirus (RV)',
  'DTaP (Diphtheria, Tetanus, Pertussis)',
  'Hib (Haemophilus influenzae type b)',
  'PCV15 (Pneumococcal)',
  'IPV (Inactivated Poliovirus)',
  'MMR (Measles, Mumps, Rubella)',
  'Varicella (Chickenpox)',
  'Hepatitis A (HepA)',
  'Influenza (Flu)',
  'COVID-19',
  'Other',
];

const DOSE_OPTIONS = ['Dose 1', 'Dose 2', 'Dose 3', 'Dose 4', 'Booster', 'Annual', 'Single Dose'];

export const VaccinationForm: React.FC<VaccinationFormProps> = ({
  isOpen,
  initialVaccination,
  babyId,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialVaccination;

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [doseNumber, setDoseNumber] = useState('Dose 1');
  const [recommendedAge, setRecommendedAge] = useState('2 Months');
  const [scheduledDate, setScheduledDate] = useState('');
  const [administeredDate, setAdministeredDate] = useState('');
  const [status, setStatus] = useState<VaccinationStatus>('scheduled');
  const [clinic, setClinic] = useState('');
  const [providerName, setProviderName] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialVaccination) {
      setName(initialVaccination.name || '');
      setCategory(initialVaccination.category || CATEGORY_OPTIONS[0]);
      setDoseNumber(initialVaccination.doseNumber || 'Dose 1');
      setRecommendedAge(initialVaccination.recommendedAge || '2 Months');
      setScheduledDate(initialVaccination.scheduledDate || '');
      setAdministeredDate(initialVaccination.administeredDate || '');
      setStatus(initialVaccination.status || 'scheduled');
      setClinic(initialVaccination.clinic || '');
      setProviderName(initialVaccination.providerName || '');
      setNotes(initialVaccination.notes || '');
    } else {
      setName('');
      setCategory(CATEGORY_OPTIONS[0]);
      setDoseNumber('Dose 1');
      setRecommendedAge('2 Months');
      setScheduledDate('');
      setAdministeredDate('');
      setStatus('scheduled');
      setClinic('');
      setProviderName('');
      setNotes('');
    }
    setErrors({});
  }, [initialVaccination, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Vaccine name is required';
    }

    if (status === 'completed' && !administeredDate.trim()) {
      newErrors.administeredDate = 'Please specify the administration date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const recMonths = parseVaccinationAgeToMonths(recommendedAge);

    const payload = {
      babyId,
      name: name.trim(),
      category,
      doseNumber,
      recommendedAge,
      recommendedAgeMonths: recMonths,
      scheduledDate: scheduledDate || undefined,
      administeredDate: status === 'completed' ? administeredDate || new Date().toISOString().split('T')[0] : undefined,
      status,
      clinic: clinic.trim() || undefined,
      providerName: providerName.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (isEditing && initialVaccination) {
      onSave({
        ...initialVaccination,
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
      aria-labelledby="vaccination-form-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/80 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Syringe className="w-4 h-4" />
            </div>
            <div>
              <h3 id="vaccination-form-title" className="text-base font-bold text-stone-900 font-display">
                {isEditing ? 'Edit Vaccination' : 'Add Vaccination'}
              </h3>
              <p className="text-xs text-stone-500">Immunization record & scheduled administration</p>
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Vaccine Name */}
          <div>
            <label htmlFor="vac-name" className="block text-xs font-bold text-stone-700 mb-1">
              Vaccine Name *
            </label>
            <input
              id="vac-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DTaP, IPV, Hib, PCV15, Rotavirus (Combo)"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 ${
                errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-rose-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Category & Dose Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vac-category" className="block text-xs font-bold text-stone-700 mb-1">
                Vaccine Type / Category
              </label>
              <select
                id="vac-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vac-dose" className="block text-xs font-bold text-stone-700 mb-1">
                Dose Number
              </label>
              <select
                id="vac-dose"
                value={doseNumber}
                onChange={(e) => setDoseNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {DOSE_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recommended Age & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vac-rec-age" className="block text-xs font-bold text-stone-700 mb-1">
                Recommended Age
              </label>
              <select
                id="vac-rec-age"
                value={recommendedAge}
                onChange={(e) => setRecommendedAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vac-status" className="block text-xs font-bold text-stone-700 mb-1">
                Status
              </label>
              <select
                id="vac-status"
                value={status}
                onChange={(e) => {
                  const val = e.target.value as VaccinationStatus;
                  setStatus(val);
                  if (val === 'completed' && !administeredDate) {
                    setAdministeredDate(new Date().toISOString().split('T')[0]);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="due">Due Now 🔴</option>
                <option value="scheduled">Scheduled 📅</option>
                <option value="completed">Completed 🟢</option>
                <option value="overdue">Overdue ⚠️</option>
                <option value="missed">Missed ⚪</option>
              </select>
            </div>
          </div>

          {/* Scheduled & Administered Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vac-scheduled-date" className="block text-xs font-bold text-stone-700 mb-1">
                Scheduled Date (Optional)
              </label>
              <input
                id="vac-scheduled-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label htmlFor="vac-admin-date" className="block text-xs font-bold text-stone-700 mb-1">
                Date Administered {status === 'completed' && '*'}
              </label>
              <input
                id="vac-admin-date"
                type="date"
                value={administeredDate}
                onChange={(e) => {
                  setAdministeredDate(e.target.value);
                  if (e.target.value && status !== 'completed') {
                    setStatus('completed');
                  }
                }}
                className={`w-full px-3 py-2 rounded-xl border text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 ${
                  errors.administeredDate
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-stone-200 focus:ring-rose-200'
                }`}
              />
              {errors.administeredDate && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.administeredDate}</p>
              )}
            </div>
          </div>

          {/* Healthcare Clinic & Provider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="vac-clinic" className="block text-xs font-bold text-stone-700 mb-1">
                Clinic / Hospital (Optional)
              </label>
              <input
                id="vac-clinic"
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="e.g. Sunrise Pediatrics, Suite 204"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label htmlFor="vac-provider" className="block text-xs font-bold text-stone-700 mb-1">
                Healthcare Provider (Optional)
              </label>
              <input
                id="vac-provider"
                type="text"
                value={providerName}
                onChange={(e) => setProviderName(e.target.value)}
                placeholder="e.g. Dr. Evelyn Martinez, MD"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="vac-notes" className="block text-xs font-bold text-stone-700 mb-1">
              Notes & Post-Vaccination Observations (Optional)
            </label>
            <textarea
              id="vac-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mild fussiness, gave extra cuddles. No fever observed."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Submit Actions */}
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
              id="submit-vaccination-form-btn"
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Add Vaccination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
