import { Github, GitBranch, BookOpen, Code2 } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./GithubActivity.module.css";

// No invented numbers here — repo counts, stars, and contribution graphs
// aren't wired up to the real GitHub API, so rather than show fabricated
// stats this card sticks to things that are actually true: the identity
// and a direct link to the real profile.
const HIGHLIGHTS = [
  { icon: GitBranch, label: "Open source repositories on GitHub" },
  { icon: Code2, label: "MERN stack projects, built end to end" },
  { icon: BookOpen, label: "Continuously learning and shipping" },
];

export default function GithubActivity() {
  const [ref, visible] = useReveal();

  return (
    <section id="github" className="section">
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Code</span>
          <h2 className="section-title">
            Find my work on <span>GitHub</span>
          </h2>
          <p className="section-subtitle">
            Browse the source for the projects above and everything else I'm building.
          </p>
        </div>

        <div ref={ref} className={`glass glass-neon ${styles.dashboard} ${visible ? styles.visible : ""}`}>
          <div className={styles.dashTop}>
            <div className={styles.identity}>
              <Github size={22} />
              <span>github.com/Shahzad34</span>
            </div>
            <a href="https://github.com/Shahzad34" target="_blank" rel="noreferrer" className="btn btn-primary" data-cursor="pointer">
              View Profile
            </a>
          </div>

          <div className={styles.metrics}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className={styles.metric}>
                <h.icon size={18} className={styles.metricIcon} />
                <span className={styles.metricLabel}>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
