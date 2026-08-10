import {
  ShieldCheck,
  Briefcase,
  Wallet,
  Building2,
  HeartHandshake,
  Clock,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Government Certified", color: "bg-blue-500", shadow: "shadow-blue-200/50" },
  { icon: Briefcase, label: "Job Assistance Program", color: "bg-emerald-500", shadow: "shadow-emerald-200/50" },
  { icon: Wallet, label: "Affordable Fees", color: "bg-amber-500", shadow: "shadow-amber-200/50" },
  { icon: Building2, label: "Modern Infrastructure", color: "bg-purple-500", shadow: "shadow-purple-200/50" },
  { icon: HeartHandshake, label: "Lifetime Support", color: "bg-rose-500", shadow: "shadow-rose-200/50" },
  { icon: Clock, label: "Flexible Batches", color: "bg-cyan-500", shadow: "shadow-cyan-200/50" },
];

function FeatureItem({ icon: Icon, label, color }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group min-w-[150px] sm:min-w-[170px] hover:-translate-y-1">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-semibold text-text-dark text-center leading-snug">
        {label}
      </span>
    </div>
  );
}

export default function FeatureStrip() {
  const allItems = [...features, ...features, ...features, ...features];

  return (
    <section className="bg-light-gray border-y border-gray-100 overflow-hidden py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-marquee" style={{ width: "max-content" }}>
            {allItems.map((feature, idx) => (
              <FeatureItem key={`${feature.label}-${idx}`} icon={feature.icon} label={feature.label} color={feature.color} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
