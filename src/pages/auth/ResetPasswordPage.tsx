import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, BrainCircuit, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const { resetPassword, verifyFirebaseResetCode, confirmFirebaseReset } = useAuth();
  const [searchParams] = useSearchParams();

  const oobCode = searchParams.get('oobCode') || searchParams.get('code');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Firebase verification states
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [codeError, setCodeError] = useState('');

  // 1. If oobCode is present in URL (from Firebase reset email), verify it immediately
  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }

    if (oobCode) {
      setIsVerifyingCode(true);
      setCodeError('');
      verifyFirebaseResetCode(oobCode)
        .then((res) => {
          setIsVerifyingCode(false);
          if (res.success && res.email) {
            setEmail(res.email);
            setCodeVerified(true);
          } else {
            setCodeError(res.error || 'এই পাসওয়ার্ড রিসেট লিংকটি মেয়াদোত্তীর্ণ বা অকার্যকর। (The reset link is invalid or expired.)');
          }
        })
        .catch(() => {
          setIsVerifyingCode(false);
          setCodeError('পাসওয়ার্ড রিসেট লিংক ভেরিফিকেশন ব্যর্থ হয়েছে। অনুগ্রহ করে নতুন করে লিংকের অনুরোধ করুন।');
        });
    }
  }, [oobCode, searchParams, verifyFirebaseResetCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');

    if (!email.trim()) {
      setMsg('Please provide your registered email address.');
      setIsSuccess(false);
      setSubmitted(true);
      return;
    }

    if (password.length < 6) {
      setMsg('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে। (Password must be at least 6 characters long)');
      setIsSuccess(false);
      setSubmitted(true);
      return;
    }

    if (password !== confirmPassword) {
      setMsg('কনফার্ম পাসওয়ার্ডটি মেলেনি। (Passwords do not match)');
      setIsSuccess(false);
      setSubmitted(true);
      return;
    }

    setIsLoading(true);

    // If Firebase oobCode is present and verified, use Firebase confirmPasswordReset
    if (oobCode) {
      const res = await confirmFirebaseReset(oobCode, password);
      setIsLoading(false);
      setMsg(res.message);
      setIsSuccess(res.success);
      setSubmitted(true);
      return;
    }

    // Otherwise fallback to standard password reset
    const res = await resetPassword(email.trim(), password);
    setIsLoading(false);
    setMsg(res.message);
    setIsSuccess(res.success);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 bg-gradient-to-tr from-amber-500 to-orange-600 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xl">
            <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="text-2xl font-black">Firebase Password Reset (পাসওয়ার্ড নির্ধারণ)</h2>
        <p className="text-xs text-slate-400">
          {oobCode
            ? 'Firebase ভেরিফাইড লিংকের মাধ্যমে নতুন পাসওয়ার্ড নির্ধারণ করুন'
            : 'Choose a secure password for your account'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
          {/* Loading verification of oobCode */}
          {isVerifyingCode ? (
            <div className="text-center py-10 space-y-4">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-300">
                Firebase সিকিউর লিংক যাচাই করা হচ্ছে...
              </p>
              <p className="text-[11px] text-slate-500">Verifying authentic Firebase reset token</p>
            </div>
          ) : codeError ? (
            /* Code Invalid or Expired */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-white">লিংকটি অকার্যকর বা মেয়াদোত্তীর্ণ!</h3>
              <p className="text-xs text-rose-300 font-medium leading-relaxed">{codeError}</p>

              <div className="pt-3 space-y-2">
                <Link
                  to="/forgot-password"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 transition"
                >
                  <span>Request New Firebase Link (নতুন লিংকের অনুরোধ করুন) →</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  ← Return to Login
                </Link>
              </div>
            </div>
          ) : submitted && isSuccess ? (
            /* Password Reset Success Screen */
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-black text-white">Password Updated! (পাসওয়ার্ড সফলভাবে সংরক্ষিত)</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{msg}</p>
              <Link
                to="/login"
                className="inline-block w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white rounded-xl text-xs font-extrabold shadow transition"
              >
                Log In Now (লগইন করুন) →
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Firebase verified banner */}
              {codeVerified && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Firebase ভেরিফাইড রিসেট লিংক শনাক্ত হয়েছে!</span>
                </div>
              )}

              {submitted && !isSuccess && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{msg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Registered Email Address {codeVerified && <span className="text-amber-400 text-[10px]">(Verified)</span>}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    readOnly={codeVerified}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      codeVerified ? 'opacity-80 cursor-not-allowed bg-slate-900' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">New Password (নতুন পাসওয়ার্ড)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password (পাসওয়ার্ড নিশ্চিত করুন)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Updating Firebase Password...' : 'Save New Password (পাসওয়ার্ড সংরক্ষণ করুন)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-800/80 text-center space-y-2">
                {!oobCode && (
                  <Link
                    to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold hover:underline block"
                  >
                    Send Firebase Reset Email Instead (ফায়ারবেস ইমেইল পাঠান) →
                  </Link>
                )}
                <Link to="/login" className="text-xs text-slate-400 hover:text-white font-medium block">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
