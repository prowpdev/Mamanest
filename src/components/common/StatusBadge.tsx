import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Sparkles, XCircle, CalendarClock } from 'lucide-react';

export type BadgeStatus = 'due' | 'upcoming' | 'completed' | 'overdue' | 'scheduled' | 'missed';

interface StatusBadgeProps {
  status: BadgeStatus;
  labelOverride?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  labelOverride,
  size = 'md',
  pulse = false,
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  switch (status) {
    case 'due':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200/90 shadow-2xs whitespace-nowrap ${sizeClasses} ${
            pulse ? 'ring-2 ring-rose-300 ring-offset-1 animate-pulse' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
          <Sparkles className="w-3 h-3 text-rose-500 shrink-0" />
          <span>{labelOverride || 'Action Required'}</span>
        </span>
      );

    case 'upcoming':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 whitespace-nowrap ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-amber-500 shrink-0" />
          <span>{labelOverride || 'Upcoming'}</span>
        </span>
      );

    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 stroke-[2.5]" />
          <span>{labelOverride || 'Completed'}</span>
        </span>
      );

    case 'overdue':
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-full bg-amber-100/80 text-amber-900 border border-amber-300 whitespace-nowrap ${sizeClasses}`}
        >
          <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
          <span>{labelOverride || 'Overdue'}</span>
        </span>
      );

    case 'missed':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-stone-100 text-stone-600 border border-stone-200 whitespace-nowrap ${sizeClasses}`}
        >
          <XCircle className="w-3 h-3 text-stone-400 shrink-0" />
          <span>{labelOverride || 'Missed'}</span>
        </span>
      );

    case 'scheduled':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap ${sizeClasses}`}
        >
          <CalendarClock className="w-3 h-3 text-blue-500 shrink-0" />
          <span>{labelOverride || 'Scheduled'}</span>
        </span>
      );
  }
};
