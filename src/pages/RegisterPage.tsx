import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/baby-setup');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="register-screen"
      className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-6 max-w-md mx-auto"
    >
      <div className="pt-6">
        <Link to="/login" className="text-xs font-semibold text-stone-500 hover:text-stone-800">
          ← Back to Login
        </Link>
      </div>

      <div className="my-auto space-y-5">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mx-auto shadow-md shadow-rose-200">
            <Heart className="w-6 h-6 fill-white stroke-none" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 font-display">Create Your Nest</h1>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Join thousands of new mothers nurturing their families and themselves.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-2xs">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Your Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mama's Name"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@example.com"
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
                placeholder="Create a strong password"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-rose-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating...' : 'Continue to Baby Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="text-center pb-safe">
        <p className="text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-rose-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
};
