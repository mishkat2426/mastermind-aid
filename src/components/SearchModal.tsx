import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Star, ArrowRight } from 'lucide-react';
import { COURSES, Course } from '../data/coursesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCourse,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? COURSES.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center gap-3 relative">
          <Search className="w-6 h-6 text-brand-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search courses (e.g., WordPress, Digital Marketing, SEO)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg font-medium text-slate-800 focus:outline-none placeholder:text-slate-400 bg-transparent"
          />
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-brand-500" />
              Start typing to search across 127+ free & premium courses...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No matching courses found for "<strong className="text-slate-800">{query}</strong>".
            </div>
          ) : (
            results.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  onSelectCourse(course);
                  onClose();
                }}
                className="p-3.5 rounded-2xl hover:bg-brand-50 border border-transparent hover:border-brand-200 flex items-center justify-between cursor-pointer transition group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F2B5A] group-hover:text-brand-600 transition">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-brand-600">{course.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current" /> {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-brand-600">
                    {course.isFree ? 'FREE' : `৳${course.price.toLocaleString()}`}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-slate-50 p-3 px-6 text-xs text-slate-400 font-medium flex justify-between border-t border-slate-100">
          <span>Press ESC to close</span>
          <span>{results.length} result(s) found</span>
        </div>

      </div>

    </div>
  );
};
