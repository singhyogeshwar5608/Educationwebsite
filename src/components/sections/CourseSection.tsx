import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, IndianRupee, Star, ArrowRight, Loader2 } from "lucide-react";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";

const cardColors = [
  { border: "border-blue-200", shadow: "shadow-blue-100/30", badge: "bg-blue-500", badgeText: "text-blue-50" },
  { border: "border-emerald-200", shadow: "shadow-emerald-100/30", badge: "bg-emerald-500", badgeText: "text-emerald-50" },
  { border: "border-amber-200", shadow: "shadow-amber-100/30", badge: "bg-amber-500", badgeText: "text-amber-50" },
  { border: "border-purple-200", shadow: "shadow-purple-100/30", badge: "bg-purple-500", badgeText: "text-purple-50" },
  { border: "border-rose-200", shadow: "shadow-rose-100/30", badge: "bg-rose-500", badgeText: "text-rose-50" },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const color = cardColors[index % cardColors.length];

  return (
    <Link to={`/courses/${course.slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        whileHover={{
          y: -8,
          scale: 1.03,
          transition: { type: "spring" as const, stiffness: 260, damping: 18 },
        }}
        className="group aspect-square bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden shrink-0 w-[280px] sm:w-auto cursor-pointer"
      >
        <div className="flex flex-col h-full p-4">
          {/* Duration badge */}
          <div className="flex items-start">
            <span className={`${color.badge} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1`}>
              <Clock className="w-3 h-3" />{course.duration}
            </span>
          </div>

          <h3 className="text-lg font-bold text-navy leading-tight line-clamp-2 mt-2 mb-1 group-hover:text-navy-light transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-text-gray leading-snug line-clamp-2">{course.subtitle}</p>

          <div className="flex-1" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4 text-green" />
              <span className="text-xl font-bold text-navy">₹{course.price}</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 text-gold fill-gold" />
              <span className="text-xs font-bold text-navy">{course.rating}</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors">
            View Details
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function CourseSection() {
  // Fetch all active courses from the DB (the public API already filters active=true).
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["public-courses-home"],
    queryFn: () => publicService.courses.list() as Promise<Course[]>,
  });

  const featuredCourses = courses.filter((c) => c.featured);

  return (
    <section id="courses" className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">Explore Our Top Courses</h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">Choose from industry-relevant courses and start your journey towards a better future.</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-navy/40">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : featuredCourses.length > 0 ? (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 overflow-x-auto pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
            {featuredCourses.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-gray py-8">No courses available right now.</p>
        )}
        <div className="text-center mt-8 sm:mt-12">
          <Link to="/courses" className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
