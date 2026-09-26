import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useProgressStore } from "./progressStore.jsx";
import { pulse } from "./mathUtils.js";

/**
 * A burst of points that expands outward right at a scroll `center` point
 * (a fraction of the whole pinned timeline), then collapses again — used to
 * bridge the visual gap when one model dissolves and the next zooms in.
 */
export default function ParticleBurst({ center, width = 0.12, color = "#00ff66", count = 220, ...props }) {
  const pointsRef = useRef();
  const store = useProgressStore();

  const { positions, directions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const directions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      directions[i * 3] = dir.x;
      directions[i * 3 + 1] = dir.y;
      directions[i * 3 + 2] = dir.z;
    }
    return { positions, directions };
  }, [count]);

  useFrame((state) => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const posAttr = geo.attributes.position;
    const t = state.clock.getElapsedTime();
    const intensity = pulse(store.progress, center, width);
    const spread = intensity * 2.4;

    for (let i = 0; i < count; i++) {
      const dx = directions[i * 3];
      const dy = directions[i * 3 + 1];
      const dz = directions[i * 3 + 2];
      const jitter = 1 + Math.sin(t * 2 + i) * 0.08;
      posAttr.array[i * 3] = dx * spread * jitter;
      posAttr.array[i * 3 + 1] = dy * spread * jitter;
      posAttr.array[i * 3 + 2] = dz * spread * jitter;
    }
    posAttr.needsUpdate = true;

    if (pointsRef.current.material) {
      pointsRef.current.material.opacity = intensity * 0.9;
    }
    pointsRef.current.visible = intensity > 0.01;
  });

  return (
    <points ref={pointsRef} {...props}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.045} transparent opacity={0} depthWrite={false} toneMapped={false} />
    </points>
  );
}
