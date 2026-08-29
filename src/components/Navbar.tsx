import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut, 
  Layout, 
  Sparkles,
  BookOpen,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playUiClickSound } from './SoundEffects';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    if (currentUser.role === 'TEACHER') return '/teacher/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Courses', path: '/courses' },
    { label: 'Transactions', path: '/transactions' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A192F]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Compact Mobile & Responsive Header Bar */}
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => playUiClickSound()}
            className="flex items-center gap-2 sm:gap-3 group shrink-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-tight leading-none">
                Mastermind <span className="text-brand-400">Aid</span>
              </span>
              <span className="hidden sm:block text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                মাস্টারমাইন্ড এইড • 2026
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => playUiClickSound()}
                  className={`transition-colors relative py-1 ${
                    isActive ? 'text-brand-400 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbarIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-400 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Compact & Mobile-Optimized: [ Search ] [ Cart ] [ Login/Profile ] [ Menu ]) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Search Modal Trigger */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenSearch();
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
              title="Search Courses"
              aria-label="Search Courses"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenCart();
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition relative"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-brand-500 text-white rounded-full font-black text-[9px] sm:text-[10px] flex items-center justify-center ring-2 ring-[#0A192F]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth State / Profile / Login CTA Button */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 pr-2 sm:p-1.5 sm:pr-3 rounded-full bg-white/10 hover:bg-white/20 transition ring-2 ring-brand-400/40"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                  />
                  <span className="text-[11px] sm:text-xs font-extrabold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-brand-500 text-white">
                    {currentUser.role}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-[#0B1B33] rounded-2xl shadow-2xl border border-slate-700/80 p-2 text-xs font-bold space-y-1 z-50"
                    >
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 mb-2">
                        <div className="font-bold text-white truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium truncate">{currentUser.email}</div>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate(getDashboardPath());
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/10 rounded-xl transition"
                      >
                        <Layout className="w-4 h-4 text-brand-400" />
                        <span>Go to {currentUser.role} Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          navigate('/transactions');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/10 rounded-xl transition"
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400" />
                        <span>Transactions Ledger</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition border-t border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => playUiClickSound()}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl text-xs font-black shadow-md shadow-brand-500/20 transition shrink-0"
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger Menu Drawer Toggle */}
            <button
              onClick={() => {
                playUiClickSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition md:hidden"
              title="Toggle Navigation Menu"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Drawer Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#071325] border-b border-white/10 px-4 py-4 space-y-3 font-extrabold text-xs uppercase tracking-wider"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  playUiClickSound();
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-4 py-2.5 rounded-xl transition ${
                  location.pathname === link.path ? 'bg-brand-500 text-white font-black' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/teacher/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-slate-400 hover:text-emerald-400 text-[11px] lowercase"
              >
                Instructor Portal Login →
              </Link>

              <Link
                to="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-slate-400 hover:text-purple-400 text-[11px] lowercase"
              >
                Admin Portal Login →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
