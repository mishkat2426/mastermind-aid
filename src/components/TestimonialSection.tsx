import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/coursesData';
import { ScrollReveal } from './ScrollReveal';

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-100/80 px-3.5 py-1 rounded-full">
              Real Student Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F]">
              What Our Students Say About Mastermind Aid
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Verified feedback from students learning Web Development, Digital Marketing & Freelancing.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 100} direction="up" distance={24}>
              <div
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-brand-100 group-hover:text-brand-200 transition" />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic font-normal">
                    "{item.comment}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-100"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-[#0A192F] flex items-center gap-1">
                      <span>{item.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">{item.role}</p>
                    <span className="text-[10px] text-brand-600 font-extrabold block mt-0.5">
                      Course: {item.courseTaken}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
