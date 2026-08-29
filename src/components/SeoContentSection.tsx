import React, { useState } from 'react';
import { ChevronDown, HelpCircle, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';
import { SEO_FAQ_ITEMS } from '../data/coursesData';
import { ScrollReveal } from './ScrollReveal';

export const SeoContentSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Copy about Mastermind Aid */}
          <ScrollReveal direction="up" distance={20} className="lg:col-span-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full">
                About Mastermind Aid Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] leading-tight">
                Best Online Course in Bangladesh – Learn Smart with Mastermind Aid
              </h2>
            </div>

            <div className="prose prose-slate text-xs sm:text-sm text-slate-600 space-y-4 leading-relaxed font-normal">
              <p>
                <strong>Mastermind Aid (মাসটারমাইন্ড এইড)</strong> is Bangladesh's premier e-learning platform committed to delivering top-tier online education in <strong>WordPress Plugin Development, Full-Stack Web Development, Digital Marketing, Meta Ads, SEO, and Freelancing</strong>.
              </p>
              
              <p>
                Our mission is to empower students, job seekers, and freelancers with industry-relevant, practical skills that translate directly into marketplace success on Fiverr, Upwork, and local IT agencies.
              </p>

              <p>
                Unlike generic online tutorials, every course on Mastermind Aid is structured around <strong>practical projects</strong>. Students gain access to lifetime HD video lessons, downloadable source code, private mentor support groups, and career guidance for Fiverr and Upwork.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 space-y-1">
                <div className="flex items-center gap-2 text-brand-600 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Practical Curriculum</span>
                </div>
                <p className="text-[11px] text-slate-500">Real-world coding & digital marketing projects.</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 space-y-1">
                <div className="flex items-center gap-2 text-amber-700 font-extrabold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Lifetime Support Lounge</span>
                </div>
                <p className="text-[11px] text-slate-500">Ask questions directly in private student community.</p>
              </div>
            </div>

          </div>
          </ScrollReveal>

          {/* Right Column: Interactive FAQ Accordion */}
          <ScrollReveal direction="up" distance={20} delay={150} className="lg:col-span-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-brand-600 font-extrabold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0A192F]">
                Got Questions? We Have Answers
              </h3>
            </div>

            <div className="space-y-3">
              {SEO_FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left font-extrabold text-xs sm:text-sm text-[#0A192F] flex items-center justify-between gap-4 hover:bg-slate-100 transition"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        openFaqIndex === idx ? 'rotate-180 text-brand-600' : ''
                      }`}
                    />
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-200/60 pt-3 bg-white">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
