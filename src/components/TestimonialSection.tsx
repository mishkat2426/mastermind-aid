import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/coursesData';

export const TestimonialSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Rating Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold border border-amber-200">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>EXCELLENT Based on 17+ Verified Reviews</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0F2B5A]">
            What Our Students Say About Course Kori
          </h2>
          <p className="text-slate-500 text-sm">
            Read real feedback from learners who mastered new skills and launched their careers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-brand-100 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs text-slate-400 font-semibold ml-2">{item.timeAgo}</span>
                </div>

                {/* Comment Text */}
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-100"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#0F2B5A] flex items-center gap-1">
                    <span>{item.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500 fill-brand-100" />
                  </h4>
                  <p className="text-[11px] font-semibold text-brand-600">{item.role}</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    Course: {item.courseTaken}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
