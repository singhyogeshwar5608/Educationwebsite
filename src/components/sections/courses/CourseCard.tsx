import { Clock, IndianRupee, Star, ArrowRight, Users } from "lucide-react";
import { Course, levelColors } from "@/data/courses";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const levelClass = levelColors[course.level] || "bg-navy/10 text-navy";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Duration Badge - same as homepage */}
        <div className="absolute top-3 right-3 bg-navy text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {course.duration}
        </div>
        {/* Level Badge */}
        <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${levelClass}`}>
          {course.level}
        </div>
        {/* Category Overlay on Hover */}
        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{course.category}</span>
        </div>
      </div>

      {/* Content - identical to homepage card */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy mb-1">{course.title}</h3>
        <p className="text-sm text-text-gray mb-3">{course.subtitle}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green" />
            <span className="text-xl font-bold text-navy">{course.price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-medium text-text-dark">{course.rating}</span>
          </div>
        </div>
        {/* Students Count */}
        <div className="flex items-center gap-1.5 mb-4 text-text-gray">
          <Users className="w-4 h-4" />
          <span className="text-sm">{course.students.toLocaleString()} students enrolled</span>
        </div>
        {/* View Details Button - same as homepage */}
        <a
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
