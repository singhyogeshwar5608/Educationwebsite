import { Award, Star } from "lucide-react";
import { Course } from "@/data/courses";

interface TrainerCardProps {
  course: Course;
}

export default function TrainerCard({ course }: TrainerCardProps) {
  const { trainer } = course;

  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Your Instructor
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Meet Your Trainer
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Learn from industry experts with years of real-world experience.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="grid sm:grid-cols-[200px_1fr] gap-0">
              {/* Trainer Image */}
              <div className="relative h-56 sm:h-auto">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Trainer Info */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-navy">{trainer.name}</h3>
                </div>
                <p className="text-navy-light font-semibold text-sm mb-2">{trainer.title}</p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-sm text-text-gray">
                    <Award className="w-4 h-4 text-gold" />
                    <span>{trainer.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-medium text-navy">{course.rating}</span>
                    <span className="text-text-gray">Rating</span>
                  </div>
                </div>

                <p className="text-sm text-text-gray font-semibold mb-2">Specializations:</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="bg-navy/10 text-navy text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
