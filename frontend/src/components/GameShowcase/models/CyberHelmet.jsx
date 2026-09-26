import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles, Float } from "@react-three/drei";
import { useProgressStore } from "../progressStore.jsx";
import { mapRange } from "../mathUtils.js";

/**
 * A stylized cyberpunk helmet built from primitives — no external GLTF
 * needed. Reads its own slice of the shared scroll-progress store and maps
 * it to [0, 1] across `window` (scroll fractions where this model is live)
 * to drive float-in, dissolve/shrink, and visor glow.
 */
export default function CyberHelmet({ window: activeWindow = [0, 0.4], ...props }) {
  const group = useRef();
  const visor = useRef();
  const store = useProgressStore();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const localProgress = mapRange(store.progress, activeWindow[0], activeWindow[1]);

    group.current.rotation.y = t * 0.25 + localProgress * Math.PI * 0.4;
    group.current.position.y = Math.sin(t * 0.8) * 0.08;

    // entrance: scale up from 0, then shrink/dissolve on exit
    const enter = Math.min(localProgress * 4, 1);
    const exit = Math.max((localProgress - 0.7) / 0.3, 0);
    const scale = enter * (1 - exit);
    group.current.scale.setScalar(Math.max(scale, 0.001));
    group.current.visible = scale > 0.002;

    if (visor.current) {
      visor.current.material.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.4;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
        {/* Dome */}
        <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
          <sphereGeometry args={[1, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <MeshDistortMaterial color="#0c1016" metalness={0.9} roughness={0.25} distort={0.08} speed={1.2} />
        </mesh>

        {/* Jaw / lower plate */}
        <mesh castShadow receiveShadow position={[0, -0.55, 0.05]}>
          <cylinderGeometry args={[0.62, 0.5, 0.55, 32, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#12161d" metalness={0.85} roughness={0.35} />
        </mesh>

        {/* Visor strip */}
        <mesh ref={visor} position={[0, 0.05, 0.86]}>
          <boxGeometry args={[1.3, 0.28, 0.12]} />
          <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>

        {/* Side vents */}
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.95, -0.1, 0.1]} rotation={[0, side * 0.4, 0]}>
            <boxGeometry args={[0.12, 0.5, 0.3]} />
            <meshStandardMaterial color="#1b212b" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}

        {/* Antenna / signal spike */}
        <mesh position={[0.55, 0.85, -0.1]} rotation={[0.3, 0, -0.3]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
          <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={0.8} />
        </mesh>
      </Float>

      <Sparkles count={30} scale={2.4} size={2} speed={0.4} color="#00ff66" opacity={0.6} />
    </group>
  );
}
