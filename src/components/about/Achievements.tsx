import { Trophy, Medal, Award, Handshake, Newspaper, TrendingUp } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Best Computer Institute Award",
    description:
      "Recognized as the Best Computer Education Institute in the region for three consecutive years (2022-2024) by the National Education Excellence Forum.",
    year: "2024",
  },
  {
    icon: Medal,
    title: "Top Placement Record",
    description:
      "Achieved the highest placement rate among peer institutes with 95% of our graduates securing employment within 3 months of course completion.",
    year: "2023",
  },
  {
    icon: Award,
    title: "ISO 9001:2015 Certified",
    description:
      "Received ISO 9001:2015 certification for our quality management systems, reflecting our commitment to maintaining international standards in education.",
    year: "2021",
  },
  {
    icon: Handshake,
    title: "50+ Industry Partnerships",
    description:
      "Established strategic partnerships with over 50 leading companies including TCS, Infosys, Wipro, HCL, and Tech Mahindra for student placements and internships.",
    year: "2023",
  },
  {
    icon: Newspaper,
    title: "Media Recognition",
    description:
      "Featured in leading national publications and education portals for our innovative teaching methodology and outstanding student success stories.",
    year: "2022",
  },
  {
    icon: TrendingUp,
    title: "5000+ Students Trained",
    description:
      "Crossed the milestone of training over 5,000 students across various professional courses, with alumni working in top companies across India and abroad.",
    year: "2024",
  },
];

export default function Achievements() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Our Pride
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Our Achievements & Recognitions
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            Milestones that reflect our dedication to excellence in education and
            student success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className="bg-light-gray rounded-xl p-6 hover:shadow-lg transition-all group border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                  <achievement.icon className="w-6 h-6 text-gold" />
                </div>
                <span className="text-gold font-bold text-sm bg-gold/10 px-3 py-1 rounded-full">
                  {achievement.year}
                </span>
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{achievement.title}</h3>
              <p className="text-text-gray text-sm leading-relaxed">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
