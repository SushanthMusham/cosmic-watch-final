"use client";

import { AlertTriangle, Globe, Zap, Activity, Cpu, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

// Matches backend/src/services/nasaService.ts
interface Asteroid {
  id: string;
  name: string;
  is_hazardous: boolean;
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

const formatNumber = (num: string) => {
  const n = parseFloat(num);
  if (isNaN(n)) return "0";
  if (n > 1000000) return (n / 1000000).toFixed(2) + "M";
  if (n > 1000) return (n / 1000).toFixed(0) + "K";
  return n.toFixed(0);
};

export default function AsteroidCard({ asteroid }: { asteroid: Asteroid }) {
  const [hovered, setHovered] = useState(false);
  const [aiText, setAiText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Simplified data access (Thanks to your clean backend!)
  const speed = parseInt(asteroid.close_approach_data.velocity_kmh);
  const distance = parseFloat(asteroid.close_approach_data.miss_distance_km);
  const size = asteroid.estimated_diameter_km.max;
  const riskLevel = asteroid.risk_level;

  // Dynamic Styles based on Risk
  let riskColor = "text-accent-cyan";
  let borderColor = "border-space-700";
  let glowColor = "group-hover:shadow-accent-cyan/20";

  if (riskLevel === "Moderate") {
    riskColor = "text-yellow-400";
    glowColor = "group-hover:shadow-yellow-400/20";
  } else if (riskLevel === "Critical") {
    riskColor = "text-orange-500";
    glowColor = "group-hover:shadow-orange-500/20";
  } else if (riskLevel === "Extreme") {
    riskColor = "text-accent-red";
    borderColor = "border-accent-red/50";
    glowColor = "group-hover:shadow-accent-red/40";
  }

  // --- AI SUMMARY FETCH ---
  useEffect(() => {
    if (hovered && !hasFetched && !loading) {
      setLoading(true);
      axios.post("http://localhost:5000/api/asteroid/summary", {
        name: asteroid.name.replace(/[()]/g, ""),
        size: size.toFixed(3),
        speed: speed,
        distance: distance,
        risk: riskLevel
      })
      .then((res) => {
        setAiText(res.data.summary);
        setHasFetched(true);
        setLoading(false);
      })
      .catch(() => {
        setAiText("⚠ UPLINK FAILED. Manual data review required.");
        setLoading(false);
      });
    }
  }, [hovered, hasFetched]);

  // --- TYPEWRITER EFFECT ---
  useEffect(() => {
    if (aiText) {
      setTypedText("");
      let i = 0;
      const timer = setInterval(() => {
        if (i < aiText.length) {
          setTypedText((prev) => prev + aiText.charAt(i));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 15);
      return () => clearInterval(timer);
    }
  }, [aiText]);

  return (
    <div 
      className={`relative group bg-space-800 rounded-xl p-5 border ${borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${glowColor} overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* HEADER */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{asteroid.name.replace(/[()]/g, "")}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Globe className="w-3 h-3" /> {asteroid.close_approach_data.orbiting_body} Orbit
          </p>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded bg-space-900 border ${borderColor} ${riskColor}`}>
          RISK: {riskLevel.toUpperCase()}
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
        <div>
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Diameter</p>
          <div className="flex items-center gap-2 text-white font-mono">
            <Activity className="w-4 h-4 text-gray-400" />
            {size.toFixed(3)} <span className="text-xs text-gray-500">km</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Velocity</p>
          <div className="flex items-center justify-end gap-2 text-white font-mono">
            <Zap className="w-4 h-4 text-gray-400" />
            {speed.toLocaleString()} <span className="text-xs text-gray-500">km/h</span>
          </div>
        </div>
      </div>

      {/* PROXIMITY BAR */}
      <div className="relative z-10">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500 uppercase">Proximity</span>
          <span className={`font-mono font-bold ${riskColor}`}>
            {formatNumber(asteroid.close_approach_data.miss_distance_km)} km
          </span>
        </div>
        <div className="w-full bg-space-900 h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${riskLevel === "Extreme" ? "bg-accent-red" : riskLevel === "Critical" ? "bg-orange-500" : riskLevel === "Moderate" ? "bg-yellow-400" : "bg-accent-cyan"}`}
            style={{ width: `${Math.max(5, 100 - (distance / 50000000) * 100)}%` }}
          ></div>
        </div>
      </div>

      {/* AI OVERLAY */}
      <div className={`absolute inset-0 bg-space-900/95 backdrop-blur-sm p-5 flex flex-col justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"} z-20`}>
        <div className="flex items-center gap-2 mb-3 text-accent-cyan">
          <Cpu className="w-5 h-5 animate-pulse" />
          <span className="text-xs font-bold tracking-widest">LIVE GEMINI AI ANALYSIS</span>
        </div>
        
        <div className="font-mono text-sm leading-relaxed text-gray-300 min-h-[80px]">
          {loading ? (
             <div className="flex items-center gap-2 text-accent-cyan animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ESTABLISHING UPLINK...</span>
             </div>
          ) : (
            <>
              {typedText}
              <span className="animate-pulse text-accent-cyan">_</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}