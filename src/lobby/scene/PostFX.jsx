import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export default function PostFX() {
  return (
    <EffectComposer disableNormalPass>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.7}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0012, 0.0012)}
        radialModulation
        modulationOffset={0.5}
      />
      <Noise
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.02}
      />
    </EffectComposer>
  );
}
