import { Clock, IndianRupee, Star, Users } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseDetailHeroProps {
  course: Course;
}

export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
  return (
    <section className="bg-light-blue relative overflow-hidden">
      {/* Decorative Elements - same pattern as homepage Hero */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-navy/5 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold/5 rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[135px] sm:pt-[150px] pb-12 lg:pb-20 relative z-10">
          <div className="text-center">
            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-text-gray text-lg mb-3">{course.subtitle}</p>
            <p className="text-text-gray leading-relaxed mb-8 max-w-3xl mx-auto">{course.description}</p>

            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center justify-center gap-5 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-navy-light" />
                <span className="font-semibold text-navy">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-5 h-5 text-green" />
                <span className="font-bold text-navy text-xl">{course.price}</span>
                <span className="text-text-gray text-sm">Course Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-gold fill-gold" />
                <span className="font-semibold text-navy">{course.rating}</span>
                <span className="text-text-gray text-sm">Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-5 h-5 text-navy-light" />
                <span className="font-semibold text-navy">{course.students.toLocaleString()}</span>
                <span className="text-text-gray text-sm">Students</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold px-7 py-3 rounded-lg transition-all hover:shadow-lg text-base"
              >
                Enroll Now
              </a>
              <a
                href="#syllabus"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-lg transition-all hover:shadow-lg text-base"
              >
                View Syllabus
              </a>
            </div>
          </div>
        </div>
      </section>
  );
}
