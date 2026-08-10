import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import AboutHeroBanner from "@/components/about/AboutHeroBanner";
import InstituteIntroduction from "@/components/about/InstituteIntroduction";
import DirectorMessage from "@/components/about/DirectorMessage";
import MissionVision from "@/components/about/MissionVision";
import AboutWhyChooseUs from "@/components/about/AboutWhyChooseUs";
import JourneyTimeline from "@/components/about/JourneyTimeline";
import Achievements from "@/components/about/Achievements";
import StudentStatistics from "@/components/about/StudentStatistics";
import CampusFacilities from "@/components/about/CampusFacilities";
import GalleryPreview from "@/components/about/GalleryPreview";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AboutHeroBanner />
        <AnimateOnScroll>
          <InstituteIntroduction />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <DirectorMessage />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <MissionVision />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <AboutWhyChooseUs />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <JourneyTimeline />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Achievements />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <StudentStatistics />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CampusFacilities />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <GalleryPreview />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CTA />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
