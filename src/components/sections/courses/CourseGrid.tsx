"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";
import CourseCard from "./CourseCard";
import CourseTable from "./CourseTable";
import CourseSearch from "./CourseSearch";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";

export default function CourseGrid() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [activeLevel, setActiveLevel] = useState("All Levels");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Pre-select the category from the ?category= URL param (e.g. clicked in the navbar dropdown)
  useEffect(() => {
    const c = searchParams.get("category");
    if (c && c !== "All Courses" && c !== activeCategory) {
      setActiveCategory(c);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const categoriesQuery = useQuery({
    queryKey: ["public-course-categories"],
    queryFn: () => publicService.categories.list() as Promise<{ id: string; name: string; slug: string }[]>,
  });

  const categories = useMemo(
    () => ["All Courses", ...(categoriesQuery.data ?? []).map((c) => c.name)],
    [categoriesQuery.data]
  );

  const { data: courses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ["public-courses", { category: activeCategory, level: activeLevel, search: debouncedSearch }],
    queryFn: () =>
      publicService.courses.list({
        category: activeCategory === "All Courses" ? undefined : activeCategory,
        level: activeLevel === "All Levels" ? undefined : activeLevel,
        search: debouncedSearch || undefined,
      }) as Promise<Course[]>,
  });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams(cat === "All Courses" ? {} : { category: cat }, { replace: true });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setActiveCategory("All Courses");
    setActiveLevel("All Levels");
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <CourseSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeLevel={activeLevel}
        onLevelChange={setActiveLevel}
        totalResults={courses.length}
        categories={categories}
      />

      <section className="bg-light-gray py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="w-10 h-10 text-navy/30 animate-spin mb-4" />
              <p className="text-text-gray">Loading courses...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Failed to Load Courses</h3>
              <p className="text-text-gray mb-6 max-w-md mx-auto">
                We couldn't load the courses right now. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
              >
                Retry
              </button>
            </div>
          ) : courses.length > 0 ? (
            <>
              {/* Mobile card grid (below md) */}
              <div className="md:hidden grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {courses.map((course, index) => (
                  <AnimateOnScroll key={course.slug} delay={index * 80}>
                    <CourseCard course={course} index={index} />
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Desktop/tablet table view (md and up) */}
              <div className="hidden md:block">
                <CourseTable courses={courses} />
              </div>
            </>
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
                onClick={resetFilters}
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
