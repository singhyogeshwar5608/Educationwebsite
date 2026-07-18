import { Clock, IndianRupee, BookOpen, Users, Award, CheckCircle } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseOverviewProps {
  course: Course;
}

export default function CourseOverview({ course }: CourseOverviewProps) {
  const highlights = [
    { icon: Clock, label: "Duration", value: course.duration, color: "bg-navy/10 text-navy" },
    { icon: IndianRupee, label: "Course Fee", value: `₹${course.price}`, color: "bg-green/10 text-green" },
    { icon: IndianRupee, label: "Registration Fee", value: `₹${course.registrationFee}`, color: "bg-gold/10 text-navy" },
    { icon: BookOpen, label: "Modules", value: `${course.syllabus.length} Modules`, color: "bg-navy/10 text-navy" },
    { icon: Users, label: "Students", value: `${course.students.toLocaleString()}+`, color: "bg-green/10 text-green" },
    { icon: Award, label: "Certificate", value: "Government Certified", color: "bg-gold/10 text-navy" },
  ];

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              About This Course
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-6">
              Course Overview
            </h2>
            <p className="text-text-gray leading-relaxed text-lg mb-8">
              {course.longDescription}
            </p>

            {/* Key Highlights */}
            <h3 className="text-xl font-bold text-navy mb-4">Key Highlights</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {course.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green shrink-0" />
                  <span className="text-text-dark font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Info Cards */}
          <div className="space-y-4">
            {/* Highlight Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="bg-light-gray rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-navy text-sm">{item.value}</p>
                  <p className="text-text-gray text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Registration CTA Card */}
            <div className="bg-navy rounded-xl p-6 text-center">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Enroll?</h3>
              <p className="text-blue-200 text-sm mb-4">
                Start your journey today with our industry-recognized program.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center w-full bg-gold hover:bg-gold-light text-navy font-bold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
              >
                Enroll Now
              </a>
              <p className="text-blue-200/60 text-xs mt-3">
                Registration Fee: ₹{course.registrationFee}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
