"use client";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto rounded-2xl border border-slate-700 p-4 shadow-xl bg-black bg-opacity-70">
        <h1 className="text-4xl font-bold text-center mb-2 text-violet-300">AetherBridge</h1>
        <p className="text-center text-gray-400 mb-4">Empowering your academic journey on the blockchain.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Personal Info */}
          <div className="bg-slate-800 p-4 rounded-xl shadow">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">P</div>
              <button className="mt-2 text-sm px-4 py-1 bg-purple-500 rounded-full text-white">Upload Photo</button>
            </div>
            <div className="space-y-3 text-sm">
              <input className="w-full p-2 rounded bg-slate-700 text-white" placeholder="Full Name" value="Aetheria Bloom" readOnly />
              <input className="w-full p-2 rounded bg-slate-700 text-white" placeholder="Email" value="aetheria.bloom@aetherbridge.edu" readOnly />
              <input className="w-full p-2 rounded bg-slate-700 text-white" placeholder="Phone" value="+1 (555) 123-4567" readOnly />
              <input className="w-full p-2 rounded bg-slate-700 text-white" placeholder="DOB" value="21-07-2003" readOnly />
              <select className="w-full p-2 rounded bg-slate-700 text-white" value="Female">
                <option>Male</option>
                <option>Female</option>
              </select>
              <input className="w-full p-2 rounded bg-slate-700 text-white" placeholder="Nationality" value="Cosmic Federation" readOnly />
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-slate-800 p-4 rounded-xl shadow space-y-3 text-sm">
            <div>
              <label className="text-gray-400">Decentralized ID (DID)</label>
              <div className="p-2 bg-slate-700 rounded break-all text-blue-300 text-xs">did:aether:0x7c4f...aa9b</div>
            </div>
            <div>
              <label className="text-gray-400">Enrollment Status</label>
              <input className="w-full p-2 rounded bg-slate-700 text-white" value="Active" readOnly />
            </div>
            <div>
              <label className="text-gray-400">Institution</label>
              <input className="w-full p-2 rounded bg-slate-700 text-white" value="Galactic University" readOnly />
            </div>
            <div>
              <label className="text-gray-400">Major</label>
              <input className="w-full p-2 rounded bg-slate-700 text-white" value="Astrophysics" readOnly />
            </div>
            <div>
              <label className="text-gray-400">Current Courses</label>
              <div className="p-2 rounded bg-slate-700 text-white">Interstellar Navigation, Quantum Mechanics</div>
            </div>
          </div>

          {/* Credentials Summary */}
          <div className="bg-slate-800 p-4 rounded-xl shadow space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">Total Credentials</div>
              <div className="text-lg font-bold text-white">12</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">Verified on Blockchain</div>
              <div className="text-lg font-bold text-green-400">9</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="font-medium text-white">Pending Verification</div>
              <div className="text-lg font-bold text-yellow-400">3</div>
            </div>
            <button className="w-full py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2 mt-4">
              View All Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 