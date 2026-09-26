import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useReveal } from "../../hooks/useReveal.js";

function GlowCore() {
  // Fakes a soft bloom around the core with 3 nested, increasingly-opaque
  // transparent spheres instead of one flat, harshly-saturated ball.
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });
  return (
    <group ref={group}>
      <mesh scale={0.95}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#bc13fe" transparent opacity={0.12} />
      </mesh>
      <mesh scale={0.72}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#bc13fe" transparent opacity={0.22} />
      </mesh>
      <mesh scale={0.48}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#d24bff" emissive="#bc13fe" emissiveIntensity={1.1} transparent opacity={0.85} roughness={0.4} />
      </mesh>
    </group>
  );
}

function RotatingGlobe({ mouseRef }) {
  const tiltGroup = useRef();
  const wireGroup = useRef();
  const glassRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (wireGroup.current) wireGroup.current.rotation.y += delta * 0.12;
    if (glassRef.current) glassRef.current.rotation.y -= delta * 0.05;
    if (ring1.current) ring1.current.rotation.x = t * 0.25;
    if (ring2.current) ring2.current.rotation.y = t * 0.18;

    // Smoothly lean the whole assembly toward wherever the pointer is
    // hovering over the canvas, on top of a slow constant auto-spin so
    // it never looks totally static when the pointer isn't moving.
    if (tiltGroup.current) {
      const { x, y } = mouseRef.current;
      const targetX = -y * 0.32;
      const targetY = x * 0.5;
      tiltGroup.current.rotation.x += (targetX - tiltGroup.current.rotation.x) * 0.05;
      tiltGroup.current.rotation.y += (targetY - tiltGroup.current.rotation.y) * 0.05 + delta * 0.04;
    }
  });

  return (
    <group ref={tiltGroup}>
      {/* Fine wireframe lattice — high segment count so it reads as a
          delicate "grid globe", not chunky low-poly facets. */}
      <group ref={wireGroup}>
        <mesh>
          <sphereGeometry args={[1.65, 28, 20]} />
          <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.22} />
        </mesh>
      </group>

      {/* Faint glassy shell for depth/thickness */}
      <mesh ref={glassRef}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshStandardMaterial
          color="#0a1a2a"
          transparent
          opacity={0.18}
          roughness={0.25}
          metalness={0.1}
          emissive="#00f3ff"
          emissiveIntensity={0.08}
        />
      </mesh>

      <GlowCore />

      {/* Orbit rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[2.05, 0.006, 16, 100]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.45} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 3.2, Math.PI / 4, 0]}>
        <torusGeometry args={[2.3, 0.005, 16, 100]} />
        <meshBasicMaterial color="#bc13fe" transparent opacity={0.32} />
      </mesh>

      <Sparkles count={14} scale={5} size={1.5} speed={0.2} color="#00f3ff" opacity={0.28} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 4]} intensity={8} color="#00f3ff" />
      <pointLight position={[-4, -2, -3]} intensity={7} color="#bc13fe" />
    </group>
  );
}

export default function Globe() {
  const [ref, visible] = useReveal();
  const mouseRef = useRef({ x: 0, y: 0 });

  function handlePointerMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  }

  function handlePointerLeave() {
    mouseRef.current = { x: 0, y: 0 };
  }

  return (
    <section aria-label="Global reach" className="relative w-full overflow-x-hidden py-20 sm:py-28 lg:py-32">
      {/* Same ambient neon grid used across the rest of the site (Hero,
          TechStack, .section::before) so this section blends into the
          page's continuous gradient background instead of sitting on a
          flat, disconnected solid-black patch. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 [background-image:linear-gradient(rgba(0,240,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.035)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_20%,transparent_100%)]"
      />

      {/* Soft ambient halo behind the canvas so the globe blends into the
          page background instead of floating in a stark black box. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle,rgba(0,243,255,0.10)_0%,rgba(188,19,254,0.08)_45%,transparent_72%)] blur-[10px]"
      />

      <div
        ref={ref}
        className={`relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center px-6 transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div
          className="relative h-[300px] w-full max-w-[440px] cursor-grab touch-none sm:h-[380px]"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
            <Suspense fallback={null}>
              <RotatingGlobe mouseRef={mouseRef} />
            </Suspense>
          </Canvas>
        </div>

        <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.2em] text-slate-500">
          Remote-ready
        </p>
        <h2 className="mt-4 text-center font-display text-[clamp(26px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#EAF6FF]">
          Working with clients{" "}
          <span className="bg-[linear-gradient(100deg,#00f0ff,#b026ff)] bg-clip-text text-transparent">
            worldwide
          </span>
        </h2>
        <p className="mt-5 max-w-[60ch] text-center text-[15.5px] leading-[1.8] text-slate-400">
          Wherever the request comes from, the build ships the same way — clean, scalable and
          production-ready. One stack, one standard, deployed anywhere in the world.
        </p>
      </div>
    </section>
  );
}
