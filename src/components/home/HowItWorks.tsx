import React from 'react';
import { MousePointerClick, BookOpenCheck, Rocket, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../layout/ScrollReveal';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Select A Course',
      bengaliTitle: 'পছন্দের কোর্স সিলেক্ট করুন',
      description: 'Browse our free & premium courses in Web Development, Digital Marketing, or SEO tailored for beginners.',
      icon: <MousePointerClick className="w-8 h-8 text-brand-500" />,
    },
    {
      number: '02',
      title: 'Enroll & Access Instantly',
      bengaliTitle: 'সহজে এনরোল করুন',
      description: 'Get immediate 24/7 access to all HD video lectures, source codes, and private student community.',
      icon: <BookOpenCheck className="w-8 h-8 text-brand-500" />,
    },
    {
      number: '03',
      title: 'Start Learning & Earning',
      bengaliTitle: 'শেখা ও আয় শুরু করুন',
      description: 'Complete practical projects, earn your verified certificate, and land client work on Fiverr & Upwork.',
      icon: <Rocket className="w-8 h-8 text-brand-500" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-4 py-1.5 rounded-full inline-block">
              Our Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F2B5A]">
              How Does Course Kori Work?
            </h2>
            <p className="text-slate-500 text-sm">
              Simple 3-step pathway to mastering high-demand skills in Bangladesh.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} delay={idx * 120} direction="up" distance={24}>
              <div
                className="bg-slate-50/80 hover:bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group h-full"
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white group-hover:bg-brand-500 text-brand-600 group-hover:text-white border border-slate-100 shadow-md flex items-center justify-center transition-colors duration-300">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-300 group-hover:text-brand-500/30 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0F2B5A] group-hover:text-brand-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-brand-600">{step.bengaliTitle}</p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-2">
                    {step.description}
                  </p>
                </div>

                {idx < 2 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
