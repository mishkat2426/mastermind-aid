import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  FileText, 
  Plus, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'assignments'>('courses');

  const myCourses = DBService.getPublishedCourses().filter(
    (c) => c.teacherId === currentUser?.id || c.teacherName.includes(currentUser?.name || '')
  );

  const totalStudents = myCourses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Teacher Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
              T
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">Instructor Portal</h2>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Teacher Account</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'courses', label: 'Assigned Courses', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'students', label: 'Enrolled Students', icon: <Users className="w-4 h-4" /> },
              { id: 'assignments', label: 'Assignments & Quizzes', icon: <FileText className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400" />
            <div className="truncate">
              <div className="font-bold truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{currentUser?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 bg-[#071325] p-6 sm:p-10 space-y-8 overflow-y-auto">
        <div className="pb-6 border-b border-slate-800">
          <h1 className="text-2xl sm:text-3xl font-black">Instructor Portal — {activeTab.toUpperCase()}</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your assigned courses, students, and assignment submissions.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Assigned Courses</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{myCourses.length}</div>
            <div className="text-[11px] text-slate-500">Masterclasses taught by you</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Students</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-400">{totalStudents}</div>
            <div className="text-[11px] text-slate-500">Learners in your classes</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pending Grading</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">4</div>
            <div className="text-[11px] text-slate-500">Assignment submissions</div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Your Assigned Courses</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {myCourses.map((c) => (
              <div key={c.id} className="bg-[#071325] p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex gap-3">
                  <img src={c.thumbnail} alt={c.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-2">{c.title}</h4>
                    <span className="text-[10px] text-emerald-400 font-extrabold">{c.category} • {c.studentsCount} Students</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400">{c.lessons.length} Lessons</span>
                  <button
                    onClick={() => navigate(`/courses/${c.id}/learn`)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Open Classroom
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
};
