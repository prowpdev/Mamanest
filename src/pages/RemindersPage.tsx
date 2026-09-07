import React, { useState } from 'react';
import { Plus, Bell, Calendar, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { BottomSheet } from '../components/common/BottomSheet';
import { formatDateFriendly } from '../utils/formatters';

export const RemindersPage: React.FC = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder, showToast } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM');
  const [category, setCategory] = useState<'doctor' | 'medication' | 'vaccine' | 'routine'>('doctor');
  const [notes, setNotes] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title: title.trim(),
      date,
      time,
      category,
      notes: notes.trim() || undefined,
    });

    setIsAddOpen(false);
    setTitle('');
    setNotes('');
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'doctor':
        return 'bg-rose-100 text-rose-700';
      case 'medication':
        return 'bg-purple-100 text-purple-700';
      case 'vaccine':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-teal-100 text-teal-700';
    }
  };

  return (
    <div id="reminders-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      <PageHeader
        title="Reminders"
        subtitle="Appointments & Daily Routines"
        showBack={true}
        showBabyPill={false}
        rightAction={
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        }
      />

      <main className="px-4 py-3 space-y-4">
        <div className="space-y-2.5">
          {reminders.length === 0 ? (
            <div className="p-8 bg-white border border-stone-200/80 rounded-2xl text-center">
              <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-stone-700">No reminders scheduled</h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Add pediatrician visits, vitamin drops, or diaper supply alerts.
              </p>
            </div>
          ) : (
            reminders.map((rem) => {
              const friendlyDate = formatDateFriendly(rem.date);

              return (
                <div
                  key={rem.id}
                  id={`reminder-card-${rem.id}`}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    rem.completed
                      ? 'bg-stone-50/80 border-stone-200/60 opacity-60'
                      : 'bg-white border-stone-200/80 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleReminder(rem.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors mt-0.5 cursor-pointer ${
                        rem.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-stone-300 bg-stone-50 hover:border-stone-400'
                      }`}
                      aria-label="Toggle completed"
                    >
                      {rem.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getCategoryColor(rem.category)}`}>
                          {rem.category}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold font-display ${
                          rem.completed ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {rem.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {friendlyDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {rem.time}
                        </span>
                      </div>

                      {rem.notes && (
                        <p className="text-[11px] text-stone-400 italic mt-1.5">{rem.notes}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-stone-300 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Add Reminder BottomSheet */}
      <BottomSheet
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule Reminder"
        subtitle="Set alerts for medical checkups, vitamins, or routines"
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4-Month Pediatrician Checkup"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
            >
              <option value="doctor">Doctor Visit / Checkup</option>
              <option value="medication">Medication / Vitamins</option>
              <option value="vaccine">Immunization</option>
              <option value="routine">Routine / Care Reminder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Bring vaccination card and question list"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            Save Reminder
          </button>
        </form>
      </BottomSheet>
    </div>
  );
};
