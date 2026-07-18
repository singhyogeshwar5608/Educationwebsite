import { ShieldCheck, Award } from "lucide-react";

export default function VerificationHero() {
  return (
    <section className="bg-light-blue relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-navy/5 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-green/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-navy/3 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-gray mb-4 sm:mb-6">
            <a href="/" className="hover:text-navy transition-colors">Home</a>
            <span>/</span>
            <span className="text-navy font-medium">Verify Certificate</span>
          </div>

          {/* Icon Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green/10 text-green rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Certificate Verification
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-navy mb-3 sm:mb-6 leading-tight">
            Verify Your{" "}
            <span className="relative inline-block">
              Certificate
              <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C50 2 150 2 198 8" stroke="#28A745" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-text-gray text-sm sm:text-lg lg:text-xl leading-relaxed mb-5 sm:mb-8 max-w-2xl">
            Enter your certificate number to verify its authenticity. All
            certificates issued by Z-TECH CAREER ACADEMY can be verified online
            for employers, institutions, and organizations.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-navy">5000+</p>
                <p className="text-[10px] sm:text-xs text-text-gray">Certificates Issued</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-navy" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-navy">100%</p>
                <p className="text-[10px] sm:text-xs text-text-gray">Verifiable Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
