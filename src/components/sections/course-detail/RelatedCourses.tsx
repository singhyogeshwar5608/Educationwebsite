import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";
import CourseCard from "@/components/sections/courses/CourseCard";

interface RelatedCoursesProps {
  currentCourse: Course;
}

export default function RelatedCourses({ currentCourse }: RelatedCoursesProps) {
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["public-courses-all"],
    queryFn: () => publicService.courses.list() as Promise<Course[]>,
  });

  // Get courses in the same category, excluding current course
  const related = courses
    .filter((c) => c.category === currentCourse.category && c.slug !== currentCourse.slug)
    .slice(0, 4);

  // If not enough in same category, add from other categories
  const remaining = related.length < 4
    ? courses
        .filter((c) => c.slug !== currentCourse.slug && !related.some((r) => r.slug === c.slug))
        .slice(0, 4 - related.length)
    : [];

  const displayCourses = [...related, ...remaining];

  if (displayCourses.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              Explore More
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2">
              Related Courses
            </h2>
          </div>
          <a
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {displayCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <a
            href="/courses"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-2.5 rounded-lg transition-all hover:shadow-lg"
          >
            View All Courses <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
