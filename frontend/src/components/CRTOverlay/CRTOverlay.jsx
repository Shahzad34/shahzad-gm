import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import styles from "./CRTOverlay.module.css";

/**
 * A fixed, pointer-events-none overlay applied above the whole app —
 * scanlines, a subtle vignette, and an occasional flicker pulse. Purely
 * decorative, so it disables its animation under prefers-reduced-motion
 * (the static scanline texture stays, since it doesn't move).
 */
export default function CRTOverlay() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.scanlines} />
      <div className={styles.vignette} />
      {!reducedMotion && <div className={styles.flicker} />}
    </div>
  );
}
