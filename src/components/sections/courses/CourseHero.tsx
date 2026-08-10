import { motion } from "framer-motion";
import { BookOpen, Users, Award, ChevronRight } from "lucide-react";
import heroStudentsImg from "@/assets/banner-images/courses_hero_students.jpg";

// Features with Navy circle background + Golden icon + Vertical dividers
const features = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
    line1: "Industry",
    line2: "Relevant Curriculum",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    line1: "Expert",
    line2: "Mentorship",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <polygon points="10 8 16 11 10 14 10 8" fill="currentColor" />
      </svg>
    ),
    line1: "Practical",
    line2: "Learning",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#F5A623]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        <path d="M12 11h.01" />
      </svg>
    ),
    line1: "Placement",
    line2: "Assistance",
  },
];

const stats = [
  { icon: BookOpen, value: "50+", label: "Courses" },
  { icon: Users, value: "5000+", label: "Students Trained" },
  { icon: Award, value: "100%", label: "Practical Training" },
];

/* â”€â”€ 3 columns x 4 rows Golden Dots Grid â”€â”€ */
function GoldenDotsGrid() {
  return (
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 grid grid-cols-3 gap-1.5 z-10 hidden sm:grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
      ))}
    </div>
  );
}

/* â”€â”€ Paper Airplane with Curved Loop Trail â”€â”€ */
function PaperAirplaneWithTrail() {
  return (
    <div className="inline-block relative ml-2.5 align-middle -mt-3 sm:-mt-5">
      <svg width="110" height="55" viewBox="0 0 110 55" fill="none" className="overflow-visible w-20 sm:w-28 h-auto">
        <path
          d="M 5 40 C 25 45, 40 18, 30 26 C 20 34, 45 38, 75 22"
          stroke="#0D1C38"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
          opacity="0.5"
        />
        <g transform="translate(75, 4) rotate(-12)">
          <path
            d="M 0 16 L 28 0 L 12 23 L 9 30 L 6 21 Z"
            stroke="#0D1C38"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 28 0 L 12 23"
            stroke="#0D1C38"
            strokeWidth="1.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

/* â”€â”€ Curved Navy Background with Golden Arc â”€â”€ */
function CurvedNavyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1440 540" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="50%" stopColor="#0D1C38" />
            <stop offset="100%" stopColor="#061224" />
          </linearGradient>
        </defs>

        {/* Dark Navy Background Curve */}
        <path
          d="M 960 -20 C 840 100, 800 270, 1120 560 L 1440 560 L 1440 -20 Z"
          fill="url(#navyGrad)"
        />

        {/* Outer Thick Golden Line */}
        <path
          d="M 950 -20 C 830 100, 790 270, 1110 560"
          stroke="#F5A623"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Inner Thin Golden Line */}
        <path
          d="M 958 -20 C 838 100, 798 270, 1118 560"
          stroke="#F5A623"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

export default function CourseHero() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] pt-24 sm:pt-28 lg:pt-24">
      {/* â”€â”€ Background Curved Shape â”€â”€ */}
      <CurvedNavyBackground />

      {/* â•â•â•â•â•â•â•â•â•â• MAIN HERO CONTAINER â•â•â•â•â•â•â•â•â•â• */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 lg:pb-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* â”€â”€â”€â”€â”€â”€ LEFT COLUMN: TEXT & FEATURES â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            {/* Tagline Badge */}
            <div className="inline-block mb-3.5">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D1C38]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span className="font-bold text-xs sm:text-sm tracking-[0.16em] text-[#0D1C38] uppercase">
                  EXPLORE. LEARN. SUCCEED
                </span>
              </div>
              <div className="h-[2px] w-full bg-[#F5A623] mt-1" />
            </div>

            {/* Main Heading */}
            <div className="relative mb-4">
              <GoldenDotsGrid />
              <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-[900] tracking-tight uppercase leading-[1.08]">
                <span className="text-[#0D1C38] block mb-1">EXPLORE OUR</span>
                <span className="text-[#F5A623] inline-block">COURSES</span>
                <PaperAirplaneWithTrail />
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed mb-6 sm:mb-8 max-w-lg font-normal">
              Discover industry-focused courses designed to build practical skills,
              boost your confidence, and accelerate your career growth.
            </p>

            {/* 4 Feature Items Row */}
            <div className="inline-flex flex-wrap items-center gap-y-4 max-w-full">
              {features.map((f, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center text-center px-2.5 sm:px-3.5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0D1C38] flex items-center justify-center mb-2 shadow-sm">
                      {f.icon}
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-[#0D1C38] leading-snug">
                      {f.line1}
                      <br />
                      {f.line2}
                    </span>
                  </div>

                  {index < features.length - 1 && (
                    <div className="h-9 w-[1px] bg-gray-300 mx-1 sm:mx-2 hidden xs:block" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* â”€â”€â”€â”€â”€â”€ RIGHT COLUMN: GENERATED HERO IMAGE (RESPONSIVE & UX OPTIMIZED) â”€â”€â”€â”€â”€â”€ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <img
                src={heroStudentsImg}
                alt="Students Learning"
                className="w-full h-auto max-h-[300px] sm:max-h-[360px] lg:max-h-[400px] object-cover"
              />
              {/* Subtle Overlay Gradient for Premium UX feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

        </div>
      </div>


    </section>
  );
}
