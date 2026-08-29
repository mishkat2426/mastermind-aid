import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Star, 
  Users, 
  Award,
  Zap,
  Code,
  Compass,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { NeuralNetworkBg } from './NeuralNetworkBg';
import { AICommandCenter } from './AICommandCenter';
import { DBService } from '../services/db';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onOpenPreview: () => void;
  onOpenPathFinder: () => void;
}

// Staggered entrance animation variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeUpVariant = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onOpenPreview,
  onOpenPathFinder,
}) => {
  // Query actual real enrollments from database (Requirement #3 & #4: NO FAKE NAMES OR LOCATIONS)
  const realEnrollments = DBService.getEnrollments();
  
  // Format real privacy-friendly tickers from database
  const tickerItems = realEnrollments.length > 0
    ? realEnrollments.slice(0, 5).map((e) => `⚡ A student recently enrolled in ${e.courseTitle}`)
    : ['⚡ Mastermind Aid • Premier AI & IT Skill Development Platform 2026'];

  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    if (tickerItems.length <= 1) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [tickerItems.length]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0D2447] to-[#0A192F] text-white pt-8 pb-16 lg:pt-14 lg:pb-28">
      
      {/* AI Neural Network Background */}
      <NeuralNetworkBg />

      {/* Dynamic Animated Background Glow Circles */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[36rem] h-[36rem] bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Real-time DB Enrollment Ticker & Silicon Valley Trust Badge (Requirement #3 & #5) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-lg"
            >
              <span>{tickerItems[tickerIndex]}</span>
            </motion.div>
          </AnimatePresence>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> ISO 9001 Silicon Valley Curriculum Standard
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-5 text-center lg:text-left"
          >
            
            {/* Pill Tag */}
            <motion.div variants={fadeUpVariant(0)} className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/40 text-brand-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide shadow-sm">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>Be Skillful • Top E-Learning Ecosystem in Bangladesh 2026</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeUpVariant(0.05)}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]"
            >
              Best Online Course in Bangladesh 2026 <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-300 relative inline-block">
                (Free & Premium)
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUpVariant(0.1)}
              className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              Master WordPress Plugin Development, Digital Marketing, Meta Ads & Freelancing with hands-on practical masterclasses, real database verification, and live mentorship.
            </motion.p>

            {/* Trust Bullet Badges */}
            <motion.div
              variants={fadeUpVariant(0.15)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-200 font-bold max-w-xl mx-auto lg:mx-0 pt-1"
            >
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified Certificates</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lifetime Video Access</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>bKash / Nagad / Card</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={fadeUpVariant(0.2)}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                onClick={onExploreCourses}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition hover:scale-105"
              >
                <span>Browse All Courses →</span>
              </button>

              <button
                onClick={onOpenPathFinder}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-emerald-300" />
                <span>AI Career PathFinder</span>
              </button>
            </motion.div>

          </motion.div>

          {/* Right AI Command Center Interactive Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 bg-[#0B1B33]/80 backdrop-blur-2xl p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-slate-400">MasterMind AI Agent v2.6</span>
              </div>

              <AICommandCenter className="w-full" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
