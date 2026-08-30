import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  ShoppingCart, 
  Check, 
  Eye, 
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { DBService } from '../../services/db';
import { Course } from '../../types/platform';
import { Footer } from '../../components/layout/Footer';
import { ScrollReveal } from '../../components/layout/ScrollReveal';
import { AIOrb } from '../../components/ai/AIOrb';

interface CoursesPageProps {
  onAddToCart: (course: Course) => void;
  cartItemIds: string[];
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onAddToCart, cartItemIds }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryQuery = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryQuery);
  const [search, setSearch] = useState<string>(searchQuery);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');

  const allCourses = DBService.getPublishedCourses();

  // Filter & Sort Logic
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Category Filter
      if (selectedCategory !== 'all' && course.categoryId !== selectedCategory && course.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Level Filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }
      // Price Filter
      if (priceFilter === 'free' && !course.isFree) return false;
      if (priceFilter === 'paid' && course.isFree) return false;

      // Search Query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchCategory = course.category.toLowerCase().includes(q);
        const matchInst = course.teacherName.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        return matchTitle || matchCategory || matchInst || matchDesc;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      return (b.studentsCount || 0) - (a.studentsCount || 0); // popular
    });
  }, [allCourses, selectedCategory, search, selectedLevel, priceFilter, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearch('');
    setSelectedLevel('all');
    setPriceFilter('all');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#0A192F] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 space-y-3 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-widest text-brand-400 bg-brand-500/20 px-3.5 py-1 rounded-full inline-block border border-brand-400/30">
            Full Course Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">All Online Courses & Masterclasses</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Explore 100% practical courses in Web Development, WordPress, Digital Marketing, SEO, and Freelancing.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Search & Control Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, category, instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories ({DBService.getCategories().length})</option>
              {DBService.getCategories().map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Level Select */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Skill Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {/* Price Filter Chips */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${priceFilter === 'all' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter('free')}
                className={`px-3 py-1.5 rounded-lg transition ${priceFilter === 'free' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'}`}
              >
                Free
              </button>
              <button
                onClick={() => setPriceFilter('paid')}
                className={`px-3 py-1.5 rounded-lg transition ${priceFilter === 'paid' ? 'bg-[#0F2B5A] text-white shadow-sm' : 'text-slate-600'}`}
              >
                Paid
              </button>
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

          </div>

        </div>

        {/* Results Counter & Reset Button */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-2">
          <span>Showing <strong className="text-slate-800 font-black">{filteredCourses.length}</strong> course(s)</span>
          {(selectedCategory !== 'all' || search !== '' || selectedLevel !== 'all' || priceFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-brand-600 font-bold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="flex justify-center">
              <AIOrb state="idle" size={56} />
            </div>
            <h3 className="text-xl font-bold text-[#0F2B5A]">Nothing here yet.</h3>
            <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
              MASTERMIND AIDT couldn't find any course matching your selected filters or search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => {
              const inCart = cartItemIds.includes(course.id);

              return (
                <ScrollReveal key={course.id} delay={idx * 50} direction="up" distance={20}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group h-full relative">
                    <div>
                      {/* Image Thumbnail */}
                      <div className="relative h-52 bg-slate-100 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {course.isFree ? (
                            <span className="bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
                              FREE
                            </span>
                          ) : (
                            <span className="bg-brand-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow">
                              ৳{course.price.toLocaleString()} BDT
                            </span>
                          )}
                          {course.badge && (
                            <span className="bg-[#0F2B5A] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                              {course.badge}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{course.rating} ({course.reviewCount})</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                          <span>{course.category}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">
                            {course.level}
                          </span>
                        </div>

                        <h3
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="text-lg font-extrabold text-[#0F2B5A] hover:text-brand-600 cursor-pointer transition line-clamp-2 leading-snug"
                        >
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Metadata & Footer Actions */}
                    <div className="p-6 pt-0 space-y-4">
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] font-semibold text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.studentsCount}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-center">
                          <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.lessonsCount} Lsn</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                          <Clock className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.durationHours}h</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.teacherAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                            alt={course.teacherName}
                            className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-100"
                          />
                          <span className="text-xs font-bold text-slate-700">{course.teacherName}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onAddToCart(course)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              inCart
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white border border-brand-200'
                            }`}
                          >
                            {inCart ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                            <span>{inCart ? 'Cart' : 'Add'}</span>
                          </button>

                          <button
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="px-3.5 py-2 bg-[#0F2B5A] hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition"
                          >
                            Enroll
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}

      </div>

      <Footer onSelectCategory={(catId) => setSelectedCategory(catId || 'all')} />

    </div>
  );
};
