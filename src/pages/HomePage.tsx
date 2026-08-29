import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Star, Users, Eye, ShoppingCart, Heart } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { MarqueePartners } from '../components/MarqueePartners';
import { CategoryGrid } from '../components/CategoryGrid';
import { HowItWorks } from '../components/HowItWorks';
import { CourseComparisonTable } from '../components/CourseComparisonTable';
import { StudentProjectsGallery } from '../components/StudentProjectsGallery';
import { StatsCounter } from '../components/StatsCounter';
import { TestimonialSection } from '../components/TestimonialSection';
import { SeoContentSection } from '../components/SeoContentSection';
import { Footer } from '../components/Footer';
import { DBService } from '../services/db';
import { Course } from '../types/platform';
import { ScrollReveal } from '../components/ScrollReveal';

interface HomePageProps {
  onOpenCodeEditor: () => void;
  onOpenPathFinder: () => void;
  onAddToCart: (course: any) => void;
  cartItemIds: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenCodeEditor,
  onOpenPathFinder,
  onAddToCart,
  cartItemIds,
}) => {
  const navigate = useNavigate();
  // Homepage requirement #7: Only show 3-4 featured courses on homepage
  const featuredCourses = DBService.getPublishedCourses().slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Hero Banner */}
      <HeroSection
        onExploreCourses={() => navigate('/courses')}
        onOpenPreview={() => navigate(`/courses/${featuredCourses[0]?.id || 'wp-plugin-dev-2026'}`)}
        onOpenCodeEditor={onOpenCodeEditor}
        onOpenPathFinder={onOpenPathFinder}
      />

      {/* Marquee Partner Logos */}
      <MarqueePartners />

      {/* Category Grid */}
      <CategoryGrid
        selectedCategory={null}
        onSelectCategory={(catId) => {
          navigate(catId ? `/courses?category=${catId}` : '/courses');
        }}
      />

      {/* Featured Courses Showcase Section (Requirement #7: small 3-4 featured courses + View All Courses button) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal direction="up" distance={20}>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-100/80 px-4 py-1.5 rounded-full inline-block">
                  Featured Masterclasses
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2B5A]">
                  Explore Our Top AI & Tech Courses
                </h2>
                <p className="text-slate-600 text-sm">
                  Hand-picked practical courses designed for immediate career growth.
                </p>
              </div>

              <Link
                to="/courses"
                className="group inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-lg shadow-brand-500/20 transition self-start md:self-auto"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 4 Featured Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course, idx) => {
              const inCart = cartItemIds.includes(course.id);

              return (
                <ScrollReveal key={course.id} delay={idx * 80} direction="up" distance={24}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl hover:border-brand-300 transition-all duration-300 flex flex-col group h-full justify-between">
                    <div>
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {course.isFree ? (
                            <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                              FREE
                            </span>
                          ) : (
                            <span className="bg-brand-500 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                              ৳{course.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-slate-800 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase text-brand-600 tracking-wider">
                          {course.category}
                        </span>
                        <h3
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="text-sm font-bold text-[#0F2B5A] hover:text-brand-600 cursor-pointer transition line-clamp-2 leading-snug"
                        >
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex items-center justify-between">
                      <button
                        onClick={() => onAddToCart(course)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                          inCart
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white'
                        }`}
                      >
                        {inCart ? 'In Cart' : '+ Cart'}
                      </button>

                      <button
                        onClick={() => navigate(`/courses/${course.id}`)}
                        className="px-3.5 py-1.5 bg-[#0F2B5A] hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-6 py-3 rounded-2xl border border-brand-200 transition"
            >
              <span>Explore Full Catalog (127+ Courses)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3-Step Learning Process */}
      <HowItWorks />

      {/* Pricing Membership Tiers */}
      <CourseComparisonTable
        onSelectPlan={(planName, price) => {
          if (price > 0) {
            navigate('/courses');
          } else {
            navigate('/courses');
          }
        }}
      />

      {/* Student Work Showcase */}
      <StudentProjectsGallery />

      {/* Achievements Counter */}
      <StatsCounter />

      {/* Testimonials */}
      <TestimonialSection />

      {/* SEO Information & FAQ */}
      <SeoContentSection />

      {/* Footer */}
      <Footer onSelectCategory={(catId) => navigate(catId ? `/courses?category=${catId}` : '/courses')} />

    </div>
  );
};
