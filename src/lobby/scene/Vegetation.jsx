import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function Vegetation({ count = 300 }) {
  const grassRef = useRef();
  const crystalRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random data for sci-fi synth-grass
  const grassData = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Distribute in a ring around the origin, avoiding the center
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 5; // scatter between 2.5 and 7.5
      temp.push({
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius,
        scale: 0.2 + Math.random() * 0.6,
        rotX: (Math.random() - 0.5) * 0.4,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.4,
      });
    }
    return temp;
  }, [count]);

  // Generate random data for glowing crystals
  const crystalData = useMemo(() => {
    const temp = [];
    const crystalCount = 30; // Fewer crystals
    for (let i = 0; i < crystalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      temp.push({
        x: Math.cos(angle) * radius,
        y: (Math.random() * 0.3) + 0.1, // Float slightly or stick up
        z: Math.sin(angle) * radius,
        scale: 0.1 + Math.random() * 0.3,
        rotX: (Math.random() - 0.5) * 0.5,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.5,
      });
    }
    return temp;
  }, []);

  useEffect(() => {
    if (grassRef.current) {
      grassData.forEach((d, i) => {
        dummy.position.set(d.x, d.y + (d.scale * 0.5), d.z); // Adjust Y so base is roughly at 0
        dummy.rotation.set(d.rotX, d.rotY, d.rotZ);
        dummy.scale.set(d.scale * 0.15, d.scale, d.scale * 0.15); // Thin blades
        dummy.updateMatrix();
        grassRef.current.setMatrixAt(i, dummy.matrix);
      });
      grassRef.current.instanceMatrix.needsUpdate = true;
    }

    if (crystalRef.current) {
      crystalData.forEach((d, i) => {
        dummy.position.set(d.x, d.y + (d.scale * 0.5), d.z);
        dummy.rotation.set(d.rotX, d.rotY, d.rotZ);
        dummy.scale.set(d.scale, d.scale * 1.5, d.scale); // Chunky crystals
        dummy.updateMatrix();
        crystalRef.current.setMatrixAt(i, dummy.matrix);
      });
      crystalRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [grassData, crystalData, dummy]);

  return (
    <group>
      {/* Synth Grass */}
      <instancedMesh ref={grassRef} args={[null, null, count]} castShadow receiveShadow>
        <coneGeometry args={[0.5, 1, 3]} /> {/* Low poly pyramids/blades */}
        <meshStandardMaterial
          color="#6C3BFF"
          emissive="#2A0A4A"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </instancedMesh>

      {/* Glowing Purple Crystals */}
      <instancedMesh ref={crystalRef} args={[null, null, 30]} castShadow receiveShadow>
        <octahedronGeometry args={[0.5, 0]} /> {/* Low poly crystals */}
        <meshStandardMaterial
          color="#D8B4FE" // Light purple
          emissive="#A855F7" // Glowing purple
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </instancedMesh>

      {/* Occasional ground glow around clumps of vegetation */}
      {crystalData.slice(0, 10).map((d, i) => (
        <pointLight
          key={i}
          position={[d.x, 0.2, d.z]}
          color="#9333EA" // Purple glow
          distance={2}
          intensity={1}
        />
      ))}
    </group>
  );
}
