"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Link from "next/link";
import { Rocket, Eye, EyeOff, Lock, Mail } from "lucide-react";
import CinematicBackground from "@/components/visuals/CinematicBackground"; // NEW IMPORT

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      login(res.data.token, {
        _id: res.data._id,
        username: res.data.username,
        email: res.data.email
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden">
      {/* 4K Cinematic Background */}
      <CinematicBackground />

      <div className="z-10 w-full max-w-md p-8 bg-space-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-1000">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-accent-cyan/10 rounded-full border border-accent-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Rocket className="w-10 h-10 text-accent-cyan" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-2 tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-cyan">
          COSMIC WATCH
        </h2>
        <p className="text-center text-gray-400 mb-8 text-xs font-mono uppercase tracking-widest">
          Secure Access Terminal
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-200 text-xs text-center font-mono">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-accent-cyan transition-colors" />
            <input
              type="email"
              placeholder="Operator ID (Email)"
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all placeholder:text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-accent-cyan transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passcode"
              required
              className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all placeholder:text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-accent-cyan text-black font-bold py-3.5 rounded-lg hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transform hover:-translate-y-0.5"
          >
            INITIATE SESSION
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          New personnel?{" "}
          <Link href="/register" className="text-accent-cyan hover:underline hover:text-cyan-300 transition-colors">
            Register Access
          </Link>
        </div>
      </div>
    </main>
  );
}