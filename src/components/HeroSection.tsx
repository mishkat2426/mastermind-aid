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
import { HeroParticles } from './HeroParticles';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onOpenPreview: () => void;
  onOpenCodeEditor: () => void;
  onOpenPathFinder: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onOpenPreview,
  onOpenCodeEditor,
  onOpenPathFinder,
}) => {
  // Live Notifications Ticker Simulation
  const liveEnrollments = [
    '🔥 Tanvir from Dhaka enrolled in WP Plugin Mastery • 2 mins ago',
    '⚡ Nusrat from Chittagong enrolled in Digital Marketing • 5 mins ago',
    '🌟 Rakib from Sylhet joined SEO Ranking Blueprint • 9 mins ago',
  ];
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveEnrollments.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0D2447] to-[#0A192F] text-white pt-12 pb-24 lg:pt-20 lg:pb-32">
      
      {/* Ambient Particle Mesh Backdrop */}
      <HeroParticles />

      {/* Dynamic Animated Background Glow Circles */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[36rem] h-[36rem] bg-brand-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-[30rem] h-[30rem] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Ticker & Silicon Valley Badge */}
        <div className="mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-slate-200 px-4 py-1.5 rounded-full text-xs font-extrabold shadow-lg"
            >
              <span>{liveEnrollments[tickerIndex]}</span>
            </motion.div>
          </AnimatePresence>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO 9001 Silicon Valley Curriculum Standard
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/40 text-brand-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wide shadow-sm">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>Be Skillful • Top E-Learning Ecosystem in Bangladesh 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Best Online Course in Bangladesh 2026 <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-emerald-300 relative inline-block">
                (Free & Premium)
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              We believe in world-class quality learning! Never publish low-quality content. Master <strong className="text-brand-300 font-bold">Web Development, WordPress Plugin Creation, Digital Marketing, SEO & Freelancing</strong> with lifetime mentor support in Bangladesh.
            </p>

            {/* Feature Bullet Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2 text-xs sm:text-sm font-bold text-slate-200">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Practical Projects</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lifetime Support Lounge</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Bangla & English Guidance</span>
              </motion.div>
            </div>

            {/* Action Buttons & Sandbox Trigger */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onExploreCourses}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-brand-500/40 flex items-center justify-center gap-3 transition-all duration-200"
              >
                <span>Browse All Courses</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenPathFinder}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold text-base px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-2.5 transition"
              >
                <Compass className="w-5 h-5 text-emerald-400" />
                <span>Career Path Quiz</span>
              </motion.button>

              <button
                onClick={onOpenCodeEditor}
                className="text-xs font-extrabold text-brand-300 hover:text-white bg-brand-500/20 hover:bg-brand-500/30 px-4 py-2 rounded-xl border border-brand-400/30 flex items-center gap-2 transition"
              >
                <Code className="w-4 h-4 text-brand-400" />
                <span>Try Live Code Sandbox</span>
              </button>
            </div>

            {/* Social Proof Avatars & Rating */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-center sm:text-left">
              <div className="flex -space-x-3 overflow-hidden">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-400 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-400 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-400 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-brand-400 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" alt="Student" />
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-600 text-white font-black text-xs ring-2 ring-brand-400">
                  +17k
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-white font-black text-sm ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-400 font-medium">Trusted by 17,000+ Students across 64 Districts</p>
              </div>
            </div>

          </motion.div>

          {/* Right Visual Image & Interactive Floating Stat Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card Image with Glow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-brand-600 to-[#0A192F] p-2 hover:shadow-brand-500/30 transition-all duration-500 group">
                
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students Learning Online"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl brightness-95 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-transparent to-transparent rounded-2xl" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 animate-pulse" /> Live Mentor Class Active
                  </div>
                  <h3 className="text-xl font-extrabold">WordPress & Digital Marketing Mastery</h3>
                  <p className="text-xs text-slate-200 font-medium">Start learning from top mentors today.</p>
                </div>
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -top-6 -left-6 bg-[#0B1E40]/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/15 flex items-center gap-3 animate-float-slow hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">17,240+</div>
                  <div className="text-xs font-semibold text-slate-300">Active Learners</div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -bottom-6 -right-6 bg-[#0B1E40]/90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/15 flex items-center gap-3 animate-float-reverse hidden sm:flex">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-black text-white">98%</div>
                  <div className="text-xs font-semibold text-slate-300">Satisfaction Rate</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
