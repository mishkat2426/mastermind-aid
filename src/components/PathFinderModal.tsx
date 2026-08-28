import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, CheckCircle2, X, Sparkles, Trophy } from 'lucide-react';
import { COURSES, Course } from '../data/coursesData';

interface PathFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedCourse: (course: Course) => void;
}

export const PathFinderModal: React.FC<PathFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedCourse,
}) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [timeCommitment, setTimeCommitment] = useState<string>('');

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setGoal('');
    setExperience('');
    setTimeCommitment('');
  };

  // Pick recommendation based on choices
  let recommendedCourse = COURSES[0];
  if (goal === 'digital-marketing') recommendedCourse = COURSES[1];
  if (goal === 'freelancing') recommendedCourse = COURSES[2];
  if (goal === 'seo') recommendedCourse = COURSES[3];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-emerald-400" /> Career AI Path Finder
            </div>
            <h3 className="text-2xl font-black">Find Your Ideal Skill Path</h3>
            <p className="text-xs text-slate-300 mt-1">
              Answer 3 quick questions to discover the best course for your career goals.
            </p>
          </div>

          {/* Quiz Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  Step 1 of 3: Primary Career Goal
                </span>
                <h4 className="text-lg font-black text-[#0A192F]">
                  আপনার প্রধান ক্যারিয়ার লক্ষ্য কোনটি?
                </h4>

                <div className="space-y-2.5">
                  {[
                    { id: 'web-dev', label: 'ওয়ার্ডপ্রেস ও ওয়েব ডেভেলপমেন্ট শিখে কোডিং প্রজেক্ট করা' },
                    { id: 'digital-marketing', label: 'ডিজিটাল মার্কেটিং ও ফেসবুক এডস স্পেশালিস্ট হওয়া' },
                    { id: 'freelancing', label: 'ফাইভার ও আপওয়ার্কে আন্তর্জাতিক ফ্রিল্যান্সিং ক্যারিয়ার গড়া' },
                    { id: 'seo', label: 'এসইও ও গুগল ফার্স্ট পেজ র‍্যাঙ্কিং এ এক্সপার্ট হওয়া' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setGoal(opt.id);
                        setStep(2);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 font-bold text-xs sm:text-sm text-slate-800 transition flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <span className="text-xs font-extrabold uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                  Step 2 of 3: Experience Level
                </span>
                <h4 className="text-lg font-black text-[#0A192F]">
                  আইটি বা কোডিং এ আপনার পূর্বের অভিজ্ঞতা কেমন?
                </h4>

                <div className="space-y-2.5">
                  {[
                    { id: 'beginner', label: 'একদম নতুন (Beginner - কোনো পূর্ব অভিজ্ঞতা নেই)' },
                    { id: 'intermediate', label: 'মাঝারি (Intermediate - বেসিক ধারণা আছে)' },
                    { id: 'advanced', label: 'উন্নত (Advanced - প্রফেশনাল স্কিল আপগ্রেড করতে চাই)' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setExperience(opt.id);
                        setStep(3);
                      }}
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50/50 font-bold text-xs sm:text-sm text-slate-800 transition flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                  <Trophy className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    Your Personalized Match Found!
                  </span>
                  <h4 className="text-xl font-black text-[#0A192F]">
                    We Recommend This Course For You
                  </h4>
                </div>

                <div className="bg-brand-50 p-5 rounded-3xl border border-brand-200 text-left flex gap-4 items-center">
                  <img
                    src={recommendedCourse.image}
                    alt={recommendedCourse.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-brand-200"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-brand-600">
                      {recommendedCourse.category}
                    </span>
                    <h5 className="text-sm font-extrabold text-[#0A192F]">
                      {recommendedCourse.title}
                    </h5>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">
                      Instructor: {recommendedCourse.instructor.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => {
                      onSelectRecommendedCourse(recommendedCourse);
                      onClose();
                    }}
                    className="flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-extrabold shadow-lg transition flex items-center justify-center gap-1.5"
                  >
                    <span>View Course Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
