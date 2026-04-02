import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, SoftShadows } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

import Floor from './Floor';
import GridLines from './GridLines';
import CrateGrid, { CRATE_POSITIONS } from './CrateGrid';
import Particles from './Particles';
import GripperHands from './GripperHands';
import RoboticArm from './RoboticArm';
import PostFX from './PostFX';
import Vegetation from './Vegetation';

/* ═══════════════════════════════════════════════════════════════════════════════
   INTRO CINEMATIC CAMERA
   Third-person shot of the full arm → flies into the gripper → first person
   ═══════════════════════════════════════════════════════════════════════════════ */

function IntroCameraRig({ onIntroDone }) {
  const { camera } = useThree();

  useEffect(() => {
    // Start: dramatic angle looking at the arm
    camera.position.set(4, 1.8, 5);
    camera.lookAt(0, 1.2, 0);

    const lookTarget = { x: 0, y: 1.2, z: 0 };

    const tl = gsap.timeline({ onComplete: onIntroDone });

    // Phase 1: Slow orbit around the arm (0s - 2.5s)
    tl.to(camera.position, {
      x: 2.5, y: 2.2, z: 4,
      duration: 2.5, ease: 'power1.inOut',
    }, 0);
    tl.to(lookTarget, {
      y: 1.5,
      duration: 2.5, ease: 'power1.inOut',
      onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
    }, 0);

    // Phase 2: Sweep upward, aiming at gripper tip (2.5s - 4s)
    tl.to(camera.position, {
      x: 0.5, y: 3.0, z: 2.5,
      duration: 1.5, ease: 'power2.inOut',
    }, 2.5);
    tl.to(lookTarget, {
      x: 0, y: 2.5, z: 0,
      duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
    }, 2.5);

    // Phase 3: Fly INTO the gripper (4s - 5.2s)
    tl.to(camera.position, {
      x: 0, y: 3.2, z: 1.8,
      duration: 1.2, ease: 'power3.inOut',
    }, 4);
    tl.to(lookTarget, {
      x: 0, y: 0.3, z: 0.5,
      duration: 1.2, ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z),
    }, 4);

    return () => tl.kill();
  }, [camera, onIntroDone]);

  return null;
}

function FirstPersonRig({ grabbedId, zones, onTransitionDone, grip }) {
  const { camera, size, gl } = useThree();
  const gripperRef = useRef();
  const grabbing = useRef(false);

  // Crosshair simulation for joystick
  const vPointer = useRef({ x: 0, y: 0 });

  // Camera fixed high above, looking down at the crate arc
  const CAM_POS = [0, 5.5, -0.5];
  const CAM_TARGET = [0, 0.3, 2.5];

  useEffect(() => {
    camera.position.set(...CAM_POS);
    camera.lookAt(...CAM_TARGET);
  }, [camera]);

  // Physics state for realistic heavy arm movement
  const vels = useRef({ x: 0, y: 0, rx: 0, ry: 0, rz: 0 });

  useFrame((state, delta) => {
    if (grabbing.current) return;

    // Subtle camera breathing
    const time = state.clock.elapsedTime;
    camera.position.set(
      CAM_POS[0] + Math.sin(time * 0.5) * 0.05,
      CAM_POS[1] + Math.cos(time * 0.4) * 0.03,
      CAM_POS[2]
    );

    // Read global joystick state (from MobileController)
    const joyX = window.__JOYSTICK_X__ || 0;
    const joyY = window.__JOYSTICK_Y__ || 0;
    const joyActive = window.__JOYSTICK_ACTIVE__ || false;

    if (joyActive) {
      // Integrate joystick direction to position (velocity)
      vPointer.current.x += joyX * 0.05;
      vPointer.current.y += joyY * 0.05;
      // Clamp to screen bounds
      vPointer.current.x = Math.max(-1, Math.min(1, vPointer.current.x));
      vPointer.current.y = Math.max(-1, Math.min(1, vPointer.current.y));

      // Override R3F pointer for hover interactions
      state.pointer.x = vPointer.current.x;
      state.pointer.y = vPointer.current.y;
    } else {
      // Desktop fallback: vPointer follows the real mouse pointer
      vPointer.current.x += (state.pointer.x - vPointer.current.x) * 0.3;
      vPointer.current.y += (state.pointer.y - vPointer.current.y) * 0.3;
    }

    // Small parallax for camera look target
    const targetX = CAM_TARGET[0] + vPointer.current.x * 0.5;
    const targetZ = CAM_TARGET[2] - vPointer.current.y * 0.3;
    camera.lookAt(targetX, CAM_TARGET[1], targetZ);

    // Update crosshair DOM position globally
    const cx = ((vPointer.current.x + 1) / 2) * size.width;
    const cy = ((-vPointer.current.y + 1) / 2) * size.height;
    if (window.__UPDATE_CROSSHAIR__) {
      window.__UPDATE_CROSSHAIR__(cx, cy);
    }

    // Force R3F raycaster update so hovers trigger while joystick moves without true DOM events
    if (joyActive) {
      state.raycaster.setFromCamera(state.pointer, camera);
    }

    // Gripper positioned in foreground, following pointer with HEAVY physics (inertia/spring)
    if (gripperRef.current) {
      const px = vPointer.current.x;
      const py = vPointer.current.y;
      
      const tarX = px * 1.5;
      const tarY = 1.2 + py * 0.5;
      const tarZ = 1.5;
      
      // Spring constants for heavy machinery feel
      const k = 18.0; // Stiffness
      const c = 6.0;  // Damping
      
      // Position physics
      const dx = tarX - gripperRef.current.position.x;
      const dy = tarY - gripperRef.current.position.y;
      
      const ax = dx * k - vels.current.x * c;
      const ay = dy * k - vels.current.y * c;
      
      vels.current.x += ax * delta;
      vels.current.y += ay * delta;
      
      gripperRef.current.position.x += vels.current.x * delta;
      gripperRef.current.position.y += vels.current.y * delta;
      gripperRef.current.position.z = tarZ;
      
      // Arm rotation physics
      const rotZ = -px * 0.25;
      const rotY = -px * 0.3;
      const rotX = -0.6 + py * 0.2;
      
      const dRx = rotX - gripperRef.current.rotation.x;
      const dRy = rotY - gripperRef.current.rotation.y;
      const dRz = rotZ - gripperRef.current.rotation.z;
      
      // Slightly stiffer springs for rotation
      const aRx = dRx * 25.0 - vels.current.rx * c;
      const aRy = dRy * 25.0 - vels.current.ry * c;
      const aRz = dRz * 25.0 - vels.current.rz * c;
      
      vels.current.rx += aRx * delta;
      vels.current.ry += aRy * delta;
      vels.current.rz += aRz * delta;
      
      gripperRef.current.rotation.x += vels.current.rx * delta;
      gripperRef.current.rotation.y += vels.current.ry * delta;
      gripperRef.current.rotation.z += vels.current.rz * delta;
    }
  });

  // Grab transition
  useEffect(() => {
    if (!grabbedId) return;
    grabbing.current = true;
    const idx = zones.findIndex(z => z.id === grabbedId);
    if (idx < 0) return;
    const cratePos = CRATE_POSITIONS[idx];

    const tl = gsap.timeline({
      onComplete: () => { grabbing.current = false; onTransitionDone(); },
    });
    tl.to(camera.position, { x: cratePos[0], y: 1.2, z: cratePos[2] + 0.3, duration: 0.6, ease: 'power2.inOut' }, 0);
    tl.to(camera.position, { y: 0.5, z: cratePos[2] - 0.2, duration: 0.4, ease: 'power3.in' }, 0.6);
    return () => tl.kill();
  }, [grabbedId, camera, zones, onTransitionDone]);

  // Reset on exit
  useEffect(() => {
    if (!grabbedId) {
      gsap.to(camera.position, { x: CAM_POS[0], y: CAM_POS[1], z: CAM_POS[2], duration: 0.6, ease: 'power2.out' });
      gsap.to(vPointer.current, { x: 0, y: 0, duration: 0.6 });
    }
  }, [grabbedId, camera]);

  return (
    <group ref={gripperRef}>
      <GripperHands grip={grip} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   SCENE
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function LobbyScene({
  zones, hoveredId, grabbedId, onHover, onClick, onTransitionDone,
  introMode, onIntroDone,
}) {
  const [grip, setGrip] = useState(0);

  useEffect(() => {
    if (grabbedId) {
      gsap.to({ val: 0 }, {
        val: 1, duration: 0.4, delay: 0.3,
        onUpdate: function () { setGrip(this.targets()[0].val); },
      });
    } else {
      setGrip(0);
    }
  }, [grabbedId]);

  return (
    <Canvas
      shadows
      dpr={1}
      camera={{ position: [4, 1.8, 5], fov: 60, near: 0.05, far: 50 }}
      gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, powerPreference: "high-performance" }}
      style={{ position: 'absolute', inset: 0, cursor: introMode ? 'default' : 'crosshair' }}
    >
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 25]} />

      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} color="#1a1a2e" />
        <spotLight position={[0, 10, 3]} angle={0.6} penumbra={0.7} intensity={4} color="#ffffff"
          castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.001} />
        <pointLight position={[-3, 4, 3]} color="#6C3BFF" intensity={3} distance={15} />
        <pointLight position={[3, 4, 3]} color="#A855F7" intensity={3} distance={15} />
        <pointLight position={[0, 3, -2]} color="#4a1d96" intensity={2.5} distance={12} />
        <directionalLight position={[0, 4, 6]} intensity={1.2} color="#ddd6fe" />
        <spotLight position={[2, 5, 4]} angle={0.4} penumbra={0.6} intensity={3} color="#c4b5fd" />
        <Environment preset="night" />

        {/* Scene elements */}
        <Floor />
        <GridLines />
        <Vegetation count={120} />

        {/* Full arm — visible during intro */}
        {introMode && (
          <RoboticArm targetPos={null} isGrabbing={false} onGrabComplete={() => {}} />
        )}

        {/* Crates — always visible */}
        <CrateGrid
          zones={zones}
          hoveredId={introMode ? null : hoveredId}
          grabbedId={grabbedId}
          onHover={introMode ? () => {} : onHover}
          onClick={introMode ? () => {} : onClick}
        />

        {/* Camera rigs */}
        {introMode ? (
          <IntroCameraRig onIntroDone={onIntroDone} />
        ) : (
          <FirstPersonRig
            grabbedId={grabbedId}
            zones={zones}
            onTransitionDone={onTransitionDone}
            grip={grip}
          />
        )}

        {/* Solo renderizamos Post-procesado (Bloom, ruido) en PC. En móvil mataría la batería */}
        {window.innerWidth > 768 && <PostFX />}
      </Suspense>
    </Canvas>
  );
}
