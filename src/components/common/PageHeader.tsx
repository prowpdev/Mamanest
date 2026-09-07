import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BabyAvatar } from './BabyAvatar';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showBabyPill?: boolean;
  showMamaAIButton?: boolean;
  showWellbeingButton?: boolean;
  rightAction?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showBabyPill = true,
  showMamaAIButton = true,
  showWellbeingButton = true,
  rightAction,
}) => {
  const navigate = useNavigate();
  const { activeBaby, openMamaAI, openCheckIn, todayCheckIn } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F5]/90 backdrop-blur-md px-4 pt-safe pb-2.5 border-b border-stone-200/50">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack && (
            <button
              id="header-back-btn"
              onClick={handleBack}
              className="p-2 -ml-1.5 rounded-full text-stone-700 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {showBabyPill && activeBaby ? (
            <button
              id="header-baby-pill-btn"
              onClick={() => navigate('/baby')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-3 bg-white border border-stone-200/80 rounded-full shadow-xs hover:border-rose-200 active:scale-98 transition-all cursor-pointer"
            >
              <BabyAvatar name={activeBaby.name} avatarUrl={activeBaby.avatarUrl} size="sm" />
              <div className="text-left">
                <span className="block text-xs font-bold text-stone-900 leading-tight truncate max-w-[80px]">
                  {activeBaby.name}
                </span>
                <span className="block text-[10px] text-stone-500 leading-tight">3m old</span>
              </div>
            </button>
          ) : (
            title && (
              <div>
                <h1 className="text-lg font-bold text-stone-900 font-display leading-tight truncate">
                  {title}
                </h1>
                {subtitle && <p className="text-xs text-stone-500 truncate">{subtitle}</p>}
              </div>
            )
          )}
        </div>

        {/* Right action group */}
        <div className="flex items-center gap-2">
          {rightAction}

          {showWellbeingButton && (
            <button
              id="header-mom-checkin-btn"
              onClick={openCheckIn}
              className={`p-2 rounded-full border transition-all cursor-pointer relative ${
                todayCheckIn
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
              }`}
              title="Mom's Daily Check-in"
              aria-label="Mom's Daily Check-in"
            >
              <Heart className="w-4 h-4 fill-current" />
              {!todayCheckIn && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>
          )}

          {showMamaAIButton && (
            <button
              id="header-mama-ai-btn"
              onClick={openMamaAI}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mama AI</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
