import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Trash2 } from 'lucide-react';
import { Milestone, MilestoneCategory, MilestoneStatus } from '../../types';
import { parseAgeRangeToMonths } from '../../utils/ageCalculator';

interface MilestoneFormProps {
  isOpen: boolean;
  initialMilestone?: Milestone | null;
  babyId: string;
  onSave: (milestoneData: Omit<Milestone, 'id'> | Milestone) => void;
  onClose: () => void;
}

const AGE_RANGE_OPTIONS = [
  '0–2 Months',
  '3–4 Months',
  '5–6 Months',
  '7–9 Months',
  '10–12 Months',
  '13–18 Months',
  '19–24 Months',
  '2+ Years',
];

const CATEGORIES: { value: MilestoneCategory; label: string }[] = [
  { value: 'motor', label: 'Motor Skills' },
  { value: 'social', label: 'Social & Emotional' },
  { value: 'cognitive', label: 'Cognitive & Thinking' },
  { value: 'language', label: 'Language & Speech' },
  { value: 'sensory', label: 'Sensory' },
  { value: 'other', label: 'General Development' },
];

export const MilestoneForm: React.FC<MilestoneFormProps> = ({
  isOpen,
  initialMilestone,
  babyId,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialMilestone;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MilestoneCategory>('motor');
  const [ageRange, setAgeRange] = useState('3–4 Months');
  const [targetDate, setTargetDate] = useState('');
  const [status, setStatus] = useState<MilestoneStatus>('due');
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [suggestedActivities, setSuggestedActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialMilestone) {
      setTitle(initialMilestone.title || '');
      setDescription(initialMilestone.description || '');
      setCategory(initialMilestone.category || 'motor');
      setAgeRange(initialMilestone.ageRange || '3–4 Months');
      setTargetDate(initialMilestone.targetDate || '');
      setStatus(initialMilestone.status || (initialMilestone.completed ? 'completed' : 'due'));
      setCompleted(initialMilestone.completed || false);
      setNotes(initialMilestone.notes || '');
      setSuggestedActivities(initialMilestone.suggestedActivities || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('motor');
      setAgeRange('3–4 Months');
      setTargetDate('');
      setStatus('due');
      setCompleted(false);
      setNotes('');
      setSuggestedActivities([]);
    }
    setNewActivity('');
    setErrors({});
  }, [initialMilestone, isOpen]);

  if (!isOpen) return null;

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setSuggestedActivities([...suggestedActivities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const handleRemoveActivity = (idx: number) => {
    setSuggestedActivities(suggestedActivities.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Milestone title is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Please describe this milestone';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { minMonths, maxMonths } = parseAgeRangeToMonths(ageRange);

    const payload = {
      babyId,
      title: title.trim(),
      description: description.trim(),
      category,
      ageRange,
      minAgeMonths: minMonths,
      maxAgeMonths: maxMonths,
      targetDate: targetDate || undefined,
      status: completed ? 'completed' : status,
      completed,
      completedDate: completed
        ? initialMilestone?.completedDate || new Date().toISOString().split('T')[0]
        : undefined,
      notes: notes.trim() || undefined,
      suggestedActivities,
    };

    if (isEditing && initialMilestone) {
      onSave({
        ...initialMilestone,
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
      aria-labelledby="milestone-form-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/80 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h3 id="milestone-form-title" className="text-base font-bold text-stone-900 font-display">
              {isEditing ? 'Edit Milestone' : 'Add Milestone'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Track developmental achievements and gentle daily practices
            </p>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label htmlFor="milestone-title" className="block text-xs font-bold text-stone-700 mb-1">
              Milestone Title / Name *
            </label>
            <input
              id="milestone-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rolls over from tummy to back"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 ${
                errors.title ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-rose-200'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="milestone-desc" className="block text-xs font-bold text-stone-700 mb-1">
              Description *
            </label>
            <textarea
              id="milestone-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Discovers how to push off with arms during floor tummy play..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 ${
                errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-200 focus:ring-rose-200'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Category & Age Range Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="milestone-category" className="block text-xs font-bold text-stone-700 mb-1">
                Category
              </label>
              <select
                id="milestone-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as MilestoneCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="milestone-age-range" className="block text-xs font-bold text-stone-700 mb-1">
                Recommended Age Range
              </label>
              <select
                id="milestone-age-range"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                {AGE_RANGE_OPTIONS.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="milestone-target-date" className="block text-xs font-bold text-stone-700 mb-1">
                Target Date / Age (Optional)
              </label>
              <input
                id="milestone-target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </div>

            <div>
              <label htmlFor="milestone-status-select" className="block text-xs font-bold text-stone-700 mb-1">
                Status
              </label>
              <select
                id="milestone-status-select"
                value={completed ? 'completed' : status}
                onChange={(e) => {
                  const val = e.target.value as MilestoneStatus;
                  setStatus(val);
                  setCompleted(val === 'completed');
                }}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-200"
              >
                <option value="due">Action Required / Due Now</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Quick Achieved Checkbox */}
          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 cursor-pointer">
            <input
              type="checkbox"
              id="milestone-completed-toggle"
              checked={completed}
              onChange={(e) => {
                setCompleted(e.target.checked);
                if (e.target.checked) setStatus('completed');
              }}
              className="w-4 h-4 rounded text-rose-500 focus:ring-rose-300 border-stone-300"
            />
            <span className="text-xs font-bold text-stone-800">
              Already completed / achieved by baby
            </span>
          </label>

          {/* Notes */}
          <div>
            <label htmlFor="milestone-notes" className="block text-xs font-bold text-stone-700 mb-1">
              Personal Notes (Optional)
            </label>
            <textarea
              id="milestone-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific observations, favorite toys, or memories..."
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>

          {/* Suggested Activities / Stimulations */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Suggested Activities (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddActivity();
                  }
                }}
                placeholder="Add a gentle practice or stimulation tip..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {suggestedActivities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {suggestedActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-rose-50/60 border border-rose-100 text-xs text-stone-700"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
                      <span className="truncate">{act}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(idx)}
                      className="text-stone-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              id="submit-milestone-form-btn"
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
