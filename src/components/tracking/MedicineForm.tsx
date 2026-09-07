import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MedicineFormProps {
  onSuccess?: () => void;
}

export const MedicineForm: React.FC<MedicineFormProps> = ({ onSuccess }) => {
  const { logMedicine } = useApp();

  const [name, setName] = useState<string>('Vitamin D3 Drops');
  const [dosage, setDosage] = useState<string>('400 IU (1 drop)');
  const [reason, setReason] = useState<string>('Daily pediatric routine');
  const [notes, setNotes] = useState<string>('');

  const suggestions = [
    { name: 'Vitamin D3 Drops', dose: '400 IU (1 drop)', reason: 'Daily pediatric routine' },
    { name: 'Infant Paracetamol', dose: 'As prescribed by doctor', reason: 'Fever / post-vaccine' },
    { name: 'Saline Nasal Drops', dose: '1–2 drops per nostril', reason: 'Congestion relief' },
    { name: 'Probiotic Drops', dose: '5 drops', reason: 'Digestive comfort' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    logMedicine({
      timestamp: new Date().toISOString(),
      medicineName: name.trim(),
      dosage: dosage.trim(),
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Medical Warning */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-2.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong className="font-semibold">Safety Notice:</strong> Always confirm medication names, exact dosages, and intervals with your pediatrician or qualified healthcare professional. Never exceed prescribed doses.
        </p>
      </div>

      {/* Quick suggestions */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Common Medications</label>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => {
                setName(s.name);
                setDosage(s.dose);
                setReason(s.reason);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                name === s.name
                  ? 'bg-purple-100 text-purple-800 border-purple-300 font-bold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Name */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Medicine Name *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Vitamin D3 Drops"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Dosage */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Dose Given *</label>
        <input
          type="text"
          required
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="e.g. 400 IU (1 drop) or 2.5 ml"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Reason / Condition</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Routine supplement, post-vaccine fever"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Notes</label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Administered with morning feeding"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
        />
      </div>

      <button
        type="submit"
        id="save-med-btn"
        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Medicine Record
      </button>
    </form>
  );
};
