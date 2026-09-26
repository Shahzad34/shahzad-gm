import { useEffect, useState } from "react";
import { skillCategories } from "../../data/skills.js";
import { fetchSkills } from "../../lib/api.js";
import { groupSkillsByCategory } from "../../lib/skills.js";
import { useReveal } from "../../hooks/useReveal.js";
import SkillCard from "./SkillCard.jsx";
import styles from "./Skills.module.css";

/**
 * Renders the skill set from the database (GET /api/skills) so the admin
 * panel is the source of truth, falling back to the curated static list in
 * data/skills.js when the API isn't reachable — the same pattern the Projects
 * section already uses.
 */
export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const [categories, setCategories] = useState(skillCategories);
  const [ref, visible] = useReveal();

  useEffect(() => {
    let cancelled = false;
    fetchSkills()
      .then((data) => {
        if (cancelled) return;
        const grouped = groupSkillsByCategory(data);
        if (grouped.length > 0) setCategories(grouped);
      })
      .catch(() => {
        // API not running yet — the curated fallback list is shown instead.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // The API can return a different set of tabs than the fallback did, so keep
  // the selection inside range rather than rendering an empty grid.
  const activeIndex = Math.min(activeTab, categories.length - 1);
  const active = categories[activeIndex];

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Skills</span>
          <h2 className="section-title">
            Tools I use to <span>ship products</span>
          </h2>
          <p className="section-subtitle">
            A stack built around MongoDB, Express, React, and Node — backed by experience
            across relational databases, mobile, and other server-side frameworks.
          </p>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Skill categories">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              role="tab"
              aria-selected={activeIndex === i}
              className={`${styles.tab} ${activeIndex === i ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(i)}
              data-cursor="pointer"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div ref={ref} className={styles.cardGrid}>
          {active.items.map((skill, i) => (
            <SkillCard
              key={skill._id || skill.name}
              name={skill.name}
              icon={skill.icon}
              description={skill.description}
              index={i}
              active={visible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
