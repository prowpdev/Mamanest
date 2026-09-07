import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NoteFormProps {
  onSuccess?: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSuccess }) => {
  const { logNote } = useApp();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isMilestoneMemory, setIsMilestoneMemory] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    logNote({
      timestamp: new Date().toISOString(),
      title: title.trim() || 'Daily Moment',
      content: content.trim(),
      isMilestoneMemory,
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Milestone memory toggle */}
      <div
        onClick={() => setIsMilestoneMemory(!isMilestoneMemory)}
        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
          isMilestoneMemory
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-stone-50 border-stone-200 text-stone-700'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Heart
            className={`w-5 h-5 ${isMilestoneMemory ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`}
          />
          <div>
            <span className="text-xs font-bold block">Milestone Memory?</span>
            <span className="text-[11px] text-stone-500">Save this special baby milestone memory</span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isMilestoneMemory}
          onChange={(e) => setIsMilestoneMemory(e.target.checked)}
          className="w-5 h-5 accent-rose-500 rounded cursor-pointer pointer-events-none"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Emma smiled for the first time today ❤️"
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1">Note Details *</label>
        <textarea
          rows={4}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write down little moments, doctor comments, or sweet thoughts..."
          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 resize-none"
        />
      </div>

      <button
        type="submit"
        id="save-note-btn"
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
      >
        Save Note
      </button>
    </form>
  );
};
