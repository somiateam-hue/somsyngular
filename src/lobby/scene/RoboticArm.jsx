import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* ═══════════════════════════════════════════════════════════════════════════════
   MATERIALS — industrial robot look (purple brand version of KUKA/ABB style)
   ═══════════════════════════════════════════════════════════════════════════════ */
const BODY_MAT = { color: '#3A1D71', metalness: 0.9, roughness: 0.2, clearcoat: 0.7, clearcoatRoughness: 0.15 };
const BODY_DARK = { color: '#1B0E38', metalness: 0.85, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2 };
const HOUSING = { color: '#111118', metalness: 0.8, roughness: 0.3, clearcoat: 0.5 };
const ACCENT = { color: '#A855F7', emissive: '#A855F7', emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.3 };
const CABLE = { color: '#050505', metalness: 0.2, roughness: 0.9 };
const METAL_JOINT = { color: '#333340', metalness: 1.0, roughness: 0.1, clearcoat: 1.0 };
const GRIPPER_PAD = { color: '#111111', metalness: 0.4, roughness: 0.8 };

/* ═══════════════════════════════════════════════════════════════════════════════
   GEOMETRY BUILDING BLOCKS
   ═══════════════════════════════════════════════════════════════════════════════ */

// Motor housing disc (the round covers on joint sides)
function MotorDisc({ radius = 0.18, thickness = 0.04, ...props }) {
  return (
    <mesh {...props} castShadow>
      <cylinderGeometry args={[radius, radius, thickness, 32]} />
      <meshPhysicalMaterial {...HOUSING} />
    </mesh>
  );
}

// Cable conduit running along arm segments
function CableRun({ points, radius = 0.018 }) {
  return (
    <group>
      {points.map((p, i) => {
        if (i === 0) return null;
        const prev = points[i - 1];
        const dx = p[0] - prev[0], dy = p[1] - prev[1], dz = p[2] - prev[2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const mid = [(p[0] + prev[0]) / 2, (p[1] + prev[1]) / 2, (p[2] + prev[2]) / 2];

        return (
          <mesh key={i} position={mid} castShadow>
            <cylinderGeometry args={[radius, radius, len, 8]} />
            <meshPhysicalMaterial {...CABLE} />
          </mesh>
        );
      })}
    </group>
  );
}

// Accent strip (neon line along a segment)
function AccentStrip({ width = 0.02, height = 0.5, depth = 0.005, ...props }) {
  return (
    <mesh {...props}>
      <boxGeometry args={[width, height, depth]} />
      <meshPhysicalMaterial {...ACCENT} />
    </mesh>
  );
}

// Panel detail (raised rectangle on surface)
function PanelDetail({ w = 0.12, h = 0.06, ...props }) {
  return (
    <mesh {...props}>
      <boxGeometry args={[w, h, 0.008]} />
      <meshPhysicalMaterial color="#1a1028" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

// Bolt/rivet detail
function Bolt({ ...props }) {
  return (
    <mesh {...props}>
      <cylinderGeometry args={[0.012, 0.012, 0.01, 8]} />
      <meshPhysicalMaterial {...METAL_JOINT} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN ROBOTIC ARM — KUKA/ABB style industrial proportions
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function RoboticArm({ targetPos, isGrabbing, onGrabComplete }) {
  const baseRotRef = useRef();
  const shoulderRef = useRef();
  const elbowRef = useRef();
  const wristRef = useRef();
  const fingerLRef = useRef();
  const fingerRRef = useRef();

  const state = useRef({
    baseRot: 0,
    shoulderRot: -0.3,
    elbowRot: 0.6,
    wristRot: -0.3,
    gripOpen: 1,
    breath: 0,
    grabActive: false,
  });

  // IK to point toward target crate
  const computeIK = (target) => {
    if (!target) return { baseRot: 0, shoulderRot: -0.3, elbowRot: 0.6, wristRot: -0.3 };
    const dx = target[0], dz = target[2];
    const baseRot = Math.atan2(dx, dz);
    const dist = Math.sqrt(dx * dx + dz * dz);
    const reach = Math.min(dist * 0.25, 0.7);
    return {
      baseRot,
      shoulderRot: -0.4 - reach * 0.35,
      elbowRot: 0.7 + reach * 0.45,
      wristRot: -0.3 - reach * 0.1,
    };
  };

  // Grab sequence
  const startGrab = () => {
    if (state.current.grabActive) return;
    state.current.grabActive = true;
    const s = state.current;
    const tl = gsap.timeline({
      onComplete: () => {
        state.current.grabActive = false;
        if (onGrabComplete) onGrabComplete();
      },
    });
    tl.to(s, { shoulderRot: -0.9, elbowRot: 1.3, wristRot: -0.45, duration: 0.6, ease: 'power2.inOut' });
    tl.to(s, { gripOpen: 0, duration: 0.3, ease: 'power2.in' });
    tl.to(s, { shoulderRot: -0.15, elbowRot: 0.35, wristRot: -0.2, duration: 0.5, ease: 'power2.inOut' });
    tl.to(s, { duration: 0.4 });
  };

  useFrame((_, delta) => {
    const s = state.current;

    if (isGrabbing && !s.grabActive) startGrab();

    // Idle breathing
    s.breath += delta * 1.2;
    const breathe = Math.sin(s.breath) * 0.015;

    // IK interpolation (when not grabbing)
    if (!s.grabActive) {
      const ik = computeIK(targetPos);
      const spd = 2.5 * delta;
      s.baseRot += (ik.baseRot - s.baseRot) * spd;
      s.shoulderRot += (ik.shoulderRot - s.shoulderRot) * spd;
      s.elbowRot += (ik.elbowRot - s.elbowRot) * spd;
      s.wristRot += (ik.wristRot - s.wristRot) * spd;
      s.gripOpen += (1 - s.gripOpen) * spd * 2;
    }

    // Apply
    if (baseRotRef.current) baseRotRef.current.rotation.y = s.baseRot;
    if (shoulderRef.current) shoulderRef.current.rotation.x = s.shoulderRot + breathe;
    if (elbowRef.current) elbowRef.current.rotation.x = s.elbowRot - breathe * 0.5;
    if (wristRef.current) wristRef.current.rotation.x = s.wristRot;
    if (fingerLRef.current) fingerLRef.current.rotation.z = s.gripOpen * 0.35;
    if (fingerRRef.current) fingerRRef.current.rotation.z = -(s.gripOpen * 0.35);
  });

  return (
    <group position={[0, 0, 0]}>

      {/* ══════════════ BASE PLATFORM ══════════════ */}
      {/* Bottom plate */}
      <mesh castShadow receiveShadow position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.48, 0.52, 0.06, 32]} />
        <meshPhysicalMaterial {...HOUSING} />
      </mesh>
      {/* Main base cylinder */}
      <mesh castShadow position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 0.18, 32]} />
        <meshPhysicalMaterial {...BODY_MAT} />
      </mesh>
      {/* Base accent ring */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.015, 8, 48]} />
        <meshPhysicalMaterial {...ACCENT} />
      </mesh>
      {/* Top ring of base */}
      <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.012, 8, 48]} />
        <meshPhysicalMaterial {...METAL_JOINT} />
      </mesh>
      {/* Base panel details */}
      <PanelDetail w={0.15} h={0.08} position={[0, 0.14, 0.4]} />
      <PanelDetail w={0.15} h={0.08} position={[0, 0.14, -0.4]} rotation={[0, Math.PI, 0]} />

      {/* ══════════════ ROTATING TURRET ══════════════ */}
      <group ref={baseRotRef} position={[0, 0.24, 0]}>

        {/* Turret housing */}
        <mesh castShadow position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 0.16, 32]} />
          <meshPhysicalMaterial {...BODY_DARK} />
        </mesh>
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.30, 0.01, 8, 48]} />
          <meshPhysicalMaterial {...ACCENT} />
        </mesh>

        {/* ══════════════ SHOULDER MOTOR HOUSING ══════════════ */}
        <group position={[0, 0.22, 0]}>
          {/* Main shoulder block */}
          <RoundedBox args={[0.38, 0.36, 0.32]} radius={0.04} smoothness={4} castShadow position={[0, 0.18, 0]}>
            <meshPhysicalMaterial {...BODY_MAT} />
          </RoundedBox>

          {/* Motor discs (sides) */}
          <MotorDisc radius={0.16} position={[0.20, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} />
          <MotorDisc radius={0.16} position={[-0.20, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} />

          {/* Shoulder accent strips */}
          <AccentStrip width={0.025} height={0.28} position={[0, 0.18, 0.165]} />
          <AccentStrip width={0.025} height={0.28} position={[0, 0.18, -0.165]} />

          {/* Bolts */}
          {[0.12, -0.12].map(x =>
            [0.12, -0.12].map(z => (
              <Bolt key={`${x}${z}`} position={[x, 0.365, z]} rotation={[Math.PI / 2, 0, 0]} />
            ))
          )}

          {/* ══════════════ UPPER ARM ══════════════ */}
          <group ref={shoulderRef} position={[0, 0.36, 0]}>

            {/* Upper arm main body */}
            <RoundedBox args={[0.22, 1.0, 0.20]} radius={0.03} smoothness={4} castShadow position={[0, 0.5, 0]}>
              <meshPhysicalMaterial {...BODY_MAT} />
            </RoundedBox>

            {/* Raised panel on front */}
            <RoundedBox args={[0.16, 0.5, 0.03]} radius={0.01} smoothness={2} position={[0, 0.5, 0.115]}>
              <meshPhysicalMaterial {...BODY_DARK} />
            </RoundedBox>

            {/* Accent strips on upper arm */}
            <AccentStrip width={0.015} height={0.8} position={[0.115, 0.5, 0]} />
            <AccentStrip width={0.015} height={0.8} position={[-0.115, 0.5, 0]} />

            {/* Cable conduit along upper arm */}
            <mesh position={[0.08, 0.5, -0.11]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.85, 8]} />
              <meshPhysicalMaterial {...CABLE} />
            </mesh>
            <mesh position={[-0.05, 0.5, -0.11]} castShadow>
              <cylinderGeometry args={[0.018, 0.018, 0.85, 8]} />
              <meshPhysicalMaterial {...CABLE} />
            </mesh>

            {/* ══════════════ ELBOW HOUSING ══════════════ */}
            <group position={[0, 1.0, 0]}>
              <RoundedBox args={[0.28, 0.24, 0.26]} radius={0.04} smoothness={4} castShadow>
                <meshPhysicalMaterial {...BODY_DARK} />
              </RoundedBox>

              {/* Elbow motor discs */}
              <MotorDisc radius={0.13} position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
              <MotorDisc radius={0.13} position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]} />

              {/* Elbow accent ring */}
              <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.12, 0.008, 8, 32]} />
                <meshPhysicalMaterial {...ACCENT} />
              </mesh>

              {/* ══════════════ FOREARM ══════════════ */}
              <group ref={elbowRef}>

                <RoundedBox args={[0.17, 0.72, 0.16]} radius={0.025} smoothness={4} castShadow position={[0, 0.36, 0]}>
                  <meshPhysicalMaterial {...BODY_MAT} />
                </RoundedBox>

                {/* Forearm panel */}
                <RoundedBox args={[0.12, 0.35, 0.02]} radius={0.008} smoothness={2} position={[0, 0.36, 0.09]}>
                  <meshPhysicalMaterial {...BODY_DARK} />
                </RoundedBox>

                {/* Accent strips */}
                <AccentStrip width={0.012} height={0.6} position={[0.09, 0.36, 0]} />
                <AccentStrip width={0.012} height={0.6} position={[-0.09, 0.36, 0]} />

                {/* Cable */}
                <mesh position={[0.06, 0.36, -0.09]} castShadow>
                  <cylinderGeometry args={[0.016, 0.016, 0.6, 8]} />
                  <meshPhysicalMaterial {...CABLE} />
                </mesh>

                {/* ══════════════ WRIST HOUSING ══════════════ */}
                <group position={[0, 0.72, 0]}>
                  <mesh castShadow>
                    <cylinderGeometry args={[0.09, 0.10, 0.14, 24]} />
                    <meshPhysicalMaterial {...HOUSING} />
                  </mesh>
                  {/* Wrist ring */}
                  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                    <torusGeometry args={[0.085, 0.006, 8, 24]} />
                    <meshPhysicalMaterial {...ACCENT} />
                  </mesh>

                  {/* ══════════════ WRIST ROTATION ══════════════ */}
                  <group ref={wristRef} position={[0, 0.08, 0]}>

                    {/* Wrist adapter */}
                    <mesh castShadow>
                      <cylinderGeometry args={[0.07, 0.08, 0.06, 20]} />
                      <meshPhysicalMaterial {...METAL_JOINT} />
                    </mesh>

                    {/* ══════════════ GRIPPER MOUNT ══════════════ */}
                    <group position={[0, 0.05, 0]}>
                      {/* Mount plate */}
                      <RoundedBox args={[0.16, 0.04, 0.12]} radius={0.008} smoothness={2} castShadow>
                        <meshPhysicalMaterial {...HOUSING} />
                      </RoundedBox>

                      {/* ── FINGER LEFT ── */}
                      <group ref={fingerLRef} position={[-0.06, -0.02, 0]}>
                        {/* Finger housing */}
                        <RoundedBox args={[0.04, 0.22, 0.08]} radius={0.008} smoothness={2} castShadow position={[0, -0.11, 0]}>
                          <meshPhysicalMaterial {...BODY_DARK} />
                        </RoundedBox>
                        {/* Finger tip / pad */}
                        <RoundedBox args={[0.035, 0.06, 0.07]} radius={0.005} smoothness={2} position={[0, -0.23, 0]}>
                          <meshPhysicalMaterial {...GRIPPER_PAD} />
                        </RoundedBox>
                        {/* Finger accent */}
                        <AccentStrip width={0.008} height={0.18} position={[0.025, -0.11, 0]} />
                      </group>

                      {/* ── FINGER RIGHT ── */}
                      <group ref={fingerRRef} position={[0.06, -0.02, 0]}>
                        <RoundedBox args={[0.04, 0.22, 0.08]} radius={0.008} smoothness={2} castShadow position={[0, -0.11, 0]}>
                          <meshPhysicalMaterial {...BODY_DARK} />
                        </RoundedBox>
                        <RoundedBox args={[0.035, 0.06, 0.07]} radius={0.005} smoothness={2} position={[0, -0.23, 0]}>
                          <meshPhysicalMaterial {...GRIPPER_PAD} />
                        </RoundedBox>
                        <AccentStrip width={0.008} height={0.18} position={[-0.025, -0.11, 0]} />
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Arm-tip spotlight */}
      <pointLight color="#A855F7" intensity={2.5} distance={5} position={[0, 2.5, 0]} />
    </group>
  );
}
