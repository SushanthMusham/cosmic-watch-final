"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AsteroidOrbit from "@/components/visuals/AsteroidOrbit";
import AsteroidCard from "@/components/dashboard/AsteroidCard";

// Matches your backend/src/services/nasaService.ts perfectly
interface Asteroid {
  id: string;
  name: string;
  is_hazardous: boolean;
  absolute_magnitude: number;
  estimated_diameter_km: {
    min: number;
    max: number;
  };
  close_approach_data: {
    date: string;
    velocity_kmh: string;
    miss_distance_km: string;
    orbiting_body: string;
  };
  risk_score: number;
  risk_level: 'Low' | 'Moderate' | 'Critical' | 'Extreme';
}

// Emergency Backup Data (Updated to match your schema)
const BACKUP_ASTEROIDS: Asteroid[] = [
  {
    id: "99901",
    name: "(2025 BF3)",
    is_hazardous: true,
    absolute_magnitude: 22,
    estimated_diameter_km: { min: 0.1, max: 0.24 },
    close_approach_data: {
      date: "2025-Feb-08 14:00",
      velocity_kmh: "58032",
      miss_distance_km: "4500000",
      orbiting_body: "Earth"
    },
    risk_score: 85,
    risk_level: "Extreme"
  },
  {
    id: "99902",
    name: "Apophis (Sim)",
    is_hazardous: true,
    absolute_magnitude: 24,
    estimated_diameter_km: { min: 0.3, max: 0.37 },
    close_approach_data: {
      date: "Future Impact",
      velocity_kmh: "110000",
      miss_distance_km: "38000",
      orbiting_body: "Earth"
    },
    risk_score: 95,
    risk_level: "Critical"
  }
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingBackup, setUsingBackup] = useState(false);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://cosmic-watch-final.vercel.app/api/asteroids", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          // Your backend already sorts by risk, so just use it directly!
          setAsteroids(res.data.data);
          setUsingBackup(false);
        } else {
          console.warn("Invalid data format. Switching to backup.");
          setAsteroids(BACKUP_ASTEROIDS);
          setUsingBackup(true);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setAsteroids(BACKUP_ASTEROIDS);
        setUsingBackup(true);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      router.push("/login");
    } else {
      fetchAsteroids();
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#0B0E17] text-white p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#000000_100%)] -z-10"></div>
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-white tracking-widest">
            COSMIC WATCH
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-1">
            OPERATOR: {user?.username} // STATUS: ACTIVE
          </p>
        </div>
        <button onClick={logout} className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded hover:bg-red-500/20 transition text-xs font-bold tracking-wider">
          ABORT SESSION
        </button>
      </div>

      {/* STATUS BAR */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${usingBackup ? "bg-yellow-500" : "bg-accent-cyan"}`}></span>
          {usingBackup ? "OFFLINE SIMULATION MODE" : "NEO MONITORING FEED"}
        </h2>
        <p className="text-gray-400 text-sm">
          {usingBackup ? "⚠ Connection limited. Displaying cached simulation data." : "Real-time telemetry from NASA NeoWs API"}
        </p>
      </div>

      {/* 3D VISUALIZATION */}
      {!loading && (
        <div className="mb-10 animate-in fade-in duration-1000">
          <AsteroidOrbit asteroids={asteroids.map(a => ({
            id: a.id,
            name: a.name,
            is_hazardous: a.is_hazardous,
            close_approach_data: { miss_distance_km: a.close_approach_data.miss_distance_km },
            risk_level: a.risk_level
          }))} />
        </div>
      )}

      {/* CARDS GRID */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-cyan"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {asteroids.map((asteroid) => (
            <AsteroidCard key={asteroid.id} asteroid={asteroid} />
          ))}
        </div>
      )}
    </div>
  );
}