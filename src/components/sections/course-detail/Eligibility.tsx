import { CheckCircle, AlertCircle } from "lucide-react";
import { Course } from "@/data/courses";

interface EligibilityProps {
  course: Course;
}

export default function Eligibility({ course }: EligibilityProps) {
  return (
    <section className="bg-light-gray py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-gold" />
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              Eligibility
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Who Can Enroll?
          </h2>
          <p className="text-text-gray leading-relaxed">
            Check if you meet the eligibility criteria for this course. We welcome
            students from diverse backgrounds who are passionate about learning and
            building their career.
          </p>
        </div>
        <div className="space-y-3">
          {course.eligibility.map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
              <CheckCircle className="w-5 h-5 text-green shrink-0 mt-0.5" />
              <span className="text-text-dark font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
