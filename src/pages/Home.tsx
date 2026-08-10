import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import AboutAcademy from "@/components/sections/AboutAcademy";
import FeatureStrip from "@/components/sections/FeatureStrip";
import HighlightedServices from "@/components/sections/HighlightedServices";
import CourseSection from "@/components/sections/CourseSection";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Statistics from "@/components/sections/Statistics";
import PlacementPartners from "@/components/sections/PlacementPartners";
import StudentTestimonials from "@/components/sections/StudentTestimonials";
import Gallery from "@/components/sections/Gallery";
import AdmissionSteps from "@/components/sections/AdmissionSteps";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeatureStrip />
        <AboutAcademy />
        <AnimateOnScroll>
          <HighlightedServices />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseSection />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <WhyChooseUs />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Statistics />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <PlacementPartners />
        </AnimateOnScroll>
        <StudentTestimonials />
        <AnimateOnScroll>
          <Gallery />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <AdmissionSteps />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <FAQ />
        </AnimateOnScroll>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
