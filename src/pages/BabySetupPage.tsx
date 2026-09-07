import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Camera, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';
import { cameraService } from '../services/cameraService';

export const BabySetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { addBaby, showToast } = useApp();

  const [name, setName] = useState('Emma');
  const [birthDate, setBirthDate] = useState('2026-06-15');
  const [gender, setGender] = useState<Gender>('female');
  const [birthWeight, setBirthWeight] = useState('3.4');
  const [birthHeight, setBirthHeight] = useState('50.5');
  const [pediatricianName, setPediatricianName] = useState('Dr. Evelyn Martinez, MD');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'
  );

  const handlePickPhoto = async () => {
    const photo = await cameraService.takeOrPickPhoto();
    if (photo) {
      setAvatarUrl(photo);
      showToast('Photo selected! 📸');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addBaby({
      name: name.trim(),
      birthDate,
      gender,
      birthWeightKg: birthWeight ? parseFloat(birthWeight) : undefined,
      birthHeightCm: birthHeight ? parseFloat(birthHeight) : undefined,
      pediatricianName: pediatricianName.trim() || undefined,
      avatarUrl,
    });

    showToast(`Welcome ${name}! ✨`);
    navigate('/');
  };

  return (
    <main
      id="baby-setup-screen"
      className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-6 max-w-md mx-auto"
    >
      <div className="pt-4 text-center space-y-1">
        <h1 className="text-2xl font-black text-stone-900 font-display">Tell Us About Your Baby</h1>
        <p className="text-xs text-stone-500">
          Personalize MamaNest to calculate age stages and growth curves
        </p>
      </div>

      <form onSubmit={handleSubmit} className="my-auto space-y-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
        {/* Avatar Picker */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Baby profile preview"
              className="w-20 h-20 rounded-full object-cover border-3 border-rose-200 shadow-sm"
            />
            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute bottom-0 right-0 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md cursor-pointer transition-transform active:scale-95"
              title="Change photo"
              aria-label="Change baby photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-[11px] text-stone-400 mt-1.5 font-medium">Tap camera to upload</span>
        </div>

        {/* Baby Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Baby's Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Birthday *</label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Gender</label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'female', label: '👧 Girl' },
                { id: 'male', label: '👦 Boy' },
                { id: 'other', label: '🤍 Other' },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGender(g.id)}
                className={`py-2 px-2 text-xs rounded-xl font-semibold border transition-all cursor-pointer ${
                  gender === g.id
                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Birth Measurements */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              value={birthWeight}
              onChange={(e) => setBirthWeight(e.target.value)}
              placeholder="3.4"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Birth Length (cm)</label>
            <input
              type="number"
              step="0.1"
              value={birthHeight}
              onChange={(e) => setBirthHeight(e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Pediatrician */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Pediatrician (Optional)
          </label>
          <input
            type="text"
            value={pediatricianName}
            onChange={(e) => setPediatricianName(e.target.value)}
            placeholder="e.g. Dr. Martinez"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Save & Open MamaNest</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center pb-safe">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          Skip for now (Use demo baby)
        </button>
      </div>
    </main>
  );
};
