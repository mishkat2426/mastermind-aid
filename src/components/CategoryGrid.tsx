import React, { useRef, useState } from 'react';
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
import { DBService } from '../services/db';
import { ScrollReveal } from './ScrollReveal';

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

/**
 * Subtle 3D tilt effect on hover — max ~4 degrees, respects reduced motion.
 */
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(600px) rotateX(0deg) rotateY(0deg)');
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg)');
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovering ? transform : 'perspective(600px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
        willChange: isHovering ? 'transform' : 'auto',
      }}
    >
      {children}
    </div>
  );
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = DBService.getCategories();
  const publishedCourses = DBService.getPublishedCourses();

  return (
    <section className="py-20 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" distance={20}>
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
        </ScrollReveal>

        {/* Categories Grid with Tilt + Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.id;
            const courseCount = publishedCourses.filter(
              (c) => c.categoryId === cat.id || c.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <ScrollReveal key={cat.id} delay={idx * 60} direction="up" distance={24}>
                <TiltCard
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
                      {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
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

                  {/* Subtle internal light on hover */}
                  <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-400/5 rounded-full blur-2xl" />
                  </div>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
