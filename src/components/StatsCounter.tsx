import React from 'react';
import { motion } from 'framer-motion';
import { Smile, BookOpen, GraduationCap, Award } from 'lucide-react';
import { ScrollReveal, useCountUp } from './ScrollReveal';

const StatCard: React.FC<{
  label: string;
  bengaliLabel: string;
  target: number;
  suffix: string;
  icon: React.ReactNode;
  bg: string;
  delay: number;
}> = ({ label, bengaliLabel, target, suffix, icon, bg, delay }) => {
  const [countRef, count] = useCountUp(target, 2200);

  return (
    <ScrollReveal delay={delay} direction="up" distance={28}>
      <div ref={countRef}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 hover:border-brand-400/50 shadow-xl transition-all duration-300"
      >
        <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm font-extrabold text-slate-200">{label}</div>
        <div className="text-xs text-brand-300 font-semibold mt-0.5">{bengaliLabel}</div>
      </motion.div>
      </div>
    </ScrollReveal>
  );
};

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      label: 'Happy Students',
      bengaliLabel: 'সন্তুষ্ট শিক্ষার্থী',
      target: 17240,
      suffix: '+',
      icon: <Smile className="w-8 h-8 text-amber-400" />,
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Enrolled Learners',
      bengaliLabel: 'মোট এনরোলমেন্ট',
      target: 28500,
      suffix: '+',
      icon: <BookOpen className="w-8 h-8 text-brand-400" />,
      bg: 'bg-brand-500/10',
    },
    {
      label: 'Expert Instructors',
      bengaliLabel: 'অভিজ্ঞ মেন্টর',
      target: 59,
      suffix: '+',
      icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Satisfaction Rate',
      bengaliLabel: 'পজিটিভ রিভিউ',
      target: 98,
      suffix: '.5%',
      icon: <Award className="w-8 h-8 text-purple-400" />,
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="py-20 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              Trusted by Mastermind Aid
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Our Achievements & Milestones
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Proven metrics of success across 64 districts in Bangladesh.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <StatCard
              key={idx}
              label={item.label}
              bengaliLabel={item.bengaliLabel}
              target={item.target}
              suffix={item.suffix}
              icon={item.icon}
              bg={item.bg}
              delay={idx * 100}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
