import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Tool from "./pages/Tool";
import Info from "./pages/Info";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Privacy from "./pages/Privacy";
import Over from "./pages/Over";
import Tarieven from "./pages/Tarieven";
import Afspraak from "./pages/Afspraak";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tool" element={<Tool />} />
            <Route path="/informatie" element={<Info />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/over-ons" element={<Over />} />
            <Route path="/tarieven" element={<Tarieven />} />
            <Route path="/afspraak" element={<Afspraak />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
