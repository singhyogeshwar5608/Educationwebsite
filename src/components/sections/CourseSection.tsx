import { Clock, IndianRupee, Star, ArrowRight } from "lucide-react";

const courses = [
  {
    title: "ADCA",
    subtitle: "Advanced Diploma in Computer Application",
    duration: "12 Months",
    price: "15,000",
    rating: 4.8,
    image: "https://sfile.chatglm.cn/images-ppt/ba342229ab25.jpg",
  },
  {
    title: "DCA",
    subtitle: "Diploma in Computer Application",
    duration: "6 Months",
    price: "8,000",
    rating: 4.7,
    image: "https://sfile.chatglm.cn/images-ppt/85b423e9c62e.jpg",
  },
  {
    title: "Tally Prime",
    subtitle: "Accounting with Tally Prime",
    duration: "3 Months",
    price: "5,000",
    rating: 4.9,
    image: "https://sfile.chatglm.cn/images-ppt/38daa6816f14.jpg",
  },
  {
    title: "Digital Marketing",
    subtitle: "Master Digital Marketing From Scratch",
    duration: "6 Months",
    price: "12,000",
    rating: 4.8,
    image: "https://sfile.chatglm.cn/images-ppt/324bd010acd4.jpg",
  },
  {
    title: "Web Development",
    subtitle: "Learn Frontend & Backend Development",
    duration: "6 Months",
    price: "15,000",
    rating: 4.9,
    image: "https://sfile.chatglm.cn/images-ppt/f3adb7c37487.jpg",
  },
];

function CourseCard({
  course,
}: {
  course: (typeof courses)[0];
}) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-navy text-white text-xs font-semibold px-2.5 py-1 rounded-full">
          {course.duration}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-navy mb-1">{course.title}</h3>
        <p className="text-sm text-text-gray mb-3">{course.subtitle}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4 text-green" />
            <span className="text-xl font-bold text-navy">{course.price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-medium text-text-dark">{course.rating}</span>
          </div>
        </div>
        <a
          href="#courses"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function CourseSection() {
  return (
    <section id="courses" className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            Explore Our Top Courses
          </h2>
          <p className="text-text-gray text-lg max-w-2xl mx-auto">
            Choose from industry-relevant courses and start your journey towards a
            better future.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {courses.map((course) => (
            <CourseCard key={course.title} course={course} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a
            href="#courses"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
