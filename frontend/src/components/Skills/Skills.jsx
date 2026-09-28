import { useState } from "react";
import { skillCategories } from "../../data/skills.js";
import { useReveal } from "../../hooks/useReveal.js";
import SkillCard from "./SkillCard.jsx";
import styles from "./Skills.module.css";

/** Renders the skill set straight from the static list in data/skills.js. */
export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const categories = skillCategories;
  const [ref, visible] = useReveal();

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
