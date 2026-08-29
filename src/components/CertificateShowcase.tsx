import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, CheckCircle2, Download, ShieldCheck, Sparkles, QrCode, Lock, X } from 'lucide-react';

interface CertificateShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateShowcase: React.FC<CertificateShowcaseProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('Mishkat Abedin');
  const [courseTitle, setCourseTitle] = useState('WordPress Plugin Development Mastery 2026');
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-[#0A192F] flex items-center justify-center shadow-lg">
                <Award className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Verified E-Certificate Preview
                </div>
                <h3 className="text-xl sm:text-2xl font-black">MASTERMIND AIDT Certificate Generator</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Form Controls */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Student Name (আপনার নাম টাইপ করুন)
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Type your name..."
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Completed Course Title
              </label>
              <select
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="WordPress Plugin Development Mastery 2026">WordPress Plugin Development Mastery 2026</option>
                <option value="Complete Digital Marketing & Ads Specialization 2026">Complete Digital Marketing & Ads Specialization 2026</option>
                <option value="Freelancing Career Blueprint: Fiverr & Upwork Success">Freelancing Career Blueprint: Fiverr & Upwork Success</option>
                <option value="Advanced SEO & Content Ranking Blueprint 2026">Advanced SEO & Content Ranking Blueprint 2026</option>
              </select>
            </div>
          </div>

          {/* Live Certificate Canvas Graphic */}
          <div className="p-6 sm:p-10 bg-slate-100 flex items-center justify-center overflow-x-auto">
            
            <div className="w-[620px] bg-white rounded-2xl p-8 border-8 border-brand-800/10 shadow-2xl relative overflow-hidden font-serif shrink-0">
              
              {/* Outer Decorative Gold Border Frame */}
              <div className="absolute inset-3 border-2 border-amber-400/40 rounded-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-bl-full pointer-events-none" />

              {/* Certificate Content */}
              <div className="text-center space-y-4 relative z-10 py-4 font-sans">
                
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-extrabold text-sm">
                      MA
                    </div>
                    <span className="text-lg font-black text-[#0A192F]">MASTERMIND <span className="text-brand-500">AIDT</span></span>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                    ID: MA-2026-89472-VERIFIED
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                    CERTIFICATE OF COMPLETION
                  </span>
                  <h4 className="text-2xl font-serif font-black text-[#0A192F] italic pt-1">
                    This is proudly presented to
                  </h4>
                </div>

                {/* Live Student Name */}
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 border-b-2 border-amber-400 inline-block px-8 py-1 tracking-tight font-sans">
                  {studentName || 'Student Name'}
                </div>

                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                  For successfully demonstrating professional mastery and completing all practical projects for the course:
                </p>

                <div className="text-sm font-black text-[#0A192F] uppercase tracking-wide bg-brand-50 py-2 px-4 rounded-xl inline-block border border-brand-200">
                  {courseTitle}
                </div>

                {/* Signatures & Security Stamp */}
                <div className="pt-8 flex items-end justify-between px-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="font-serif italic font-bold text-slate-800 text-sm">Hasibul Islam</div>
                    <div className="text-[10px] text-slate-400 border-t border-slate-300 pt-1 font-sans">Lead Instructor & Founder</div>
                  </div>

                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-[#0A192F] flex flex-col items-center justify-center font-bold text-[9px] shadow-lg ring-4 ring-amber-100">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                    <span>VERIFIED</span>
                  </div>

                  <div className="text-center">
                    <div className="font-serif italic font-bold text-slate-800 text-sm">MASTERMIND AIDT Board</div>
                    <div className="text-[10px] text-slate-400 border-t border-slate-300 pt-1 font-sans">Academic Director</div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Includes Verifiable QR Code & Security Seal</span>
            </div>

            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloaded ? 'Certificate PDF Generated ✓' : 'Download High-Res PDF Certificate'}</span>
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
