"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, Sparkles } from "@react-three/drei";
import { useRef } from "react";

// NEBULA SIMULATION (Using Colored Particle Clusters)
function NebulaSystem() {
  return (
    <group>
      {/* PURPLE GAS CLOUD (Left Side) */}
      <Sparkles 
        position={[-15, -5, -20]} // Left position
        scale={[25, 15, 15]}      // Huge area
        color="#a855f7"           // Purple
        count={800}               // High density
        size={6}                  // Large soft particles
        speed={0.4}               // Slow drift
        opacity={0.4}             // Ghostly transparency
        noise={1}                 // Organic randomness
      />

      {/* BLUE GAS CLOUD (Right Side) */}
      <Sparkles 
        position={[15, 10, -25]}  // Right position
        scale={[25, 15, 15]} 
        color="#06b6d4"           // Cyan/Blue
        count={800} 
        size={6} 
        speed={0.3} 
        opacity={0.4} 
        noise={1}
      />
      
      {/* GOLDEN CORE GLOW (Center) */}
      <Sparkles 
        position={[0, 0, -30]} 
        scale={[10, 10, 10]} 
        color="#fbbf24"           // Warm Gold
        count={200} 
        size={8} 
        speed={0.2} 
        opacity={0.2} 
      />
    </group>
  );
}

//  Camera Movement Rig
function CameraRig() {
  useFrame((state) => {
    const x = state.mouse.x * 0.5;
    const y = state.mouse.y * 0.5;
    // Smooth camera drift based on mouse
    state.camera.position.lerp(new THREE.Vector3(x, y, 20), 0.02);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function CinematicBackground() {
  return (
    // Rich Dark Gradient Background
    <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#000000_100%)]">
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{ antialias: true }}
      >
        <CameraRig />
        
        {/* Soft Ambient Light */}
        <ambientLight intensity={0.5} />

        {/* The Particle Clouds */}
        <NebulaSystem />
        
        {/* Deep Space Stars */}
        <Stars 
          radius={100} 
          depth={60} 
          count={5000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={0.5} 
        />
        
        {/* Foreground Dust for Depth */}
        <Sparkles 
          count={200} 
          scale={30} 
          size={2} 
          speed={0.5} 
          opacity={0.3} 
          color="#ffffff" 
        />
      </Canvas>
    </div>
  );
}