import { MapPin, Radar, Sparkles } from "lucide-react";
import Stats from "../Stats/Stats.jsx";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./About.module.css";

export default function About() {
  const [ref, visible] = useReveal();

  return (
    <section id="about" className="section">
      <div ref={ref} className={`container ${styles.grid} ${visible ? styles.visible : ""}`}>
        <div className={styles.copy}>
          <span className="eyebrow">About</span>
          <h2 className="section-title">
            Turning ideas into <span>working software</span>
          </h2>

          <p className={styles.lead}>
            I'm a full stack developer who enjoys the entire journey of building a product — from
            designing a database schema, to wiring up an API, to shipping an interface people
            actually enjoy using. My core stack is MongoDB, Express, React and Node, and I got
            there by way of PHP, MySQL, ASP.NET and Flutter.
          </p>
          <p className={styles.paragraph}>
            I care about clean architecture, readable code, and interfaces that feel fast and
            intentional — the details that separate a demo from a product.
          </p>

          <Stats />
        </div>

        <aside className={`glass ${styles.profileCard}`}>
          <div className={styles.profileGlow} aria-hidden="true" />
          <div className={styles.status}>
            <span className={styles.statusDot} />
            AVAILABLE FOR WORK
          </div>

          <div className={styles.avatar}>
            <span>SG</span>
          </div>

          <h3 className={styles.name}>Shahzad GM</h3>
          <p className={styles.role}>Full Stack Developer</p>

          <ul className={styles.metaList}>
            <li>
              <MapPin size={15} className={styles.metaIcon} />
              Remote / Open to relocation
            </li>
            <li>
              <Radar size={15} className={styles.metaIcon} />
              Focus: MERN Stack Applications
            </li>
            <li>
              <Sparkles size={15} className={styles.metaIcon} />
              Currently building production-grade projects
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
