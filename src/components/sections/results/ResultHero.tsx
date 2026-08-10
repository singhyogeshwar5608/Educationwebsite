import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import desktopBanner from "@/assets/banner-images/results.png";
import mobileBanner from "@/assets/banner-images/mobile result.png";

export default function ResultHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-navy">
      <img
        src={isMobile ? mobileBanner : desktopBanner}
        alt="Check Your Results - Z-TECH Career Institute"
        className="w-full h-auto object-cover object-center"
      />
      <div className="absolute top-0 left-0 right-0 z-10 pt-36 sm:pt-40 md:pt-44 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gold font-medium">Results</span>
          </div>
        </div>
      </div>
    </section>
  );
}
