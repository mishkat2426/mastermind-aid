import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  ShoppingCart, 
  Eye, 
  Check, 
  Sparkles,
  Search,
  Heart,
  Compass
} from 'lucide-react';
import { DBService } from '../services/db';
import { Course } from '../types/platform';
import { ScrollReveal } from './ScrollReveal';
import { AIOrb } from './AIOrb';

interface CourseGridProps {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onViewCourse: (course: Course) => void;
  onAddToCart: (course: Course) => void;
  cartItemIds: string[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewCourse,
  onAddToCart,
  cartItemIds,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>([]);

  const allCourses = DBService.getPublishedCourses();

  const toggleWishlist = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  // Dynamic Filter Logic from Database
  const filteredCourses = allCourses.filter((course) => {
    if (selectedCategory && course.categoryId !== selectedCategory && course.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (activeTab === 'free' && !course.isFree) return false;
    if (activeTab === 'paid' && course.isFree) return false;
    if (activeTab !== 'all' && activeTab !== 'free' && activeTab !== 'paid' && course.categoryId !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCategory = course.category.toLowerCase().includes(q);
      const matchInst = (course.teacherName || '').toLowerCase().includes(q);
      return matchTitle || matchCategory || matchInst;
    }
    return true;
  });

  return (
    <section id="courses" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <ScrollReveal direction="up" distance={20}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-100/80 px-4 py-1.5 rounded-full inline-block">
              Our Courses List
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0F2B5A]">
              Most Popular Online Courses
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore high-yield skills designed for Bangladeshi developers, digital marketers, and freelancers.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter Bar & Search Input */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setActiveTab('all');
                onSelectCategory(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'all' && !selectedCategory
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Courses ({allCourses.length})
            </button>
            
            <button
              onClick={() => setActiveTab('free')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                activeTab === 'free'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Free Courses
            </button>

            <button
              onClick={() => setActiveTab('paid')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'paid'
                  ? 'bg-[#0F2B5A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Premium Courses
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition font-medium"
            />
          </div>

        </div>

        {/* Selected Category Notice */}
        {selectedCategory && (
          <div className="mb-6 flex items-center justify-between bg-brand-50 border border-brand-200 text-brand-800 px-5 py-3.5 rounded-2xl text-sm">
            <span>Filtering by category: <strong className="uppercase font-extrabold">{selectedCategory}</strong></span>
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              Clear Category Filter
            </button>
          </div>
        )}

        {/* Courses Cards Grid with Animated Stagger */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 px-4">
            <div className="flex justify-center mb-4">
              <AIOrb state="idle" size={56} />
            </div>
            <h3 className="text-xl font-bold text-[#0F2B5A]">Nothing here yet.</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
              Start your learning journey and MasterMind will help you find the perfect course.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                onSelectCategory(null);
                setSearchQuery('');
              }}
              className="group mt-5 px-6 py-2.5 bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition inline-flex items-center gap-2"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Courses</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCourses.map((course, idx) => {
                const inCart = cartItemIds.includes(course.id);
                const isSaved = wishlist.includes(course.id);

                return (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl hover:border-brand-300 transition-all duration-300 flex flex-col group relative"
                  >
                    {/* Image Container & Shimmer Effect */}
                    <div className="relative overflow-hidden h-52 bg-slate-100 shimmer-effect">
                      <img
                        src={course.thumbnail || (course as any).image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Badge Tag (Free or Price) */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {course.isFree ? (
                          <span className="bg-emerald-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> FREE
                          </span>
                        ) : (
                          <span className="bg-brand-500 text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                            ৳{course.price.toLocaleString()} BDT
                          </span>
                        )}

                        {course.badge && (
                          <span className="bg-[#0F2B5A] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                            {course.badge}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Toggle */}
                      <button
                        onClick={(e) => toggleWishlist(course.id, e)}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all ${
                          isSaved ? 'bg-rose-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                      </button>

                      {/* Rating Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating} ({course.reviewCount})</span>
                      </div>

                      {/* Quick View Floating Trigger */}
                      <button
                        onClick={() => onViewCourse(course)}
                        className="absolute bottom-4 right-4 w-9 h-9 rounded-xl bg-white text-slate-700 hover:bg-brand-500 hover:text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Course Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                          {course.category}
                        </div>

                        <h3
                          onClick={() => onViewCourse(course)}
                          className="text-lg font-extrabold text-[#0F2B5A] hover:text-brand-600 cursor-pointer transition line-clamp-2 leading-snug"
                        >
                          {course.title}
                        </h3>

                        {course.bengaliTitle && (
                          <p className="text-xs font-semibold text-slate-400 line-clamp-1">
                            {course.bengaliTitle}
                          </p>
                        )}
                      </div>

                      {/* Seat Progress Bar Simulation */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span>Batch Enrollment Capacity</span>
                          <span className="text-brand-600">85% Filled</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full w-[85%]" />
                        </div>
                      </div>

                      {/* Course Metadata (Lessons, Students, Hours) */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.studentsCount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                          <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.lessonsCount} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <Clock className="w-3.5 h-3.5 text-brand-500" />
                          <span>{course.durationHours}h</span>
                        </div>
                      </div>

                      {/* Instructor & Action Footer */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Instructor */}
                        <div className="flex items-center gap-2.5">
                          <img
                            src={course.teacherAvatar || course.instructor?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
                            alt={course.teacherName || course.instructor?.name || 'Instructor'}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-100"
                          />
                          <div className="text-left">
                            <div className="text-xs font-bold text-slate-800 leading-tight">
                              {course.teacherName || course.instructor?.name || 'Instructor'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">Mentor</div>
                          </div>
                        </div>

                        {/* Cart / Enroll Action Button */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAddToCart(course)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                              inCart
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white border border-brand-200'
                            }`}
                          >
                            {inCart ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" /> In Cart
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" /> Add
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onViewCourse(course)}
                            className="px-3.5 py-2 bg-[#0F2B5A] hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                          >
                            Enroll
                          </button>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
