import { Github, ExternalLink, FolderGit2 } from "lucide-react";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./Projects.module.css";

export default function ProjectCard({ project, index }) {
  const [ref, visible] = useReveal();

  return (
    <article
      ref={ref}
      className={`glass ${styles.card} ${visible ? styles.cardVisible : ""}`}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <div className={styles.media}>
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={`${project.title} preview`} loading="lazy" />
        ) : (
          <div className={styles.mediaFallback}>
            <span className={styles.fallbackIcon}>
              <FolderGit2 size={26} strokeWidth={1.3} />
            </span>
          </div>
        )}
        <div className={styles.mediaOverlay} />
      </div>

      <div className={styles.body}>
        {project.category && <span className={styles.category}>{project.category}</span>}
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description}</p>

        {project.techStack?.length > 0 && (
          <div className={styles.badges}>
            {project.techStack.map((t) => (
              <span key={t} className={styles.badge}>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className={styles.links}>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.linkBtn}
              data-cursor="pointer"
            >
              <Github size={15} /> Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className={`${styles.linkBtn} ${styles.linkBtnPrimary}`}
              data-cursor="pointer"
            >
              <ExternalLink size={15} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
