import { useEffect, useRef } from "react";
import { useProgressStore } from "./progressStore.jsx";
import styles from "./HUD.module.css";

/**
 * Reads `store.progress` on a requestAnimationFrame loop and writes
 * directly to the bar's inline style — no React state, so this updates at
 * 60fps without re-rendering the rest of the HUD.
 */
export default function ScrollHealthBar() {
  const store = useProgressStore();
  const fillRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    let raf;
    const tick = () => {
      const pct = Math.round(store.progress * 100);
      if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      if (labelRef.current) labelRef.current.textContent = `${pct}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [store]);

  return (
    <div className={styles.healthBarWrap} aria-hidden="true">
      <div className={styles.healthBarLabel}>
        <span>SCROLL PROGRESS</span>
        <span ref={labelRef}>0%</span>
      </div>
      <div className={styles.healthBarTrack}>
        <div ref={fillRef} className={styles.healthBarFill} style={{ width: "0%" }} />
        <div className={styles.healthBarTicks} />
      </div>
    </div>
  );
}
