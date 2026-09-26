import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial, Sparkles } from "@react-three/drei";
import { useProgressStore } from "../progressStore.jsx";
import { mapRange } from "../mathUtils.js";

/**
 * A floating sci-fi orb/weapon core — a torus-knot blade ring orbiting a
 * glowing core sphere. Enters with a 3D flip + zoom, then bursts outward
 * right before Model 3 takes over.
 */
export default function SciFiOrb({ window: activeWindow = [0.28, 0.72], ...props }) {
  const group = useRef();
  const ring = useRef();
  const core = useRef();
  const store = useProgressStore();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const localProgress = mapRange(store.progress, activeWindow[0], activeWindow[1]);

    const enter = Math.min(localProgress * 3.2, 1);
    const flip = (1 - enter) * Math.PI * 2;
    const exit = Math.max((localProgress - 0.72) / 0.28, 0);
    const burstScale = 1 + exit * 2.4; // expands right before dissolving into particles
    const fadeScale = enter * (1 - exit);

    group.current.rotation.x = flip;
    group.current.rotation.y = t * 0.35;
    const scale = Math.max(fadeScale * burstScale, 0.001);
    group.current.scale.setScalar(scale);
    group.current.visible = fadeScale > 0.002;
    group.current.position.y = Math.sin(t * 1.1) * 0.12;

    if (ring.current) ring.current.rotation.z = t * 0.6;
    if (core.current) {
      core.current.material.emissiveIntensity = 1.6 + Math.sin(t * 4) * 0.6;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshStandardMaterial
          color="#00f3ff"
          emissive="#00ff66"
          emissiveIntensity={1.6}
          metalness={0.3}
          roughness={0.15}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.15, 0.05, 16, 100]} />
        <MeshWobbleMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.9} factor={0.25} speed={1.4} />
      </mesh>

      <mesh rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[1.4, 0.02, 12, 100]} />
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.8} />
      </mesh>

      <Sparkles count={45} scale={3} size={2.4} speed={0.6} color="#00f3ff" opacity={0.7} />
    </group>
  );
}
