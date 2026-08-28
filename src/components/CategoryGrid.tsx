import React from 'react';
import { motion } from 'framer-motion';
import { 
  Share2, 
  Megaphone, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  Search, 
  Layout, 
  Code, 
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { CATEGORIES } from '../data/coursesData';

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Share2': <Share2 className="w-6 h-6" />,
  'Megaphone': <Megaphone className="w-6 h-6" />,
  'Mail': <Mail className="w-6 h-6" />,
  'Briefcase': <Briefcase className="w-6 h-6" />,
  'ShieldCheck': <ShieldCheck className="w-6 h-6" />,
  'Search': <Search className="w-6 h-6" />,
  'Layout': <Layout className="w-6 h-6" />,
  'Code': <Code className="w-6 h-6" />,
  'Globe': <Globe className="w-6 h-6" />
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-20 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1.5 rounded-full inline-block">
              Browse Categories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F2B5A] mt-2">
              Start Learning with Top Categories
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Select any category to explore available free & premium courses.
            </p>
          </div>

          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-slate-500 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 px-4 py-2.5 rounded-xl transition"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        {/* Categories Grid with Framer Motion Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`group relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-50/90 border-brand-500 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500'
                    : 'bg-slate-50/60 hover:bg-white border-slate-200/80 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                      : 'bg-white text-brand-600 border border-slate-100 shadow-sm group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/30'
                  }`}>
                    {ICON_MAP[cat.iconName] || <Globe className="w-6 h-6" />}
                  </div>

                  <span className="text-xs font-bold bg-brand-100/80 text-brand-700 px-3 py-1 rounded-full flex items-center gap-1 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    {cat.count} {cat.count === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>

                <div className="mt-5 space-y-1">
                  <h3 className="text-lg font-bold text-[#0F2B5A] group-hover:text-brand-600 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-brand-600 transition-all -translate-x-1 group-hover:translate-x-0" />
                  </h3>
                  <p className="text-xs font-semibold text-brand-600/80">{cat.bengaliName}</p>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
