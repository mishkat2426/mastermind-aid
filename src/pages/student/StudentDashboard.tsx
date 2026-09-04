import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { 
  BookOpen, 
  Play, 
  Award, 
  CreditCard, 
  User, 
  LogOut, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AIOrb } from '../../components/ai/AIOrb';

export const StudentDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my-courses' | 'progress' | 'transactions' | 'certificates' | 'profile'>('my-courses');

  const enrollments = currentUser ? DBService.getEnrollmentsByUserId(currentUser.id) : [];
  const transactions = currentUser ? DBService.getTransactionsByUserId(currentUser.id, currentUser.id) : [];
  const pendingTransactions = transactions.filter((t) => t.status === 'PENDING');

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const activeCount = enrollments.filter((e) => e.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Student Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-black shadow-lg">
              S
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">MASTERMIND AIDIT Student Portal</h2>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Learner Dashboard</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'my-courses', label: 'My Enrolled Courses', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'progress', label: 'Learning Progress', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'transactions', label: 'Transactions & Payment', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  activeTab === item.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <Link
              to="/courses"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-emerald-400 hover:bg-white/5 transition"
            >
              <Compass className="w-4 h-4" />
              <span>Explore New Courses</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-400" />
            <div className="truncate">
              <div className="font-bold truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-brand-400 font-semibold">{currentUser?.email}</div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {currentUser?.name}! 👋</h1>
            <p className="text-xs text-slate-400 mt-1">Track your course progress, watch HD lectures, and access certificate downloads.</p>
          </div>

          <Link
            to="/courses"
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Compass className="w-4 h-4" /> Browse Catalog
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Enrolled Courses</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-400">{enrollments.length}</div>
            <div className="text-[11px] text-slate-500">Active learning subscriptions</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Learning</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">{activeCount}</div>
            <div className="text-[11px] text-slate-500">In progress right now</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Completed</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{completedCount}</div>
            <div className="text-[11px] text-slate-500">Finished masterclasses</div>
          </div>

          <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Certificates</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400">{completedCount}</div>
            <div className="text-[11px] text-slate-500">Verified credentials</div>
          </div>
        </div>

        {/* Tab 1: Enrolled Courses */}
        {activeTab === 'my-courses' && (
          <div className="space-y-6">

            {/* Pending Requests Section */}
            {pendingTransactions.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-amber-300">
                        Pending Course Enrollment Requests ({pendingTransactions.length})
                      </h4>
                      <p className="text-xs text-slate-300">
                        আপনার পাঠানো রিকোয়েস্টটি অ্যাডমিন ভেরিফাই করছেন। অ্যাডমিন অনুমোদন দিলেই নিচের একটিভ কোর্সে যোগ হবে।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40 animate-pulse self-start sm:self-auto">
                    Awaiting Admin Approval
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingTransactions.map((trx) => (
                    <div
                      key={trx.id}
                      className="bg-[#0A192F] p-5 rounded-2xl border border-amber-500/30 space-y-3 flex flex-col justify-between hover:border-amber-400/60 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-amber-300 font-black bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                            {trx.paymentMethod}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(trx.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="text-sm font-black text-white line-clamp-2">{trx.courseTitle}</h5>
                        <div className="text-xs text-slate-400 space-y-1 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                          <div>TrxID: <span className="font-mono text-emerald-400 font-bold">{trx.transactionId}</span></div>
                          <div>Amount: <span className="text-white font-black">৳{trx.amount.toLocaleString()} BDT</span></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Verification in Progress
                        </span>
                        <Link
                          to={`/courses/${trx.courseId}`}
                          className="text-xs font-extrabold text-brand-400 hover:text-brand-300 hover:underline"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-400" />
                <span>Your Active Enrolled Courses ({enrollments.length})</span>
              </h3>

            {enrollments.length === 0 ? (
              <div className="bg-[#0A192F] p-12 rounded-3xl border border-slate-800 text-center space-y-4">
                <AIOrb state="idle" size={56} />
                <h4 className="text-lg font-bold text-white">No courses enrolled yet.</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Explore our practical masterclasses in Web Development, WordPress, and Marketing to get started.
                </p>
                <Link
                  to="/courses"
                  className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md transition inline-flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" /> Browse Available Courses
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enr) => (
                  <div
                    key={enr.id}
                    className="bg-[#0A192F] rounded-3xl border border-slate-800 overflow-hidden space-y-4 p-5 flex flex-col justify-between hover:border-brand-400 transition"
                  >
                    <div className="space-y-3">
                      <img
                        src={enr.courseThumbnail}
                        alt={enr.courseTitle}
                        className="w-full h-36 rounded-2xl object-cover"
                      />
                      <h4 className="text-sm font-black text-white line-clamp-2">{enr.courseTitle}</h4>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-extrabold">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-emerald-400">{enr.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full" style={{ width: `${enr.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/courses/${enr.courseId}/learn`)}
                      className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{enr.progress > 0 ? 'Continue Lesson' : 'Start Course'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        )}

        {/* Tab 3: Transactions */}
        {activeTab === 'transactions' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>Your Transaction & Payment History ({transactions.length})</span>
              </h3>
              <Link to="/transactions" className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow transition">
                Full Ledger →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Access Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-500">No payment transaction history recorded.</td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t.id}>
                        <td className="p-3 font-mono font-bold text-white">{t.transactionId}</td>
                        <td className="p-3 truncate max-w-xs">{t.courseTitle}</td>
                        <td className="p-3 font-bold text-emerald-400">৳{t.amount.toLocaleString()}</td>
                        <td className="p-3"><span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">{t.paymentMethod}</span></td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          {t.status === 'SUCCESS' ? (
                            <button
                              type="button"
                              onClick={() => navigate(`/courses/${t.courseId}/learn`)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" /> Classroom
                            </button>
                          ) : t.status === 'PENDING' ? (
                            <span className="text-[10px] text-amber-400 font-semibold">Pending</span>
                          ) : (
                            <Link
                              to={`/checkout/${t.courseId}`}
                              className="text-[10px] text-rose-400 hover:underline font-bold"
                            >
                              Retry
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
