import { useState, useEffect, useRef } from "react";
import { Users, BookOpen, Award, TrendingUp, Calendar, GraduationCap } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: string;
  label: string;
  gradient: string;
  iconBg: string;
  cardBg: string;
}

const stats: StatItem[] = [
  {
    icon: GraduationCap,
    value: "5000+",
    label: "Students Trained",
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    cardBg: "from-white to-cyan-50",
  },
  {
    icon: BookOpen,
    value: "40+",
    label: "Professional Courses",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    cardBg: "from-white to-violet-50",
  },
  {
    icon: Award,
    value: "15+",
    label: "Expert Trainers",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
    cardBg: "from-white to-amber-50",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Success Rate",
    gradient: "from-emerald-500 to-green-600",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    cardBg: "from-white to-emerald-50",
  },
  {
    icon: Calendar,
    value: "10+",
    label: "Years of Excellence",
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
    cardBg: "from-white to-pink-50",
  },
];

function useCounter(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!trigger || started.current) return;
    started.current = true;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return count;
}

function CountUp({ value, trigger, className }: { value: string; trigger: boolean; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return <span className={className}>{value}</span>;
  const target = parseInt(match[1]);
  const suffix = match[2];
  const count = useCounter(target, 2000, trigger);
  return <span className={className}>{count}{suffix}</span>;
}

export default function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-navy py-12 sm:py-16 lg:py-20 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <h2 className="text-base sm:text-2xl lg:text-4xl font-bold text-white whitespace-nowrap">
            Our Achievements in Numbers
          </h2>
          <p className="text-blue-200/80 text-[10px] sm:text-xs lg:text-base whitespace-nowrap overflow-hidden text-ellipsis mt-1 sm:mt-2">
            Trusted by thousands of students for quality education and career growth.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative group"
            >
              <div className={`relative bg-gradient-to-br ${stat.cardBg} rounded-2xl p-3 sm:p-4 lg:p-6 text-center border border-gray-100/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col items-center justify-center`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4 shadow-md group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                  <div className={`w-full h-full ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                </div>
                <CountUp
                  value={stat.value}
                  trigger={isVisible}
                  className={`text-xl sm:text-2xl lg:text-4xl font-bold mb-0.5 sm:mb-1 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                />
                <p className="text-gray-500 text-[10px] sm:text-xs lg:text-sm font-medium whitespace-nowrap">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
