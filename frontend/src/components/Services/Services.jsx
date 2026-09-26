import { Layers, Component, Boxes, Plug, Database, Smartphone } from "lucide-react";
import { services } from "../../data/journey.js";
import { useReveal } from "../../hooks/useReveal.js";
import styles from "./Services.module.css";

const ICONS = [Layers, Component, Boxes, Plug, Database, Smartphone];

export default function Services() {
  const [ref, visible] = useReveal();

  return (
    <section id="services" className="section">
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Services</span>
          <h2 className="section-title">
            What I can <span>build for you</span>
          </h2>
          <p className="section-subtitle">
            End-to-end development services centered on the MERN stack, from a first
            schema sketch to a deployed product.
          </p>
        </div>

        <div ref={ref} className={styles.grid}>
          {services.map((service, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={service.title}
                className={`glass ${styles.card} ${visible ? styles.cardVisible : ""}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={styles.iconWrap}>
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <h3 className={styles.title}>{service.title}</h3>
                <p className={styles.desc}>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
