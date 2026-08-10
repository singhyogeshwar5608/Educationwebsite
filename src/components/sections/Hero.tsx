"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const desktopModules = import.meta.glob("/src/assets/hero/desktop/*.{svg,jpg,jpeg,png,webp}", { eager: true });
const desktopImages = Object.values(desktopModules).map((mod: any) => mod.default);

const mobileModules = import.meta.glob("/src/assets/hero/mobile/*.{svg,jpg,jpeg,png,webp}", { eager: true });
const mobileImages = Object.values(mobileModules).map((mod: any) => mod.default);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(isPaused);
  pausedRef.current = isPaused;
  const isMobile = useIsMobile();

  const slides = isMobile
    ? (mobileImages.length > 0 ? mobileImages : desktopImages)
    : (desktopImages.length > 0 ? desktopImages : mobileImages);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setTimeout(() => {
      if (emblaApi && !pausedRef.current) {
        emblaApi.scrollNext();
      }
      startAutoplay();
    }, 5000);
  }, [emblaApi, stopAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    if (!isPaused) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return stopAutoplay;
  }, [emblaApi, isPaused, startAutoplay, stopAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    stopAutoplay();
    startAutoplay();
  }, [emblaApi, stopAutoplay, startAutoplay]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    stopAutoplay();
    startAutoplay();
  }, [emblaApi, stopAutoplay, startAutoplay]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    stopAutoplay();
    startAutoplay();
  }, [emblaApi, stopAutoplay, startAutoplay]);

  if (slides.length === 0) {
    return (
      <section className="relative bg-navy overflow-hidden min-h-[300px] md:min-h-[450px] lg:min-h-[550px] pt-[108px] lg:pt-0" />
    );
  }

  return (
    <section
      className="relative overflow-hidden w-full pt-[108px] lg:pt-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full" ref={emblaRef}>
        <div className="flex">
          {slides.map((src, idx) => (
            <div key={idx} className="relative min-w-0 flex-[0_0_100%]">
              <img
                src={src}
                alt={`Banner ${idx + 1}`}
                className={`w-full block ${isMobile ? "object-contain max-h-[80vh]" : "object-cover lg:max-h-[100vh]"}`}
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`rounded-full transition-all focus:outline-none ${
              idx === currentIndex
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-gold"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
