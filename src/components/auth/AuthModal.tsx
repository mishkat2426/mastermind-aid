import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, BrainCircuit } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      setSuccessMsg('Successfully signed in! Redirecting to student dashboard...');
    } else {
      setSuccessMsg('Account created successfully! Welcome to MASTERMIND AIDITIT.');
    }
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="text-xl font-black">MASTERMIND <span className="text-brand-400">AIDT</span></span>
            </div>

            <h3 className="text-lg font-black pt-1">
              {tab === 'login' ? 'Welcome Back Student!' : 'Create Free Student Account'}
            </h3>
            <p className="text-xs text-slate-300">
              Access 127+ free & premium skill masterclasses anytime.
            </p>

            {/* Tab Selector */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl mt-4 text-xs font-bold">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'login' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('register')}
                className={`flex-1 py-2 rounded-lg transition ${
                  tab === 'register' ? 'bg-brand-500 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                Register Free
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {successMsg ? (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-center space-y-1">
                <p>{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {tab === 'register' && (
                  <div>
                    <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0A192F] hover:bg-brand-600 text-white rounded-xl font-extrabold shadow-lg transition flex items-center justify-center gap-2 pt-3"
                >
                  <span>{tab === 'login' ? 'Sign In to Portal' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
};
