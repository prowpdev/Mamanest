import React, { useState } from 'react';
import { Check, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { growthService } from '../../services/growthService';
import { Milestone } from '../../types';

export const MilestonesTracker: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => growthService.getMilestones());

  const toggleMilestone = (id: string) => {
    const updated = growthService.toggleMilestone(id);
    setMilestones(updated);
  };

  const completedCount = milestones.filter((m) => m.completed).length;

  const thingsToTry = [
    { title: 'Talk to your baby', desc: 'Narrate your day and wait for their coos or smiles.' },
    { title: 'Sing gentle songs', desc: 'Rhythmic melodies soothe and stimulate auditory tracking.' },
    { title: 'Read together', desc: 'Show high-contrast board books and point to pictures.' },
    { title: 'Show colorful objects', desc: 'Slowly move a bright toy from left to right for eye tracking.' },
  ];

  return (
    <div className="space-y-4">
      {/* Age Band Banner */}
      <div className="p-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded-2xl shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-rose-100 uppercase tracking-wider block">
              Current Stage
            </span>
            <h3 className="text-xl font-bold font-display">3–4 Months</h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-display">{completedCount}/{milestones.length}</span>
            <span className="text-[11px] block text-rose-100">achieved</span>
          </div>
        </div>
      </div>

      {/* Medical disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          <strong>Pediatric Guidance:</strong> Developmental milestones are general observations, not rigid timetables or medical diagnoses. Every baby develops skills at their own unique pace. If you have concerns, consult your pediatrician.
        </p>
      </div>

      {/* Milestone Checklists */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider px-1">
          Your baby may begin to:
        </h4>

        <div className="space-y-2">
          {milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => toggleMilestone(m.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                m.completed
                  ? 'bg-white border-emerald-200 shadow-2xs'
                  : 'bg-white border-stone-200/80 hover:border-stone-300'
              }`}
            >
              <button
                type="button"
                className={`w-6 h-6 rounded-lg flex items-center justify-center border shrink-0 transition-colors mt-0.5 cursor-pointer ${
                  m.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-stone-300 bg-stone-50'
                }`}
                aria-label={m.completed ? 'Milestone completed' : 'Milestone not completed'}
              >
                {m.completed && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-bold block ${
                    m.completed ? 'text-stone-900 line-through text-stone-400' : 'text-stone-900'
                  }`}
                >
                  {m.title}
                </span>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{m.description}</p>

                {m.suggestedActivities?.length > 0 && !m.completed && (
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center gap-1 text-[11px] text-rose-600 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>Try: {m.suggestedActivities[0]}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Things you can try */}
      <div className="p-4 bg-white border border-stone-200/80 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-500" />
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider font-display">
            Things You Can Try Together
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {thingsToTry.map((item, idx) => (
            <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="text-xs font-bold text-stone-800 block mb-0.5">
                • {item.title}
              </span>
              <p className="text-[11px] text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
