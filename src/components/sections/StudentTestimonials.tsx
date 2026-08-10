"use client";

import { motion } from "framer-motion";

interface Testimonial {
  name: string;
  course: string;
  text: string;
  image: string;
  shapeColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aman Sharma",
    course: "Full Stack Development",
    text: "Live projects and practical training completely changed my confidence. I got placement within two months after completing the course.",
    image: "https://sfile.chatglm.cn/images-ppt/6cbb07f2ed04.jpg",
    shapeColor: "#1EA7FD",
  },
  {
    name: "Priya Mehta",
    course: "Digital Marketing",
    text: "The hands-on SEO and social media campaigns gave me real-world experience. I now run my own agency and help brands grow online.",
    image: "https://sfile.chatglm.cn/images-ppt/b7e325b53a30.png",
    shapeColor: "#62D84E",
  },
  {
    name: "Rohit Verma",
    course: "Tally Prime & Accounting",
    text: "From GST filing to financial reporting, everything was taught practically. I got placed in a leading finance firm right after training.",
    image: "https://sfile.chatglm.cn/images-ppt/3e4df0387bc6.jpg",
    shapeColor: "#23C9C9",
  },
];

function StarBadge() {
  return (
    <motion.div
      className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center z-20"
      whileHover={{ scale: 1.15, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      <span className="text-lg">⭐</span>
    </motion.div>
  );
}

export default function StudentTestimonials() {
  return (
    <section className="bg-[#F8FAFC] py-[60px] sm:py-[100px] lg:py-[140px]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold tracking-widest uppercase text-[#1EA7FD] mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy">
            What Our Students Say
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Real stories from real students who transformed their careers with
            Z-TECH Career Academy.
          </p>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-[30px] lg:gap-[50px] md:justify-items-center md:overflow-visible md:snap-none md:pb-0 overflow-x-auto snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.2, ease: "easeOut" }}
              className="relative min-w-[85vw] max-w-[380px] shrink-0 snap-center md:min-w-0 md:w-full"
            >
              <motion.div
                className="absolute -bottom-3 -left-3 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] lg:w-[220px] lg:h-[220px] rounded-[32px] z-0"
                style={{
                  backgroundColor: t.shapeColor,
                  transform: "rotate(18deg)",
                  transformOrigin: "bottom left",
                }}
                whileHover={{ rotate: 22, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />

              <motion.div
                className="relative bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-6 sm:p-10 flex flex-col items-center text-center z-10 w-full h-[400px] sm:h-[380px]"
                whileHover={{ y: -12, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="absolute -top-[45px] left-1/2 -translate-x-1/2 z-30">
                  <motion.div
                    className="w-[90px] h-[90px] rounded-full overflow-hidden border-[5px] border-white shadow-[0_8px_25px_-8px_rgba(0,0,0,0.25)]"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 250, damping: 12 }}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 mt-6 sm:mt-10">
                  <h3 className="text-xl font-bold text-navy mt-2">
                    {t.name}
                  </h3>
                  <p className="text-[#1EA7FD] italic text-sm font-medium mt-1">
                    {t.course}
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed mt-4 line-clamp-4 max-w-[280px]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <StarBadge />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
