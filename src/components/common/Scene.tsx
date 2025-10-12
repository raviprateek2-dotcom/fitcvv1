'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { TorusKnot } from "@react-three/drei";

function ClientScene() {
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

export function Scene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <ClientScene /> : null;
}
