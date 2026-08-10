import { Building2, Monitor, Cpu, Shield, Globe, Briefcase } from "lucide-react";

const partners = [
  { name: "TCS", icon: Building2, color: "bg-blue-500" },
  { name: "Infosys", icon: Globe, color: "bg-blue-600" },
  { name: "Wipro", icon: Monitor, color: "bg-emerald-500" },
  { name: "HCL", icon: Cpu, color: "bg-purple-500" },
  { name: "Tech Mahindra", icon: Briefcase, color: "bg-red-500" },
  { name: "Cognizant", icon: Shield, color: "bg-amber-500" },
  { name: "TCS", icon: Building2, color: "bg-blue-500" },
  { name: "Infosys", icon: Globe, color: "bg-blue-600" },
  { name: "Wipro", icon: Monitor, color: "bg-emerald-500" },
  { name: "HCL", icon: Cpu, color: "bg-purple-500" },
  { name: "Tech Mahindra", icon: Briefcase, color: "bg-red-500" },
  { name: "Cognizant", icon: Shield, color: "bg-amber-500" },
];

export default function PlacementPartners() {
  return (
    <section className="bg-white py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Our Placement Partners
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Top Companies Recruit Our Students
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex gap-6 animate-marquee-partners" style={{ width: "max-content" }}>
          {partners.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="shrink-0 bg-gray-50 rounded-2xl border border-gray-100 px-8 py-6 flex flex-col items-center gap-3 min-w-[150px] hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
            >
              <div className={`w-12 h-12 ${p.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <p.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold text-navy tracking-tight">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-partners {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-partners {
          animation: marquee-partners 30s linear infinite;
        }
        .animate-marquee-partners:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
