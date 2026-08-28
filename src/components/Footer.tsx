import React, { useState } from 'react';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Twitter, 
  Instagram, 
  Send,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

interface FooterProps {
  onSelectCategory: (catId: string | null) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#0F2B5A] text-white pt-16 pb-8 border-t border-brand-900 relative">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-8 sm:p-10 mb-16 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-brand-400/30">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Subscribe to Our Newsletter for Latest Updates
            </h3>
            <p className="text-brand-100 text-xs sm:text-sm">
              Get weekly notifications about new free courses, discounts, and freelancing tips.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            {isSubscribed ? (
              <div className="bg-white text-emerald-700 px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Thank you for subscribing! Check your inbox.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-5 py-3.5 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none w-full sm:w-80 shadow-inner font-medium"
                />
                <button
                  type="submit"
                  className="bg-[#0F2B5A] hover:bg-brand-900 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <span>Subscribe Now</span>
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* 4-Column Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Course <span className="text-brand-400">Kori</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Course Kori is Bangladesh’s leading e-learning ecosystem providing top-tier practical training in WordPress Plugin Development, Digital Marketing, SEO, and Freelancing.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-500 text-slate-200 hover:text-white flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-rose-600 text-slate-200 hover:text-white flex items-center justify-center transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-sky-500 text-slate-200 hover:text-white flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/10 hover:bg-pink-600 text-slate-200 hover:text-white flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Useful Links</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><a href="#about" className="hover:text-brand-400 transition">About Course Kori</a></li>
              <li><a href="#courses" className="hover:text-brand-400 transition">Top Rated Mentors</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-400 transition">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-brand-400 transition">Student Success Stories</a></li>
              <li><a href="#" className="hover:text-brand-400 transition">Affiliate Partner Program</a></li>
            </ul>
          </div>

          {/* Column 4: Top Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-brand-400 transition text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Bir Uttam Rafiqul Islam Avenue, Dhaka-1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="tel:+8801712949410" className="hover:text-white transition">+880 1712-949410</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href="mailto:support@coursekori.com" className="hover:text-white transition">support@coursekori.com</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 <strong>Course Kori</strong>. All Rights Reserved. Designed & Developed with Premium White & Blue UI.
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Bangladeshi Learners</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
