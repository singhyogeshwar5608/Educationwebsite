import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-light-gray">
        <div className="text-center py-20 px-4">
          <div className="w-24 h-24 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchX className="w-12 h-12 text-navy/30" />
          </div>
          <h1 className="text-6xl font-extrabold text-navy mb-4">404</h1>
          <h2 className="text-2xl font-bold text-navy mb-3">Page Not Found</h2>
          <p className="text-text-gray max-w-md mx-auto mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
