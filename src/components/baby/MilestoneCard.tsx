import React from 'react';
import { Check, Edit2, Trash2, Sparkles, Calendar, FileText, ChevronRight } from 'lucide-react';
import { Milestone, MilestoneCategory } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateFriendly } from '../../utils/formatters';

interface MilestoneCardProps {
  milestone: Milestone;
  detectedStatus: 'due' | 'upcoming' | 'completed' | 'overdue';
  onToggle: (id: string) => void;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
}

const CATEGORY_CONFIG: Record<
  MilestoneCategory,
  { label: string; bg: string; text: string; border: string; icon: string }
> = {
  motor: {
    label: 'Motor',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-100',
    icon: '🏃',
  },
  social: {
    label: 'Social & Emotional',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-100',
    icon: '💛',
  },
  cognitive: {
    label: 'Cognitive',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    icon: '🧠',
  },
  language: {
    label: 'Language',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-100',
    icon: '💬',
  },
  sensory: {
    label: 'Sensory',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    icon: '✨',
  },
  other: {
    label: 'Other',
    bg: 'bg-stone-50',
    text: 'text-stone-700',
    border: 'border-stone-200',
    icon: '🌟',
  },
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  detectedStatus,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const isDueNow = detectedStatus === 'due';
  const isOverdue = detectedStatus === 'overdue';
  const isCompleted = milestone.completed;

  const categoryInfo = CATEGORY_CONFIG[milestone.category] || CATEGORY_CONFIG.other;

  // Determine container styling based on age-based status
  let containerStyle = 'bg-white border-stone-200/80 hover:border-stone-300';
  if (isCompleted) {
    containerStyle = 'bg-white/90 border-emerald-200 shadow-2xs opacity-95';
  } else if (isDueNow) {
    containerStyle =
      'bg-gradient-to-r from-rose-50/90 via-amber-50/60 to-white border-2 border-rose-300 shadow-xs ring-2 ring-rose-100/80';
  } else if (isOverdue) {
    containerStyle =
      'bg-amber-50/50 border-2 border-amber-300/90 shadow-2xs';
  }

  return (
    <div
      id={`milestone-card-${milestone.id}`}
      className={`rounded-2xl p-4 border transition-all relative ${containerStyle}`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Category Tag */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryInfo.bg} ${categoryInfo.text} ${categoryInfo.border}`}
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </span>

          {/* Recommended Age Range */}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            {milestone.ageRange}
          </span>
        </div>

        {/* Status Badge */}
        <StatusBadge
          status={detectedStatus}
          labelOverride={
            isDueNow
              ? 'Action Required'
              : isOverdue
              ? 'Past Stage'
              : isCompleted
              ? 'Achieved'
              : 'Upcoming'
          }
          pulse={isDueNow}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex items-start gap-3">
        {/* Completion Toggle Button */}
        <button
          type="button"
          id={`toggle-milestone-${milestone.id}`}
          onClick={() => onToggle(milestone.id)}
          className={`w-7 h-7 rounded-xl flex items-center justify-center border shrink-0 transition-all mt-0.5 cursor-pointer shadow-2xs ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600'
              : isDueNow
              ? 'border-rose-400 bg-white hover:bg-rose-50 text-rose-500'
              : 'border-stone-300 bg-stone-50 hover:bg-stone-100 text-transparent'
          }`}
          title={isCompleted ? 'Mark uncompleted' : 'Mark completed'}
          aria-label={isCompleted ? 'Mark milestone uncompleted' : 'Mark milestone completed'}
        >
          <Check className={`w-4 h-4 stroke-[3] ${isCompleted ? 'block' : 'opacity-30 hover:opacity-100'}`} />
        </button>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-bold leading-snug font-display ${
                isCompleted ? 'text-stone-700 line-through decoration-emerald-500/60' : 'text-stone-900'
              }`}
            >
              {milestone.title}
            </h4>

            {/* Actions Menu */}
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                id={`edit-milestone-${milestone.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(milestone);
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Edit Milestone"
                aria-label={`Edit ${milestone.title}`}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                id={`delete-milestone-${milestone.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(milestone);
                }}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Delete Milestone"
                aria-label={`Delete ${milestone.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{milestone.description}</p>

          {/* Target Date or Target Age */}
          {milestone.targetDate && (
            <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-1.5 font-medium">
              <Calendar className="w-3 h-3 text-stone-400" />
              <span>Target: {formatDateFriendly(milestone.targetDate)}</span>
            </div>
          )}

          {/* Notes */}
          {milestone.notes && (
            <div className="flex items-start gap-1 text-[11px] text-stone-500 mt-1.5 italic bg-stone-50/80 p-1.5 rounded-lg border border-stone-100">
              <FileText className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
              <p className="leading-snug">{milestone.notes}</p>
            </div>
          )}

          {/* Completion timestamp */}
          {isCompleted && milestone.completedDate && (
            <p className="text-[10px] text-emerald-600 font-semibold mt-1.5">
              Achieved on {formatDateFriendly(milestone.completedDate)} 🎉
            </p>
          )}

          {/* Suggested Activities */}
          {milestone.suggestedActivities && milestone.suggestedActivities.length > 0 && !isCompleted && (
            <div className="mt-2.5 pt-2 border-t border-stone-100 space-y-1">
              {milestone.suggestedActivities.map((activity, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
                  <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="leading-tight">Try: {activity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
