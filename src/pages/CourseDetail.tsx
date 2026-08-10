import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import CourseDetailHero from "@/components/sections/course-detail/CourseDetailHero";
import CourseOverview from "@/components/sections/course-detail/CourseOverview";
import CourseSyllabus from "@/components/sections/course-detail/CourseSyllabus";
import Eligibility from "@/components/sections/course-detail/Eligibility";
import CourseGallery from "@/components/sections/course-detail/CourseGallery";
import CertificatePreview from "@/components/sections/course-detail/CertificatePreview";
import RelatedCourses from "@/components/sections/course-detail/RelatedCourses";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading, isError, refetch } = useQuery<Course>({
    queryKey: ["public-course", slug],
    queryFn: () => publicService.courses.show(slug as string) as Promise<Course>,
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-navy/30 animate-spin mx-auto mb-4" />
            <p className="text-text-gray">Loading course details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold text-navy mb-4">Course Not Found</h1>
            <p className="text-text-gray mb-6">
              The course you are looking for does not exist or has been removed.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
              >
                Browse All Courses
              </Link>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-navy font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Retry
              </button>
            </div>
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
          <CourseSyllabus course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <Eligibility course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CourseGallery course={course} />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <CertificatePreview />
        </AnimateOnScroll>
        <AnimateOnScroll>
          <RelatedCourses currentCourse={course} />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}
