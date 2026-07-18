import { ArrowRight } from "lucide-react";

const galleryImages = [
  {
    src: "https://sfile.chatglm.cn/images-ppt/77e327810525.jpg",
    alt: "Students in classroom",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/9d788bebbc5e.jpg",
    alt: "Group discussion session",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/ba342229ab25.jpg",
    alt: "Computer lab training",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/bd95255a7d29.jpg",
    alt: "Campus building",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/33178661e549.jpg",
    alt: "Teacher in classroom",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/0e22043a8aef.jpg",
    alt: "Graduation ceremony",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
