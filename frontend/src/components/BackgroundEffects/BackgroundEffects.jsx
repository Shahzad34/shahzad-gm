import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import styles from "./BackgroundEffects.module.css";

export default function BackgroundEffects() {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];
    // Tier 3 — a light dusting, not a starfield.
    const count = isMobile ? 14 : 32;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.4,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        accent: Math.random() > 0.8 ? "purple" : Math.random() > 0.5 ? "cyan" : "dust",
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.accent === "purple"
            ? "rgba(176, 38, 255, 0.34)"
            : p.accent === "cyan"
            ? "rgba(0, 240, 255, 0.32)"
            : "rgba(139, 147, 167, 0.22)";
        if (p.accent !== "dust") {
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.accent === "purple" ? "rgba(176, 38, 255, 0.45)" : "rgba(0, 240, 255, 0.45)";
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    resize();
    init();
    tick();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, isMobile]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.glow1} />
      <div className={styles.glow2} />
      {!reducedMotion && <canvas ref={canvasRef} className={styles.canvas} />}
    </div>
  );
}
