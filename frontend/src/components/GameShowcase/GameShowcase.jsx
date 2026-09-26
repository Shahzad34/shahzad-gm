import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import HUD from "./HUD.jsx";
import { ProgressProvider, useProgressStoreRef } from "./progressStore.jsx";
import { useGameTimeline } from "./useGameTimeline.js";
import styles from "./GameShowcase.module.css";

/**
 * A pinned, scroll-driven 3D showcase section:
 *  - `wrapperRef` is a tall spacer (400vh) that defines how much scroll
 *    distance the sequence spans.
 *  - `pinRef` is the actual 100vh viewport GSAP pins in place while the
 *    user scrolls through the wrapper.
 *  - `store` is a mutable, non-React-state object so the Three.js scene can
 *    read scroll progress every frame without re-rendering React.
 */
export default function GameShowcase() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const store = useProgressStoreRef();

  useGameTimeline(wrapperRef, pinRef, store);

  return (
    <section ref={wrapperRef} className={styles.wrapper} aria-label="Interactive 3D project showcase">
      <div ref={pinRef} className={styles.pin}>
        <ProgressProvider store={store}>
          <Canvas
            className={styles.canvas}
            camera={{ position: [0, 0.6, 5.5], fov: 45, near: 0.1, far: 40 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
          >
            <Experience />
          </Canvas>
          <HUD />
        </ProgressProvider>

        <div className={styles.vignette} aria-hidden="true" />
        <div className={styles.scanlines} aria-hidden="true" />
      </div>
    </section>
  );
}
