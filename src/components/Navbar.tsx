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
  CreditCard,
  UserCheck,
  ReceiptText,
  UserPlus
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
    ...(isAuthenticated && currentUser?.role !== 'TEACHER' ? [{ label: 'Transactions', path: '/transactions' }] : []),
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
                Mastermind <span className="text-brand-400">AidlT</span>
              </span>
              <span className="hidden sm:block text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                মাস্টারমাইন্ড এইডটি • 2026
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
                  className={`relative py-2 transition-colors duration-200 ${
                    isActive ? 'text-brand-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full shadow-[0_0_8px_#0D5FF9]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Center (Icons, Cart, Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Quick Global Search Icon */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenSearch();
              }}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/5"
              aria-label="Search Academy Courses"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Smart Cart Icon with Badge */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenCart();
              }}
              className="relative p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-white/5"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Dashboard / Login Action */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-brand-500/50"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-white max-w-[100px] truncate leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase text-brand-400 tracking-wider">
                      {currentUser.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0B1B33] border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-xs font-bold divide-y divide-slate-800">
                    <div className="p-3">
                      <div className="text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                      <div className="mt-1.5">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30">
                          {currentUser.role} Access
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                      >
                        <UserCheck className="w-4 h-4 text-brand-400" />
                        <span>My Dashboard</span>
                      </Link>

                      {currentUser.role !== 'TEACHER' && (
                        <Link
                          to="/transactions"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
                        >
                          <ReceiptText className="w-4 h-4 text-emerald-400" />
                          <span>My Transactions</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  onClick={() => playUiClickSound()}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold text-slate-300 hover:text-white hover:bg-white/5 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => playUiClickSound()}
                  className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-black text-xs shadow-lg shadow-brand-500/30 transition flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => {
                playUiClickSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition border border-white/5"
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

            {isAuthenticated && currentUser ? (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <div className="truncate">
                    <div className="text-white text-xs font-bold truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-brand-400 font-bold">{currentUser.role}</div>
                  </div>
                </div>

                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-brand-300 hover:bg-white/5 rounded-xl text-xs lowercase"
                >
                  → Go to My Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-white/10 text-white rounded-xl text-xs font-bold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center bg-brand-500 text-white rounded-xl text-xs font-bold"
                  >
                    Sign Up
                  </Link>
                </div>

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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
