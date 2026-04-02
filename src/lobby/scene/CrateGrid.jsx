import Crate from './Crate';

// Arc layout: 5 crates arranged in a semicircle in front of the arm
const CRATE_POSITIONS = [
  [-2.0, 0.22, 2.0],   // left far
  [-1.0, 0.22, 2.8],   // left near
  [0.0,  0.22, 3.2],   // center
  [1.0,  0.22, 2.8],   // right near
  [2.0,  0.22, 2.0],   // right far
];

export default function CrateGrid({ zones, hoveredId, grabbedId, onHover, onClick }) {
  return (
    <group>
      {zones.map((zone, i) => {
        const pos = CRATE_POSITIONS[i];
        // Rotate so the front (Z+) faces towards the origin/camera
        const rotY = Math.atan2(pos[0], pos[2]) + Math.PI;

        return (
          <Crate
            key={zone.id}
            zone={zone}
            position={pos}
            rotation={[0, rotY, 0]}
            isHovered={hoveredId === zone.id}
            isGrabbed={grabbedId === zone.id}
            onHover={(over) => onHover(over ? zone.id : null)}
            onClick={() => onClick(zone)}
          />
        );
      })}
    </group>
  );
}

export { CRATE_POSITIONS };
