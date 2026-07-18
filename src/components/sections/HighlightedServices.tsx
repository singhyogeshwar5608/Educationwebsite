"use client";

import {
  Monitor,
  FileSpreadsheet,
  Briefcase,
  Calculator,
  Layout,
  Keyboard,
  Plane,
  CreditCard,
  FileText,
  Globe,
  BookOpen,
  Train,
  Landmark,
  ArrowRight,
} from "lucide-react";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";

interface ServiceItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const leftColumn: ServiceItem[] = [
  {
    icon: Monitor,
    title: "Computer Basics",
    description: "Fundamental computer skills and digital literacy for beginners.",
  },
  {
    icon: FileSpreadsheet,
    title: "MS Office",
    description: "Master Word, Excel, PowerPoint for professional productivity.",
  },
  {
    icon: Briefcase,
    title: "Office Work Training",
    description: "Practical office management and administrative skills.",
  },
  {
    icon: Calculator,
    title: "Tally Prime",
    description: "Professional accounting and GST compliance with Tally.",
  },
  {
    icon: Layout,
    title: "DTP",
    description: "Desktop publishing for creative print and digital design.",
  },
  {
    icon: Keyboard,
    title: "Typing",
    description: "Speed and accuracy in Hindi & English typing skills.",
  },
];

const rightColumn: ServiceItem[] = [
  {
    icon: Plane,
    title: "Passport Services",
    description: "Online passport application and renewal assistance.",
  },
  {
    icon: CreditCard,
    title: "PAN Card Services",
    description: "New PAN card application and correction services.",
  },
  {
    icon: FileText,
    title: "Online Job Forms",
    description: "Application filling for government and private jobs.",
  },
  {
    icon: Globe,
    title: "Haryana Online Forms",
    description: "All Haryana government portal services and forms.",
  },
  {
    icon: BookOpen,
    title: "NIOS Board Forms",
    description: "NIOS admission and examination form filling services.",
  },
  {
    icon: Plane,
    title: "Air Ticket Booking",
    description: "Domestic and international flight booking services.",
  },
  {
    icon: Train,
    title: "Railway Ticket Booking",
    description: "IRCTC train ticket reservation and booking assistance.",
  },
  {
    icon: Landmark,
    title: "Other Government Services",
    description: "Aadhaar, voter ID, certificates and all online services.",
  },
];

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  return (
    <AnimateOnScroll delay={index * 60}>
      <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 hover:-translate-y-1 cursor-pointer">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300">
            <service.icon className="w-5 h-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-1 group-hover:text-gold transition-colors duration-300">
              {service.title}
            </h4>
            <p className="text-blue-100/70 text-xs leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

export default function HighlightedServices() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Gradient Background — Navy → Indigo → Purple using brand palette */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-[#2d1b69]" />

      {/* Soft glowing gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-navy/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-navy-light/30 rounded-full blur-[100px]" />
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-[#6d28d9]/10 rounded-full blur-[80px]" />

      {/* Decorative subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
              <Landmark className="w-4 h-4 text-gold" />
              <span className="text-white/90 text-sm font-semibold">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              More Than Just{" "}
              <span className="relative inline-block">
                Computer Courses
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 8C50 2 150 2 198 8" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <p className="text-blue-100/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              We provide professional computer education along with essential online
              government and digital services under one roof.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Two Columns */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column — Professional Computer Education */}
          <AnimateOnScroll>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <Monitor className="w-4 h-4 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Professional Computer Education
                </h3>
              </div>
              <div className="space-y-3">
                {leftColumn.map((service, index) => (
                  <ServiceCard key={service.title} service={service} index={index} />
                ))}
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right Column — Online & Digital Services */}
          <AnimateOnScroll delay={150}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-navy" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  Online &amp; Digital Services
                </h3>
              </div>
              <div className="space-y-3">
                {rightColumn.map((service, index) => (
                  <ServiceCard key={service.title} service={service} index={index} />
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Bottom CTA */}
        <AnimateOnScroll delay={200}>
          <div className="text-center mt-14">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-lg transition-all hover:shadow-xl hover:shadow-gold/20 text-lg"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
