import { CheckCircle } from "lucide-react";

const features = [
  "Experienced & Certified Trainers",
  "Practical & Live Project Training",
  "Updated Curriculum",
  "Placement Assistance",
  "Modern Computer Labs",
  "Personalized Guidance",
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://sfile.chatglm.cn/images-ppt/1429a813450d.jpg"
                alt="Students working together in a modern computer lab"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-5 -right-5 bg-gold text-navy rounded-xl p-5 shadow-xl">
              <p className="text-3xl font-bold">10+</p>
              <p className="text-sm font-semibold">Years of</p>
              <p className="text-sm font-semibold">Excellence</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
              We Provide The Best Learning Experience
            </h2>
            <p className="text-text-gray leading-relaxed mb-8">
              At Future Skills Institute, we are committed to providing quality
              education and practical training to help students achieve their
              dreams. Our experienced trainers, modern infrastructure, and
              industry-focused curriculum make us the preferred choice for
              thousands of students.
            </p>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green shrink-0" />
                  <span className="text-text-dark font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-lg mt-8 transition-all hover:shadow-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
