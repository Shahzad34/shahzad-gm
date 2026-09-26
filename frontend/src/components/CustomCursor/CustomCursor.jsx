import { useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    // Skip on touch devices even if the viewport is wide
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    function onMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    function loop() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(loop);
    }

    function onEnter(e) {
      if (e.target.closest?.("a, button, [data-cursor='pointer']")) {
        ring.classList.add(styles.ringActive);
      }
    }
    function onLeave(e) {
      if (e.target.closest?.("a, button, [data-cursor='pointer']")) {
        ring.classList.remove(styles.ringActive);
      }
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    const raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
