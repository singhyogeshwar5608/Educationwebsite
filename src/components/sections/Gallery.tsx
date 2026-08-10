import { ArrowRight } from "lucide-react";
import imgClassroom from "@/assets/banner-images/courses_hero_students.jpg";
import imgLab from "@/assets/banner-images/ChatGPT Image Jul 29, 2026, 03_19_44 PM.png";
import imgCampus from "@/assets/banner-images/ChatGPT Image Jul 29, 2026, 01_37_00 PM.png";
import imgCourses from "@/assets/banner-images/COURSE.png";
import imgResults from "@/assets/banner-images/results.png";
import imgAchievements from "@/assets/banner-images/mobile result.png";

const galleryImages = [
  {
    src: imgClassroom,
    alt: "Students in classroom",
  },
  {
    src: imgLab,
    alt: "Computer lab training",
  },
  {
    src: imgCampus,
    alt: "Institute campus",
  },
  {
    src: imgCourses,
    alt: "Course offerings",
  },
  {
    src: imgResults,
    alt: "Student results",
  },
  {
    src: imgAchievements,
    alt: "Student achievements",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-light-gray pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[70px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Moments From Our Institute
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            A glimpse of life at Z-TECH CAREER ACADEMY.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {galleryImages.map((image, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden group aspect-[4/3]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#gallery"
            className="inline-flex items-center gap-2 text-navy hover:text-navy-light font-semibold transition-colors"
          >
            View More Photos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
