import { useEffect, useState } from "react";
import { Github, ExternalLink } from "lucide-react";
import { fetchProjects } from "../../../lib/api.js";
import { fallbackProjects } from "../../../data/projects.js";
import { PROJECT_COUNT } from "../sceneConfig.js";
import { useProgressStore } from "../progressStore.jsx";
import GlitchText from "../GlitchText.jsx";
import shared from "../HUD.module.css";
import styles from "./ArmoryHUD.module.css";

export default function ArmoryHUD() {
  const store = useProgressStore();
  const [projects, setProjects] = useState(fallbackProjects);
  const [activeIndex, setActiveIndex] = useState(store.projectIndex);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) setProjects(data);
      })
      .catch(() => {
        // API not running — the curated fallback list stays on screen.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Syncs the highlighted list item with whichever holo-card the camera is
  // currently passing in the 3D display case, so the 2D panel and the 3D
  // scene read as one connected experience rather than two separate UIs.
  useEffect(() => store.subscribeProject(setActiveIndex), [store]);

  const shown = projects.slice(0, PROJECT_COUNT);

  return (
    <div className={`${shared.panel} ${shared.mainPanel} ${styles.panel}`} style={{ maxWidth: 560 }}>
      <GlitchText text="CYBER ARMORY" as="h2" className={shared.title} />
      <p className={shared.subtitle}>Weapon systems online — select a module to inspect</p>

      <div className={styles.list}>
        {shown.map((project, i) => (
          <div
            key={project._id || project.title}
            className={`${styles.item} ${i === activeIndex ? styles.itemActive : ""}`}
          >
            <span className={styles.itemTitle}>{project.title}</span>

            {project.technologies?.length > 0 && (
              <div className={styles.techRow}>
                {project.technologies.slice(0, 4).map((tech) => (
                  <span key={tech} className={styles.tech}>
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.linkRow}>
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                  <Github size={13} /> Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.linkBtn} ${styles.linkBtnPrimary}`}
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
