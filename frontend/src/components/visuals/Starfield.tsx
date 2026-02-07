"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WarpStars() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 6000;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 800;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 800; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 800; // Z
      spd[i] = Math.random() * 2 + 0.5; 
    }
    return [pos, spd];
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 2] += speeds[i] * 3; 

        if (positions[i * 3 + 2] > 400) {
          positions[i * 3 + 2] = -400;
          positions[i * 3] = (Math.random() - 0.5) * 800;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        }
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
      meshRef.current.rotation.z += 0.001;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        {/* FIX: Pass data as constructor arguments [array, itemSize] */}
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]} 
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Starfield() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
        <WarpStars />
      </Canvas>
    </div>
  );
}