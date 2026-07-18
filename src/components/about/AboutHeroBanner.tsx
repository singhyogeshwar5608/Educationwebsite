import { ChevronRight, Home } from "lucide-react";

export default function AboutHeroBanner() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* Decorative shapes - same as homepage hero */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-blue-200/80 text-sm mb-6">
            <a href="/" className="hover:text-gold transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gold">About Us</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight mb-6">
            About Our{" "}
            <span className="text-gold relative">
              Institute
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="#FFC107"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto">
            Discover our story, our mission, and our commitment to shaping the
            future of education. Learn what makes Z-TECH CAREER ACADEMY a
            trusted name in skill development.
          </p>
        </div>
      </div>
    </section>
  );
}
