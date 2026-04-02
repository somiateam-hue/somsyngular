import { MeshReflectorMaterial } from '@react-three/drei';

export default function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={2048}
        mixBlur={1.5}
        mixStrength={0.8}
        roughness={0.15}
        depthScale={1.5}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080810"
        metalness={0.8}
        mirror={1}
      />
    </mesh>
  );
}
