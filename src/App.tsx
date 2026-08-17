import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Results from "@/pages/Results";
import Contact from "@/pages/Contact";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/NotFound";
import AdminApp from "@/admin/AdminApp";
import { AdmissionProvider } from "@/components/admission/AdmissionModal";

export default function App() {
  return (
    <AdmissionProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
        <Route path="/results" element={<Results />} />
        <Route path="/verification" element={<Navigate to="/results" replace />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdmissionProvider>
  );
}
