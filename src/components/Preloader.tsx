import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 600);
    }, 1400);

    return () => clearTimeout(timer);
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
            
            {/* Logo Animated Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-2xl shadow-brand-500/50 ring-4 ring-white/10"
            >
              <BrainCircuit className="w-8 h-8 text-white stroke-[2.5]" />
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-1.5 justify-center">
                Mastermind <span className="text-brand-400">Aid</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-widest uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                মাসটারমাইন্ড এইড • Elevating Skills in Bangladesh
              </p>
            </motion.div>

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
