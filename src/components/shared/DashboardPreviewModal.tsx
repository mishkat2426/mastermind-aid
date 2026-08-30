import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  FileText, 
  Download, 
  MessageSquare, 
  X, 
  Layout, 
  Award, 
  Sparkles,
  BookOpen,
  Clock
} from 'lucide-react';

interface DashboardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardPreviewModal: React.FC<DashboardPreviewModalProps> = ({ isOpen, onClose }) => {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  if (!isOpen) return null;

  const lessons = [
    { id: 1, title: '01. Course Intro & LocalWP Setup', duration: '14:20', isCompleted: true },
    { id: 2, title: '02. Understanding WordPress Hooks & Actions', duration: '28:45', isCompleted: true },
    { id: 3, title: '03. Building Custom Shortcodes with PHP', duration: '35:10', isCompleted: false, active: true },
    { id: 4, title: '04. Registering Custom Database Tables', duration: '42:00', isCompleted: false },
    { id: 5, title: '05. Deploying to WordPress.org Marketplace', duration: '22:15', isCompleted: false },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col max-h-[90vh]"
        >
          
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg">
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-brand-400 font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Interactive Student Portal Demo
                </div>
                <h3 className="text-xl sm:text-2xl font-black">MASTERMIND AIDITIT Learning Dashboard</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student LMS Portal Layout */}
          <div className="flex-1 overflow-y-auto grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left Column: Video Player & Lecture Notes */}
            <div className="lg:col-span-8 p-6 space-y-6">
              
              {/* HD Video Player Simulation */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-lg group flex items-center justify-center">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/uCvNsKvIHgg?autoplay=0"
                  title="Lecture Video"
                  allowFullScreen
                />
              </div>

              {/* Lesson Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-[#0A192F]">
                    {lessons[activeLessonIndex].title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Module 2: Advanced WordPress Development & Database Queries
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Source Code (.ZIP)
                  </button>
                  <button className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                </div>
              </div>

              {/* Overall Progress Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-700">
                  <span>Your Overall Course Progress</span>
                  <span className="text-brand-600">40% Completed (2 of 5 Lessons)</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full w-[40%]" />
                </div>
              </div>

            </div>

            {/* Right Column: Playlist & Student Support */}
            <div className="lg:col-span-4 p-6 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Course Playlist ({lessons.length} Modules)
                </span>
                <span className="text-xs text-slate-500 font-bold">HD Videos</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      activeLessonIndex === idx
                        ? 'bg-brand-500 text-white border-brand-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${activeLessonIndex === idx ? 'text-emerald-300' : 'text-emerald-500'}`} />
                      ) : (
                        <Play className={`w-4 h-4 shrink-0 ${activeLessonIndex === idx ? 'text-white' : 'text-brand-500'}`} />
                      )}
                      <span className="line-clamp-1">{lesson.title}</span>
                    </div>

                    <span className={`text-[10px] font-semibold ${activeLessonIndex === idx ? 'text-slate-200' : 'text-slate-400'}`}>
                      {lesson.duration}
                    </span>
                  </button>
                ))}
              </div>

              {/* Private Student Group Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-brand-600 font-bold text-xs">
                  <MessageSquare className="w-4 h-4" />
                  <span>Private Mentor Support Group</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Have a bug or code question? Ask mentor Hasibul Islam directly in our private Facebook Student Lounge.
                </p>
              </div>

            </div>

          </div>

          {/* Footer Bar */}
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Demo Portal • All MASTERMIND AIDITIT Enrolled Students get 24/7 Access
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#0A192F] hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Close Demo Dashboard
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
