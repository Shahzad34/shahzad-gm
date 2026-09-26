import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, MessageCircle, ArrowRight } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./Footer.module.css";

// Only real, already-existing links and content — nothing here is invented.
const EXPLORE_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

// Only technologies that actually appear in this portfolio's own data
// (see data/skills.js) — kept in sync with the Hero's rotating roles.
const EXPERTISE = ["Frontend", "Backend", "Python", "Flutter", "MERN", "API Development"];

const CONNECT = [
  { icon: Github, label: "GitHub", href: "https://github.com/Shahzad34" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-shahzad-pk/" },
  { icon: Mail, label: "Email", href: "mailto:shahzadgm13@gmail.com" },
  { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/923091200362" },
];

const BUILT_WITH = ["React", "JavaScript", "MERN"];

/**
 * Multi-layer footer — the polished signature at the end of the site.
 *
 * Four stacked bands, separated by thin hairlines rather than borders and
 * glow rings: the closing CTA, the brand block plus Explore / Expertise /
 * Connect, and the legal bar. Nothing here sits inside a glowing card, and
 * the ambient grid + glow are deliberately faint so the type leads.
 */
export default function Footer() {
  const [ref, visible] = useReveal({ threshold: 0.05 });

  return (
    <footer ref={ref} className={`${styles.footer} ${visible ? styles.visible : ""}`}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      {/* ---- Band 1: closing CTA ---- */}
      <div className={styles.ctaBand}>
        <div className="container">
          <div className={styles.cta}>
            <h2 className={styles.ctaTitle}>
              Ready to build <span>something great?</span>
            </h2>
            <p className={styles.ctaText}>
              Let's turn your idea into a modern, scalable product — clean architecture, clear
              communication, shipped on time.
            </p>
            <Link to="/contact" className={styles.ctaBtn} data-cursor="pointer">
              Start a Project <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* ---- Band 2: brand + Explore / Expertise / Connect ---- */}
      <div className={styles.mainBand}>
        <div className={`container ${styles.main}`}>
          <div className={styles.brand}>
            <div className={styles.wordmark}>
              <span className={styles.monogram}>SG</span>
              <span className={styles.brandName}>Shahzad GM</span>
            </div>
            <p className={styles.brandRole}>Full Stack Developer</p>
            <p className={styles.brandNote}>
              Building fast, scalable web and mobile products end to end — from database schema to
              polished interface.
            </p>
            <p className={styles.brandMeta}>Built with {BUILT_WITH.join(" · ")}</p>
          </div>

          <nav className={styles.col} aria-labelledby="footer-explore">
            <h3 id="footer-explore" className={styles.colTitle}>
              Explore
            </h3>
            <ul className={styles.list}>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Expertise</h3>
            <ul className={styles.list}>
              {EXPERTISE.map((item) => (
                <li key={item}>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Connect</h3>
            <ul className={styles.list}>
              {CONNECT.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.connectLink}
                      data-cursor="pointer"
                    >
                      <Icon size={15} strokeWidth={1.8} />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ---- Band 3: bottom bar ---- */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottom}>
            <p>© 2026 Shahzad GM. All rights reserved.</p>
            <p className={styles.bottomMeta}>Full Stack Developer</p>
            <p className={styles.bottomMeta}>Available for new opportunities</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
