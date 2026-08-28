import React from 'react';
import { motion } from 'framer-motion';
import { Smile, BookOpen, GraduationCap, Award } from 'lucide-react';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      label: 'Happy Students',
      bengaliLabel: 'সন্তুষ্ট শিক্ষার্থী',
      count: '17,240+',
      icon: <Smile className="w-8 h-8 text-amber-400" />,
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Enrolled Learners',
      bengaliLabel: 'মোট এনরোলমেন্ট',
      count: '28,500+',
      icon: <BookOpen className="w-8 h-8 text-brand-400" />,
      bg: 'bg-brand-500/10'
    },
    {
      label: 'Expert Instructors',
      bengaliLabel: 'অভিজ্ঞ মেন্টর',
      count: '59+',
      icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Satisfaction Rate',
      bengaliLabel: 'পজিটিভ রিভিউ',
      count: '98.5%',
      icon: <Award className="w-8 h-8 text-purple-400" />,
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <section className="py-20 bg-[#0A192F] text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center hover:bg-white/10 hover:border-brand-400/50 shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                {item.icon}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tight">
                {item.count}
              </div>
              <div className="text-sm font-extrabold text-slate-200">{item.label}</div>
              <div className="text-xs text-brand-300 font-semibold mt-0.5">{item.bengaliLabel}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
