import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import styles from "./TerminalCard.module.css";

const LINES = [
  { prompt: "shahzad@developer:~$", command: "whoami", output: "Full Stack Developer" },
  { prompt: "shahzad@developer:~$", command: "stack", output: "MERN + React + Node + MongoDB" },
  { prompt: "shahzad@developer:~$", command: "status", output: "Available for work" },
];

export default function TerminalCard() {
  const [displayed, setDisplayed] = useState([]);
  const startedRef = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (reducedMotion) {
      setDisplayed(LINES);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;

    function typeNext() {
      if (cancelled || lineIndex >= LINES.length) return;
      const line = LINES[lineIndex];
      charIndex++;
      const typedCommand = line.command.slice(0, charIndex);

      setDisplayed((prev) => {
        const next = [...prev];
        next[lineIndex] = { ...line, command: typedCommand, output: charIndex >= line.command.length ? line.output : "" };
        return next;
      });

      if (charIndex < line.command.length) {
        setTimeout(typeNext, 55);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNext, 450);
      }
    }

    setDisplayed([{ ...LINES[0], command: "", output: "" }]);
    setTimeout(typeNext, 500);

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  return (
    <div className={`glass ${styles.terminal}`}>
      <div className={styles.titlebar}>
        <span className={styles.dot} style={{ background: "#FF5F57" }} />
        <span className={styles.dot} style={{ background: "#FEBC2E" }} />
        <span className={styles.dot} style={{ background: "#28C840" }} />
        <span className={styles.titleText}>terminal — zsh</span>
      </div>
      <div className={styles.body}>
        {displayed.map((line, i) => (
          <div key={i} className={styles.line}>
            <div>
              <span className={styles.prompt}>{line.prompt}</span> <span className={styles.command}>{line.command}</span>
              {i === displayed.length - 1 && !line.output && <span className={styles.cursor} />}
            </div>
            {line.output && <div className={styles.output}>{line.output}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
