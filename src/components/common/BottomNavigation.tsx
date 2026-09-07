import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Baby, PlusCircle, BookOpen, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openLogger } = useApp();

  const tabs = [
    { id: 'nav-home', name: 'Home', path: '/', icon: Home },
    { id: 'nav-baby', name: 'Baby', path: '/baby', icon: Baby },
    { id: 'nav-track', name: 'Track', path: '/track', icon: PlusCircle, isQuickAction: false },
    { id: 'nav-learn', name: 'Learn', path: '/learn', icon: BookOpen },
    { id: 'nav-profile', name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe"
    >
      <div className="max-w-md mx-auto px-3 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;

          return (
            <button
              key={tab.name}
              id={tab.id}
              onClick={() => {
                navigate(tab.path);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive ? 'text-rose-600' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.3]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-500 rounded-full" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'font-semibold text-rose-600' : 'text-stone-500'
                }`}
              >
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
