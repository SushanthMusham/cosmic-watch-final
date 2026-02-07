"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

interface Asteroid {
  id: string;
  name: string;
  is_hazardous: boolean;
  close_approach_data: {
    miss_distance_km: string;
  };
  risk_level: string;
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const colorMap = useLoader(TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; 
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial map={colorMap} color="#ffffff" />
      </mesh>
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#4db2ff" transparent opacity={0.2} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function AsteroidMesh({ data, position }: { data: Asteroid; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const isDangerous = 
    data.is_hazardous || 
    data.risk_level === "Critical" || 
    data.risk_level === "Extreme";

  const color = isDangerous ? "#FF2E2E" : "#00F0FF"; 

  // Random rotation speed for tumbling effect
  const rotSpeed = useMemo(() => ({
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // 1. Tumble Animation (Rotate endlessly)
      meshRef.current.rotation.x += rotSpeed.x;
      meshRef.current.rotation.y += rotSpeed.y;

      // 2. Threat Pulse Animation (Only for Dangerous ones)
      if (isDangerous) {
        const t = state.clock.getElapsedTime();
        // Sine wave scaling for "heartbeat" effect
        const scale = 1 + Math.sin(t * 3) * 0.2; 
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  return (
    <group position={new THREE.Vector3(...position)}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        {/* JAGED GEOMETRY: Dodecahedron with 0 detail looks like a low-poly rock */}
        <dodecahedronGeometry args={[hovered ? 0.5 : (isDangerous ? 0.25 : 0.15), 0]} />
        
        {/* FLAT SHADING: Makes the facets pop like crystals */}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={isDangerous ? 2 : 0.8} 
          roughness={0.2}
          flatShading={true} 
        />
      </mesh>

      {/* Optional: Add a subtle ring around dangerous ones for emphasis */}
      {isDangerous && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
           <ringGeometry args={[0.4, 0.45, 32]} />
           <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-space-900/90 p-3 rounded-lg border border-accent-cyan text-xs text-white whitespace-nowrap z-50 pointer-events-none shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md">
            <p className="font-bold text-lg text-accent-cyan mb-1">{data.name}</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-400">Risk Level:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded ${isDangerous ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                {data.risk_level}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">
              {(parseInt(data.close_approach_data.miss_distance_km) / 1000000).toFixed(2)}M km away
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function AsteroidOrbit({ asteroids }: { asteroids: Asteroid[] }) {
  const asteroidPositions = useMemo(() => {
    return asteroids.map((ast) => {
      const distance = parseFloat(ast.close_approach_data.miss_distance_km) / 5000000 + 3.5; 
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      return {
        data: ast,
        pos: [
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi),
        ] as [number, number, number]
      };
    });
  }, [asteroids]);

  return (
    <div className="w-full h-[500px] bg-black rounded-2xl overflow-hidden border border-space-700 relative shadow-2xl">
       <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm p-3 rounded-lg text-xs text-accent-cyan font-mono border border-accent-cyan/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-bold tracking-widest">LIVE ORBITAL VIEW</span>
        </div>
        <span className="text-gray-400">Scroll to Zoom • Drag to Rotate</span>
      </div>

      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <ambientLight intensity={1.5} /> 
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
        <Earth />
        {asteroidPositions.map((item, idx) => (
          <AsteroidMesh key={idx} data={item.data} position={item.pos} />
        ))}
        <OrbitControls enablePan={false} minDistance={5} maxDistance={40} />
      </Canvas>
    </div>
  );
}