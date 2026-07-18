import { Course } from "@/data/courses";

interface CourseGalleryProps {
  course: Course;
}

export default function CourseGallery({ course }: CourseGalleryProps) {
  if (!course.gallery || course.gallery.length === 0) return null;

  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Course Gallery
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            A glimpse of what you will experience during this course.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {course.gallery.map((src, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden group aspect-[4/3]"
            >
              <img
                src={src}
                alt={`${course.title} gallery ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
