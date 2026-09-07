import React, { ReactNode } from 'react';

interface StatCardProps {
  id?: string;
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  badge?: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  icon,
  label,
  value,
  unit,
  badge,
  bgColor = 'bg-white',
  textColor = 'text-stone-900',
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`${bgColor} border border-stone-100/80 rounded-2xl p-3.5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:shadow-sm active:scale-98' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="p-2 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
          {icon}
        </span>
        {badge && (
          <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-stone-500 mb-0.5">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold font-display ${textColor}`}>{value}</span>
          {unit && <span className="text-xs text-stone-500 font-medium">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
