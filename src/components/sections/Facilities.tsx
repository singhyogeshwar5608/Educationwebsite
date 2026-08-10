import {
  MonitorSmartphone,
  Computer,
  Wifi,
  Library,
  Projector,
  GraduationCap,
} from "lucide-react";

const facilities = [
  {
    icon: MonitorSmartphone,
    title: "Smart Classrooms",
    description: "Interactive and modern learning environment with smart boards and audio-visual aids.",
  },
  {
    icon: Computer,
    title: "Computer Labs",
    description: "High-performance computer systems with latest software for practical training.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi Campus",
    description: "High speed internet access available for all students across the campus.",
  },
  {
    icon: Library,
    title: "Digital Library",
    description: "Access to thousands of e-books, study materials, and educational resources.",
  },
  {
    icon: Projector,
    title: "Project Based Learning",
    description: "Real-world projects for practical knowledge and hands-on experience.",
  },
  {
    icon: GraduationCap,
    title: "Career Guidance",
    description: "Expert counseling and mentorship for a bright and successful career.",
  },
];

export default function Facilities() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            World-Class Infrastructure & Facilities
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            We provide everything you need for a better learning experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div
              key={facility.title}
              className="bg-light-gray rounded-xl p-6 hover:shadow-lg transition-all group border border-gray-100"
            >
              <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
                <facility.icon className="w-7 h-7 text-navy group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{facility.title}</h3>
              <p className="text-text-gray text-sm leading-relaxed">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
