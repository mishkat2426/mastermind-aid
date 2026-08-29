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
    <header className="sticky top-0 z-40 bg-[#0A192F]/90 backdrop-blur-xl border-b border-white/10 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={() => playUiClickSound()}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight leading-none">
                Mastermind <span className="text-brand-400">Aid</span>
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                মাসটারমাইন্ড এইড • 2026
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

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Search Modal Trigger */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenSearch();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
              title="Search Courses"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => {
                playUiClickSound();
                onOpenCart();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition relative"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-500 text-white rounded-full font-black text-[10px] flex items-center justify-center ring-2 ring-[#0A192F]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth State / Profile Menu */}
            {isAuthenticated && currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/20 transition ring-2 ring-brand-400/40"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-extrabold hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-brand-500 text-white">
                    {currentUser.role}
                  </span>
                </button>

                {/* Dropdown Menu */}
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
                        <span>Transaction History</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/20 rounded-xl transition border-t border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={() => playUiClickSound()}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  Log In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A192F] border-b border-white/10 px-4 py-4 space-y-2 text-xs font-bold"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2.5 px-4 rounded-xl text-slate-200 hover:bg-white/10 transition"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate(getDashboardPath());
                }}
                className="w-full text-left py-2.5 px-4 rounded-xl bg-brand-500 text-white font-black"
              >
                Open {currentUser?.role} Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center py-2.5 px-4 rounded-xl bg-brand-500 text-white font-black"
              >
                Log In / Register
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
