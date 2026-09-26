import { useEffect, useState } from "react";
import { useProgressStore } from "./progressStore.jsx";
import { LEVELS } from "./levelData.js";
import ScrollHealthBar from "./ScrollHealthBar.jsx";
import PlayerHUD from "./hud-states/PlayerHUD.jsx";
import ArmoryHUD from "./hud-states/ArmoryHUD.jsx";
import ContactHUD from "./hud-states/ContactHUD.jsx";
import styles from "./HUD.module.css";

const STATE_COMPONENTS = [PlayerHUD, ArmoryHUD, ContactHUD];

export default function HUD() {
  const store = useProgressStore();
  const [level, setLevel] = useState(store.level);

  useEffect(() => store.subscribe(setLevel), [store]);

  const data = LEVELS[level];
  const StateComponent = STATE_COMPONENTS[level];

  return (
    <div className={styles.hud}>
      {/* Corner brackets — pure decoration, reinforces the HUD framing */}
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />

      <div className={styles.topBar}>
        <div className={`${styles.panel} ${styles.levelBadge}`}>
          <span className={styles.levelCode}>{data.code}</span>
        </div>
        <ScrollHealthBar />
      </div>

      <div className={styles.mainPanelWrap} key={level}>
        <StateComponent />
      </div>

      <div className={styles.levelDots}>
        {LEVELS.map((l) => (
          <span key={l.id} className={`${styles.dot} ${l.id === level ? styles.dotActive : ""}`} />
        ))}
      </div>

      <div className={styles.scrollCue}>
        <span>SCROLL</span>
        <span className={styles.scrollCueLine} />
      </div>
    </div>
  );
}
