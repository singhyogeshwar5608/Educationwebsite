import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Web Developer",
    company: "TCS",
    rating: 5,
    text: "The training and support I received at Future Skills Institute helped me to get placed in a top company. The practical approach to learning made me industry-ready from day one.",
    image: "https://sfile.chatglm.cn/images-ppt/6cbb07f2ed04.jpg",
  },
  {
    name: "Priya Singh",
    role: "Digital Marketer",
    company: "Infosys",
    rating: 5,
    text: "I enrolled in the Digital Marketing course and it was the best decision of my career. The trainers are very supportive and the curriculum is up to date with industry trends.",
    image: "https://sfile.chatglm.cn/images-ppt/b7e325b53a30.png",
  },
  {
    name: "Amit Verma",
    role: "Accountant",
    company: "HCL",
    rating: 5,
    text: "The Tally Prime course gave me the practical skills I needed to land my first job. The placement assistance team was incredibly helpful throughout the process.",
    image: "https://sfile.chatglm.cn/images-ppt/3e4df0387bc6.jpg",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="bg-navy py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Hear from our students who have achieved their career goals with us.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 sm:p-10 text-center relative">
            <Quote className="w-10 h-10 text-gold/30 absolute top-6 left-6" />
            <div className="mb-6">
              <img
                src={testimonials[activeIndex].image}
                alt={testimonials[activeIndex].name}
                className="w-20 h-20 rounded-full mx-auto border-4 border-gold/30 object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold fill-gold" />
              ))}
            </div>
            <p className="text-white text-lg leading-relaxed mb-6 italic">
              &ldquo;{testimonials[activeIndex].text}&rdquo;
            </p>
            <h4 className="text-white font-bold text-lg">
              {testimonials[activeIndex].name}
            </h4>
            <p className="text-blue-200 text-sm">
              {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === activeIndex ? "bg-gold" : "bg-white/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
