import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import styles from "./Stats.module.css";

const STATS = [
  { value: 10, suffix: "+", label: "Projects" },
  { value: 15, suffix: "+", label: "Technologies" },
  { value: 100, suffix: "%", label: "Passion" },
];

function Counter({ value, suffix, active, reducedMotion }) {
  const [display, setDisplay] = useState(reducedMotion ? value : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current || reducedMotion) return;
    startedRef.current = true;

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [active, value, reducedMotion]);

  return (
    <span className={styles.value}>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [ref, visible] = useReveal();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div ref={ref} className={styles.stats}>
      {STATS.map((s) => (
        <div key={s.label} className={`glass ${styles.card}`}>
          <Counter value={s.value} suffix={s.suffix} active={visible} reducedMotion={reducedMotion} />
          <span className={styles.label}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
