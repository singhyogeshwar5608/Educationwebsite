import { Clock, IndianRupee, Star, Users, GraduationCap } from "lucide-react";
import { Course, levelColors } from "@/data/courses";

interface CourseDetailHeroProps {
  course: Course;
}

export default function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const levelClass = levelColors[course.level] || "bg-navy/10 text-navy";

  return (
    <section className="bg-light-blue relative overflow-hidden">
      {/* Decorative Elements - same pattern as homepage Hero */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-navy/5 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-gold/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-gray mb-6">
          <a href="/" className="hover:text-navy transition-colors">Home</a>
          <span>/</span>
          <a href="/courses" className="hover:text-navy transition-colors">Courses</a>
          <span>/</span>
          <span className="text-navy font-medium">{course.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${levelClass}`}>
                {course.level}
              </div>
              <div className="inline-flex items-center gap-1.5 bg-navy/10 text-navy text-xs font-semibold px-3 py-1 rounded-full">
                <GraduationCap className="w-3.5 h-3.5" />
                {course.category}
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-text-gray text-lg mb-3">{course.subtitle}</p>
            <p className="text-text-gray leading-relaxed mb-8">{course.description}</p>

            {/* Quick Info Row */}
            <div className="flex flex-wrap items-center gap-5 mb-8">
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
            <div className="flex flex-wrap gap-3">
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

          {/* Course Image */}
          <div className="relative">
            <img
              src={course.image}
              alt={course.title}
              className="rounded-2xl shadow-2xl w-full h-[350px] object-cover"
            />
            <div className="absolute -inset-3 bg-gradient-to-br from-gold/10 to-navy-light/10 rounded-2xl -z-10" />
            {/* Floating Duration Card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">{course.duration}</p>
                <p className="text-xs text-text-gray">Course Duration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
