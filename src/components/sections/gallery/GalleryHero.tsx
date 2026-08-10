import { motion } from "framer-motion";
import { Images, Camera, Sparkles, ChevronRight, Home } from "lucide-react";
import heroImg from "@/assets/banner-images/courses_hero_students.jpg";

function GoldenDotsGrid() {
  return (
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 grid grid-cols-3 gap-1.5 z-10 hidden sm:grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
      ))}
    </div>
  );
}

function CurvedNavyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1440 540" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="galleryNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="50%" stopColor="#0D1C38" />
            <stop offset="100%" stopColor="#061224" />
          </linearGradient>
        </defs>

        <path
          d="M 960 -20 C 840 100, 800 270, 1120 560 L 1440 560 L 1440 -20 Z"
          fill="url(#galleryNavyGrad)"
        />
        <path
          d="M 950 -20 C 830 100, 790 270, 1110 560"
          stroke="#F5A623"
          strokeWidth="3.5"
          fill="none"
        />
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

const features = [
  {
    icon: <Camera className="w-5 h-5 text-[#F5A623]" />,
    line1: "Campus",
    line2: "Life",
  },
  {
    icon: <Images className="w-5 h-5 text-[#F5A623]" />,
    line1: "Classrooms",
    line2: "& Labs",
  },
  {
    icon: <Sparkles className="w-5 h-5 text-[#F5A623]" />,
    line1: "Events",
    line2: "& Moments",
  },
];

const stats = [
  { value: "5000+", label: "Students" },
  { value: "15+", label: "Courses" },
  { value: "1000+", label: "Memories" },
];

export default function GalleryHero() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] pt-24 sm:pt-28 lg:pt-24">
      <CurvedNavyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 lg:pb-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="inline-block mb-3.5">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D1C38]" />
                <span className="font-bold text-xs sm:text-sm tracking-[0.16em] text-[#0D1C38] uppercase">
                  OUR GALLERY
                </span>
              </div>
              <div className="h-[2px] w-full bg-[#F5A623] mt-1" />
            </div>

            <div className="relative mb-4">
              <GoldenDotsGrid />
              <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-[900] tracking-tight uppercase leading-[1.08]">
                <span className="text-[#0D1C38] block mb-1">MOMENTS FROM</span>
                <span className="text-[#F5A623] inline-block">OUR INSTITUTE</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed mb-6 sm:mb-8 max-w-lg font-normal">
              A glimpse of life at Z-TECH CAREER ACADEMY — our classrooms, labs,
              events, and the moments that make learning special.
            </p>

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

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <img
                src={heroImg}
                alt="Campus Life"
                className="w-full h-auto max-h-[300px] sm:max-h-[360px] lg:max-h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
