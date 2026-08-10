import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Web Developer",
    company: "TCS",
    rating: 5,
    text: "The training and support I received at Z-TECH CAREER ACADEMY helped me to get placed in a top company. The practical approach to learning made me industry-ready from day one.",
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
  {
    name: "Neha Gupta",
    role: "Graphic Designer",
    company: "Wipro",
    rating: 5,
    text: "The DTP and Graphic Design course completely transformed my career. The hands-on projects and expert guidance helped me build an impressive portfolio.",
    image: "https://sfile.chatglm.cn/images-ppt/6cbb07f2ed04.jpg",
  },
  {
    name: "Vikram Singh",
    role: "Data Entry Specialist",
    company: "Genpact",
    rating: 5,
    text: "My typing speed improved from 20 to 60 WPM in just two months. The regular practice sessions and feedback from trainers were incredibly helpful.",
    image: "https://sfile.chatglm.cn/images-ppt/3e4df0387bc6.jpg",
  },
  {
    name: "Sneha Patel",
    role: "Office Assistant",
    company: "Deloitte",
    rating: 5,
    text: "The Office Work Training program covered everything I needed for my job. From MS Office to office etiquette, I felt fully prepared for the corporate world.",
    image: "https://sfile.chatglm.cn/images-ppt/b7e325b53a30.png",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-gold fill-gold" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCardsPerView(3);
  }, []);

  const totalSlides = Math.max(0, testimonials.length - cardsPerView);
  const slidePercent = 100 / cardsPerView;

  const next = () => setCurrent((p) => Math.min(p + 1, totalSlides));
  const prev = () => setCurrent((p) => Math.max(p - 1, 0));

  return (
    <section className="bg-navy py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block text-gold text-sm font-semibold tracking-wider uppercase mb-2">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Student Success Stories
          </h2>
          <p className="text-blue-200/80 text-base sm:text-lg max-w-2xl mx-auto">
            Hear from our students who have achieved their career goals with us.
          </p>
        </div>

        <div className="relative px-1">
          <div className="overflow-hidden rounded-2xl" ref={containerRef}>
            <div
              className="flex transition-transform duration-500 ease-out gap-4 sm:gap-6"
              style={{ transform: `translateX(-${current * slidePercent}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-0"
                >
                  <div className="bg-white/[0.06] backdrop-blur-sm rounded-2xl border border-white/[0.08] hover:border-gold/30 transition-colors duration-300 p-3 flex flex-col items-center text-center h-full aspect-square">
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-gold/30 mb-2 shrink-0 shadow-lg">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <StarRating rating={t.rating} />
                    <p className="text-white/75 text-[10px] leading-relaxed mt-2 flex-1 line-clamp-3 italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-auto pt-2 border-t border-white/10 w-full">
                      <h4 className="text-white font-bold text-[11px]">
                        {t.name}
                      </h4>
                      <p className="text-blue-200/70 text-[9px] mt-0.5">
                        {t.role} at {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            disabled={current === 0}
            className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={next}
            disabled={current >= totalSlides}
            className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/10 z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-gold w-6" : "bg-white/20 hover:bg-white/40 w-2"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
