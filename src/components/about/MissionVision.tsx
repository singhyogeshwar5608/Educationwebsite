import { Target, Eye, Lightbulb } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To provide accessible, affordable, and industry-relevant education that empowers individuals with practical skills and knowledge. We strive to bridge the gap between academic learning and professional requirements, ensuring every student is equipped to succeed in their chosen career path. Our commitment extends beyond the classroom — we provide lifelong support, mentorship, and placement assistance to help our students achieve their full potential.",
    color: "bg-navy",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become the most trusted and respected skill development institute in India, recognized for producing job-ready professionals who contribute meaningfully to the digital economy. We envision a future where every young person, regardless of their background, has access to quality education that transforms their life. Our goal is to expand our reach to underserved communities and create a skilled workforce that drives innovation and growth across the nation.",
    color: "bg-navy-light",
  },
  {
    icon: Lightbulb,
    title: "Our Values",
    description:
      "Integrity, excellence, and student-centricity form the foundation of everything we do. We believe in transparent practices, continuous improvement, and putting our students first. Our values guide our curriculum design, our teaching methodology, and our relationships with industry partners. We foster a culture of respect, collaboration, and innovation that prepares our students not just for jobs, but for leadership roles in their fields.",
    color: "bg-green",
  },
];

export default function MissionVision() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Our Purpose
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Mission, Vision & Values
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            The guiding principles that drive our commitment to educational
            excellence and student success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-light-gray rounded-xl p-6 hover:shadow-lg transition-all group border border-gray-100"
            >
              <div
                className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{item.title}</h3>
              <p className="text-text-gray text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
