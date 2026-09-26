import GlitchText from "../GlitchText.jsx";
import shared from "../HUD.module.css";
import styles from "./PlayerHUD.module.css";

const SKILL_BADGES = ["React", "Node.js", "MongoDB"];
const HP_PERCENT = 100;
const XP_CURRENT = 2450;
const XP_NEXT = 3000;

export default function PlayerHUD() {
  return (
    <div className={`${shared.panel} ${shared.mainPanel}`}>
      <GlitchText text="PLAYER 1: SHAHZAD" as="h2" className={shared.title} />
      <p className={shared.subtitle}>MERN Stack Developer</p>
      <p className={shared.description}>
        Full stack combat unit. Loadout: MongoDB, Express, React, Node — calibrated and ready
        to deploy.
      </p>

      <div className={styles.hpRow}>
        <span className={styles.rowLabel}>HP</span>
        <div className={styles.hpTrack}>
          <div className={styles.hpFill} style={{ width: `${HP_PERCENT}%` }} />
        </div>
        <span className={styles.rowValue}>{HP_PERCENT}%</span>
      </div>

      <div className={styles.xpRow}>
        <span className={styles.rowLabel}>XP</span>
        <div className={styles.xpTrack}>
          <div className={styles.xpFill} style={{ width: `${(XP_CURRENT / XP_NEXT) * 100}%` }} />
        </div>
        <span className={styles.rowValue}>
          {XP_CURRENT.toLocaleString()} / {XP_NEXT.toLocaleString()}
        </span>
      </div>

      <div className={styles.badgeRow}>
        {SKILL_BADGES.map((skill) => (
          <span key={skill} className={styles.badge}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
