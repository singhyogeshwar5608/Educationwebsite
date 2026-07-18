"use client";

import { useParams, notFound } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import CourseDetailHero from "@/components/sections/course-detail/CourseDetailHero";
import CourseOverview from "@/components/sections/course-detail/CourseOverview";
import TrainerCard from "@/components/sections/course-detail/TrainerCard";
import CourseSyllabus from "@/components/sections/course-detail/CourseSyllabus";
import Eligibility from "@/components/sections/course-detail/Eligibility";
import CertificatePreview from "@/components/sections/course-detail/CertificatePreview";
import CourseGallery from "@/components/sections/course-detail/CourseGallery";
import CourseFAQ from "@/components/sections/course-detail/CourseFAQ";
import RelatedCourses from "@/components/sections/course-detail/RelatedCourses";
import { courses } from "@/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-navy mb-4">Course Not Found</h1>
            <p className="text-text-gray mb-6">
              The course you are looking for does not exist or has been removed.
            </p>
            <a
              href="/courses"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
            >
              Browse All Courses
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseDetailHero course={course} />
        <AnimateOnScroll>
          <CourseOverview course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <TrainerCard course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseSyllabus course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Eligibility course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CertificatePreview />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseGallery course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseFAQ course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <RelatedCourses currentCourse={course} />
        </AnimateOnScroll>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
