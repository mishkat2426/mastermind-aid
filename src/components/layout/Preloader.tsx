import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { AIOrb } from '../ai/AIOrb';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [statusText, setStatusText] = useState('Initializing...');

  useEffect(() => {
    const texts = [
      { text: 'Initializing...', delay: 0 },
      { text: 'Preparing your experience...', delay: 500 },
      { text: 'Almost ready...', delay: 1000 },
    ];

    const timers = texts.map(({ text, delay }) =>
      setTimeout(() => setStatusText(text), delay)
    );

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 1400);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 bg-[#0A192F] text-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-5 text-center px-4">
            
            {/* AI Orb replaces simple logo icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              <AIOrb state="thinking" size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white/80 stroke-[2.5]" />
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-1.5 justify-center">
                MASTERMIND <span className="text-brand-400">AIDIT</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                মাস্টারমাইন্ড এইডআইটি • Elevating Skills in Bangladesh
              </p>
            </motion.div>

            {/* Status text */}
            <AnimatePresence mode="wait">
              <motion.p
                key={statusText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-slate-500 font-medium"
              >
                {statusText}
              </motion.p>
            </AnimatePresence>

            {/* Progress Bar Loader Line */}
            <div className="w-48 bg-white/10 h-1.5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-400 rounded-full"
              />
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
