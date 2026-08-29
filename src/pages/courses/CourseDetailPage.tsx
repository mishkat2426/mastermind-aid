import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
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
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Lock
} from 'lucide-react';
import { DBService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { Footer } from '../../components/Footer';
import { AIOrb } from '../../components/AIOrb';

interface CourseDetailPageProps {
  onAddToCart: (course: any) => void;
  cartItemIds: string[];
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ onAddToCart, cartItemIds }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const course = DBService.getCourseById(courseId || '');

  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'instructor'>('overview');
  const [openSectionIndex, setOpenSectionIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <AIOrb state="idle" size={60} />
        <h2 className="text-2xl font-black text-[#0A192F]">Course Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md">
          The requested course ID could not be found or has been archived.
        </p>
        <Link
          to="/courses"
          className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses Catalog
        </Link>
      </div>
    );
  }

  const isEnrolled = currentUser ? DBService.isUserEnrolled(currentUser.id, course.id) : false;
  const isInCart = cartItemIds.includes(course.id);

  const handleEnrollClick = () => {
    if (isEnrolled) {
      navigate(`/courses/${course.id}/learn`);
      return;
    }

    if (course.isFree) {
      if (!isAuthenticated || !currentUser) {
        navigate('/login', { state: { from: `/courses/${course.id}` } });
        return;
      }
      // Instant enroll for free course
      DBService.enrollUser(currentUser.id, course.id);
      navigate(`/courses/${course.id}/learn`);
      return;
    }

    // Go to checkout
    navigate(`/checkout/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Breadcrumb Header */}
      <div className="bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative">
        <div className="max-w-7xl mx-auto space-y-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-white font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Courses
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Course Info */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="bg-white/10 text-slate-200 text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-white/10">
                  {course.level}
                </span>
                {course.isFree && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Free Masterclass
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              {course.bengaliTitle && (
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  {course.bengaliTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 font-medium">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{course.rating} ({course.reviewCount} reviews)</span>
                </div>
                <div>• {course.studentsCount} Students Enrolled</div>
                <div>• {course.durationHours} Hours HD Video Content</div>
                <div>• Mentor: <strong className="text-white font-bold">{course.teacherName}</strong></div>
              </div>
            </div>

            {/* Quick Pricing & Enrollment Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-300 font-medium">Course Investment</span>
                {course.isFree ? (
                  <span className="text-3xl font-black text-emerald-400">FREE</span>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">৳{course.price.toLocaleString()}</span>
                    {course.discountPrice && (
                      <span className="text-sm line-through text-slate-400">৳{course.discountPrice.toLocaleString()}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition"
                >
                  {isEnrolled ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Continue Learning (Access Classroom)</span>
                    </>
                  ) : course.isFree ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Free Course Now</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Enroll & Pay via bKash / Nagad / Card</span>
                    </>
                  )}
                </button>

                {!isEnrolled && !course.isFree && (
                  <button
                    onClick={() => onAddToCart(course)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 ${
                      isInCart
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{isInCart ? 'Already in Shopping Cart' : 'Add to Shopping Cart'}</span>
                  </button>
                )}
              </div>

              <div className="pt-2 text-[11px] text-slate-300 space-y-1 font-medium">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Lifetime Access Guarantee</span>
                </div>
                <div>• Verified Certificate of Completion included</div>
                <div>• Private Facebook Student lounge access</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 px-6 flex gap-6 text-xs sm:text-sm font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 transition relative ${activeTab === 'overview' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Overview & Details
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-4 transition relative ${activeTab === 'syllabus' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Curriculum ({course.lessons.length} Lessons)
          </button>

          <button
            onClick={() => setActiveTab('instructor')}
            className={`py-4 transition relative ${activeTab === 'instructor' ? 'text-brand-600 font-black border-b-2 border-brand-500' : 'hover:text-slate-900'}`}
          >
            Instructor Profile
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-8">
              
              {/* Video Preview Player */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-xl group flex items-center justify-center">
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
                      src={course.thumbnail}
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
                      Watch HD Intro Masterclass Preview
                    </div>
                  </>
                )}
              </div>

              {/* Course Description */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#0A192F]">About This Course</h3>
                  <button
                    onClick={() => {
                      setDownloadSuccess(true);
                      setTimeout(() => setDownloadSuccess(false), 3000);
                    }}
                    className="text-xs font-bold text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-xl border border-brand-200 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadSuccess ? 'Syllabus PDF Downloaded ✓' : 'Download Syllabus PDF'}</span>
                  </button>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">{course.description}</p>
                
                {course.bengaliDescription && (
                  <p className="text-slate-800 font-medium text-sm bg-brand-50/70 p-5 rounded-2xl border border-brand-200 mt-2">
                    🇧🇩 {course.bengaliDescription}
                  </p>
                )}
              </div>

              {/* What You Will Learn */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-xl font-black text-[#0A192F]">What You Will Learn & Master</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <h4 className="text-base font-black text-[#0A192F]">Course Requirements</h4>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-brand-600 to-[#0A192F] text-white p-6 rounded-3xl shadow-xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                  ✦ Mastermind Aid Lifetime Access
                </span>
                <h4 className="text-lg font-black">Ready to Start Learning?</h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Join 17,000+ Bangladeshi learners and build practical coding & marketing skills today.
                </p>
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3 bg-white text-brand-700 hover:bg-slate-100 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <span>{isEnrolled ? 'Go to Classroom' : 'Enroll Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Syllabus / Curriculum */}
        {activeTab === 'syllabus' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 max-w-4xl">
            <h3 className="text-xl font-black text-[#0A192F]">Course Curriculum & Lessons Breakdown</h3>

            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between hover:bg-white transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center font-extrabold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                        <span>{lesson.title}</span>
                        {lesson.isPreview && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            Free Preview
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400">{lesson.duration}</span>
                    {isEnrolled || lesson.isPreview ? (
                      <button
                        onClick={() => navigate(`/courses/${course.id}/learn`)}
                        className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Instructor Profile */}
        {activeTab === 'instructor' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 max-w-4xl">
            <div className="flex items-center gap-5">
              <img
                src={course.teacherAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                alt={course.teacherName}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md"
              />
              <div>
                <h3 className="text-2xl font-black text-[#0A192F]">{course.teacherName}</h3>
                <p className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                  Lead Instructor & Mentor
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  10+ Years experience training web developers, WordPress engineers & digital marketers in Bangladesh.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer onSelectCategory={() => navigate('/courses')} />

    </div>
  );
};
