import React from 'react';
import { Award, ShieldCheck, Zap, Globe, Star, Sparkles } from 'lucide-react';

export const MarqueePartners: React.FC = () => {
  const partners = [
    { name: 'Fiverr Top Rated Guild', icon: <Award className="w-4 h-4 text-emerald-400" /> },
    { name: 'Upwork Expert Vetted', icon: <ShieldCheck className="w-4 h-4 text-brand-400" /> },
    { name: 'Meta Certified Partner', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { name: 'Google Ads Specialist', icon: <Globe className="w-4 h-4 text-sky-400" /> },
    { name: 'Prothom Alo IT Feature', icon: <Star className="w-4 h-4 text-rose-400" /> },
    { name: 'Somoy TV Tech Spotlight', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { name: '100% Verified Certificate', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <div className="bg-[#0B1E40] border-y border-brand-800/60 py-4 overflow-hidden relative shadow-inner">
      {/* Side Fade Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B1E40] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B1E40] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Double array to seamlessly loop */}
        {[...partners, ...partners, ...partners, ...partners].map((p, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-400/50 transition cursor-pointer group shrink-0"
          >
            {p.icon}
            <span className="text-xs font-extrabold text-slate-200 tracking-wider group-hover:text-white transition">
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
