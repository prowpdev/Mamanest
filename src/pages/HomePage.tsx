import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { TodayOverview } from '../components/home/TodayOverview';
import { QuickActions } from '../components/home/QuickActions';
import { TodayTimeline } from '../components/home/TodayTimeline';
import { ReminderBanner } from '../components/home/ReminderBanner';
import { formatDateFriendly } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, activeBaby, openCheckIn, openMamaAI } = useApp();

  const todayStr = new Date().toISOString();
  const dateFormatted = formatDateFriendly(todayStr);

  return (
    <div id="home-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      {/* Top Header */}
      <PageHeader
        showBabyPill={true}
        showMamaAIButton={true}
        showWellbeingButton={true}
      />

      <main className="px-4 py-3 space-y-4">
        {/* Warm Greeting */}
        <section aria-labelledby="welcome-heading" className="pt-1">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-600 tracking-wide uppercase">
                {dateFormatted}
              </p>
              <h1 id="welcome-heading" className="text-xl font-black text-stone-900 font-display">
                Good morning, {user?.name ? user.name.split(' ')[0] : 'Mama'} ✨
              </h1>
            </div>
          </div>
        </section>

        {/* Today Overview 4 Cards */}
        <TodayOverview />

        {/* Quick Actions (+ Add Activity with large buttons) */}
        <QuickActions />

        {/* Today's Timeline */}
        <TodayTimeline onViewAll={() => navigate('/track')} />

        {/* Upcoming Reminder Card */}
        <ReminderBanner />

        {/* Motivational Card */}
        <section
          id="motivational-card"
          aria-label="Daily encouragement"
          className="p-4 bg-gradient-to-r from-rose-100/70 via-pink-100/50 to-amber-100/60 border border-rose-200/70 rounded-2xl flex items-center gap-3.5 shadow-2xs"
        >
          <div className="w-10 h-10 rounded-2xl bg-white text-rose-500 flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 font-display">
              You're doing great, Mom ❤️
            </h2>
            <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
              Every small moment matters. Remember to drink water and take a deep breath today.
            </p>
          </div>
        </section>

        {/* Mama AI Assistant Promo Banner */}
        <section
          onClick={openMamaAI}
          aria-label="Mama AI advice banner"
          className="p-4 bg-stone-900 text-white rounded-2xl shadow-xs cursor-pointer hover:bg-stone-800 transition-all flex items-center justify-between gap-3 active:scale-98"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Questions about {activeBaby.name}?</span>
            </div>
            <p className="text-xs text-stone-300">
              Ask Mama AI about nap routines, feeding intervals, or milestone tips.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-stone-800 border border-stone-700 text-white shrink-0">
            Ask AI
          </span>
        </section>
      </main>
    </div>
  );
};
