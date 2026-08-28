import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import { playUiClickSound } from './SoundEffects';

interface CourseComparisonTableProps {
  onSelectPlan: (planName: string, price: number) => void;
}

export const CourseComparisonTable: React.FC<CourseComparisonTableProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'lifetime' | 'annual'>('lifetime');

  const features = [
    { name: 'Access to All HD Video Lectures', free: true, pro: true, vip: true },
    { name: 'Downloadable Project Source Codes & Worksheets', free: false, pro: true, vip: true },
    { name: 'Private Facebook Student Support Lounge', free: false, pro: true, vip: true },
    { name: 'Verifiable ISO 9001 Certificate of Completion', free: false, pro: true, vip: true },
    { name: 'Fiverr & Upwork Gig Optimization Audit', free: false, pro: false, vip: true },
    { name: '1-on-1 Weekly Live Code Review with Hasibul Islam', free: false, pro: false, vip: true },
    { name: 'Bangladesh IT Agency Job Recommendation', free: false, pro: false, vip: true },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-4 py-1.5 rounded-full inline-block">
            Transparent Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0A192F]">
            Compare Learning Membership Tiers
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Choose the best plan for your career goals. All plans include 100% money-back guarantee.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mt-4 text-xs font-bold">
            <button
              onClick={() => {
                playUiClickSound();
                setBillingCycle('lifetime');
              }}
              className={`px-5 py-2 rounded-xl transition ${
                billingCycle === 'lifetime' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lifetime Access (Best Value)
            </button>
            <button
              onClick={() => {
                playUiClickSound();
                setBillingCycle('annual');
              }}
              className={`px-5 py-2 rounded-xl transition ${
                billingCycle === 'annual' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1-Year All Access
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Free Starter */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:shadow-xl transition">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                Free Starter
              </span>
              <h3 className="text-2xl font-black text-[#0A192F]">Starter Learner</h3>
              <p className="text-xs text-slate-500">Perfect for beginners exploring basic skills.</p>
              
              <div className="text-3xl font-black text-[#0A192F] pt-2">
                FREE <span className="text-xs text-slate-400 font-normal">/ forever</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 pt-4 border-t border-slate-200">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.free ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={f.free ? 'font-bold text-slate-800' : 'text-slate-400 line-through'}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                playUiClickSound();
                onSelectPlan('Free Starter', 0);
              }}
              className="mt-8 w-full py-3 bg-white border border-slate-300 hover:bg-slate-100 text-[#0A192F] font-extrabold text-xs rounded-2xl transition"
            >
              Start Free Courses
            </button>
          </div>

          {/* Plan 2: Pro Career (Highlighted) */}
          <div className="bg-gradient-to-b from-[#0A192F] to-[#0D2447] text-white rounded-3xl p-8 border-2 border-brand-500 shadow-2xl flex flex-col justify-between relative transform lg:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-[#0A192F] text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Most Popular Choice
            </div>

            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-brand-300 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-400/30">
                Pro Career Tier
              </span>
              <h3 className="text-2xl font-black text-white">Full Career Pass</h3>
              <p className="text-xs text-slate-300">Complete roadmap with certificate & project files.</p>
              
              <div className="text-3xl font-black text-white pt-2 flex items-baseline gap-2">
                <span>৳2,500</span>
                <span className="text-xs text-slate-400 font-normal line-through">৳5,000</span>
                <span className="text-xs font-extrabold text-amber-400">50% OFF</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200 pt-4 border-t border-white/10">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {f.pro ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className={f.pro ? 'font-bold text-white' : 'text-slate-400 line-through'}>{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                playUiClickSound();
                onSelectPlan('Pro Career', 2500);
              }}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition"
            >
              <span>Enroll Pro Career Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 3: VIP Mentorship */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:shadow-xl transition">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                VIP Mentorship
              </span>
              <h3 className="text-2xl font-black text-[#0A192F]">Masterclass VIP</h3>
              <p className="text-xs text-slate-500">1-on-1 mentorship & agency job recommendations.</p>
              
              <div className="text-3xl font-black text-[#0A192F] pt-2">
                ৳5,000 <span className="text-xs text-slate-400 font-normal">/ lifetime</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 pt-4 border-t border-slate-200">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800">{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                playUiClickSound();
                onSelectPlan('Masterclass VIP', 5000);
              }}
              className="mt-8 w-full py-3 bg-[#0A192F] hover:bg-brand-600 text-white font-extrabold text-xs rounded-2xl transition"
            >
              Enroll VIP Mentorship
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
