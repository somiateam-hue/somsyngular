import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function Crate({ zone, position, rotation = [0, 0, 0], isHovered, isGrabbed, onHover, onClick }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const baseY = position[1];
  const baseRotY = rotation[1] || 0;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;

    // Hover float
    const targetY = isHovered ? baseY + 0.15 : baseY;
    g.position.y += (targetY - g.position.y) * delta * 6;

    // Subtle rotation when hovered, added to base rotation
    const targetRotY = isHovered ? Math.sin(Date.now() * 0.002) * 0.08 : 0;
    g.rotation.y += ((baseRotY + targetRotY) - g.rotation.y) * delta * 4;

    // Grabbed: lift and scale up
    if (isGrabbed) {
      g.position.y += delta * 2;
      g.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), delta * 3);
    }

    // Glow pulse
    if (glowRef.current) {
      const intensity = isHovered ? 0.5 + Math.sin(Date.now() * 0.004) * 0.2 : 0.15;
      glowRef.current.emissiveIntensity = intensity;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={rotation}
      onPointerEnter={(e) => { e.stopPropagation(); onHover(true); }}
      onPointerLeave={(e) => { e.stopPropagation(); onHover(false); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Main crate body */}
      <RoundedBox args={[0.6, 0.45, 0.5]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0d0d14"
          metalness={0.8}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
          envMapIntensity={1.2}
        />
      </RoundedBox>

      {/* Top accent plate */}
      <mesh position={[0, 0.225, 0]} castShadow>
        <boxGeometry args={[0.58, 0.02, 0.48]} />
        <meshStandardMaterial
          ref={glowRef}
          color={zone.color}
          metalness={0.7}
          roughness={0.3}
          emissive={zone.color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Edge neon strips (4 vertical edges) */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sz], i) => (
        <mesh key={i} position={[sx * 0.29, 0, sz * 0.24]}>
          <boxGeometry args={[0.015, 0.44, 0.015]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={isHovered ? 0.8 : 0.2}
            transparent
            opacity={isHovered ? 0.9 : 0.4}
          />
        </mesh>
      ))}

      {/* Icon */}
      <Text
        position={[0, 0.06, 0.26]}
        fontSize={0.18}
        color={zone.color}
        anchorX="center"
        anchorY="middle"
      >
        {zone.icon}
      </Text>

      {/* Label: zone name */}
      <Text
        position={[0, -0.08, 0.26]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {zone.name}
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, -0.16, 0.26]}
        fontSize={0.04}
        color={zone.color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        fillOpacity={0.6}
      >
        {zone.sub}
      </Text>

      {/* Ground glow disc */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={isHovered ? 0.4 : 0.08}
          transparent
          opacity={isHovered ? 0.3 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Point light on the crate */}
      {isHovered && (
        <pointLight color={zone.color} intensity={1.5} distance={2} position={[0, 0.5, 0]} />
      )}
    </group>
  );
}
