import { Suspense } from "react";
import { Environment } from "@react-three/drei";
import CameraRig from "./CameraRig.jsx";
import CyberHelmet from "./models/CyberHelmet.jsx";
import SciFiOrb from "./models/SciFiOrb.jsx";
import CrystalGateway from "./models/CrystalGateway.jsx";
import HologramCase from "./HologramCase.jsx";
import ParticleBurst from "./ParticleBurst.jsx";
import { MODEL_WINDOWS, BURST_POINTS } from "./sceneConfig.js";

export default function Experience() {
  return (
    <>
      <color attach="background" args={["#0a0a0c"]} />
      <fog attach="fog" args={["#0a0a0c", 6, 16]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 3]} intensity={1.4} color="#00ff66" distance={12} decay={2} />
      <pointLight position={[-3, -2, -3]} intensity={1.1} color="#00f3ff" distance={14} decay={2} />
      {/* Subtle magenta rim light — keeps the third accent present even
          when no single element is explicitly magenta-colored */}
      <pointLight position={[0, -3, 2]} intensity={0.5} color="#ff0055" distance={10} decay={2} />
      <directionalLight position={[0, 5, 5]} intensity={0.4} color="#ffffff" />

      <CameraRig />

      <Suspense fallback={null}>
        {/* State 1 — helmet/orb initiation */}
        <CyberHelmet window={MODEL_WINDOWS.helmet} />

        {/* State 2 — weapon core + hologram project display case */}
        <SciFiOrb window={MODEL_WINDOWS.armory} />
        <HologramCase />

        {/* State 3 — neon crystal gateway / portal */}
        <CrystalGateway window={MODEL_WINDOWS.gateway} />

        {/* Hand-off bursts: cyan light streams into the armory, then a
            magenta explosion collapsing into the final portal */}
        <ParticleBurst center={BURST_POINTS.lightStreams} color="#00f3ff" />
        <ParticleBurst center={BURST_POINTS.explosion} color="#ff0055" />

        <Environment preset="night" />
      </Suspense>
    </>
  );
}
