import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useProgressStore } from "./progressStore.jsx";
import { mapRange } from "./mathUtils.js";
import { MODEL_WINDOWS, PROJECT_COUNT } from "./sceneConfig.js";
import { fallbackProjects } from "../../data/projects.js";
import styles from "./HologramCase.module.css";

const [WINDOW_START, WINDOW_END] = MODEL_WINDOWS.armory;
const RADIUS = 2.3;
const PROJECTS = fallbackProjects.slice(0, PROJECT_COUNT);

function HoloCard({ project, index, total }) {
  const group = useRef();
  const frame = useRef();
  const store = useProgressStore();
  const angle = (index / total) * Math.PI * 2;

  // Each card gets its own slice of the armory window so scrolling through
  // State 2 cycles which project is highlighted — with slight overlap so
  // the hand-off between cards feels continuous rather than a hard cut.
  const slice = (WINDOW_END - WINDOW_START) / total;
  const slotStart = WINDOW_START + index * slice;
  const slotEnd = slotStart + slice * 1.4;

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const overall = mapRange(store.progress, WINDOW_START, WINDOW_END);
    const local = mapRange(store.progress, slotStart, slotEnd);
    const highlight = Math.sin(Math.min(local, 1) * Math.PI); // rises then falls across its slot

    group.current.position.x = Math.cos(angle) * RADIUS;
    group.current.position.z = Math.sin(angle) * RADIUS;
    group.current.position.y = Math.sin(t * 0.6 + index) * 0.06;
    group.current.rotation.y = -angle + Math.PI / 2;

    const scale = overall * (0.72 + highlight * 0.35);
    group.current.scale.setScalar(Math.max(scale, 0.001));
    group.current.visible = overall > 0.02;

    if (frame.current) {
      frame.current.material.emissiveIntensity = 0.5 + highlight * 1.3;
      frame.current.material.opacity = 0.25 + highlight * 0.25;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={frame}>
        <planeGeometry args={[1.5, 1.9]} />
        <meshStandardMaterial
          color="#0a0e14"
          emissive="#00f3ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Html center transform distanceFactor={6} occlude={false} className={styles.cardHtml}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>{project.title}</span>
          <div className={styles.cardTech}>
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * A ring of glowing hologram cards showing project data — the "display
 * case" from State 2. Fades in/out with the armory window and rotates
 * slowly for ambient motion.
 */
export default function HologramCase() {
  const store = useProgressStore();
  const ring = useRef();

  useFrame((state) => {
    if (!ring.current) return;
    const overall = mapRange(store.progress, WINDOW_START, WINDOW_END);
    ring.current.material.opacity = overall * 0.45;
    ring.current.rotation.z = state.clock.getElapsedTime() * 0.08;
  });

  return (
    <group>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[RADIUS - 0.04, RADIUS + 0.04, 64]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0} toneMapped={false} />
      </mesh>

      {PROJECTS.map((project, i) => (
        <HoloCard key={project._id || project.title} project={project} index={i} total={PROJECTS.length} />
      ))}
    </group>
  );
}
