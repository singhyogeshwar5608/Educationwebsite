import { CheckCircle, AlertCircle } from "lucide-react";
import { Course } from "@/data/courses";

interface EligibilityProps {
  course: Course;
}

export default function Eligibility({ course }: EligibilityProps) {
  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Eligibility */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-gold" />
              <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
                Eligibility
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
              Who Can Enroll?
            </h2>
            <p className="text-text-gray leading-relaxed mb-6">
              Check if you meet the eligibility criteria for this course. We welcome
              students from diverse backgrounds who are passionate about learning and
              building their career.
            </p>
            <div className="space-y-3">
              {course.eligibility.map((item, index) => (
                <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green shrink-0 mt-0.5" />
                  <span className="text-text-dark font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career Opportunities */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green" />
              <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
                Career Paths
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-6">
              Career Opportunities
            </h2>
            <p className="text-text-gray leading-relaxed mb-6">
              Explore the exciting career paths and salary ranges that open up after
              completing this course. Our placement cell helps you secure the best
              positions in the industry.
            </p>
            <div className="space-y-3">
              {course.careerOpportunities.map((career, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-navy font-bold text-sm">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <span className="text-navy font-semibold text-sm">{career.title}</span>
                  </div>
                  <span className="text-green font-bold text-sm whitespace-nowrap">{career.salary}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
