import React, { useState } from 'react';
import { ChevronDown, HelpCircle, BookOpen, CheckCircle } from 'lucide-react';
import { SEO_FAQ_ITEMS } from '../data/coursesData';

export const SeoContentSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section id="about" className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Layout: Deep Informational Copy & FAQ */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Copy about Course Kori */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full">
              About Course Kori Platform
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B5A] leading-tight">
              Best Online Course in Bangladesh – Learn Smart with Course Kori
            </h2>

            <div className="prose prose-slate text-sm text-slate-600 space-y-4 leading-relaxed">
              <p>
                <strong>Course Kori (কোর্স করি)</strong> is Bangladesh's premier e-learning platform committed to delivering top-tier online education in <strong>WordPress Plugin Development, Full-Stack Web Development, Digital Marketing, Meta Ads, SEO, and Freelancing</strong>.
              </p>

              <p className="bg-brand-50/70 p-4 rounded-2xl border border-brand-200 text-slate-800 font-medium">
                🇧🇩 আমাদের লক্ষ্য হলো বাংলাদেশের তরুণ ও শিক্ষার্থীদের বিনামূল্যে এবং সাশ্রয়ী মূল্যে গ্লোবাল কোয়ালিটির আইটি কোর্স প্রদান করা, যেন তারা ঘরে বসেই ফ্রিল্যান্সিং ও আইটি ক্যারিয়ার গড়তে পারে।
              </p>

              <p>
                Unlike generic online tutorials, every course on Course Kori is structured around <strong>practical projects</strong>. Students gain access to lifetime HD video lessons, downloadable source code, private mentor support groups, and career guidance for Fiverr and Upwork.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-brand-600 font-bold text-base">100% Practical</div>
                <div className="text-xs text-slate-500 mt-0.5">Real projects without theory waste</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="text-brand-600 font-bold text-base">Lifetime Support</div>
                <div className="text-xs text-slate-500 mt-0.5">24/7 dedicated mentor assistance</div>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#0F2B5A]">
              <HelpCircle className="w-6 h-6 text-brand-500" />
              <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-4">
              {SEO_FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-5 font-bold text-sm sm:text-base text-[#0F2B5A] flex items-center justify-between gap-4"
                    >
                      <span>{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-brand-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
