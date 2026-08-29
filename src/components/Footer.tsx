import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Linkedin, 
  ArrowRight,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

interface FooterProps {
  onSelectCategory: (catId: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-[#0A192F] text-white pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Newsletter CTA Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-black/20 px-3.5 py-1 rounded-full inline-block">
              Stay Ahead in Tech & Skill Career
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Subscribe for Free Masterclass Updates & Discounts!
            </h3>
            <p className="text-slate-100 text-xs sm:text-sm">
              Join 25,000+ learners receiving weekly WordPress, Digital Marketing & Freelancing guides.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="px-5 py-3.5 bg-white text-slate-900 placeholder:text-slate-400 rounded-2xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-4 focus:ring-amber-400/50 w-full sm:w-80"
              required
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-[#0A192F] hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>Subscribe Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* 4-Column Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                MASTERMIND <span className="text-brand-400">AIDT</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              MASTERMIND AIDT is Bangladesh's premier skill development platform, delivering high-impact online courses in Web Development, WordPress, Digital Marketing, SEO, and Freelancing.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 text-slate-300 hover:text-white flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 text-slate-300 hover:text-white flex items-center justify-center transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-500 text-slate-300 hover:text-white flex items-center justify-center transition">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><Link to="/courses" className="hover:text-brand-400 transition">Course Catalog</Link></li>
              <li><Link to="/dashboard" className="hover:text-brand-400 transition">Student Portal</Link></li>
              <li><Link to="/transactions" className="hover:text-brand-400 transition">Transactions Ledger</Link></li>
              <li><Link to="/teacher/login" className="hover:text-brand-400 transition">Instructor Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-brand-400 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">Popular Categories</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-brand-400 transition text-left"
                  >
                    {cat.name} ({cat.bengaliName})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-400">Contact & Support</h4>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+8801712949410" className="hover:text-white transition">+880 1712-949410</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:support@mastermindaidt.com" className="hover:text-white transition">support@mastermindaidt.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 <strong className="text-white">MASTERMIND AIDT</strong>. All Rights Reserved. Built with Excellence.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Refund Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
