import { ArrowRight } from "lucide-react";

const galleryImages = [
  {
    src: "https://sfile.chatglm.cn/images-ppt/77e327810525.jpg",
    alt: "Classroom session in progress",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/ba342229ab25.jpg",
    alt: "Students in computer lab",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/bd95255a7d29.jpg",
    alt: "Institute campus building",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/0e22043a8aef.jpg",
    alt: "Graduation celebration",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/9bebb30c9383.jpg",
    alt: "Library and study area",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/1429a813450d.jpg",
    alt: "Students collaborating on project",
  },
];

export default function GalleryPreview() {
  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
            A Glimpse of Our Campus
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            Explore the vibrant spaces where learning comes to life at Future
            Skills Institute.
          </p>
        </div>

        {/* Same grid pattern as homepage Gallery */}
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
            href="/#gallery"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            View Full Gallery
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
