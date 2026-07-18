import { Users, BookOpen, Award, TrendingUp, Calendar } from "lucide-react";

const stats = [
  { icon: Users, value: "5000+", label: "Students Trained" },
  { icon: BookOpen, value: "40+", label: "Professional Courses" },
  { icon: Award, value: "15+", label: "Expert Trainers" },
  { icon: TrendingUp, value: "95%", label: "Success Rate" },
  { icon: Calendar, value: "10+", label: "Years of Excellence" },
];

export default function Statistics() {
  return (
    <section className="bg-navy py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Achievements in Numbers
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Trusted by thousands of students for quality education and career growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors group"
            >
              <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                <stat.icon className="w-7 h-7 text-gold" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-blue-200 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
