import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 200 }) {
  const ref = useRef();

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      speeds[i] = Math.random() * 0.005 + 0.002;
    }
    return { positions, speeds };
  }, [count]);

  useFrame(() => {
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += speeds[i];
      if (pos.array[i * 3 + 1] > 8) pos.array[i * 3 + 1] = 0;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#A855F7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
