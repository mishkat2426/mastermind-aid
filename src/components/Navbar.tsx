import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Grid, 
  ChevronDown, 
  BookOpen, 
  Award, 
  Sparkles,
  Phone,
  ShieldCheck,
  Flame,
  Layout,
  BrainCircuit
} from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenCertificate: () => void;
  onOpenDashboard: () => void;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAuth,
  onOpenCertificate,
  onOpenDashboard,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#0A192F] text-white text-xs sm:text-sm py-2 px-4 border-b border-brand-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-brand-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3 animate-bounce" /> Hot Offer
            </span>
            <span className="hidden sm:inline">Use code <strong className="text-amber-300 font-extrabold">MASTERMIND50</strong> for 50% OFF on all premium courses!</span>
            <span className="sm:hidden">50% OFF Code: <strong className="text-amber-300 font-extrabold">MASTERMIND50</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <button 
              onClick={onOpenCertificate}
              className="hover:text-amber-300 transition flex items-center gap-1 font-bold text-amber-400"
            >
              <Award className="w-3.5 h-3.5" /> Verify Certificate
            </button>
            <span className="text-slate-600">|</span>
            <a href="tel:+8801712949410" className="hover:text-white transition flex items-center gap-1">
              <Phone className="w-3 h-3 text-brand-400" /> +880 1712-949410
            </a>
          </div>
        </div>
      </div>

      {/* Main White & Blue Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Logo & Category Menu */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
                  <BrainCircuit className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-[#0A192F] flex items-center gap-1 leading-none">
                    Mastermind <span className="text-brand-500">Aid</span>
                  </span>
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase mt-0.5">
                    মাসটারমাইন্ড এইড • Elevating Skills
                  </span>
                </div>
              </a>

              {/* All Category Dropdown (Desktop) */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2 bg-brand-50 hover:bg-brand-100/80 text-brand-600 font-extrabold px-4 py-2.5 rounded-xl border border-brand-200 transition-all duration-200 text-sm"
                >
                  <Grid className="w-4 h-4 text-brand-500" />
                  <span>All Categories</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isCategoryOpen && (
                  <div 
                    className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setIsCategoryOpen(false)}
                  >
                    <div className="px-4 py-2 text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Browse Categories ({CATEGORIES.length})
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                      <button
                        onClick={() => {
                          onSelectCategory(null);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-brand-50 transition ${
                          selectedCategory === null ? 'text-brand-600 bg-brand-50' : 'text-slate-700'
                        }`}
                      >
                        <span>🌟 All Courses</span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">All</span>
                      </button>
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-brand-50 transition ${
                            selectedCategory === cat.id ? 'text-brand-600 bg-brand-50' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div>{cat.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{cat.bengaliName}</div>
                          </div>
                          <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">
                            {cat.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Navigation Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-7 font-bold text-sm text-slate-700">
              <a href="#" className="hover:text-brand-500 font-black transition text-brand-600">
                Home
              </a>
              <a href="#courses" className="hover:text-brand-500 transition">
                Courses
              </a>
              <a href="#about" className="hover:text-brand-500 transition">
                About Us
              </a>
              
              <button
                onClick={onOpenDashboard}
                className="hover:text-brand-600 text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 flex items-center gap-1.5 transition text-xs font-black"
              >
                <Layout className="w-3.5 h-3.5" /> Portal Demo
              </button>

              <button
                onClick={onOpenCertificate}
                className="hover:text-amber-700 text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5 transition text-xs font-black"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" /> Certificate
              </button>
            </nav>

            {/* Right Action Icons & Auth Button */}
            <div className="flex items-center gap-3">
              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 flex items-center justify-center transition"
                title="Search courses (Ctrl+K)"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={onOpenCart}
                className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-600 flex items-center justify-center transition"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Login / Register Button */}
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-2 bg-[#0A192F] hover:bg-brand-600 text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-brand-900/10 hover:shadow-brand-500/25 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
            <div className="space-y-1 pt-2">
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-extrabold text-brand-600 bg-brand-50"
              >
                Home
              </a>
              <a
                href="#courses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-bold text-slate-700 hover:bg-slate-50"
              >
                All Courses
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-bold text-brand-600 hover:bg-brand-50 flex items-center gap-2"
              >
                <Layout className="w-4 h-4" /> Student Portal Demo
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCertificate();
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2"
              >
                <Award className="w-4 h-4" /> Verify Certificate
              </button>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-3 bg-[#0A192F] text-white rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg"
              >
                <User className="w-5 h-5" />
                <span>Login / Register</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
