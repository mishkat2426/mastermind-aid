import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Star, Trophy, CheckCircle2 } from 'lucide-react';
import { playUiClickSound } from '../../utils/SoundEffects';
import { ScrollReveal } from '../layout/ScrollReveal';

export const StudentProjectsGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Multi-Vendor E-Commerce Portal',
      category: 'wordpress',
      studentName: 'Rakibul Hasan',
      studentRole: 'WordPress Developer (Fiverr Top Rated)',
      studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      image: 'https://images.unsplash.com/photo-1556742049-0a67daf4095a?auto=format&fit=crop&w=800&q=80',
      description: 'Built complete WooCommerce multi-vendor marketplace plugin with bKash API & SMS gateway integration.',
      earnings: '$3,400+ Earned on Fiverr'
    },
    {
      id: 2,
      title: 'Global Meta Ads Campaign Dashboard',
      category: 'marketing',
      studentName: 'Mahmuda Akter',
      studentRole: 'Digital Marketing Strategist',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      description: 'Scaled e-commerce store from 0 to ৳5,00,000 monthly sales with Meta CAPI & retargeting pixel setup.',
      earnings: '৳5 Lakh Sales Generated'
    },
    {
      id: 3,
      title: 'Local Business #1 Google Ranking',
      category: 'seo',
      studentName: 'Kamrul Islam',
      studentRole: 'SEO Agency Founder',
      studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=800&q=80',
      description: 'Ranked 15 competitive Dhaka real estate keywords on 1st page of Google Search using RankMath SEO.',
      earnings: '#1 Page Google Organic Traffic'
    }
  ];

  const filtered = activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" distance={20}>
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-100/80 px-4 py-1.5 rounded-full inline-block">
            Student Work Showcase
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0A192F]">
            Real Projects Built by Mastermind AidITIT Graduates
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Explore live portfolio projects created by students currently working on Fiverr, Upwork & local agencies.
          </p>

          {/* Filter Chips */}
          <div className="flex justify-center gap-2 pt-2">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'wordpress', label: 'WordPress & Code' },
              { id: 'marketing', label: 'Digital Marketing' },
              { id: 'seo', label: 'SEO Case Studies' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  playUiClickSound();
                  setActiveFilter(tab.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeFilter === tab.id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        </ScrollReveal>

        {/* Projects Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {item.earnings}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-black text-[#0A192F] group-hover:text-brand-600 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Student Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.studentAvatar}
                    alt={item.studentName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>{item.studentName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                    </h5>
                    <p className="text-[10px] text-slate-400 font-semibold">{item.studentRole}</p>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
