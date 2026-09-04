import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, BrainCircuit, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    const res = await forgotPassword(email.trim());
    setIsLoading(false);
    setMsg(res.message);
    setIsSuccess(res.success);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl">
            <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
          </div>
        </Link>
        <h2 className="text-2xl font-black">Firebase Password Reset (পাসওয়ার্ড রিসেট)</h2>
        <p className="text-xs text-slate-400">ফায়ারবেস অথেনটিকেশন থেকে সরাসরি আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          {submitted && isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-white">ইমেইল সফলভাবে পাঠানো হয়েছে!</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">{msg}</p>
              
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-[11px] text-amber-300 space-y-1">
                <p className="font-bold">💡 পরবর্তী ধাপ:</p>
                <p>১. আপনার ইমেইলের ইনবক্স অথবা স্প্যাম (Spam) ফোল্ডার চেক করুন।</p>
                <p>২. ফায়ারবেস প্রেরিত পাসওয়ার্ড রিসেট লিংকে ক্লিক করে নতুন পাসওয়ার্ড সংরক্ষণ করুন।</p>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  to={`/reset-password?email=${encodeURIComponent(email)}`}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 transition"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Go to Reset Page (রিসেট পেজে যান) →</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  ← Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitted && !isSuccess && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{msg}</span>
                </div>
              )}

              <div className="p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl text-[11px] text-slate-300">
                নিবন্ধনকৃত ইমেইল এড্রেস প্রদান করুন। ফায়ারবেস সিকিউর সার্ভার থেকে রিসেট লিংক প্রেরণ করা হবে।
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Registered Firebase Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Firebase Email...' : 'Send Firebase Reset Email (লিংক পাঠান)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-slate-800/80 text-center space-y-2">
                <Link
                  to={`/reset-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="text-xs text-brand-400 hover:text-brand-300 font-bold hover:underline block"
                >
                  Direct Password Reset (তাৎক্ষণিক পাসওয়ার্ড রিসেট) →
                </Link>
                <Link
                  to="/login"
                  className="text-xs text-slate-400 hover:text-white font-medium block"
                >
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
