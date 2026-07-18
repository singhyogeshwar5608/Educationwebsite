"use client";

import { useState } from "react";
import { ArrowRight, Star, TrendingUp, Search } from "lucide-react";
import { courses, categories } from "@/data/courses";
import CourseCard from "./CourseCard";
import CourseSearch from "./CourseSearch";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";

export default function CourseGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [activeLevel, setActiveLevel] = useState("All Levels");

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All Courses" ||
      course.category === activeCategory;

    const matchesLevel =
      activeLevel === "All Levels" ||
      course.level === activeLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Featured and popular courses
  const featuredCourses = courses.filter((c) => c.featured);
  const popularCourses = courses.filter((c) => c.popular);

  return (
    <>
      {/* Search & Filter */}
      <CourseSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeLevel={activeLevel}
        onLevelChange={setActiveLevel}
        totalResults={filteredCourses.length}
      />

      {/* Featured Courses Section */}
      {searchQuery === "" && activeCategory === "All Courses" && activeLevel === "All Levels" && (
        <section className="bg-light-gray py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-gold/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  Featured
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                  Featured Courses
                </h2>
              </div>
              <a
                href="#all-courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Courses Section */}
      {searchQuery === "" && activeCategory === "All Courses" && activeLevel === "All Levels" && (
        <section className="bg-white py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="inline-flex items-center gap-2 bg-green/10 text-green rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Most Popular
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-navy">
                  Popular Courses
                </h2>
              </div>
              <a
                href="#all-courses"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {popularCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Courses / Search Results */}
      <section id="all-courses" className={searchQuery === "" && activeCategory === "All Courses" && activeLevel === "All Levels" ? "bg-light-gray py-16 lg:py-20" : "bg-light-gray py-8"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - only show when filtered */}
          {(searchQuery !== "" || activeCategory !== "All Courses" || activeLevel !== "All Levels") && (
            <div className="mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
                {activeCategory !== "All Courses" ? activeCategory : "All Courses"}
              </h2>
              <p className="text-text-gray text-lg max-w-2xl">
                Browse our complete selection of courses. Use the filters above
                to find exactly what you&apos;re looking for.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredCourses.map((course, index) => (
                <AnimateOnScroll key={course.id} delay={index * 80}>
                  <CourseCard course={course} />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-navy/30" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">No Courses Found</h3>
              <p className="text-text-gray mb-6 max-w-md mx-auto">
                We couldn&apos;t find any courses matching your search criteria.
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Courses");
                  setActiveLevel("All Levels");
                }}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}


