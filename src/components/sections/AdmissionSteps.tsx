import { BookOpen, FileText, CheckCircle, Rocket } from "lucide-react";

const steps = [
  {
    icon: BookOpen,
    step: "01",
    title: "Choose Your Course",
    description: "Browse our courses and select the one that matches your career goals.",
  },
  {
    icon: FileText,
    step: "02",
    title: "Submit Your Details",
    description: "Fill the admission form with your personal and educational details.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Confirmation From Institute",
    description: "Receive confirmation and batch details from our admissions team.",
  },
  {
    icon: Rocket,
    step: "04",
    title: "Start Your Classes",
    description: "Begin your learning journey with expert trainers and practical training.",
  },
];

export default function AdmissionSteps() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Admission Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Simple Steps To Get Admission
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Getting admission is easy. Follow these simple steps to start your
            journey.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative text-center group">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-navy/10 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-navy transition-colors">
                  <step.icon className="w-8 h-8 text-navy group-hover:text-white transition-colors" />
                </div>
                <span className="inline-block bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Step {step.step}
                </span>
                <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-text-gray text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
