import React from 'react';
import { Calendar, User, MapPin } from 'lucide-react';
import { Appointment } from '../../types';

export const AppointmentsTab: React.FC = () => {
  const appointments: Appointment[] = [
    {
      id: 'apt-1',
      babyId: 'baby-emma-1',
      title: '3-Month Wellness Checkup',
      doctorName: 'Dr. Evelyn Martinez, MD (Pediatrics)',
      location: 'Sunrise Pediatrics, Suite 204',
      dateTime: 'Tomorrow • 10:00 AM',
      notes: 'Weight, length, and head circumference check. Discussing tummy time stamina.',
      completed: false,
    },
    {
      id: 'apt-2',
      babyId: 'baby-emma-1',
      title: '2-Month Well-Child Visit',
      doctorName: 'Dr. Evelyn Martinez, MD',
      location: 'Sunrise Pediatrics, Suite 204',
      dateTime: '1 month ago',
      notes: 'Excellent weight gain (+1.1 kg). First round of vaccines administered smoothly.',
      completed: true,
    },
    {
      id: 'apt-3',
      babyId: 'baby-emma-1',
      title: 'Newborn 2-Week Follow-up',
      doctorName: 'Dr. Evelyn Martinez, MD',
      location: 'Sunrise Pediatrics',
      dateTime: '2.5 months ago',
      notes: 'Regained birth weight. Cord stump healed clean.',
      completed: true,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Doctor Appointments
        </h3>
        <span className="text-[11px] text-stone-500">{appointments.length} visits</span>
      </div>

      <div className="space-y-2.5">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={`p-4 rounded-2xl border ${
              apt.completed
                ? 'bg-white border-stone-200/80 text-stone-600'
                : 'bg-gradient-to-br from-rose-50/70 to-amber-50/50 border-rose-200 text-stone-900 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  apt.completed ? 'bg-stone-100 text-stone-500' : 'bg-rose-500 text-white'
                }`}
              >
                {apt.completed ? 'Completed' : 'Upcoming Visit'}
              </span>
              <span className="text-xs font-bold flex items-center gap-1 text-stone-600">
                <Calendar className="w-3.5 h-3.5" />
                {apt.dateTime}
              </span>
            </div>

            <h4 className="text-sm font-bold text-stone-900 font-display">{apt.title}</h4>

            <div className="mt-2 space-y-1 text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{apt.doctorName}</span>
              </div>
              {apt.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{apt.location}</span>
                </div>
              )}
            </div>

            {apt.notes && (
              <p className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] text-stone-500 italic">
                Notes: "{apt.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
