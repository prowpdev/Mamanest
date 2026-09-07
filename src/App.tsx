import React from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { BottomNavigation } from './components/common/BottomNavigation';
import { Toast } from './components/common/Toast';
import { LogActivitySheet } from './components/tracking/LogActivitySheet';
import { MamaAIChatModal } from './components/ai/MamaAIChatModal';
import { MomCheckInSheet } from './components/wellbeing/MomCheckInSheet';

// Pages
import { SplashPage } from './pages/SplashPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BabySetupPage } from './pages/BabySetupPage';
import { HomePage } from './pages/HomePage';
import { BabyPage } from './pages/BabyPage';
import { TrackPage } from './pages/TrackPage';
import { LearnPage } from './pages/LearnPage';
import { RemindersPage } from './pages/RemindersPage';
import { ProfilePage } from './pages/ProfilePage';

const MainLayout: React.FC = () => {
  const location = useLocation();

  // Hide bottom navigation on full-screen flows
  const hideBottomNav = [
    '/splash',
    '/onboarding',
    '/login',
    '/register',
    '/baby-setup',
    '/reminders',
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-stone-800 antialiased font-sans flex flex-col justify-between">
      <div className="w-full flex-1">
        <Outlet />
      </div>

      {!hideBottomNav && <BottomNavigation />}

      {/* Global Modals and Overlays */}
      <LogActivitySheet />
      <MamaAIChatModal />
      <MomCheckInSheet />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/baby" element={<BabyPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/splash" element={<SplashPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/baby-setup" element={<BabySetupPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
