import {
  MonitorSmartphone,
  Computer,
  Wifi,
  Library,
  Projector,
  GraduationCap,
  Coffee,
  Shield,
} from "lucide-react";

const campusFacilities = [
  {
    icon: MonitorSmartphone,
    title: "Smart Classrooms",
    description:
      "Interactive learning spaces equipped with smart boards, projectors, and audio-visual systems for an engaging educational experience.",
  },
  {
    icon: Computer,
    title: "Advanced Computer Labs",
    description:
      "Three dedicated labs with 100+ high-performance systems, latest software installations, and individual workstations for every student.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Enabled Campus",
    description:
      "High-speed 100 Mbps internet connectivity across the entire campus, ensuring seamless access to online resources and learning materials.",
  },
  {
    icon: Library,
    title: "Digital Library & Resource Center",
    description:
      "Extensive collection of e-books, video tutorials, research papers, and industry journals accessible to students round the clock.",
  },
  {
    icon: Projector,
    title: "Seminar & Workshop Hall",
    description:
      "A 200-seat capacity hall for guest lectures, industry workshops, seminars, and placement drives with full multimedia support.",
  },
  {
    icon: GraduationCap,
    title: "Placement & Career Cell",
    description:
      "Dedicated career guidance center with resume building, mock interviews, and direct connections to 50+ recruiting companies.",
  },
  {
    icon: Coffee,
    title: "Student Common Room",
    description:
      "A comfortable space for students to relax, collaborate on projects, and network with peers between classes.",
  },
  {
    icon: Shield,
    title: "CCTV & Security",
    description:
      "24/7 CCTV surveillance and security personnel ensuring a safe and secure learning environment for all students and staff.",
  },
];

export default function CampusFacilities() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Infrastructure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Our Campus Facilities
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            A well-equipped campus designed to provide the best learning
            experience with modern amenities and resources.
          </p>
        </div>

        {/* Same card pattern as homepage Facilities */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {campusFacilities.map((facility) => (
            <div
              key={facility.title}
              className="bg-light-gray rounded-xl p-6 hover:shadow-lg transition-all group border border-gray-100"
            >
              <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                <facility.icon className="w-7 h-7 text-navy group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{facility.title}</h3>
              <p className="text-text-gray text-sm leading-relaxed">
                {facility.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
