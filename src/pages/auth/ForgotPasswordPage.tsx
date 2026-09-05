import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowRight, BrainCircuit, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get('email');
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

  // Client-side validation before contacting Firebase
  const validateEmail = (val: string): { isValid: boolean; error?: string; cleanEmail: string } => {
    const clean = val.trim().toLowerCase();
    if (!clean) {
      return { isValid: false, error: 'Please enter your email address.', cleanEmail: '' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clean)) {
      return { isValid: false, error: 'Please enter a valid email address.', cleanEmail: clean };
    }

    return { isValid: true, cleanEmail: clean };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const validation = validateEmail(email);
    if (!validation.isValid) {
      setErrorMsg(validation.error!);
      return;
    }

    if (isLoading) return; // Prevent concurrent requests

    setIsLoading(true);

    try {
      const res = await forgotPassword(validation.cleanEmail);
      setIsLoading(false);

      if (res.success) {
        setIsSuccess(true);
        setSubmitted(true);
      } else {
        setIsSuccess(false);
        setErrorMsg(res.message);
      }
    } catch {
      setIsLoading(false);
      setIsSuccess(false);
      setErrorMsg('Something went wrong. Please try again later.');
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setIsSuccess(false);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background glow effects matching Mastermind AidIT */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-brand-600 to-brand-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-gradient-to-tr from-blue-600 to-teal-400 pointer-events-none" />

      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link to="/" className="inline-flex items-center gap-3 justify-center group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/20 group-hover:scale-105 transition duration-200">
            <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
          </div>
          <span className="text-base sm:text-xl font-black tracking-tight leading-none text-white">
            Mastermind <span className="text-brand-400">AidIT</span>
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Forgot Password?</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
          Enter your registered email address and we'll send you a password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          {submitted && isSuccess ? (
            /* SUCCESS STATE */
            <div className="text-center space-y-5" aria-live="polite">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  ✓ Password reset email sent!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We've sent a password reset link to your email. Please check your inbox and spam folder.
                </p>
              </div>

              {/* Confirmation badge showing the target email */}
              <div className="p-3 bg-[#071325] border border-slate-700/80 rounded-xl text-xs font-mono text-brand-300 break-all">
                {email.trim().toLowerCase()}
              </div>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-xs text-amber-300 space-y-1">
                <p className="font-bold">Next steps:</p>
                <p>1. Open the email sent from Firebase Authentication.</p>
                <p>2. Click the password reset link to set your new password.</p>
                <p>3. Return to the login page and sign in with your new password.</p>
              </div>

              <div className="pt-3 space-y-3">
                <Link
                  to="/login"
                  className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>

                <button
                  type="button"
                  onClick={handleResetForm}
                  className="text-xs text-slate-400 hover:text-brand-300 transition font-medium hover:underline block mx-auto pt-1"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
            </div>
          ) : (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-live="polite">
              {/* Error Notification */}
              {errorMsg && (
                <div
                  role="alert"
                  className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Accessible Email Input */}
              <div>
                <label htmlFor="reset-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button with Loading State */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="pt-4 border-t border-slate-800/80 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
