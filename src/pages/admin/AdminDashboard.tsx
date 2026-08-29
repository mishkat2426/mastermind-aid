import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { Course, User, Transaction, Review, Comment, Category, AuditLog, ReviewStatus, CommentStatus, UserRole } from '../../types/platform';
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
  Check,
  XCircle,
  FileText,
  Star,
  MessageSquare,
  Flag,
  Tag,
  History,
  Eye,
  EyeOff,
  Copy,
  AlertTriangle,
  RotateCcw,
  Key
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users' | 'teachers' | 'reviews' | 'comments' | 'transactions' | 'categories' | 'audit' | 'administrators'>('overview');
  
  // Administrator & Access Code Form states
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newTeacherAccessCode, setNewTeacherAccessCode] = useState('');
  const [newAdminSecurityCode, setNewAdminSecurityCode] = useState('');
  
  // Modals & Selection
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Course Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newPrice, setNewPrice] = useState('2500');
  const [newDescription, setNewDescription] = useState('');

  // New Category Form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatBengali, setNewCatBengali] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const stats = DBService.getStats();
  const users = DBService.getUsers();
  const courses = DBService.getCourses();
  const transactions = DBService.getTransactions();
  const reviews = DBService.getReviews();
  const comments = DBService.getComments();
  const categories = DBService.getCategories();
  const auditLogs = DBService.getAuditLogs();

  const teachers = users.filter((u) => u.role === 'TEACHER');
  const students = users.filter((u) => u.role === 'STUDENT');

  // User Actions
  const handleToggleSuspendUser = (user: User) => {
    if (user.status === 'ACTIVE') {
      if (confirm(`Are you sure you want to suspend user ${user.name}?`)) {
        DBService.suspendUser(user.id, currentUser?.name || 'Admin');
        window.location.reload();
      }
    } else {
      DBService.unsuspendUser(user.id, currentUser?.name || 'Admin');
      window.location.reload();
    }
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    if (confirm(`Change user role to ${newRole}?`)) {
      DBService.updateUser(userId, { role: newRole });
      DBService.logAdminAction('usr-admin-1', currentUser?.name || 'Admin', `Changed role of user ${userId} to ${newRole}`, 'User', userId);
      window.location.reload();
    }
  };

  // Course Actions
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
      rating: 5,
      reviewCount: 1,
      studentsCount: 0,
      lessonsCount: 5,
      requirements: ['Basic computer knowledge'],
      features: ['Lifetime Access', 'Certificate'],
      lessons: [],
    }, currentUser?.name);

    setShowCourseModal(false);
    setNewTitle('');
    setNewDescription('');
    alert('New course created and published!');
    window.location.reload();
  };

  const handleDuplicateCourse = (course: Course) => {
    DBService.createCourse({
      ...course,
      title: `${course.title} (Copy)`,
      slug: `${course.slug}-copy`,
      status: 'DRAFT',
      studentsCount: 0,
    }, currentUser?.name);
    alert('Course duplicated as DRAFT!');
    window.location.reload();
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to permanently delete this course?')) {
      DBService.deleteCourse(courseId, currentUser?.name);
      window.location.reload();
    }
  };

  // Review Actions
  const handleReviewStatus = (reviewId: string, status: ReviewStatus) => {
    DBService.updateReviewStatus(reviewId, status, currentUser?.name || 'Admin');
    window.location.reload();
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Delete this review permanently?')) {
      DBService.deleteReview(reviewId, currentUser?.name);
      window.location.reload();
    }
  };

  // Comment Actions
  const handleCommentStatus = (commentId: string, status: CommentStatus) => {
    DBService.updateCommentStatus(commentId, status, currentUser?.name || 'Admin');
    window.location.reload();
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Delete this comment permanently?')) {
      DBService.deleteComment(commentId, currentUser?.name);
      window.location.reload();
    }
  };

  // Category Action
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    DBService.createCategory({
      name: newCatName,
      bengaliName: newCatBengali || newCatName,
      description: newCatDesc || 'Skill development courses.',
      iconName: 'BookOpen',
    }, currentUser?.name || 'Admin');
    setNewCatName('');
    setNewCatBengali('');
    setNewCatDesc('');
    window.location.reload();
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;
    DBService.createAdminAccount(newAdminName, newAdminEmail, currentUser?.name || 'Admin');
    setNewAdminName('');
    setNewAdminEmail('');
    alert(`New Administrator account created for ${newAdminEmail}`);
    window.location.reload();
  };

  const handleRotateAccessCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherAccessCode.trim() && !newAdminSecurityCode.trim()) return;
    DBService.rotateAccessCodes(currentUser?.name || 'Admin', newTeacherAccessCode, newAdminSecurityCode);
    setNewTeacherAccessCode('');
    setNewAdminSecurityCode('');
    alert('Security Access Codes rotated successfully!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
              A
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">Mastermind Admin</h2>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Super CMS Portal</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: <Layout className="w-4 h-4" /> },
              { id: 'courses', label: 'Course Management', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
              { id: 'teachers', label: 'Teachers', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'reviews', label: 'Reviews Moderation', icon: <Star className="w-4 h-4 text-amber-400" /> },
              { id: 'comments', label: 'Comments & Reports', icon: <MessageSquare className="w-4 h-4 text-rose-400" /> },
              { id: 'transactions', label: 'Transactions Ledger', icon: <CreditCard className="w-4 h-4 text-emerald-400" /> },
              { id: 'categories', label: 'Category Manager', icon: <Tag className="w-4 h-4" /> },
              { id: 'administrators', label: 'Admins & Access Codes', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
              { id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4 text-slate-400" /> },
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

      {/* Main Content Area */}
      <main className="flex-1 bg-[#071325] p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black capitalize">Super Admin — {activeTab}</h1>
            <p className="text-xs text-slate-400 mt-1">Full management access to courses, reviews, comments, users, and audit logs.</p>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Revenue</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳{stats.totalRevenue.toLocaleString()}</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Courses</div>
                <div className="text-2xl sm:text-3xl font-black text-brand-400">{stats.totalCourses}</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Reported Comments</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats.reportedComments}</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pending Trx</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.pendingTransactions}</div>
              </div>
            </div>

            {/* Audit Feed */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <span>Recent Admin Activity Logs</span>
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="text-xs text-slate-500 py-4 text-center">No recent activity logged.</div>
                ) : (
                  auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-purple-300">{log.adminName}</span>: <span className="text-slate-200">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
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
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {courses.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-white flex items-center gap-3">
                        <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-xl object-cover" />
                        <span className="truncate max-w-xs">{c.title}</span>
                      </td>
                      <td className="p-3">{c.category}</td>
                      <td className="p-3 font-bold text-emerald-400">{c.isFree ? 'FREE' : `৳${c.price.toLocaleString()}`}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => handleDuplicateCourse(c)} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300" title="Duplicate Course">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCourse(c.id)} className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 rounded-lg" title="Delete Course">
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

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                          className="bg-[#071325] border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="TEACHER">TEACHER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleToggleSuspendUser(u)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg ${u.status === 'ACTIVE' ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'}`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Moderation (Requirement #8) */}
        {activeTab === 'reviews' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Reviews Moderation Engine</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Comment Text</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">No reviews found.</td>
                    </tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r.id}>
                        <td className="p-3 font-bold text-white">{r.userName}</td>
                        <td className="p-3 truncate max-w-xs">{r.courseTitle}</td>
                        <td className="p-3 text-amber-400 font-bold">{r.rating} ★</td>
                        <td className="p-3 max-w-xs truncate">{r.comment}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {r.status !== 'PUBLISHED' && (
                            <button onClick={() => handleReviewStatus(r.id, 'PUBLISHED')} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Approve</button>
                          )}
                          {r.status !== 'HIDDEN' && (
                            <button onClick={() => handleReviewStatus(r.id, 'HIDDEN')} className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]">Hide</button>
                          )}
                          <button onClick={() => handleDeleteReview(r.id)} className="p-1 bg-rose-500/20 text-rose-300 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Comments & Reports (Requirement #13 & #14) */}
        {activeTab === 'comments' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              <span>Comment Moderation & Reported Posts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Author</th>
                    <th className="p-3">Comment Content</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Report Reason</th>
                    <th className="p-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">No comments found.</td>
                    </tr>
                  ) : (
                    comments.map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-bold text-white">{c.userName} ({c.userRole})</td>
                        <td className="p-3 max-w-sm truncate">{c.text}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'REPORTED' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-rose-400 font-bold">{c.reportReason || '-'}</td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => handleCommentStatus(c.id, 'PUBLISHED')} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Keep</button>
                          <button onClick={() => handleCommentStatus(c.id, 'HIDDEN')} className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]">Hide</button>
                          <button onClick={() => handleDeleteComment(c.id)} className="p-1 bg-rose-500/20 text-rose-300 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 8: Categories Management */}
        {activeTab === 'categories' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-black">Manage Course Categories</h3>

            <form onSubmit={handleCreateCategory} className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. AI & Machine Learning)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
              />
              <input
                type="text"
                placeholder="Bengali Name"
                value={newCatBengali}
                onChange={(e) => setNewCatBengali(e.target.value)}
                className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
              />
              <button type="submit" className="py-2.5 bg-purple-600 text-white rounded-xl text-xs font-extrabold shadow">
                + Add Category
              </button>
            </form>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#071325] rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{cat.name}</div>
                    <div className="text-[10px] text-purple-400 font-semibold">{cat.bengaliName}</div>
                  </div>
                  <button onClick={() => DBService.deleteCategory(cat.id, currentUser?.name || 'Admin')} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Administrators & Access Codes (Requirement #13 & #14) */}
        {activeTab === 'administrators' && (
          <div className="space-y-6">
            
            {/* Create Administrator Card */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Create Authorized Administrator Account</span>
              </h3>
              <p className="text-xs text-slate-400">Only existing authenticated Admins can provision another Administrator account.</p>

              <form onSubmit={handleCreateAdmin} className="grid sm:grid-cols-3 gap-3 text-xs font-bold">
                <input
                  type="text"
                  required
                  placeholder="Admin Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@mastermindaid.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
                <button type="submit" className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow">
                  + Create Administrator
                </button>
              </form>
            </div>

            {/* Access Code Rotation Card */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-purple-500/30 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2 text-purple-300">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Rotate System Security Access Codes</span>
              </h3>
              <p className="text-xs text-slate-400">Update server access codes for Teacher registration and Admin security login.</p>

              <form onSubmit={handleRotateAccessCodes} className="grid sm:grid-cols-3 gap-3 text-xs font-bold">
                <div>
                  <label className="block text-[11px] text-emerald-400 mb-1">New Teacher Code (Default: MASTERMIND10)</label>
                  <input
                    type="text"
                    placeholder="e.g. MASTERMIND2026"
                    value={newTeacherAccessCode}
                    onChange={(e) => setNewTeacherAccessCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-purple-400 mb-1">New Admin Code (Default: MASTERMIND ADMIN)</label>
                  <input
                    type="password"
                    placeholder="Enter new Admin security secret"
                    value={newAdminSecurityCode}
                    onChange={(e) => setNewAdminSecurityCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-extrabold shadow">
                    Rotate Security Codes
                  </button>
                </div>
              </form>
            </div>

            {/* List of Admins */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white">Active Platform Administrators</h4>
              <div className="space-y-2">
                {users.filter((u) => u.role === 'ADMIN').map((adm) => (
                  <div key={adm.id} className="p-3.5 bg-[#071325] rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={adm.avatar} alt={adm.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500" />
                      <div>
                        <div className="font-extrabold text-white">{adm.name}</div>
                        <div className="text-[10px] text-purple-400 font-mono">{adm.email}</div>
                      </div>
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                      SUPER ADMIN
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 9: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              <span>Full System Audit Trail</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-300">{log.adminName}</span>: <span className="text-slate-200">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Course Modal */}
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
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-xl font-extrabold shadow">Publish Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
