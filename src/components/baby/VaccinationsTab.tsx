import React from 'react';
import { Syringe, CheckCircle2, Clock } from 'lucide-react';
import { Vaccination } from '../../types';

export const VaccinationsTab: React.FC = () => {
  const schedule: Vaccination[] = [
    {
      id: 'v1',
      babyId: 'baby-emma-1',
      name: 'Hepatitis B (Dose 1)',
      recommendedAge: 'Birth',
      status: 'completed',
      administeredDate: 'At Hospital',
      clinic: 'St. Mary Maternity Care',
    },
    {
      id: 'v2',
      babyId: 'baby-emma-1',
      name: 'DTaP, IPV, Hib, PCV15, Rotavirus (Dose 1)',
      recommendedAge: '2 Months',
      status: 'completed',
      administeredDate: '2 Months Checkup',
      clinic: 'Sunrise Pediatrics',
    },
    {
      id: 'v3',
      babyId: 'baby-emma-1',
      name: 'DTaP, IPV, Hib, PCV15, Rotavirus (Dose 2)',
      recommendedAge: '4 Months',
      status: 'upcoming',
      clinic: 'Sunrise Pediatrics',
      notes: 'Scheduled for upcoming 4-month well-child visit',
    },
    {
      id: 'v4',
      babyId: 'baby-emma-1',
      name: 'DTaP, IPV, Hib, PCV15, Rotavirus, HepB (Dose 3)',
      recommendedAge: '6 Months',
      status: 'upcoming',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Immunization Record
        </h3>
        <span className="text-[11px] text-stone-500">CDC/AAP Guidelines</span>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-2xl divide-y divide-stone-100 overflow-hidden shadow-2xs">
        {schedule.map((vac) => (
          <div key={vac.id} className="p-3.5 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  vac.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                <Syringe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block font-display">
                  {vac.name}
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  Age: {vac.recommendedAge} {vac.clinic && `• ${vac.clinic}`}
                </span>
                {vac.notes && <p className="text-[11px] text-stone-400 italic mt-0.5">{vac.notes}</p>}
              </div>
            </div>

            <div>
              {vac.status === 'completed' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" />
                  Done
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  <Clock className="w-3 h-3" />
                  Upcoming
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
