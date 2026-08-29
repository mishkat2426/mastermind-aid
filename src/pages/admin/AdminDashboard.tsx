import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { Course, User, Transaction } from '../../types/platform';
import { 
  Layout, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  Search,
  Bell,
  Check,
  XCircle,
  FileText,
  HelpCircle,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AIOrb } from '../../components/AIOrb';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'teachers' | 'courses' | 'enrollments' | 'transactions' | 'announcements'>('overview');
  const [showCourseModal, setShowCourseModal] = useState(false);

  // Form states for new course
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newPrice, setNewPrice] = useState('2500');
  const [newDescription, setNewDescription] = useState('');

  const stats = DBService.getStats();
  const users = DBService.getUsers();
  const courses = DBService.getCourses();
  const transactions = DBService.getTransactions();
  const enrollments = DBService.getEnrollments();

  const teachers = users.filter((u) => u.role === 'TEACHER');
  const students = users.filter((u) => u.role === 'STUDENT');

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    DBService.createCourse({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDescription || 'Comprehensive practical masterclass.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      price: parseFloat(newPrice) || 0,
      isFree: parseFloat(newPrice) === 0,
      category: newCategory,
      categoryId: newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      level: 'All Levels',
      durationHours: 12,
      status: 'PUBLISHED',
      teacherId: teachers[0]?.id || 'usr-teacher-1',
      teacherName: teachers[0]?.name || 'Hasibul Islam',
      rating: 4.9,
      reviewCount: 15,
      studentsCount: 0,
      lessonsCount: 5,
      requirements: ['Basic computer knowledge'],
      features: ['Lifetime Access', 'Certificate'],
      lessons: [],
    });

    setShowCourseModal(false);
    setNewTitle('');
    setNewDescription('');
    alert('New course created and published!');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      DBService.deleteCourse(courseId);
      window.location.reload();
    }
  };

  const handleApproveTrx = (trxId: string) => {
    DBService.updateTransactionStatus(trxId, 'SUCCESS', currentUser?.name || 'Admin');
    window.location.reload();
  };

  const handleRejectTrx = (trxId: string) => {
    DBService.updateTransactionStatus(trxId, 'FAILED', currentUser?.name || 'Admin');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
              A
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">Mastermind Admin</h2>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Super Administrator</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <Layout className="w-4 h-4" /> },
              { id: 'courses', label: 'Manage Courses', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'transactions', label: 'Transactions & Revenue', icon: <CreditCard className="w-4 h-4" /> },
              { id: 'users', label: 'Students & Users', icon: <Users className="w-4 h-4" /> },
              { id: 'teachers', label: 'Manage Teachers', icon: <GraduationCap className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-md'
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
            <img src={currentUser?.avatar} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-400" />
            <div className="truncate">
              <div className="font-bold truncate">{currentUser?.name}</div>
              <div className="text-[10px] text-purple-400 font-semibold">{currentUser?.email}</div>
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
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black capitalize">Admin Control Panel — {activeTab}</h1>
            <p className="text-xs text-slate-400 mt-1">Full platform administration and oversight for Mastermind Aid.</p>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Create New Course
            </button>
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Revenue</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳{stats.totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-slate-500">From successful transactions</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Courses</div>
                <div className="text-2xl sm:text-3xl font-black text-brand-400">{stats.totalCourses}</div>
                <div className="text-[11px] text-slate-500">Published masterclasses</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Students</div>
                <div className="text-2xl sm:text-3xl font-black text-purple-400">{stats.totalStudents}</div>
                <div className="text-[11px] text-slate-500">Registered platform learners</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pending Trx</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.pendingTransactions}</div>
                <div className="text-[11px] text-slate-500">Requires manual review</div>
              </div>
            </div>

            {/* Pending Transactions Box */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                <span>Pending Transaction Approvals</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Gateway</th>
                      <th className="p-3">TrxID</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {transactions.filter((t) => t.status === 'PENDING').length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-500">No pending transactions at the moment.</td>
                      </tr>
                    ) : (
                      transactions.filter((t) => t.status === 'PENDING').map((t) => (
                        <tr key={t.id}>
                          <td className="p-3 font-bold text-white">{t.userName} ({t.userEmail})</td>
                          <td className="p-3 truncate max-w-xs">{t.courseTitle}</td>
                          <td className="p-3 text-emerald-400 font-bold">৳{t.amount.toLocaleString()}</td>
                          <td className="p-3">{t.paymentMethod}</td>
                          <td className="p-3 font-mono font-bold text-purple-300">{t.transactionId}</td>
                          <td className="p-3 text-right space-x-2">
                            <button onClick={() => handleApproveTrx(t.id)} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]">Approve</button>
                            <button onClick={() => handleRejectTrx(t.id)} className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px]">Reject</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Courses */}
        {activeTab === 'courses' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Thumbnail & Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Students</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 flex items-center gap-3 font-bold text-white">
                        <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="max-w-xs truncate">{c.title}</span>
                      </td>
                      <td className="p-3">{c.category}</td>
                      <td className="p-3 font-bold text-emerald-400">{c.isFree ? 'FREE' : `৳${c.price.toLocaleString()}`}</td>
                      <td className="p-3">{c.studentsCount}</td>
                      <td className="p-3">
                        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">{c.status}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteCourse(c.id)} className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg transition" title="Delete Course">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Transactions */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <Link to="/transactions" className="inline-block px-5 py-2.5 bg-purple-600 text-white text-xs font-extrabold rounded-xl shadow">
              Open Full Transactions Ledger Page →
            </Link>
          </div>
        )}

      </main>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">Create New Platform Course</h3>
            
            <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., React & Next.js SaaS Development"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="WordPress">WordPress</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO">SEO</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Course Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 text-white rounded-xl font-extrabold shadow"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
