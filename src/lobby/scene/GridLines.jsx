import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GridLines() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.material.opacity = 0.08 + Math.sin(Date.now() * 0.001) * 0.03;
    }
  });

  return (
    <gridHelper
      ref={ref}
      args={[30, 40, '#6C3BFF', '#6C3BFF']}
      position={[0, 0.005, 0]}
      material-transparent
      material-opacity={0.08}
    />
  );
}
