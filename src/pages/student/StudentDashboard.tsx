import React, { useState, useEffect } from 'react';
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
  FileText,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Camera,
  KeyRound
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AIOrb } from '../../components/ai/AIOrb';

const STUDENT_AVATAR_PRESETS = [
  { label: 'Modern Tech', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
  { label: 'Developer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { label: 'Student Pro', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80' },
  { label: 'Designer', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80' },
  { label: 'Innovator', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
  { label: 'Leader', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80' },
];

export const StudentDashboard: React.FC = () => {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'my-courses' | 'progress' | 'transactions' | 'certificates' | 'profile'>('my-courses');

  // Profile Form States
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Reset Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileAvatar(currentUser.avatar || '');
      setProfileBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');
    if (!profileName.trim()) {
      setProfileErrorMsg('নাম খালি রাখা যাবে না। (Name cannot be empty)');
      return;
    }
    setIsSavingProfile(true);
    const res = await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      avatar: profileAvatar.trim(),
      bio: profileBio.trim(),
    });
    setIsSavingProfile(false);
    if (res.success) {
      setProfileSuccessMsg('প্রোফাইল তথ্য সফলভাবে আপডেট করা হয়েছে! (Profile updated successfully!)');
      setTimeout(() => setProfileSuccessMsg(''), 4500);
    } else {
      setProfileErrorMsg(res.error || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');
    if (!newPassword) {
      setPasswordErrorMsg('নতুন পাসওয়ার্ড লিখুন। (Please enter new password)');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('নতুন পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters)');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('কনফার্ম পাসওয়ার্ডটি মেলেনি। (Confirm password does not match)');
      return;
    }
    setIsSavingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);
    if (res.success) {
      setPasswordSuccessMsg('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! (Password successfully updated!)');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 4500);
    } else {
      setPasswordErrorMsg(res.error || 'Failed to update password.');
    }
  };

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
              { id: 'profile', label: 'Profile & Security (প্রোফাইল ও সিকিউরিটি)', icon: <User className="w-4 h-4" /> },
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
          <div 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 text-xs p-2 rounded-2xl cursor-pointer transition ${
              activeTab === 'profile' ? 'bg-brand-500/20 border border-brand-500/40' : 'hover:bg-white/5'
            }`}
            title="Click to view & edit Profile"
          >
            <img src={currentUser?.avatar || STUDENT_AVATAR_PRESETS[0].url} alt={currentUser?.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-400 shrink-0" />
            <div className="truncate">
              <div className="font-bold truncate text-white">{currentUser?.name}</div>
              <div className="text-[10px] text-brand-400 font-semibold truncate">{currentUser?.email}</div>
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

        {/* Tab 5: Profile & Security */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" />
                <span>Profile & Account Security (প্রোফাইল ও সিকিউরিটি)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                আপনার ব্যক্তিগত প্রোফাইল তথ্য ও লগইন পাসওয়ার্ড আপডেট করুন।
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left column: Profile Information */}
              <div className="lg:col-span-7 bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="text-sm font-black text-white">Personal Information (ব্যক্তিগত তথ্য)</h4>
                    <p className="text-[11px] text-slate-400">Update your public details and contact info</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-brand-500/20 text-brand-400 border border-brand-500/30">
                    {currentUser?.role || 'STUDENT'}
                  </span>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  {/* Avatar Picker */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-300">
                      Profile Picture (প্রোফাইল ছবি)
                    </label>

                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-brand-500 bg-slate-800 shrink-0 shadow-lg">
                        <img
                          src={profileAvatar || STUDENT_AVATAR_PRESETS[0].url}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = STUDENT_AVATAR_PRESETS[0].url;
                          }}
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="url"
                          placeholder="Or paste custom image URL"
                          value={profileAvatar}
                          onChange={(e) => setProfileAvatar(e.target.value)}
                          className="w-full px-3 py-2 bg-[#071325] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                        />
                        <span className="text-[10px] text-slate-400 block">
                          Choose an avatar preset below or paste your image URL
                        </span>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {STUDENT_AVATAR_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setProfileAvatar(p.url)}
                          className={`flex items-center gap-1.5 p-1 rounded-xl border transition cursor-pointer ${
                            profileAvatar === p.url
                              ? 'border-brand-500 bg-brand-500/20 text-brand-300'
                              : 'border-slate-800 hover:border-slate-700 bg-[#071325] text-slate-400'
                          }`}
                        >
                          <img src={p.url} alt={p.label} className="w-6 h-6 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold pr-1">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name (পুরো নাম)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email (ইমেইল)</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          disabled
                          value={currentUser?.email || ''}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#071325]/50 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 cursor-not-allowed"
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block">Email is locked for account safety</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Phone (ফোন নম্বর)</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          placeholder="e.g. +880 1712-345678"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Bio / About Me (নিজের সম্পর্কে)</label>
                    <textarea
                      rows={3}
                      placeholder="Share a short bio about your learning goals..."
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes (প্রোফাইল সংরক্ষণ করুন)'}</span>
                  </button>
                </form>
              </div>

              {/* Right column: Password Reset & Security */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
                  <div className="border-b border-slate-800 pb-4">
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Change Password (পাসওয়ার্ড পরিবর্তন)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Keep your account safe by updating your password regularly</p>
                  </div>

                  {passwordSuccessMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{passwordSuccessMsg}</span>
                    </div>
                  )}

                  {passwordErrorMsg && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{passwordErrorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Current Password (বর্তমান পাসওয়ার্ড)
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showOldPass ? 'text' : 'password'}
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        New Password (নতুন পাসওয়ার্ড)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          required
                          placeholder="At least 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Confirm New Password (পাসওয়ার্ড নিশ্চিত করুন)
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPass ? 'text' : 'password'}
                          required
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showConfirmPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isSavingPassword ? 'Updating...' : 'Update Password (পাসওয়ার্ড সেভ করুন)'}</span>
                    </button>
                  </form>
                </div>

                {/* Account Security Tip Box */}
                <div className="p-5 bg-gradient-to-br from-brand-500/10 via-[#0A192F] to-slate-900 rounded-3xl border border-brand-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-brand-400 text-xs font-black">
                    <Sparkles className="w-4 h-4" />
                    <span>Security Advice (নিরাপত্তা টিপস)</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
                    <li>পাসওয়ার্ডে বড় ও ছোট হাতের অক্ষর এবং সংখ্যা ব্যবহার করুন।</li>
                    <li>পাসওয়ার্ড কারও সাথে শেয়ার করবেন না।</li>
                    <li>যেকোনো সহায়তার জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
