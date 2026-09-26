import { useEffect } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsapSetup.js";
import { LEVEL_BOUNDARIES, ARMORY_PROJECT_WINDOW, PROJECT_COUNT } from "./sceneConfig.js";

const [LEVEL_1_END, LEVEL_2_END] = LEVEL_BOUNDARIES;

/**
 * Pins `pinRef`'s content in place while the user scrolls through
 * `wrapperRef` (a tall spacer element), and scrubs `store.progress` from
 * 0 -> 1 across that scroll distance. Also derives the discrete
 * `store.level` (0/1/2) used by the HUD text, and `store.projectIndex`
 * (which holo-card is highlighted while inside the Armory state).
 */
export function useGameTimeline(wrapperRef, pinRef, store) {
  useEffect(() => {
    if (!wrapperRef.current || !pinRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Skip the scroll-jacked pin entirely; show a static Level 01 frame
      // and let the section scroll past normally.
      store.setProgress(0.05);
      store.setLevel(0);
      return;
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          store.setProgress(p);

          const level = p < LEVEL_1_END ? 0 : p < LEVEL_2_END ? 1 : 2;
          store.setLevel(level);

          if (level === 1) {
            const [start, end] = ARMORY_PROJECT_WINDOW;
            const localT = Math.min(Math.max((p - start) / (end - start), 0), 0.999);
            store.setProjectIndex(Math.floor(localT * PROJECT_COUNT));
          }
        },
      });

      return () => trigger.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, [wrapperRef, pinRef, store]);
}
