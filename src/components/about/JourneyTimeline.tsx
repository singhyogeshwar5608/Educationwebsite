import { GraduationCap, Award, Users, Building2 } from "lucide-react";

const milestones = [
  {
    year: "2015",
    title: "Foundation Year",
    description:
      "Future Skills Institute was founded with a vision to provide quality computer education. Started with just 3 courses and a single classroom in Knowledge City.",
    icon: GraduationCap,
  },
  {
    year: "2016",
    title: "Government Recognition",
    description:
      "Received government certification for all courses, making our diplomas and certificates officially recognized across India. Enrolled our 500th student.",
    icon: Award,
  },
  {
    year: "2018",
    title: "Campus Expansion",
    description:
      "Expanded to a full campus with 5 smart classrooms, 2 computer labs, and a digital library. Introduced Digital Marketing and Web Development courses.",
    icon: Building2,
  },
  {
    year: "2020",
    title: "Online Learning Launch",
    description:
      "Adapted to the digital shift by launching online and hybrid learning options. Maintained 95% student satisfaction despite global challenges. Trained 2000+ students.",
    icon: Users,
  },
  {
    year: "2022",
    title: "Placement Milestone",
    description:
      "Achieved 1000+ successful student placements across top companies including TCS, Infosys, and Wipro. Partnered with 30+ companies for recruitment.",
    icon: Award,
  },
  {
    year: "2024",
    title: "10 Years of Excellence",
    description:
      "Celebrated a decade of educational excellence with 5000+ students trained, 40+ courses, 15+ expert trainers, and a growing alumni network of successful professionals.",
    icon: GraduationCap,
  },
];

export default function JourneyTimeline() {
  return (
    <section className="bg-navy py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative shapes - same as homepage Statistics */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-gold font-semibold text-sm uppercase tracking-wider">
            Our Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
            Our Journey Over The Years
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            From a small classroom to a leading institute — our growth story
            reflects our commitment to excellence.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${
                  index > 0 ? "lg:mt-0" : ""
                }`}
              >
                {/* Desktop: alternating left/right */}
                {index % 2 === 0 ? (
                  <>
                    {/* Left content */}
                    <div className="lg:text-right lg:pr-12 mb-6 lg:mb-0">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 inline-block text-left lg:text-right">
                        <div className="flex items-center gap-3 lg:justify-end mb-3">
                          <milestone.icon className="w-5 h-5 text-gold lg:order-2" />
                          <span className="text-gold font-bold text-lg">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-blue-200 text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    {/* Right spacer */}
                    <div className="hidden lg:block" />
                  </>
                ) : (
                  <>
                    {/* Left spacer */}
                    <div className="hidden lg:block" />
                    {/* Right content */}
                    <div className="lg:pl-12">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <milestone.icon className="w-5 h-5 text-gold" />
                          <span className="text-gold font-bold text-lg">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-blue-200 text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Center dot (desktop only) */}
                <div className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 bg-gold rounded-full items-center justify-center z-10">
                  <div className="w-2 h-2 bg-navy rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
