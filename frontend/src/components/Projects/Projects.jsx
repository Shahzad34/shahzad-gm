import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fetchProjects } from "../../lib/api.js";
import { fallbackProjects } from "../../data/projects.js";
import ProjectCard from "./ProjectCard.jsx";
import styles from "./Projects.module.css";

export default function Projects({ limit, showViewAll = true }) {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {
        // API not running yet — the curated fallback list is shown instead.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className={styles.header}>
          <div>
            <span className="eyebrow">Projects</span>
            <h2 className="section-title">
              Things I've <span>built and shipped</span>
            </h2>
            <p className="section-subtitle">
              A selection of full stack applications — from event management to e-commerce —
              built end to end with the MERN stack.
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {visible.map((project, i) => (
            <ProjectCard key={project._id || project.title} project={project} index={i} />
          ))}
        </div>

        {showViewAll && (
          <div className={styles.footerAction}>
            <Link to="/projects" className="btn btn-ghost" data-cursor="pointer">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
