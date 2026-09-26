import About from "../components/About/About.jsx";
import ExperienceTimeline from "../components/ExperienceTimeline/ExperienceTimeline.jsx";
import Services from "../components/Services/Services.jsx";

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <About />
      <ExperienceTimeline />
      <Services />
    </div>
  );
}
