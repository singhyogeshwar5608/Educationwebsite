"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Monitor,
  Calculator,
  Megaphone,
  Code2,
  Palette,
  FileSpreadsheet,
  GraduationCap,
  BookOpen,
  ImageIcon,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";

interface CardStyle {
  accent: string;
  border: string;
  shadow: string;
  iconBg: string;
  placeholder: string;
}

const categoryStyles: Record<string, CardStyle> = {
  "Computer Applications": {
    accent: "#3B82F6",
    border: "border-blue-100",
    shadow: "shadow-blue-100/40",
    iconBg: "bg-blue-500",
    placeholder: "from-blue-500/30 via-blue-600/20 to-blue-800/40",
  },
  "Accounting & Finance": {
    accent: "#F97316",
    border: "border-orange-100",
    shadow: "shadow-orange-100/40",
    iconBg: "bg-orange-500",
    placeholder: "from-orange-500/30 via-orange-600/20 to-orange-800/40",
  },
  "Digital Marketing": {
    accent: "#EC4899",
    border: "border-pink-100",
    shadow: "shadow-pink-100/40",
    iconBg: "bg-pink-500",
    placeholder: "from-pink-500/30 via-pink-600/20 to-pink-800/40",
  },
  "Web Development": {
    accent: "#8B5CF6",
    border: "border-violet-100",
    shadow: "shadow-violet-100/40",
    iconBg: "bg-violet-500",
    placeholder: "from-violet-500/30 via-violet-600/20 to-violet-800/40",
  },
  "Graphic Design": {
    accent: "#EC4899",
    border: "border-fuchsia-100",
    shadow: "shadow-fuchsia-100/40",
    iconBg: "bg-fuchsia-500",
    placeholder: "from-fuchsia-500/30 via-fuchsia-600/20 to-fuchsia-800/40",
  },
  "Office & Productivity": {
    accent: "#22C55E",
    border: "border-green-100",
    shadow: "shadow-green-100/40",
    iconBg: "bg-green-500",
    placeholder: "from-green-500/30 via-green-600/20 to-green-800/40",
  },
};

const defaultStyle: CardStyle = {
  accent: "#3B82F6",
  border: "border-blue-100",
  shadow: "shadow-blue-100/40",
  iconBg: "bg-blue-500",
  placeholder: "from-blue-500/30 via-blue-600/20 to-blue-800/40",
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Computer Applications": Monitor,
  "Accounting & Finance": Calculator,
  "Digital Marketing": Megaphone,
  "Web Development": Code2,
  "Graphic Design": Palette,
  "Office & Productivity": FileSpreadsheet,
};

function truncateWords(text: string, maxWords: number): string {
  const words = (text || "").trim().split(/\s+/);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ") + "...";
}

function CourseCard({ course }: { course: Course }) {
  const style = categoryStyles[course.category] ?? defaultStyle;
  const Icon = categoryIcons[course.category] ?? BookOpen;
  const firstImage = course.gallery?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
      whileHover={{
        y: -10,
        scale: 1.04,
        rotate: 0.5,
        transition: { type: "spring" as const, stiffness: 260, damping: 18 },
      }}
      className={`group relative bg-white rounded-[22px] border-2 ${style.border} ${style.shadow} hover:shadow-xl overflow-hidden flex flex-col h-full`}
    >
      <div className="relative h-28 sm:h-32 lg:h-36 overflow-hidden shrink-0 bg-white">
        {firstImage ? (
          <img
            src={firstImage}
            alt={course.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${style.placeholder} flex items-center justify-center`}
          >
            <div className="relative flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gold rounded-full flex items-center justify-center shadow-lg">
                <ImageIcon className="w-3.5 h-3.5 text-navy" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-5 lg:p-6 min-h-0">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div
            className={`w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 ${style.iconBg} rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-[8deg] group-hover:scale-110 shadow-sm`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>

        <h3 className="text-xs sm:text-base lg:text-lg font-bold text-navy mb-0.5 sm:mb-1.5 leading-tight sm:leading-snug line-clamp-2 min-h-[2.5em] sm:min-h-[2.75em] lg:min-h-[2.75em]">
          {course.title}
        </h3>
        <p className="text-text-gray text-[10px] sm:text-xs lg:text-sm leading-relaxed flex-1 line-clamp-2 sm:line-clamp-3">
          {truncateWords(course.subtitle || course.description, 15)}
        </p>
      </div>

      <div className="px-3 sm:px-5 lg:px-6 pb-3 sm:pb-5 lg:pb-6">
        <Link
          to={`/courses/${course.slug}`}
          className={`inline-flex items-center justify-center gap-1.5 w-full ${style.iconBg} text-white text-[11px] sm:text-sm font-bold px-4 py-2 sm:py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
        >
          Learn More
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        className="absolute inset-0 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${style.accent}08, transparent 40%)`,
        }}
      />
    </motion.div>
  );
}

export default function HighlightedServices() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["public-courses-services"],
    queryFn: () => publicService.courses.list() as Promise<Course[]>,
  });

  return (
    <section className="relative py-[15px] overflow-hidden">
      <div className="absolute inset-0 bg-[#0A2647]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <GraduationCap className="w-4 h-4 text-gold" />
            <span className="text-white/90 text-sm font-semibold">Our Courses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            More Than Just{" "}
            <span className="relative inline-block">
              Computer Courses
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="#FFC107"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-blue-100/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            We provide professional computer education along with essential online
            government and digital services under one roof.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-center text-blue-100/70 py-12">
            No courses available right now.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-lg transition-all hover:shadow-xl hover:shadow-gold/20 text-lg"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
