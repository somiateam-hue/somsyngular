import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';

/*
  First-person gripper fingers — always visible at bottom of screen
  like hands in an FPS game. They close when grabbing.
*/

const METAL = { color: '#3A1D71', metalness: 0.9, roughness: 0.2, clearcoat: 0.7, clearcoatRoughness: 0.15 };
const DARK = { color: '#1B0E38', metalness: 0.85, roughness: 0.25, clearcoat: 0.6, clearcoatRoughness: 0.2 };
const PAD = { color: '#111111', metalness: 0.4, roughness: 0.8 };
const GLOW = { color: '#A855F7', emissive: '#A855F7', emissiveIntensity: 1.2, metalness: 0.5, roughness: 0.3 };
const HOUSING = { color: '#111118', metalness: 0.8, roughness: 0.3, clearcoat: 0.5 };

function Finger({ side, grip }) {
  const s = side; // -1 = left, 1 = right
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    // Grip closes fingers inward
    ref.current.position.x = s * (0.35 - grip * 0.18);
    ref.current.rotation.z = s * (0.15 - grip * 0.12);
  });

  return (
    <group ref={ref} position={[s * 0.35, -0.25, -0.1]}>
      {/* Main finger housing */}
      <RoundedBox args={[0.08, 0.45, 0.12]} radius={0.015} smoothness={3} castShadow>
        <meshPhysicalMaterial {...METAL} />
      </RoundedBox>

      {/* Inner pad */}
      <RoundedBox args={[0.03, 0.35, 0.10]} radius={0.008} smoothness={2}
        position={[-s * 0.03, -0.02, 0]}>
        <meshPhysicalMaterial {...PAD} />
      </RoundedBox>

      {/* Tip section */}
      <RoundedBox args={[0.07, 0.12, 0.11]} radius={0.012} smoothness={2}
        position={[0, -0.25, 0]}>
        <meshPhysicalMaterial {...DARK} />
      </RoundedBox>
      {/* Rubber tip pad */}
      <RoundedBox args={[0.025, 0.10, 0.09]} radius={0.005} smoothness={2}
        position={[-s * 0.028, -0.25, 0]}>
        <meshPhysicalMaterial {...PAD} />
      </RoundedBox>

      {/* Accent strip */}
      <mesh position={[s * 0.042, 0.05, 0]}>
        <boxGeometry args={[0.008, 0.35, 0.005]} />
        <meshPhysicalMaterial {...GLOW} />
      </mesh>

      {/* Knuckle joint */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.13, 16]} />
        <meshPhysicalMaterial {...HOUSING} />
      </mesh>

      {/* Mount bracket at top */}
      <RoundedBox args={[0.12, 0.06, 0.14]} radius={0.01} smoothness={2}
        position={[0, 0.28, 0]}>
        <meshPhysicalMaterial {...HOUSING} />
      </RoundedBox>

      {/* Hydraulic cylinder on outside */}
      <mesh position={[s * 0.05, 0.1, 0.04]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 8]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function GripperHands({ grip = 0 }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Subtle idle sway
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.x = Math.sin(t * 0.8) * 0.008;
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.003;
  });

  return (
    <group ref={groupRef}>
      {/* Mounting crossbar between fingers */}
      <RoundedBox args={[0.55, 0.04, 0.10]} radius={0.01} smoothness={2}
        position={[0, 0.05, -0.1]}>
        <meshPhysicalMaterial {...HOUSING} />
      </RoundedBox>

      {/* Center mount cylinder (wrist adapter) */}
      <mesh position={[0, 0.12, -0.1]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 20]} />
        <meshPhysicalMaterial {...HOUSING} />
      </mesh>

      {/* Wrist accent ring */}
      <mesh position={[0, 0.16, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.058, 0.005, 8, 24]} />
        <meshPhysicalMaterial {...GLOW} />
      </mesh>

      {/* Small light on mount */}
      <mesh position={[0, 0.02, 0.0]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshPhysicalMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={2} />
      </mesh>

      <Finger side={-1} grip={grip} />
      <Finger side={1} grip={grip} />

      {/* Gripper light illuminating below */}
      <pointLight color="#A855F7" intensity={1.5} distance={3} position={[0, -0.2, 0]} />
    </group>
  );
}
