import React, { useState } from 'react';
import { Star, Check, X } from 'lucide-react';

export interface CourseFilterState {
  categories: string[];
  difficulties: string[];
  minRating: number;
  maxPrice: number;
  currency: 'BDT' | 'USD';
}

interface CourseFilterCardProps {
  filters: CourseFilterState;
  onToggleCategory: (category: string) => void;
  onToggleDifficulty: (difficulty: string) => void;
  onSelectRating: (rating: number) => void;
  onChangeMaxPrice: (price: number) => void;
  onToggleCurrency?: () => void;
  onClearAll: () => void;
  className?: string;
  onCloseMobile?: () => void;
}

const CATEGORY_OPTIONS = [
  'Development',
  'Design & UI/UX',
  'Business',
  'Marketing'
];

const DIFFICULTY_OPTIONS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export const CourseFilterCard: React.FC<CourseFilterCardProps> = ({
  filters,
  onToggleCategory,
  onToggleDifficulty,
  onSelectRating,
  onChangeMaxPrice,
  onToggleCurrency,
  onClearAll,
  className = '',
  onCloseMobile
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const maxLimit = filters.currency === 'USD' ? 250 : 5000;
  const pricePercentage = Math.min(100, Math.max(0, (filters.maxPrice / maxLimit) * 100));

  // Determine if any filter is active
  const isAnyFilterActive = 
    filters.categories.length > 0 || 
    filters.difficulties.length > 0 || 
    filters.minRating > 0 || 
    filters.maxPrice < maxLimit;

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 ${className}`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-black tracking-wider text-slate-900 uppercase">
            FILTERS
          </h2>
          {isAnyFilterActive && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" title="Active filters applied" />
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClearAll}
            className={`text-xs font-bold transition-colors ${
              isAnyFilterActive 
                ? 'text-blue-600 hover:text-blue-700 hover:underline cursor-pointer' 
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            Clear All
          </button>
          
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES SECTION */}
      <div className="pt-4">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">
          CATEGORIES
        </h3>
        <div className="space-y-3">
          {CATEGORY_OPTIONS.map((cat) => {
            const isChecked = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleCategory(cat);
                }}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div
                  className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-150 ${
                    isChecked
                      ? 'bg-blue-600 border border-blue-600 text-white shadow-sm'
                      : 'border border-slate-300 bg-white group-hover:border-blue-400'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${
                  isChecked ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* DIFFICULTY SECTION */}
      <div className="pt-6">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">
          DIFFICULTY
        </h3>
        <div className="space-y-3">
          {DIFFICULTY_OPTIONS.map((diff) => {
            const isChecked = filters.difficulties.includes(diff);
            return (
              <label
                key={diff}
                onClick={(e) => {
                  e.preventDefault();
                  onToggleDifficulty(diff);
                }}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div
                  className={`w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-150 ${
                    isChecked
                      ? 'bg-blue-600 border border-blue-600 text-white shadow-sm'
                      : 'border border-slate-300 bg-white group-hover:border-blue-400'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-sm font-semibold transition-colors ${
                  isChecked ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {diff}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* MIN. RATING SECTION */}
      <div className="pt-6">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">
          MIN. RATING
        </h3>
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-1.5"
            onMouseLeave={() => setHoverRating(null)}
          >
            {[1, 2, 3, 4, 5].map((starValue) => {
              const activeRating = hoverRating !== null ? hoverRating : filters.minRating;
              const isFilled = starValue <= activeRating;

              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => {
                    if (filters.minRating === starValue) {
                      onSelectRating(0);
                    } else {
                      onSelectRating(starValue);
                    }
                  }}
                  onMouseEnter={() => setHoverRating(starValue)}
                  className="focus:outline-none transition-transform hover:scale-110 p-0.5"
                  aria-label={`${starValue} star rating`}
                >
                  <Star
                    className={`w-4 h-4 transition-colors ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 fill-slate-50'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm font-extrabold text-slate-900">
            {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+` : 'All'}
          </span>
        </div>
      </div>

      {/* PRICE RANGE SECTION */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              PRICE RANGE
            </h3>
            {onToggleCurrency && (
              <button
                type="button"
                onClick={onToggleCurrency}
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                title="Switch currency"
              >
                {filters.currency === 'USD' ? '$' : '৳'}
              </button>
            )}
          </div>
          <span className="text-xs font-bold text-blue-600">
            {filters.currency === 'USD' 
              ? `$0 - $${filters.maxPrice}` 
              : `৳0 - ৳${filters.maxPrice.toLocaleString()}`}
          </span>
        </div>

        {/* Custom Range Slider with dynamic blue progress bar */}
        <div className="relative py-1 flex items-center">
          <input
            type="range"
            min={0}
            max={maxLimit}
            step={filters.currency === 'USD' ? 10 : 100}
            value={filters.maxPrice}
            onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pricePercentage}%, #e2e8f0 ${pricePercentage}%, #e2e8f0 100%)`
            }}
            aria-label="Price range filter"
          />
        </div>
      </div>

      {/* Mobile Apply Button */}
      {onCloseMobile && (
        <div className="mt-8 pt-4 border-t border-slate-100 lg:hidden">
          <button
            type="button"
            onClick={onCloseMobile}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition-all"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Global CSS for custom slider thumb */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
        }
        input[type='range']::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
        }
      `}</style>

    </div>
  );
};
