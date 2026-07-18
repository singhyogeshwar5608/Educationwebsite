"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { categories } from "@/data/courses";

interface CourseSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeLevel: string;
  onLevelChange: (level: string) => void;
  totalResults: number;
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
}: CourseSearchProps) {
  return (
    <section className="bg-white py-8 border-b border-gray-100 sticky top-[120px] lg:top-[112px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-gray" />
            <input
              type="text"
              placeholder="Search courses by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-light-gray border border-gray-200 rounded-xl text-navy text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-gray hover:text-navy transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Level Filter - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-gray" />
            <select
              value={activeLevel}
              onChange={(e) => onLevelChange(e.target.value)}
              className="bg-light-gray border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all appearance-none cursor-pointer pr-8"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Level Filter */}
        <div className="md:hidden mb-4">
          <select
            value={activeLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full bg-light-gray border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
                activeCategory === category
                  ? "bg-navy text-white shadow-md"
                  : "bg-light-gray text-text-gray hover:bg-navy/10 hover:text-navy"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-text-gray">
            Showing{" "}
            <span className="font-semibold text-navy">{totalResults}</span>{" "}
            {totalResults === 1 ? "course" : "courses"}
            {activeCategory !== "All Courses" && (
              <span>
                {" "}
                in <span className="font-medium text-navy">{activeCategory}</span>
              </span>
            )}
            {searchQuery && (
              <span>
                {" "}
                for &quot;<span className="font-medium text-navy">{searchQuery}</span>&quot;
              </span>
            )}
          </p>
          {(activeCategory !== "All Courses" || activeLevel !== "All Levels" || searchQuery) && (
            <button
              onClick={() => {
                onCategoryChange("All Courses");
                onLevelChange("All Levels");
                onSearchChange("");
              }}
              className="text-sm text-gold hover:text-navy font-medium transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
