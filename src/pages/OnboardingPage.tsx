import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, Heart, Sparkles, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    icon: '🍼',
    title: 'Effortless Daily Tracking',
    description:
      'Log feedings, diapers, naps, pumping, and medication in one single tap without fussy menus or spreadsheets.',
    badge: 'Daily Routines',
    color: 'from-rose-500/20 to-amber-500/20',
  },
  {
    icon: '💖',
    title: 'Care for Baby, Care for You',
    description:
      "Your physical and emotional wellbeing matters. Check in on your mood, energy, and sleep with zero judgment.",
    badge: "Mom's Mental Health",
    color: 'from-pink-500/20 to-purple-500/20',
  },
  {
    icon: '✨',
    title: 'Gentle Pediatric Guidance',
    description:
      'Track real growth milestones, monitor vaccinations, and ask Mama AI for evidence-based parenting advice.',
    badge: 'Pediatric Intelligence',
    color: 'from-amber-500/20 to-rose-500/20',
  },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const step = STEPS[currentStep];

  return (
    <main
      id="onboarding-flow"
      className="min-h-screen bg-[#FAF7F5] flex flex-col justify-between p-6 max-w-md mx-auto select-none"
    >
      {/* Top bar with Skip */}
      <div className="pt-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep ? 'w-8 bg-rose-500' : 'w-2 bg-stone-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-semibold text-stone-500 hover:text-stone-800 p-2 cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="my-auto flex flex-col items-center text-center space-y-6"
        >
          {/* Card Visual Graphic */}
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-tr ${step.color} border border-rose-100/80 flex items-center justify-center text-5xl shadow-lg shadow-rose-100/60`}
          >
            {step.icon}
          </div>

          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100/70 text-rose-700">
              {step.badge}
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-display tracking-tight leading-snug">
              {step.title}
            </h2>
            <p className="text-sm text-stone-600 max-w-xs leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="space-y-3 pb-safe">
        <button
          id="onboarding-next-btn"
          onClick={handleNext}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 active:scale-98 text-white font-bold text-base rounded-2xl shadow-md shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Private, secure, and stored safely on your device</span>
        </div>
      </div>
    </main>
  );
};
