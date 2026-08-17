import { Link } from "react-router-dom";
import { Clock, IndianRupee, ArrowRight } from "lucide-react";
import { Course, levelColors } from "@/data/courses";

interface CourseTableProps {
  courses: Course[];
}

export default function CourseTable({ courses }: CourseTableProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-navy/10 shadow-lg shadow-navy/5 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-navy text-white">
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Course</th>
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Level</th>
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Duration</th>
              <th className="px-5 py-4 text-left font-semibold whitespace-nowrap">Fee</th>
              <th className="px-5 py-4 text-right font-semibold whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const levelClass = levelColors[course.level] || "bg-navy/10 text-navy";
              return (
                <tr
                  key={course.slug}
                  className="odd:bg-white even:bg-gray-50 hover:bg-navy/5 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {/* Course */}
                  <td className="px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-bold text-navy leading-snug">
                        {course.title}
                      </p>
                      <p className="text-xs text-text-gray mt-0.5">
                        {course.subtitle}
                      </p>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${levelClass}`}>
                      {course.level}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {course.duration}
                    </span>
                  </td>

                  {/* Fee */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-green" />
                      <span className="text-base font-bold text-navy">{course.price}</span>
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link
                      to={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy-light text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md hover:shadow-navy/20"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

