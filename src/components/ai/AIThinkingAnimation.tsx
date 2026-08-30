import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIOrb, OrbState } from './AIOrb';

interface AIThinkingAnimationProps {
  isVisible: boolean;
  contextLabel?: string;
  onComplete?: () => void;
}

const THINKING_STAGES = [
  { label: 'Understanding', icon: '🧠' },
  { label: 'Analyzing', icon: '🔍' },
  { label: 'Personalizing', icon: '✦' },
  { label: 'Generating', icon: '⚡' },
  { label: 'Ready', icon: '✅' },
];

export const AIThinkingAnimation: React.FC<AIThinkingAnimationProps> = ({
  isVisible,
  contextLabel = 'MasterMind is thinking...',
  onComplete,
}) => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev >= THINKING_STAGES.length - 1) {
          clearInterval(interval);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  const orbState: OrbState =
    stageIndex < 2 ? 'thinking' : stageIndex < 4 ? 'generating' : 'success';

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center gap-4 py-6"
    >
      <AIOrb state={orbState} size={56} />

      <p className="text-sm font-bold text-slate-500">{contextLabel}</p>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        {THINKING_STAGES.map((stage, idx) => (
          <React.Fragment key={stage.label}>
            <motion.span
              className={`flex items-center gap-1 transition-colors duration-300 ${
                idx < stageIndex
                  ? 'text-emerald-500'
                  : idx === stageIndex
                  ? 'text-brand-500 font-bold'
                  : 'text-slate-300'
              }`}
              animate={idx === stageIndex ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <span>{stage.icon}</span>
              <span className="hidden sm:inline">{stage.label}</span>
            </motion.span>
            {idx < THINKING_STAGES.length - 1 && (
              <span className={`text-[10px] ${idx < stageIndex ? 'text-emerald-400' : 'text-slate-200'}`}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
};
