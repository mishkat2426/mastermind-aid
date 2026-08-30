import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Play, 
  ShieldCheck, 
  Award, 
  ShoppingCart,
  ChevronDown,
  Sparkles,
  Download,
  Zap,
  Smartphone
} from 'lucide-react';
import { Course } from '../../types/platform';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onAddToCart: (course: Course) => void;
  onOpenPayment: () => void;
  isInCart: boolean;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onAddToCart,
  onOpenPayment,
  isInCart,
}) => {
  if (!course) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor'>('overview');
  const [openSectionIndex, setOpenSectionIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadSyllabus = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[90vh]"
        >
          
          {/* Modal Header */}
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 relative flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {course.category}
                </span>
                {course.isFree && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Free Course
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                {course.title}
              </h2>

              {course.bengaliTitle && (
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {course.bengaliTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-medium">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating} ({course.reviewCount} reviews)</span>
                </div>
                <div>• {course.studentsCount} Students Enrolled</div>
                <div>• {course.durationHours} Hours HD Content</div>
              </div>
            </div>

            {/* Pricing & Quick Action Box */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
              <div className="text-xs text-slate-300 font-medium">Course Fee</div>
              <div className="flex items-baseline gap-2">
                {course.isFree ? (
                  <span className="text-3xl font-black text-emerald-400">FREE</span>
                ) : (
                  <>
                    <span className="text-3xl font-black text-white">৳{course.price.toLocaleString()}</span>
                    {course.originalPrice && (
                      <span className="text-sm line-through text-slate-400">৳{course.originalPrice.toLocaleString()}</span>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => onAddToCart(course)}
                  className={`w-full px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                    isInCart
                      ? 'bg-emerald-500 text-white'
                      : 'bg-brand-500 hover:bg-brand-600 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isInCart ? 'In Shopping Cart' : 'Enroll Now'}</span>
                </button>

                {!course.isFree && (
                  <button
                    onClick={() => {
                      onAddToCart(course);
                      onOpenPayment();
                      onClose();
                    }}
                    className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Instant bKash / Nagad Checkout</span>
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* Modal Navigation Tabs with LayoutId Animation */}
          <div className="bg-slate-100 border-b border-slate-200 px-6 flex gap-6 text-xs sm:text-sm font-bold text-slate-600 relative">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 transition relative ${
                activeTab === 'overview' ? 'text-brand-600 font-black' : 'hover:text-slate-900'
              }`}
            >
              Overview & Benefits
              {activeTab === 'overview' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`py-3.5 transition relative ${
                activeTab === 'syllabus' ? 'text-brand-600 font-black' : 'hover:text-slate-900'
              }`}
            >
              Course Curriculum ({course.curriculum ? course.curriculum.reduce((acc: number, curr: any) => acc + curr.lessons.length, 0) : course.lessons?.length || course.lessonsCount || 0} Lessons)
              {activeTab === 'syllabus' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('instructor')}
              className={`py-3.5 transition relative ${
                activeTab === 'instructor' ? 'text-brand-600 font-black' : 'hover:text-slate-900'
              }`}
            >
              Instructor Profile
              {activeTab === 'instructor' && (
                <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* Video Preview Box */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-64 sm:h-80 border border-slate-200 shadow-inner group flex items-center justify-center">
                  {isPlayingVideo ? (
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/uCvNsKvIHgg?autoplay=1"
                      title="Course Preview Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={course.thumbnail || (course as any).image}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-75"
                      />
                      <button
                        onClick={() => setIsPlayingVideo(true)}
                        className="absolute w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
                      >
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold">
                        Watch HD Intro Preview Video
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#0A192F]">Course Description</h3>
                    
                    <button
                      onClick={handleDownloadSyllabus}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess ? 'PDF Downloaded ✓' : 'Download Syllabus PDF'}</span>
                    </button>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
                  {course.bengaliDescription && (
                    <p className="text-slate-700 font-medium text-sm bg-brand-50/70 p-4 rounded-2xl border border-brand-200 mt-2">
                      🇧🇩 {course.bengaliDescription}
                    </p>
                  )}
                </div>

                {/* Course Features */}
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {course.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#0A192F]">Prerequisites / Requirements</h3>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {course.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

              </div>
            )}

            {/* Tab 2: Syllabus */}
            {activeTab === 'syllabus' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <h3 className="text-base font-bold text-[#0A192F]">Curriculum & Modules Breakdown</h3>
                {course.curriculum && course.curriculum.length > 0 ? (
                  course.curriculum.map((section: any, idx: number) => {
                    const isOpen = openSectionIndex === idx;

                    return (
                      <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => setOpenSectionIndex(isOpen ? -1 : idx)}
                          className="w-full text-left px-5 py-4 font-bold text-sm text-[#0A192F] flex items-center justify-between hover:bg-slate-100 transition"
                        >
                          <span>{section.sectionTitle}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="bg-white border-t border-slate-200 divide-y divide-slate-100">
                            {section.lessons.map((lesson: any, lIdx: number) => (
                              <div key={lIdx} className="px-5 py-3 flex items-center justify-between text-xs text-slate-700">
                                <div className="flex items-center gap-2 font-medium">
                                  <Play className="w-3.5 h-3.5 text-brand-500" />
                                  <span>{lesson.title}</span>
                                  {lesson.isPreview && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                                <span className="text-slate-400 font-semibold">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 divide-y divide-slate-100">
                    {(course.lessons || []).map((lesson: any, lIdx: number) => (
                      <div key={lesson.id || lIdx} className="py-3 flex items-center justify-between text-xs text-slate-700">
                        <div className="flex items-center gap-2 font-medium">
                          <Play className="w-3.5 h-3.5 text-brand-500" />
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-slate-400 font-semibold">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Instructor */}
            {activeTab === 'instructor' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <img
                    src={course.teacherAvatar || (course as any).instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                    alt={course.teacherName || (course as any).instructor?.name || 'Instructor'}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-100"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-[#0A192F]">{course.teacherName || (course as any).instructor?.name || 'Hasibul Islam'}</h4>
                    <p className="text-xs font-semibold text-brand-600">{(course as any).instructor?.title || 'Lead Instructor'}</p>
                    <p className="text-xs text-slate-500 mt-1">10+ Years experience in software & digital marketing training in Bangladesh.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer Bar */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              Includes Lifetime Access • Verified Certificate
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onAddToCart(course);
                  onClose();
                }}
                className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{isInCart ? 'View Cart' : 'Add to Cart & Checkout'}</span>
              </button>
            </div>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
