"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, ArrowRight, Star } from "lucide-react";

const skillTags = [
  { label: "Computer Basics", className: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200" },
  { label: "MS Office", className: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200" },
  { label: "Tally Prime", className: "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200" },
  { label: "DTP", className: "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200" },
  { label: "Digital Marketing", className: "bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200" },
  { label: "Web Development", className: "bg-indigo-100 text-indigo-700 border-indigo-300 hover:bg-indigo-200" },
  { label: "Typing", className: "bg-cyan-100 text-cyan-700 border-cyan-300 hover:bg-cyan-200" },
  { label: "Graphic Design", className: "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 as const },
  visible: { opacity: 1, y: 0 as const, transition: { duration: 0.6 } },
};

const zoomIn = {
  hidden: { opacity: 0, scale: 0.85 as const },
  visible: { opacity: 1, scale: 1 as const, transition: { duration: 0.8 } },
};

export default function AboutAcademy() {
  return (
    <section className="relative pt-[2px] pb-[10px] lg:pb-[40px] bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* LEFT — Layered Images */}
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Main Image */}
            <motion.div variants={zoomIn} className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://sfile.chatglm.cn/images-ppt/ba342229ab25.jpg"
                  alt="Students at Z-TECH Academy"
                  className="w-full h-[460px] lg:h-[540px] object-cover"
                />
              </div>

              {/* Floating Stats Card on main image */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 z-20 bg-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <Users className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-navy leading-none">10K+</p>
                  <p className="text-xs text-text-gray font-medium mt-1">Students Trained</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary overlapping image */}
            <motion.div
              variants={zoomIn}
              className="absolute -bottom-10 -right-6 z-20 w-[180px] sm:w-[220px]"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://sfile.chatglm.cn/images-ppt/85b423e9c62e.jpg"
                  alt="Student learning"
                  className="w-full h-[200px] sm:h-[260px] object-cover"
                />
              </div>
            </motion.div>

            <div className="absolute -top-8 -left-8 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          </motion.div>

          {/* RIGHT — Content */}
          <motion.div
            className="flex flex-col"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 bg-navy/5 text-navy font-semibold text-sm px-4 py-1.5 rounded-full mb-5">
                <ShieldCheck className="w-4 h-4 text-gold" />
                Who We Are
              </div>
            </motion.div>

            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-navy leading-[1.15] mb-5">
              Shaping Future With<br />
              <span className="relative inline-block">
                Quality Education
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-text-gray text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Z-TECH Career Academy is a government-certified computer training institute providing industry-relevant education since 2012. We empower students with practical skills, certified courses, and 100% job assistance to build successful careers.
            </motion.p>

            <motion.div variants={fadeUp} className="mb-10">
              <a
                href="#courses"
                className="group inline-flex items-center gap-3 bg-navy hover:bg-navy-light text-white font-semibold text-sm px-7 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-navy/30"
                style={{ height: "58px" }}
              >
                Explore Our Courses
                <div className="w-[38px] h-[38px] bg-gold rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-[6px]">
                  <ArrowRight className="w-4 h-4 text-navy" />
                </div>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-navy/10 shrink-0">
                  <img
                    src="https://ui-avatars.com/api/?name=Vijay+Singla&background=0A2647&color=FFC107&size=48&bold=true"
                    alt="Vijay Kumar Singla"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy leading-none">Vijay Kumar Singla</p>
                  <p className="text-xs text-text-gray mt-1">Founder & Director</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-4 py-3 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-xs font-bold text-navy">4.9 / 5</p>
                <p className="text-[10px] text-text-gray">Trusted by Students</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skill Tags */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillTags.map((tag, i) => (
            <motion.span
              key={tag.label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className={`text-sm font-semibold rounded-full px-5 py-2 cursor-pointer transition-colors border ${tag.className}`}
            >
              {tag.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
