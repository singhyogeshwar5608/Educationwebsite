import { CheckCircle } from "lucide-react";

const reasons = [
  {
    title: "Experienced & Certified Trainers",
    description:
      "Our faculty consists of industry professionals with years of practical experience and recognized certifications in their respective fields.",
  },
  {
    title: "Practical & Live Project Training",
    description:
      "Every course includes hands-on projects that simulate real-world scenarios, giving students the confidence and skills employers demand.",
  },
  {
    title: "Government Certified Courses",
    description:
      "All our courses are recognized and certified by government bodies, ensuring your credentials are valid and respected across India.",
  },
  {
    title: "Placement Assistance Program",
    description:
      "Our dedicated placement cell works with 50+ top companies to connect students with career opportunities that match their skills and aspirations.",
  },
  {
    title: "Affordable Fee Structure",
    description:
      "We believe quality education should be accessible to all. Our fees are among the most competitive in the industry with flexible payment options.",
  },
  {
    title: "Modern Infrastructure & Labs",
    description:
      "State-of-the-art computer labs, smart classrooms, high-speed Wi-Fi, and digital library resources create an ideal learning environment.",
  },
  {
    title: "Flexible Batch Timings",
    description:
      "Morning, afternoon, evening, and weekend batches accommodate students and working professionals alike, so you can learn at your pace.",
  },
  {
    title: "Lifetime Support & Alumni Network",
    description:
      "Once a part of Z-TECH CAREER ACADEMY, you receive lifetime access to our resources, alumni network, and career guidance — even after course completion.",
  },
];

export default function AboutWhyChooseUs() {
  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Our Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Why Choose Z-TECH CAREER ACADEMY?
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            Discover the reasons thousands of students trust us for their career
            growth and skill development.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100 group"
            >
              <div className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green group-hover:text-white transition-colors">
                <CheckCircle className="w-6 h-6 text-green group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-base font-bold text-navy mb-2">{reason.title}</h3>
              <p className="text-text-gray text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
