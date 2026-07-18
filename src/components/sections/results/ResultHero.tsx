import { ClipboardList, GraduationCap } from "lucide-react";

export default function ResultHero() {
  return (
    <section className="bg-light-blue relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-navy/5 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-navy/3 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-text-gray mb-6">
            <a href="/" className="hover:text-navy transition-colors">Home</a>
            <span>/</span>
            <span className="text-navy font-medium">Results</span>
          </div>

          {/* Icon Badge */}
          <div className="inline-flex items-center gap-2 bg-navy/10 text-navy rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <ClipboardList className="w-4 h-4" />
            Examination Results
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy mb-6 leading-tight">
            Check Your{" "}
            <span className="relative inline-block">
              Results
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-text-gray text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
            Enter your roll number below to view your examination results.
            Download your marksheet and track your academic performance across
            all subjects at Z-TECH CAREER ACADEMY.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-navy" />
              </div>
              <div>
                <p className="text-xl font-bold text-navy">5000+</p>
                <p className="text-xs text-text-gray">Students</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-green" />
              </div>
              <div>
                <p className="text-xl font-bold text-navy">95%</p>
                <p className="text-xs text-text-gray">Pass Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
