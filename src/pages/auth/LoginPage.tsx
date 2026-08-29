import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, BrainCircuit, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/platform';
import { AIOrb } from '../../components/AIOrb';

interface LoginPageProps {
  presetRole?: UserRole;
}

export const LoginPage: React.FC<LoginPageProps> = ({ presetRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const from = (location.state as any)?.from?.pathname || null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (presetRole === 'ADMIN') {
      setEmail('admin@mastermindaid.com');
      setPassword('admin123');
    } else if (presetRole === 'TEACHER') {
      setEmail('teacher@mastermindaid.com');
      setPassword('teacher123');
    }
  }, [presetRole]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    const result = await login(email, presetRole);
    if (result.success && result.user) {
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      // Redirect based on role
      if (result.user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (result.user.role === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/dashboard');
    } else {
      setErrorMsg(result.error || 'Failed to authenticate. Please check your credentials.');
    }
  };

  // Quick Demo Account Login Helper
  const handleQuickDemoLogin = async (demoRole: UserRole) => {
    setErrorMsg('');
    let demoEmail = 'student@mastermindaid.com';
    if (demoRole === 'ADMIN') demoEmail = 'admin@mastermindaid.com';
    if (demoRole === 'TEACHER') demoEmail = 'teacher@mastermindaid.com';

    setEmail(demoEmail);
    setPassword('password123');

    const result = await login(demoEmail, demoRole);
    if (result.success && result.user) {
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (demoRole === 'ADMIN') navigate('/admin/dashboard');
      else if (demoRole === 'TEACHER') navigate('/teacher/dashboard');
      else navigate('/dashboard');
    }
  };

  const pageTitle = presetRole === 'ADMIN' 
    ? 'Admin Portal Login' 
    : presetRole === 'TEACHER' 
    ? 'Instructor Portal Login' 
    : 'Account Login';

  const pageSubtitle = presetRole === 'ADMIN'
    ? 'Secure Administrator Authentication Gateway'
    : presetRole === 'TEACHER'
    ? 'Sign in to access your instructor course dashboard'
    : 'Sign in to access your role dashboard and course materials';

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
            <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-black tracking-tight">
            Mastermind <span className="text-brand-400">Aid</span>
          </span>
        </Link>
        <div>
          <h2 className="text-2xl font-black">{pageTitle}</h2>
          <p className="text-xs text-slate-400 font-medium">
            {pageSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Quick Demo Login Preset Bar */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15 mb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-300 font-extrabold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Login Presets
            </span>
            <span className="text-slate-400 text-[10px] lowercase font-normal">(one-click access)</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('STUDENT')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold shadow transition flex flex-col items-center gap-0.5 ${
                presetRole === 'STUDENT' || !presetRole ? 'bg-brand-500 ring-2 ring-white text-white' : 'bg-brand-500/70 hover:bg-brand-500 text-white'
              }`}
            >
              <span>Student</span>
              <span className="text-[9px] opacity-85 font-mono">student@...</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('TEACHER')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold shadow transition flex flex-col items-center gap-0.5 ${
                presetRole === 'TEACHER' ? 'bg-emerald-600 ring-2 ring-white text-white' : 'bg-emerald-600/70 hover:bg-emerald-600 text-white'
              }`}
            >
              <span>Teacher</span>
              <span className="text-[9px] opacity-85 font-mono">teacher@...</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold shadow transition flex flex-col items-center gap-0.5 ${
                presetRole === 'ADMIN' ? 'bg-purple-600 ring-2 ring-white text-white' : 'bg-purple-600/70 hover:bg-purple-600 text-white'
              }`}
            >
              <span>Admin</span>
              <span className="text-[9px] opacity-85 font-mono">admin@...</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-brand-400 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition text-xs font-bold"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#071325] border-slate-700 text-brand-500 focus:ring-brand-500"
              />
              <label htmlFor="rememberMe" className="cursor-pointer">Remember me on this device</label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <AIOrb state="thinking" size={20} />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In To {presetRole || 'Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          <div className="text-center pt-2 text-xs text-slate-400 font-medium border-t border-slate-800">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-brand-400 hover:underline">
              Create Account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
