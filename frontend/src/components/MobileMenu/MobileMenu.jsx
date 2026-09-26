import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Github, Linkedin, Mail, MessageCircle, Briefcase } from "lucide-react";
import anime from "animejs";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ open, onClose, links }) {
  const panelRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!panelRef.current) return;

    if (open) {
      if (reducedMotion) {
        panelRef.current.style.opacity = 1;
        return;
      }
      anime.timeline({ easing: "easeOutExpo" })
        .add({
          targets: panelRef.current,
          opacity: [0, 1],
          duration: 300,
        })
        .add(
          {
            targets: `.${styles.item}`,
            opacity: [0, 1],
            translateY: [24, 0],
            delay: anime.stagger(60),
            duration: 500,
          },
          "-=150"
        );
    }
  }, [open, reducedMotion]);

  if (!open) return null;

  return (
    <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className={styles.grid} aria-hidden="true" />
      <nav className={styles.nav} aria-label="Mobile primary">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            end={link.to === "/"}
            className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <NavLink to="/contact" onClick={onClose} className={`btn btn-primary ${styles.cta}`}>
          Let's Talk
        </NavLink>
        <div className={styles.socials}>
          <a href="https://github.com/Shahzad34" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          <a href="https://www.linkedin.com/in/muhammad-shahzad-pk/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
          <a href="https://profile.indeed.com/?hl=en_PK&co=PK&from=gnav-homepage" target="_blank" rel="noreferrer" aria-label="Indeed"><Briefcase size={18} /></a>
          <a href="https://wa.me/923091200362" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={18} /></a>
          <a href="mailto:shahzadgm13@gmail.com" aria-label="Email"><Mail size={18} /></a>
        </div>
      </div>
    </div>
  );
}
