import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, 
  CheckCircle2, 
  FileText, 
  Download, 
  MessageSquare, 
  ArrowLeft, 
  Award, 
  Sparkles,
  BookOpen,
  Clock,
  Lock,
  ChevronRight
} from 'lucide-react';
import { DBService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';
import { AIOrb } from '../../components/AIOrb';

export const ClassroomPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const course = DBService.getCourseById(courseId || '');
  const isEnrolled = currentUser && course ? DBService.isUserEnrolled(currentUser.id, course.id) : false;

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold">Course Not Found</h2>
        <Link to="/courses" className="text-brand-600 font-bold hover:underline">Browse Courses</Link>
      </div>
    );
  }

  // Protected route check
  if (!isEnrolled) {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black">Access Denied: Enrollment Required</h2>
        <p className="text-xs text-slate-300 max-w-md">
          You must be enrolled in <strong className="text-white">"{course.title}"</strong> to view full course lectures and source files.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to={`/courses/${course.id}`} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition">
            View Course Details
          </Link>
          <Link to="/courses" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition">
            All Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  const handleLessonComplete = () => {
    if (!currentUser) return;
    DBService.updateLessonProgress(currentUser.id, course.id, currentLesson.id);
  };

  const userEnrollment = currentUser ? DBService.getEnrollmentsByUserId(currentUser.id).find(e => e.courseId === course.id) : null;
  const progressPercent = userEnrollment ? userEnrollment.progress : 0;

  return (
    <div className="min-h-screen bg-[#071325] text-white flex flex-col font-sans">
      
      {/* Top Header Bar */}
      <div className="bg-[#0A192F] border-b border-slate-800 p-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Back to Student Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] text-brand-400 font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Student Classroom
            </div>
            <h1 className="text-sm sm:text-base font-black truncate max-w-md sm:max-w-xl">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Course Progress</div>
            <div className="text-xs font-black text-emerald-400">{progressPercent}% Completed</div>
          </div>
          <div className="w-16 bg-white/10 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-400 to-emerald-400 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Classroom Split View */}
      <div className="flex-1 grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        
        {/* Left 8 Cols: Video Player & Lecture Material */}
        <div className="lg:col-span-8 p-4 sm:p-8 space-y-6 overflow-y-auto">
          
          {/* HD Video Player */}
          <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border border-slate-800 shadow-2xl group flex items-center justify-center">
            <iframe
              className="w-full h-full"
              src={currentLesson.videoUrl || "https://www.youtube.com/embed/uCvNsKvIHgg"}
              title={currentLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Lecture Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-400 tracking-wider">
                Lesson {activeLessonIndex + 1} of {course.lessons.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">{currentLesson.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{currentLesson.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLessonComplete}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Lesson Complete</span>
              </button>
            </div>
          </div>

          {/* Downloadable Resources */}
          <div className="bg-[#0B1E40] p-5 rounded-2xl border border-white/10 space-y-2">
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
              <Download className="w-4 h-4" /> Lecture Source Code & Exercise Files
            </h4>
            <p className="text-xs text-slate-300">
              Download the source code files and exercise guides for this lecture.
            </p>
            <button
              onClick={() => alert('Source code package downloaded!')}
              className="mt-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Source Code (.ZIP)</span>
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Playlist & Mentor Support */}
        <div className="lg:col-span-4 p-4 sm:p-6 bg-[#0B1B33] space-y-4 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-slate-300 tracking-wider">
                Course Playlist ({course.lessons.length} Lessons)
              </span>
              <span className="text-[10px] text-brand-400 font-extrabold">HD Video</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {course.lessons.map((les, idx) => {
                const isActive = activeLessonIndex === idx;
                const isCompleted = userEnrollment?.completedLessons.includes(les.id);

                return (
                  <button
                    key={les.id}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      isActive
                        ? 'bg-brand-500 text-white border-brand-400 shadow-lg'
                        : 'bg-[#0A192F] text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-300' : 'text-emerald-400'}`} />
                      ) : (
                        <Play className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-400'}`} />
                      )}
                      <span className="line-clamp-1">{les.title}</span>
                    </div>

                    <span className={`text-[10px] font-medium ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                      {les.duration}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Support Box */}
          <div className="bg-[#0A192F] p-4 rounded-2xl border border-white/10 space-y-2 mt-4">
            <div className="flex items-center gap-2 text-brand-400 font-extrabold text-xs">
              <MessageSquare className="w-4 h-4" />
              <span>Mentor Support Lounge</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Stuck on a bug? Ask mentor <strong className="text-white">{course.teacherName}</strong> directly in our private Facebook student group.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
