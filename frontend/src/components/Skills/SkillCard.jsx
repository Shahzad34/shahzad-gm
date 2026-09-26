import { useRef } from "react";
import { resolveSkillIcon } from "../../lib/skills.js";
import styles from "./Skills.module.css";

export default function SkillCard({ name, icon, description, index, active }) {
  const cardRef = useRef(null);
  const Icon = resolveSkillIcon(icon);

  // A very small lean toward the pointer — enough to feel alive, nowhere
  // near a full 3D card flip, and disabled entirely on touch devices.
  function handleMove(e) {
    const card = cardRef.current;
    if (!card || window.matchMedia("(hover: none)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-3px)`;
  }

  function handleLeave() {
    if (cardRef.current) cardRef.current.style.transform = "";
  }

  return (
    <div
      ref={cardRef}
      className={`glass ${styles.card} ${active ? styles.cardActive : ""}`}
      style={{ transitionDelay: `${index * 40}ms` }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <span className={styles.cardIcon}>
        <Icon size={19} strokeWidth={1.6} />
      </span>
      <span className={styles.cardName}>{name}</span>
      <p className={styles.cardDesc}>{description}</p>
    </div>
  );
}
