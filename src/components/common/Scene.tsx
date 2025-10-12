'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot } from "@react-three/drei";

export function Scene() {
  const ref = useRef<any>();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta / 2;
      ref.current.rotation.y += delta / 2;
    }
  });

  return (
    <Canvas>
      <TorusKnot ref={ref} args={[1, 0.4, 128, 32]}>
        <meshNormalMaterial />
      </TorusKnot>
    </Canvas>
  );
}
