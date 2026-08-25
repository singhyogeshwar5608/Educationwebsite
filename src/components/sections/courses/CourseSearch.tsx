"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [viewAllCats, setViewAllCats] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const hasFilters = activeCategory !== "All Courses" || activeLevel !== "All Levels" || searchQuery;

  const scrollCats = (dir: "left" | "right") => {
    const el = catScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* Category Select - Mobile (custom dropdown with scrollable list) */}
        <div className="mt-4 md:hidden">
          <label className="block text-xs font-semibold text-text-gray mb-1.5">Category</label>
          <div ref={categoryRef} className="relative">
            <button
              type="button"
              onClick={() => setCategoryOpen((o) => !o)}
              className={`w-full bg-light-gray border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all flex items-center justify-between gap-2 ${
                categoryOpen ? "border-gold ring-2 ring-gold/50" : ""
              }`}
            >
              <span className="truncate">{activeCategory}</span>
              <ChevronDown className={`w-4 h-4 text-text-gray shrink-0 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 z-40 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="max-h-72 overflow-y-auto py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => { onCategoryChange(cat); setCategoryOpen(false); }}
                        className={`w-full px-4 py-2.5 text-sm text-left flex items-center justify-between gap-2 transition-colors ${
                          activeCategory === cat
                            ? "bg-navy text-white font-semibold"
                            : "text-navy hover:bg-navy/5"
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        {activeCategory === cat && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Category Chips - Desktop */}
        <div className="hidden md:block mt-5">
          {viewAllCats ? (
            /* View All: expanded downward (multi-row wrap) */
            <div className="flex flex-wrap items-center gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`whitespace-nowrap px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border shadow-sm ${
                    activeCategory === cat
                      ? "bg-navy text-white border-navy shadow-md shadow-navy/25"
                      : "bg-[#F5F8FF] text-navy border-gray-200/70 hover:bg-navy/10 hover:border-navy/20 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            /* Collapsed: single row with horizontal slide */
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => scrollCats("left")}
                className="shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={catScrollRef}
                className="flex-1 flex items-center gap-2.5 overflow-x-auto scroll-smooth hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`whitespace-nowrap px-4.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 border shadow-sm ${
                      activeCategory === cat
                        ? "bg-navy text-white border-navy shadow-md shadow-navy/25"
                        : "bg-[#F5F8FF] text-navy border-gray-200/70 hover:bg-navy/10 hover:border-navy/20 hover:shadow-md hover:-translate-y-0.5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollCats("right")}
                className="shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* View All / View Less toggle — always visible below */}
          <div className="mt-3">
            <button
              onClick={() => setViewAllCats((v) => !v)}
              className="whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-semibold bg-navy text-white border border-navy shadow-md shadow-navy/25 hover:bg-navy-light transition-all"
            >
              {viewAllCats ? "View Less" : "View All"}
            </button>
          </div>
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
