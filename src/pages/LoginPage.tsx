import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState('sarah.mom@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try our demo account.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('sarah.mom@example.com');
    setPassword('password123');
    setLoading(true);
    await login('sarah.mom@example.com', 'password123');
    navigate('/');
  };

  return (
    <main
      id="login-screen"
      className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-6 max-w-md mx-auto"
    >
      <div className="pt-6">
        <Link to="/onboarding" className="text-xs font-semibold text-stone-500 hover:text-stone-800">
          ← Back
        </Link>
      </div>

      <div className="my-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-200">
            <Heart className="w-7 h-7 fill-white stroke-none" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 font-display">Welcome to MamaNest</h1>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Log in to access your baby's logs, milestones, and your personalized daily check-in.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mom@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit-btn"
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Entering...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-3 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-800 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-rose-600" />
          <span>Quick Demo Access (Sarah & Baby Emma)</span>
        </button>
      </div>

      <div className="text-center pb-safe space-y-2">
        <p className="text-xs text-stone-500">
          New mother?{' '}
          <Link to="/register" className="font-bold text-rose-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </main>
  );
};
