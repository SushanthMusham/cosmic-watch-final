"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Rocket } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-16 border-b border-space-700 bg-space-900/80 backdrop-blur-md flex items-center justify-between px-6 fixed top-0 z-50">
      <div className="flex items-center gap-2">
        <Rocket className="text-accent-cyan w-6 h-6" />
        <Link href="/dashboard" className="text-xl font-bold tracking-wider text-white">
          COSMIC<span className="text-accent-cyan">WATCH</span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <UserIcon className="w-4 h-4 text-accent-cyan" />
              <span>{user.username}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-bold text-accent-red hover:text-red-400 transition-colors border border-accent-red/30 px-3 py-1.5 rounded bg-accent-red/10"
            >
              <LogOut className="w-3 h-3" />
              ABORT SESSION
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm text-accent-cyan hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}