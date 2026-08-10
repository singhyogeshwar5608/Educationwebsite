"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CourseSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeLevel: string;
  onLevelChange: (level: string) => void;
  totalResults: number;
  categories: string[];
}

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CourseSearch({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  activeLevel,
  onLevelChange,
  totalResults,
  categories,
}: CourseSearchProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const hasFilters = activeCategory !== "All Courses" || activeLevel !== "All Levels" || searchQuery;

  const clearAll = () => {
    onCategoryChange("All Courses");
    onLevelChange("All Levels");
    onSearchChange("");
    setMobileFilterOpen(false);
  };

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Top Row: Search + Filter Button */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 sm:py-3 bg-light-gray border border-gray-200 rounded-xl text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <X className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>

          {/* Filter Button - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-gray" />
            <select
              value={activeLevel}
              onChange={(e) => onLevelChange(e.target.value)}
              className="bg-light-gray border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all appearance-none cursor-pointer pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center",
              }}
            >
              {levels.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2.5 bg-light-gray border border-gray-200 rounded-xl text-sm font-medium text-navy hover:bg-gray-100 transition-colors relative shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {hasFilters && <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full" />}
          </button>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? "bg-navy text-white shadow-md"
                  : "bg-light-gray text-text-gray hover:bg-navy/10 hover:text-navy"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count + Clear */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-text-gray">
            <span className="font-semibold text-navy">{totalResults}</span> {totalResults === 1 ? "course" : "courses"}
            {activeCategory !== "All Courses" && <span> in <span className="font-medium text-navy">{activeCategory}</span></span>}
            {searchQuery && <span> for &quot;<span className="font-medium text-navy">{searchQuery}</span>&quot;</span>}
          </p>
          {hasFilters && (
            <button onClick={clearAll} className="text-sm text-gold hover:text-navy font-medium transition-colors">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-[24px] shadow-2xl max-h-[70vh] overflow-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              <div className="px-5 pb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-navy">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Level Filter */}
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-navy mb-3">Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => onLevelChange(level)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          activeLevel === level
                            ? "bg-navy text-white"
                            : "bg-light-gray text-text-gray hover:bg-gray-200"
                        }`}
                      >
                        {activeLevel === level && <Check className="w-3.5 h-3.5" />}
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-navy text-white font-bold text-sm rounded-xl hover:bg-navy-light transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
