import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, IndianRupee, ArrowRight } from "lucide-react";
import { Course, levelColors } from "@/data/courses";

interface CourseCardProps {
  course: Course;
  index?: number;
}

const accentColors = [
  { border: "border-blue-100", shadow: "shadow-blue-100/40", badge: "bg-blue-500", btn: "bg-blue-500 group-hover:bg-blue-600" },
  { border: "border-green-100", shadow: "shadow-green-100/40", badge: "bg-green-500", btn: "bg-green-500 group-hover:bg-green-600" },
  { border: "border-purple-100", shadow: "shadow-purple-100/40", badge: "bg-purple-500", btn: "bg-purple-500 group-hover:bg-purple-600" },
  { border: "border-orange-100", shadow: "shadow-orange-100/40", badge: "bg-orange-500", btn: "bg-orange-500 group-hover:bg-orange-600" },
  { border: "border-pink-100", shadow: "shadow-pink-100/40", badge: "bg-pink-500", btn: "bg-pink-500 group-hover:bg-pink-600" },
  { border: "border-cyan-100", shadow: "shadow-cyan-100/40", badge: "bg-cyan-500", btn: "bg-cyan-500 group-hover:bg-cyan-600" },
  { border: "border-amber-100", shadow: "shadow-amber-100/40", badge: "bg-amber-500", btn: "bg-amber-500 group-hover:bg-amber-600" },
  { border: "border-emerald-100", shadow: "shadow-emerald-100/40", badge: "bg-emerald-500", btn: "bg-emerald-500 group-hover:bg-emerald-600" },
];

export default function CourseCard({ course, index = 0 }: CourseCardProps) {
  const levelClass = levelColors[course.level] || "bg-navy/10 text-navy";
  const color = accentColors[index! % accentColors.length];

  return (
    <Link to={`/courses/${course.slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 }}
        whileHover={{
          y: -8,
          scale: 1.03,
          transition: { type: "spring" as const, stiffness: 260, damping: 18 },
        }}
        className={`group relative bg-white rounded-[22px] border-2 ${color.border} ${color.shadow} hover:shadow-xl overflow-hidden flex flex-col`}
      >
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelClass}`}>
              {course.level}
            </div>
            <div className="bg-navy text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {course.duration}
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-navy group-hover:text-navy-light transition-colors leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-text-gray leading-snug mt-0.5">{course.subtitle}</p>
          <div className="flex items-center gap-1 mt-2">
            <IndianRupee className="w-3.5 h-3.5 text-green" />
            <span className="text-base font-bold text-navy">₹{course.price}</span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-xs font-semibold text-navy group-hover:text-navy-light transition-colors">
              View Details
            </span>
            <div className={`w-7 h-7 rounded-full ${color.btn} flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 shadow-sm`}>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${index % 2 === 0 ? "#3B82F6" : "#22C55E"}08, transparent 40%)`,
          }}
        />
      </motion.div>
    </Link>
  );
}
