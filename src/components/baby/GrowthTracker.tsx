import React, { useState } from 'react';
import { Plus, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { growthService } from '../../services/growthService';
import { BottomSheet } from '../common/BottomSheet';
import { formatDateFriendly } from '../../utils/formatters';

export const GrowthTracker: React.FC = () => {
  const { activeBaby, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'weight' | 'height' | 'head'>('weight');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add measurement form state
  const [weight, setWeight] = useState<string>('6.3');
  const [height, setHeight] = useState<string>('61.0');
  const [headCircumference, setHeadCircumference] = useState<string>('39.8');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const [records, setRecords] = useState(() => growthService.getGrowthRecords(activeBaby.id));
  const latestGrowth = growthService.getLatestGrowth(activeBaby.id);

  const reloadRecords = () => {
    setRecords(growthService.getGrowthRecords(activeBaby.id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    growthService.addGrowthRecord({
      babyId: activeBaby.id,
      date,
      weightKg: weight ? parseFloat(weight) : undefined,
      heightCm: height ? parseFloat(height) : undefined,
      headCircumferenceCm: headCircumference ? parseFloat(headCircumference) : undefined,
      notes: notes.trim() || undefined,
    });
    reloadRecords();
    setIsAddModalOpen(false);
    showToast('Measurement saved! 📏');
  };

  const handleDelete = (id: string) => {
    growthService.deleteGrowthRecord(id);
    reloadRecords();
    showToast('Measurement deleted');
  };

  // Generate simple clean SVG chart points
  const validRecords = records.filter((r) => {
    if (activeTab === 'weight') return typeof r.weightKg === 'number';
    if (activeTab === 'height') return typeof r.heightCm === 'number';
    return typeof r.headCircumferenceCm === 'number';
  });

  const getMetricValue = (r: any) => {
    if (activeTab === 'weight') return r.weightKg;
    if (activeTab === 'height') return r.heightCm;
    return r.headCircumferenceCm;
  };

  const values = validRecords.map(getMetricValue);
  const minVal = values.length > 0 ? Math.min(...values) * 0.95 : 0;
  const maxVal = values.length > 0 ? Math.max(...values) * 1.05 : 10;
  const range = maxVal - minVal || 1;

  const chartWidth = 320;
  const chartHeight = 120;
  const paddingX = 25;
  const paddingY = 20;

  const points = validRecords.map((r, i) => {
    const x = paddingX + (i / Math.max(1, validRecords.length - 1)) * (chartWidth - paddingX * 2);
    const val = getMetricValue(r);
    const y = chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y, val, date: r.date };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  return (
    <div className="space-y-4">
      {/* Metric Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-2xl">
        {(
          [
            { id: 'weight', label: 'Weight (kg)', icon: '⚖️' },
            { id: 'height', label: 'Height (cm)', icon: '📏' },
            { id: 'head', label: 'Head (cm)', icon: '🧢' },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            id={`growth-tab-${t.id}`}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Latest Highlight Card */}
      <div className="p-4 bg-white border border-stone-200/80 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {activeTab === 'weight'
              ? 'Current Weight'
              : activeTab === 'height'
              ? 'Current Height'
              : 'Head Circumference'}
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record</span>
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-stone-900 font-display">
            {activeTab === 'weight'
              ? `${latestGrowth.latestWeight ?? '--'} kg`
              : activeTab === 'height'
              ? `${latestGrowth.latestHeight ?? '--'} cm`
              : `${latestGrowth.latestHead ?? '--'} cm`}
          </span>

          {activeTab === 'weight' && typeof latestGrowth.weightDelta === 'number' && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              {latestGrowth.weightDelta >= 0 ? `+${latestGrowth.weightDelta}` : latestGrowth.weightDelta} kg
              since last measurement
            </span>
          )}

          {activeTab === 'height' && typeof latestGrowth.heightDelta === 'number' && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +{latestGrowth.heightDelta} cm
            </span>
          )}
        </div>

        {/* SVG Sparkline Chart */}
        {points.length > 1 && (
          <div className="mt-4 pt-3 border-t border-stone-100">
            <div className="w-full flex justify-center overflow-x-auto">
              <svg width={chartWidth} height={chartHeight} className="overflow-visible">
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                  d={`${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`}
                  fill="url(#growthGradient)"
                />

                {/* Main line */}
                <path d={pathD} fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2.5" />
                    <text x={pt.x} y={pt.y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#44403C">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 font-medium px-2 mt-1">
              <span>Birth ({formatDateFriendly(records[0]?.date || '')})</span>
              <span>Latest ({formatDateFriendly(records[records.length - 1]?.date || '')})</span>
            </div>
          </div>
        )}
      </div>

      {/* Medical disclaimer */}
      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-start gap-2 text-stone-500">
        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          Growth curves vary naturally. This tracker is for personal observation only and does not present medical diagnoses. Consult your pediatrician during well-child visits.
        </p>
      </div>

      {/* Historical List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider px-1">
          Historical Measurements
        </h3>

        <div className="bg-white border border-stone-200/80 rounded-2xl divide-y divide-stone-100 overflow-hidden shadow-2xs">
          {records
            .slice()
            .reverse()
            .map((rec) => (
              <div key={rec.id} className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-stone-900">
                    {formatDateFriendly(rec.date)}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-stone-600 mt-0.5">
                    {rec.weightKg && <span>⚖️ <strong>{rec.weightKg}</strong> kg</span>}
                    {rec.heightCm && <span>📏 <strong>{rec.heightCm}</strong> cm</span>}
                    {rec.headCircumferenceCm && <span>🧢 <strong>{rec.headCircumferenceCm}</strong> cm</span>}
                  </div>
                  {rec.notes && <p className="text-[11px] text-stone-400 italic mt-0.5">{rec.notes}</p>}
                </div>

                <button
                  onClick={() => handleDelete(rec.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Add Measurement BottomSheet */}
      <BottomSheet
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Measurement"
        subtitle="Track weight, height, or head circumference"
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="6.1"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="60.5"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Head (cm)</label>
              <input
                type="number"
                step="0.1"
                value={headCircumference}
                onChange={(e) => setHeadCircumference(e.target.value)}
                placeholder="39.4"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 3-month checkup at clinic"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            Save Measurement
          </button>
        </form>
      </BottomSheet>
    </div>
  );
};
