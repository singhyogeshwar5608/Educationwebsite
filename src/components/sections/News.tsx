import { Calendar, ArrowRight } from "lucide-react";

const newsItems = [
  {
    date: "15 May, 2025",
    title: "New Batch Announcement",
    description: "Admissions open for ADCA & DCA new batches. Enroll now and start your journey towards a successful career in IT.",
    image: "https://sfile.chatglm.cn/images-ppt/77e327810525.jpg",
  },
  {
    date: "6 May, 2025",
    title: "Workshop on AI Tools",
    description: "Free workshop on AI tools for students this weekend. Learn about the latest AI technologies and their applications.",
    image: "https://sfile.chatglm.cn/images-ppt/33d375aa603a.jpg",
  },
  {
    date: "20 Apr, 2025",
    title: "Exam Schedule Published",
    description: "May 2025 exam schedule has been published. Students can check their exam dates and prepare accordingly.",
    image: "https://sfile.chatglm.cn/images-ppt/9d788bebbc5e.jpg",
  },
  {
    date: "10 Apr, 2025",
    title: "Holiday Notice",
    description: "Institute will remain closed on 1st May on Labour Day. Regular classes will resume from 2nd May onwards.",
    image: "https://sfile.chatglm.cn/images-ppt/bd95255a7d29.jpg",
  },
];

export default function News() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Latest Updates
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Latest News & Events
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Stay updated with the latest happenings at Future Skills Institute.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newsItems.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-text-gray text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                <p className="text-text-gray text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-navy-light transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
