import React, { useState } from 'react';
import { Camera, Calendar, User, Phone, Sparkles, Scale, Ruler, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { GrowthTracker } from '../components/baby/GrowthTracker';
import { MilestonesTracker } from '../components/baby/MilestonesTracker';
import { VaccinationsTab } from '../components/baby/VaccinationsTab';
import { AppointmentsTab } from '../components/baby/AppointmentsTab';
import { cameraService } from '../services/cameraService';
import { formatDateFriendly } from '../utils/formatters';
import { calculateBabyAge } from '../utils/ageCalculator';

export const BabyPage: React.FC = () => {
  const { activeBaby, updateBaby, showToast, notes } = useApp();

  const [activeTab, setActiveTab] = useState<'growth' | 'milestones' | 'vaccines' | 'appointments' | 'moments'>('growth');

  const babyAge = calculateBabyAge(activeBaby.birthDate);

  const handleUpdatePhoto = async () => {
    const photo = await cameraService.takeOrPickPhoto();
    if (photo) {
      updateBaby({ ...activeBaby, avatarUrl: photo });
      showToast('Baby photo updated! 📸');
    }
  };

  const milestoneNotes = (notes || []).filter((n) => n.isMilestoneMemory);

  return (
    <div id="baby-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      <PageHeader
        title="Baby Profile"
        subtitle="Growth & Milestones"
        showBabyPill={false}
        showMamaAIButton={true}
        showWellbeingButton={true}
      />

      <main className="px-4 py-3 space-y-4">
        {/* Baby Hero Card */}
        <section
          aria-labelledby="baby-profile-card-title"
          className="bg-white border border-stone-200/80 rounded-3xl p-4 shadow-xs relative overflow-hidden"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={
                  activeBaby.avatarUrl ||
                  'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'
                }
                alt={activeBaby.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 rounded-2xl object-cover border-2 border-rose-200 shadow-2xs"
              />
              <button
                id="update-baby-photo-btn"
                onClick={handleUpdatePhoto}
                className="absolute -bottom-1 -right-1 p-1.5 bg-rose-500 text-white rounded-full shadow-xs hover:bg-rose-600 transition-colors cursor-pointer"
                title="Change photo"
                aria-label="Change photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h1 id="baby-profile-card-title" className="text-xl font-bold text-stone-900 font-display truncate">
                  {activeBaby.name}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-100">
                  {activeBaby.gender === 'female' ? 'Girl 👧' : 'Boy 👦'}
                </span>
              </div>

              <p className="text-xs font-semibold text-rose-600 mt-0.5">
                {babyAge.formattedAge} • {babyAge.weeks} weeks old
              </p>

              <p className="text-[11px] text-stone-400 mt-0.5">
                Born {formatDateFriendly(activeBaby.birthDate)}
              </p>
            </div>
          </div>

          {/* Key Birth Stats Banner */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-stone-100 text-center">
            <div className="p-2 rounded-xl bg-stone-50">
              <span className="text-[10px] text-stone-400 block font-medium">Birth Weight</span>
              <span className="text-xs font-bold text-stone-800 font-display">
                {activeBaby.birthWeightKg ? `${activeBaby.birthWeightKg} kg` : '3.4 kg'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50">
              <span className="text-[10px] text-stone-400 block font-medium">Birth Length</span>
              <span className="text-xs font-bold text-stone-800 font-display">
                {activeBaby.birthHeightCm ? `${activeBaby.birthHeightCm} cm` : '50.5 cm'}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-stone-50">
              <span className="text-[10px] text-stone-400 block font-medium">Pediatrician</span>
              <span className="text-xs font-bold text-stone-800 truncate block">
                {activeBaby.pediatricianName?.split(',')[0] || 'Dr. Martinez'}
              </span>
            </div>
          </div>
        </section>

        {/* Section Navigation Tabs */}
        <section aria-label="Baby details tabs" className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              { id: 'growth', label: 'Growth & Charts', icon: '📏' },
              { id: 'milestones', label: 'Milestones', icon: '✨' },
              { id: 'vaccines', label: 'Vaccinations', icon: '💉' },
              { id: 'appointments', label: 'Visits', icon: '🏥' },
              { id: 'moments', label: 'Memories', icon: '❤️' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              id={`baby-subtab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </section>

        {/* Active Tab View */}
        <section aria-label="Tab content">
          {activeTab === 'growth' && <GrowthTracker />}
          {activeTab === 'milestones' && <MilestonesTracker />}
          {activeTab === 'vaccines' && <VaccinationsTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'moments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Milestone Memories ❤️
                </h3>
                <span className="text-[11px] text-stone-400">{milestoneNotes.length} moments saved</span>
              </div>

              {milestoneNotes.length === 0 ? (
                <div className="p-6 bg-white border border-stone-200/80 rounded-2xl text-center">
                  <Heart className="w-8 h-8 text-rose-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">No milestone memories recorded yet</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    When adding a note, toggle "Milestone Memory" to highlight sweet firsts here!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {milestoneNotes.map((m) => (
                    <div
                      key={m.id}
                      className="p-4 bg-gradient-to-r from-rose-50/80 to-amber-50/50 border border-rose-200/80 rounded-2xl shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-rose-700 font-display">
                          {m.title}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {formatDateFriendly(m.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
