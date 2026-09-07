import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  Baby,
  Bell,
  Download,
  Share2,
  Shield,
  Smartphone,
  LogOut,
  ChevronRight,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { notificationService } from '../services/notificationService';
import { shareService } from '../services/shareService';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, babies, activeBaby, logout, showToast, syncPendingCount } = useApp();

  const handleRequestNotifications = async () => {
    const granted = await notificationService.requestPermissions();
    if (granted) {
      showToast('Notifications enabled! 🔔');
    } else {
      showToast('Notification permission dismissed');
    }
  };

  const handleExportData = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      user,
      babies,
      notes: localStorage.getItem('mamanest_notes_v1'),
      feedings: localStorage.getItem('mamanest_feedings_v1'),
      diapers: localStorage.getItem('mamanest_diapers_v1'),
      sleep: localStorage.getItem('mamanest_sleep_v1'),
      growth: localStorage.getItem('mamanest_growth_v1'),
      wellbeing: localStorage.getItem('mamanest_wellbeing_v1'),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `MamaNest_${activeBaby.name}_Export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exported baby records! 📂');
  };

  const handleShareApp = async () => {
    await shareService.share({
      title: 'MamaNest Companion',
      text: 'MamaNest has been wonderful for logging feeds, sleep, and pediatrician milestones!',
    });
  };

  return (
    <div id="profile-screen" className="min-h-screen pb-24 max-w-md mx-auto">
      <PageHeader
        title="Settings & Profile"
        subtitle="Account & Preferences"
        showBabyPill={false}
        showMamaAIButton={true}
        showWellbeingButton={true}
      />

      <main className="px-4 py-3 space-y-4">
        {/* Mom User Card */}
        <div className="p-4 bg-white border border-stone-200/80 rounded-3xl shadow-xs flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white text-xl font-bold font-display shadow-sm">
            {user?.name ? user.name[0] : 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base font-bold text-stone-900 font-display truncate">
                {user?.name || 'Sarah Jenkins'}
              </h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  user?.role === 'admin'
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : user?.role === 'partner'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : user?.role === 'caregiver'
                    ? 'bg-teal-100 text-teal-700 border-teal-200'
                    : 'bg-rose-50 text-rose-700 border-rose-100'
                }`}
              >
                {user?.role ? user.role.toUpperCase() : 'MOM'}
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate">{user?.email || 'sarah.mom@example.com'}</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Nest member since June 2026</p>
          </div>
        </div>

        {/* Admin Console Card (if user is admin or accessible) */}
        {user?.role === 'admin' && (
          <div className="p-4 bg-gradient-to-br from-purple-950 to-stone-900 text-white rounded-3xl shadow-sm space-y-2 border border-purple-800/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-display">
                <Shield className="w-4 h-4 text-purple-400" />
                Administrator Privileges Active
              </span>
              <span className="text-[10px] bg-purple-800/60 px-2 py-0.5 rounded-full text-purple-200 font-semibold">
                Super Admin
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              You have clinical and system permissions to view all users, activate/suspend accounts, reset credentials, and switch accounts.
            </p>
            <button
              id="profile-admin-console-btn"
              onClick={() => navigate('/admin')}
              className="w-full mt-1 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Open Admin Console (Manage Users)</span>
            </button>
          </div>
        )}

        {/* Baby Management Card */}
        <div className="p-4 bg-white border border-stone-200/80 rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Baby className="w-4 h-4 text-rose-500" />
              <span>Babies in Your Nest</span>
            </h3>
            <button
              onClick={() => navigate('/baby-setup')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Baby</span>
            </button>
          </div>

          <div className="space-y-2">
            {babies.map((b) => (
              <div
                key={b.id}
                onClick={() => navigate('/baby')}
                className="p-3 bg-stone-50 rounded-2xl flex items-center justify-between border border-stone-100 hover:border-rose-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      b.avatarUrl ||
                      'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'
                    }
                    alt={b.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{b.name}</h4>
                    <p className="text-[11px] text-stone-500">3 months • Born June 15, 2026</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-2xs divide-y divide-stone-100">
          <button
            id="profile-launch-wizard-btn"
            onClick={() => navigate('/wizard')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Setup Wizard Guide</span>
                <span className="text-[11px] text-stone-400">Re-run baby profile & reminder preferences</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          {user?.role === 'admin' && (
            <button
              id="profile-quick-admin-btn"
              onClick={() => navigate('/admin')}
              className="w-full p-3.5 flex items-center justify-between hover:bg-purple-50/50 transition-colors cursor-pointer text-left bg-purple-50/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-purple-900 block">Admin Console (Manage Users)</span>
                  <span className="text-[11px] text-purple-600">View user directory, roles & account status</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </button>
          )}

          <button
            onClick={() => navigate('/reminders')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Reminders & Schedules</span>
                <span className="text-[11px] text-stone-400">Pediatrician visits & routine alerts</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={handleRequestNotifications}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Push Notifications</span>
                <span className="text-[11px] text-stone-400">Enable feeding & medication alerts</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={handleExportData}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Export Baby Data</span>
                <span className="text-[11px] text-stone-400">Download complete logs in JSON format</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={handleShareApp}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-stone-800 block">Share with Partner / Family</span>
                <span className="text-[11px] text-stone-400">Invite co-parent or share milestones</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Capacitor & Offline Architecture Info Box */}
        <div className="p-4 bg-stone-900 text-white rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5 font-display">
              <Smartphone className="w-3.5 h-3.5" />
              Capacitor & REST Architecture
            </span>
            <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded-full text-stone-300">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            MamaNest is fully decoupled for easy native packaging into iOS and Android using Capacitor, with offline-first storage and pending sync queue for future REST APIs.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] text-stone-400">
            <RefreshCw className="w-3 h-3 text-emerald-400" />
            <span>Local Sync Status: 100% Offline Active ({syncPendingCount} queued)</span>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full py-3.5 bg-white hover:bg-rose-50 border border-stone-200 text-rose-600 hover:border-rose-200 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of MamaNest</span>
        </button>
      </main>
    </div>
  );
};
