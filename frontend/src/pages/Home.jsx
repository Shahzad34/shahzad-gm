import Hero from "../components/Hero/Hero.jsx";
import Globe from "../components/Globe/Globe.jsx";
import About from "../components/About/About.jsx";
import Projects from "../components/Projects/Projects.jsx";
import Services from "../components/Services/Services.jsx";
import ExperienceTimeline from "../components/ExperienceTimeline/ExperienceTimeline.jsx";
import GithubActivity from "../components/GithubActivity/GithubActivity.jsx";
import Contact from "../components/Contact/Contact.jsx";

// GameShowcase (the standalone HP/XP scroller section) has been removed
// from the page flow — its "PLAYER 1: SHAHZAD" content now lives in the
// Hero itself, and its 3D-scroll spirit continues there via the
// LightSweep + useScrollTilt effects. The component files are untouched
// under components/GameShowcase/ if you want to reuse them elsewhere.
//
// TechStack has also been removed from the page flow — it duplicated the
// same Development/Security/Backend icons Hero's own floating badges
// already showed, stacking a near-identical row of icons + line right
// under Hero's own social dock. The component file is untouched under
// components/TechStack/ if you want to bring it back somewhere else.
//
// Hero is now a single-viewport section: its rotating roles run on a calm
// auto-advancing slide/fade rotator (see components/Hero/Hero.jsx) instead
// of the old 300vh scroll-pinned profile switcher, so the page scrolls
// straight from the portrait into the rest of the story.
//
// Globe (the rotating 3D "world" sphere) is back in the flow, right
// after the Hero — restored on request, now with a mouse-hover tilt
// interaction (see components/Globe/Globe.jsx).
export default function Home({ heroReveal }) {
  return (
    <>
      <Hero reveal={heroReveal} />
      <Globe />
      <About />
      <Projects limit={3} />
      <Services />
      <ExperienceTimeline />
      <GithubActivity />
      <Contact />
    </>
  );
}
