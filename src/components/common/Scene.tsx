
"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot } from "@react-three/drei";

export function Scene() {
  const meshRef = useRef<any>();
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.1;
        meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <TorusKnot ref={meshRef} args={[1, 0.4, 256, 32]}>
            <meshNormalMaterial />
        </TorusKnot>
    </Canvas>
  )
}
