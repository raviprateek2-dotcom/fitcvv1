
'use client';

import * as THREE from 'three';
import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, useCursor } from '@react-three/drei';

function Shape({ ...props }) {
  const ref = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Initialize random data for each shape
  const { factor, speed, x, y, z } = useMemo(() => {
    return {
      factor: 0.5 + Math.random(),
      speed: 0.001 + Math.random() / 500,
      x: Math.random() * 40 - 20,
      y: Math.random() * 40 - 20,
      z: Math.random() * 20 - 10,
    };
  }, []);

  // Animate the shape
  useFrame((state) => {
    if (ref.current) {
        ref.current.rotation.y += speed;
        ref.current.position.y = y + Math.sin(state.clock.getElapsedTime() * speed * 2) * factor;
    }
  });

  return (
    <Icosahedron {...props} ref={ref} args={[1, 0]} position={[x, y, z]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <meshStandardMaterial color={hovered ? 'hsl(217, 91%, 70%)' : 'hsl(217, 91%, 60%)'} roughness={0.1} metalness={0.9} />
    </Icosahedron>
  );
}

export function AnimatedShapes() {
  return (
    <Canvas
      camera={{ position: [0, 0, 25], fov: 75 }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="hsl(217, 91%, 60%)" />
      
      {Array.from({ length: 15 }).map((_, i) => (
        <Shape key={i} />
      ))}
    </Canvas>
  );
}

    