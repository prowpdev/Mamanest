import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  const handleContinue = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <main
      id="splash-screen"
      className="min-h-screen bg-gradient-to-b from-[#FFF5F2] via-[#FAF7F5] to-[#F5EFEB] flex flex-col justify-between p-6 max-w-md mx-auto"
    >
      <div className="pt-8 flex justify-end">
        <span className="px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-bold tracking-wide">
          Capacitor Ready
        </span>
      </div>

      <div className="flex flex-col items-center text-center space-y-6 my-auto">
        {/* Logo Mark */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-xl shadow-rose-200/50">
            <Heart className="w-12 h-12 fill-white stroke-none" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-amber-500">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-stone-900 font-display tracking-tight">
            MamaNest
          </h1>
          <p className="text-sm font-medium text-stone-600 max-w-xs leading-relaxed">
            A gentle companion for new mothers. Track daily moments, celebrate milestones, and nurture your wellbeing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50/80 border border-rose-100 px-3.5 py-1.5 rounded-full">
          <span>❤️ Warm</span>
          <span>•</span>
          <span>🔒 Offline-First</span>
          <span>•</span>
          <span>📱 Mobile Native</span>
        </div>
      </div>

      <div className="space-y-3 pb-safe">
        <button
          id="splash-continue-btn"
          onClick={handleContinue}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-base rounded-2xl shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Enter MamaNest</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-[11px] text-stone-400">
          Designed with pediatric care principles for new moms
        </p>
      </div>
    </main>
  );
};
