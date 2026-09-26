import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import BackgroundEffects from "./components/BackgroundEffects/BackgroundEffects.jsx";
import CustomCursor from "./components/CustomCursor/CustomCursor.jsx";
import CRTOverlay from "./components/CRTOverlay/CRTOverlay.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import AboutPage from "./pages/About.jsx";
import SkillsPage from "./pages/Skills.jsx";
import ProjectsPage from "./pages/Projects.jsx";
import ContactPage from "./pages/Contact.jsx";
import AdminPage from "./pages/Admin.jsx";

/**
 * The public site: ambient background, custom cursor, CRT overlay, navbar and
 * footer, plus the five public routes. Extracted from App so the admin panel
 * can render as a plain dashboard with none of that decorative chrome —
 * while still sharing the tokens, fonts and utility classes from index.css.
 */
function PublicSite({ heroReveal }) {
  return (
    <>
      <BackgroundEffects />
      <CustomCursor />
      <CRTOverlay />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home heroReveal={heroReveal} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const [heroReveal, setHeroReveal] = useState(false);

  /**
   * There is exactly ONE loading screen, and it has to live in index.html
   * so it can paint before React mounts (that's what removes the white
   * flash). React therefore renders nothing on top of it — it just listens
   * for the splash to report that the wipe has begun, which is the cue for
   * the Hero to start its entrance as the screen opens.
   *
   * The sticky `revealed` / `done` flags on window.__BOOT__ cover the race
   * where the splash finishes before this effect has attached its listeners.
   */
  useEffect(() => {
    const reveal = () => setHeroReveal(true);
    const done = () => setHeroReveal(true);

    if (window.__BOOT__?.revealed) reveal();
    if (window.__BOOT__?.done) done();

    window.addEventListener("boot:reveal", reveal);
    window.addEventListener("boot:done", done);
    return () => {
      window.removeEventListener("boot:reveal", reveal);
      window.removeEventListener("boot:done", done);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin panel — no loader chrome, no cursor/CRT effects, no nav/footer. */}
        <Route path="/admin/*" element={<AdminPage />} />
        {/* Everything else is the public site. */}
        <Route path="*" element={<PublicSite heroReveal={heroReveal} />} />
      </Routes>
    </>
  );
}
