import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useProgressStore } from "./progressStore.jsx";
import { BURST_POINTS } from "./sceneConfig.js";

const RADIUS = 5.5;
const START_ANGLE = -Math.PI / 2; // camera starts facing the scene head-on
const END_ANGLE = START_ANGLE + Math.PI; // 180 degree orbit, completed by the state 2 -> 3 explosion
const ORBIT_COMPLETE_AT = BURST_POINTS.explosion; // 0.68 — single source of truth, shared with the model windows

export default function CameraRig() {
  const store = useProgressStore();
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const p = store.progress;

    // Orbit happens across states 1 -> 2, finishing right as the explosion fires
    const orbitT = THREE.MathUtils.clamp(p / ORBIT_COMPLETE_AT, 0, 1);
    const eased = THREE.MathUtils.smoothstep(orbitT, 0, 1);
    const angle = THREE.MathUtils.lerp(START_ANGLE, END_ANGLE, eased);

    // Camera pulls in tighter for the final "boss" act (state 3) — a cheap
    // stand-in for a depth-of-field push without extra postprocessing deps.
    const finalPull = THREE.MathUtils.clamp((p - ORBIT_COMPLETE_AT) / (1 - ORBIT_COMPLETE_AT), 0, 1);
    const radius = RADIUS - finalPull * 1.4;
    const height = 0.6 + Math.sin(angle) * 0.15 + finalPull * 0.4;

    targetPos.current.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    camera.position.lerp(targetPos.current, Math.min(delta * 4, 1));
    camera.lookAt(0, 0, 0);

    // Subtle FOV punch-in during the final act reads like a lens focus pull
    const targetFov = 45 - finalPull * 8;
    camera.fov += (targetFov - camera.fov) * Math.min(delta * 3, 1);
    camera.updateProjectionMatrix();
  });

  return null;
}
