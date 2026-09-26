import { timeline } from "../../data/journey.js";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./ExperienceTimeline.module.css";

function TimelineItem({ item, index }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`${styles.item} ${visible ? styles.itemVisible : ""}`} style={{ transitionDelay: `${index * 60}ms` }}>
      <div className={styles.marker}>
        <span className={styles.dot} />
      </div>
      <div className={`glass ${styles.content}`}>
        <span className={styles.year}>{item.year}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.detail}>{item.detail}</p>
      </div>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <section id="journey" className="section">
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Journey</span>
          <h2 className="section-title">
            How I got <span>here</span>
          </h2>
          <p className="section-subtitle">
            A path through several stacks before settling on MERN as my primary toolkit.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.spine} aria-hidden="true" />
          {timeline.map((item, i) => (
            <TimelineItem key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
