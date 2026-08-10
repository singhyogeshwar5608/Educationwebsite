import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import GalleryHero from "@/components/sections/gallery/GalleryHero";
import Gallery from "@/components/sections/Gallery";

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <GalleryHero />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
