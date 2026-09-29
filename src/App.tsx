import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ProjectsPage from "./pages/ProjectsPage";
import DivisionsPage from "./pages/DivisionsPage";
import GalleryPage from "./pages/GalleryPage";
import BlogPage from "./pages/BlogPage";
import CareerPage from "./pages/CareerPage";
import ContactPageV2 from "./pages/ContactPageV2";
import ScrollToTop from "./components/ScrollToTop";
import ToonHubPage from "./pages/ToonHubPage";
import HomePageV2 from "./pages/HomePageV2";
import CareerPageV2 from "./pages/CareerPageV2";
import BlogPageV2 from "./pages/BlogPageV2";
import BlogPostPageV2 from "./pages/BlogPostPageV2";
import ServicesPageV2 from "./pages/ServicesPageV2";
import AboutPageV2 from "./pages/AboutPageV2";
import ProjectsPageV2 from "./pages/ProjectsPageV2";
import ProjectDetailPageV2 from "./pages/ProjectDetailPageV2";
import GalleryPageV2 from "./pages/GalleryPageV2";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/divisions" element={<DivisionsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/career" element={<CareerPage />} />
          </Route>
          <Route path="/" element={<HomePageV2 />} />
          <Route path="/home-02" element={<HomePageV2 />} />
          <Route path="/home-02/contact" element={<ContactPageV2 />} />
          <Route path="/home-02/career" element={<CareerPageV2 />} />
          <Route path="/home-02/blog" element={<BlogPageV2 />} />
          <Route path="/home-02/blog/:slug" element={<BlogPostPageV2 />} />
          <Route path="/home-02/services" element={<ServicesPageV2 />} />
          <Route path="/home-02/about" element={<AboutPageV2 />} />
          <Route path="/home-02/projects" element={<ProjectsPageV2 />} />
          <Route path="/home-02/projects/:slug" element={<ProjectDetailPageV2 />} />
          <Route path="/home-02/gallery" element={<GalleryPageV2 />} />
          <Route path="/toonhub" element={<ToonHubPage />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
