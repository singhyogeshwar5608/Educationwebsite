import { Clock, CircleDollarSign, BadgeIndianRupee, BookOpen, CircleCheck, BadgeCheck } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseOverviewProps {
  course: Course;
}

export default function CourseOverview({ course }: CourseOverviewProps) {
  const totalTopics = course.syllabus.reduce((sum, subj) => sum + subj.topics.length, 0);
  const highlights = [
    { icon: Clock, label: "Duration", value: course.duration, color: "bg-navy/10 text-navy" },
    { icon: CircleDollarSign, label: "Course Fee", value: `₹${course.price}`, color: "bg-green/10 text-green" },
    { icon: BadgeIndianRupee, label: "Registration Fee", value: `₹${course.registrationFee}`, color: "bg-gold/10 text-navy" },
    { icon: BookOpen, label: "Subjects", value: `${course.syllabus.length} Subjects`, color: "bg-navy/10 text-navy" },
    { icon: CircleCheck, label: "Topics", value: `${totalTopics} Topics`, color: "bg-green/10 text-green" },
    { icon: BadgeCheck, label: "Certificate", value: "Government Certified", color: "bg-gold/10 text-navy" },
  ];

  return (
    <section className="bg-white py-[50px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="bg-light-gray rounded-xl p-4 text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <item.icon className="w-6 h-6" fill="currentColor" strokeWidth={1.5} />
              </div>
              <p className="font-bold text-navy text-sm">{item.value}</p>
              <p className="text-text-gray text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Registration CTA Card */}
        <div className="bg-navy rounded-xl p-6 text-center max-w-md mx-auto">
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
    </section>
  );
}
