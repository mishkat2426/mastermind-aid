import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIOrb } from './AIOrb';
import type { OrbState } from './AIOrb';

interface AICommandCenterProps {
  className?: string;
}

const STATUS_SEQUENCE: { label: string; icon: string; orbState: OrbState; progress: number }[] = [
  { label: 'Analyzing your goal...', icon: '◉', orbState: 'thinking', progress: 25 },
  { label: 'Understanding your skill level...', icon: '◉', orbState: 'thinking', progress: 45 },
  { label: 'Personalizing recommendations...', icon: '◉', orbState: 'generating', progress: 68 },
  { label: 'Generating learning path...', icon: '◉', orbState: 'generating', progress: 88 },
  { label: 'Your personalized path is ready.', icon: '✦', orbState: 'success', progress: 100 },
];

export const AICommandCenter: React.FC<AICommandCenterProps> = ({ className = '' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    if (!isLooping) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STATUS_SEQUENCE.length - 1) {
          // Pause at last step, then restart
          setTimeout(() => setCurrentStep(0), 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLooping, currentStep]);

  const current = STATUS_SEQUENCE[currentStep];
  const completedSteps = STATUS_SEQUENCE.slice(0, currentStep);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden ${className}`}
      style={{
        background: 'rgba(10, 25, 47, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Subtle inner glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-brand-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <AIOrb state={current.orbState} size={36} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-400">
                ✦ MASTERMIND AI
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Intelligent Learning Engine</p>
          </div>
        </div>

        {/* Current status */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <span className="text-brand-400">{current.icon}</span>
            <span>{current.label}</span>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-emerald-400"
              animate={{ width: `${current.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
            <span>Progress</span>
            <span className="text-brand-400 font-bold">{current.progress}%</span>
          </div>
        </div>

        {/* Step checklist */}
        <div className="space-y-1.5 pt-1">
          {STATUS_SEQUENCE.map((step, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 text-[11px] font-medium transition-colors duration-300 ${
                idx < currentStep
                  ? 'text-emerald-400'
                  : idx === currentStep
                  ? 'text-slate-200'
                  : 'text-slate-600'
              }`}
            >
              <span className="w-3 text-center">
                {idx < currentStep ? '✓' : idx === currentStep ? '◉' : '○'}
              </span>
              <span>{step.label.replace('...', '').replace('Your personalized path is ready.', 'Ready')}</span>
            </div>
          ))}
        </div>

        {/* Waveform decoration */}
        <div className="flex items-end gap-[2px] h-4 pt-2 opacity-50">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="w-[2px] bg-brand-400/60 rounded-full"
              animate={{
                height: [
                  4 + Math.sin(i * 0.5) * 4,
                  8 + Math.cos(i * 0.7) * 6,
                  4 + Math.sin(i * 0.5) * 4,
                ],
              }}
              transition={{
                duration: 1.5 + (i % 3) * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
