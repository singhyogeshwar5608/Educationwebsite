"use client";

import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import CourseHero from "@/components/sections/courses/CourseHero";
import CourseGrid from "@/components/sections/courses/CourseGrid";

export default function CoursesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseHero />
        <CourseGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
