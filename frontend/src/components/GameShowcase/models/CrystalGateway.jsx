import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useProgressStore } from "../progressStore.jsx";
import { mapRange } from "../mathUtils.js";

/**
 * A neon crystal gateway — a glowing portal disc framed by crystal shards.
 * Descends from above with a growing aura as `window` becomes active.
 */
export default function CrystalGateway({ window: activeWindow = [0.62, 1.0], ...props }) {
  const group = useRef();
  const portal = useRef();
  const store = useProgressStore();

  const shards = useMemo(() => {
    const count = 10;
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.6;
      return {
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.55, 0],
        rotation: [0, 0, angle + Math.PI / 2],
        scale: 0.5 + Math.random() * 0.4,
      };
    });
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const localProgress = mapRange(store.progress, activeWindow[0], activeWindow[1]);

    // Descend from above: starts high, eases down as localProgress grows
    const enter = Math.min(localProgress * 2.4, 1);
    const eased = 1 - Math.pow(1 - enter, 3);
    group.current.position.y = (1 - eased) * 4;
    group.current.rotation.z = (1 - eased) * 0.6;
    group.current.visible = localProgress > 0.001;
    group.current.rotation.y = t * 0.15;

    if (portal.current) {
      portal.current.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Portal disc */}
      <mesh ref={portal}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial
          color="#0a0e14"
          emissive="#00f3ff"
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Ring outline */}
      <mesh>
        <ringGeometry args={[1.5, 1.62, 64]} />
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Crystal shards framing the portal — cycle through all three neon accents */}
      {shards.map((shard, i) => {
        const shardColor = ["#00ff66", "#00f3ff", "#ff0055"][i % 3];
        return (
          <mesh key={i} position={shard.position} rotation={shard.rotation} scale={shard.scale}>
            <coneGeometry args={[0.14, 0.6, 4]} />
            <meshStandardMaterial
              color="#12212a"
              emissive={shardColor}
              emissiveIntensity={0.9}
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}
