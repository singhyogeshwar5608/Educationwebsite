import {
  ShieldCheck,
  Briefcase,
  Wallet,
  Building2,
  HeartHandshake,
  Clock,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, label: "Government Certified" },
  { icon: Briefcase, label: "Job Assistance Program" },
  { icon: Wallet, label: "Affordable Fees" },
  { icon: Building2, label: "Modern Infrastructure" },
  { icon: HeartHandshake, label: "Lifetime Support" },
  { icon: Clock, label: "Flexible Batches" },
];

export default function FeatureStrip() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-light-blue transition-colors group"
            >
              <div className="w-12 h-12 bg-navy/10 rounded-xl flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-colors">
                <feature.icon className="w-6 h-6 text-navy group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-text-dark text-center">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
