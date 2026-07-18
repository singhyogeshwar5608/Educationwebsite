"use client";

import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import FeatureStrip from "@/components/sections/FeatureStrip";
import CourseSection from "@/components/sections/CourseSection";
import HighlightedServices from "@/components/sections/HighlightedServices";
import Statistics from "@/components/sections/Statistics";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import PlacementPartners from "@/components/sections/PlacementPartners";
import Verification from "@/components/sections/Verification";
import Facilities from "@/components/sections/Facilities";
import Gallery from "@/components/sections/Gallery";
import AdmissionSteps from "@/components/sections/AdmissionSteps";
import FAQ from "@/components/sections/FAQ";
import News from "@/components/sections/News";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AnimateOnScroll>
          <FeatureStrip />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseSection />
        </AnimateOnScroll>
        <HighlightedServices />
        <AnimateOnScroll>
          <Statistics />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <WhyChooseUs />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Testimonials />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <PlacementPartners />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Verification />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Facilities />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Gallery />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <AdmissionSteps />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <FAQ />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <News />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CTA />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
