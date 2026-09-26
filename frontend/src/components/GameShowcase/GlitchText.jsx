import styles from "./GlitchText.module.css";

/**
 * Renders `text` three times stacked (base + two RGB-split glitch layers).
 * The layers are pure CSS animation — no JS interval needed — so this is
 * cheap to leave mounted even while it's off-screen.
 */
export default function GlitchText({ text, as: Tag = "h2", className = "" }) {
  return (
    <Tag className={`${styles.glitch} ${className}`} data-text={text}>
      <span aria-hidden="true" className={styles.layerGreen}>
        {text}
      </span>
      {text}
      <span aria-hidden="true" className={styles.layerCyan}>
        {text}
      </span>
    </Tag>
  );
}
