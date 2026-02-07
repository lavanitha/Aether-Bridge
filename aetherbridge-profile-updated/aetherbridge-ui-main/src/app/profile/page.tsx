
"use client";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto rounded-2xl border border-slate-700 p-6 shadow-xl bg-slate-900">
        <h1 className="text-4xl font-bold text-center mb-2 text-violet-300">AetherBridge</h1>
        <p className="text-center text-slate-400 mb-8">Empowering your academic journey on the blockchain.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="bg-slate-800 p-4 rounded-xl shadow">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">P</div>
              <button className="mt-2 text-sm px-4 py-1 bg-purple-500 rounded-full">Upload Photo</button>
            </div>
            <div className="space-y-3 text-sm">
              <input className="w-full p-2 rounded bg-slate-700" placeholder="Full Name" value="Aetheria Bloom" readOnly />
              <input className="w-full p-2 rounded bg-slate-700" placeholder="Email" value="aetheria.bloom@aetherbridge.edu" readOnly />
              <input className="w-full p-2 rounded bg-slate-700" placeholder="Phone" value="+1 (555) 123-4567" readOnly />
              <input className="w-full p-2 rounded bg-slate-700" placeholder="DOB" value="21-07-2003" readOnly />
              <select className="w-full p-2 rounded bg-slate-700">
                <option>Female</option>
              </select>
              <input className="w-full p-2 rounded bg-slate-700" placeholder="Nationality" value="Cosmic Federation" readOnly />
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-slate-800 p-4 rounded-xl shadow space-y-3 text-sm">
            <div>
              <label className="text-slate-400">Decentralized ID (DID)</label>
              <div className="p-2 bg-slate-700 rounded break-all text-blue-300 text-xs">did:aether:0x7c4f...aa9b</div>
            </div>
            <select className="w-full p-2 rounded bg-slate-700">
              <option>Aether University</option>
            </select>
            <input className="w-full p-2 rounded bg-slate-700" placeholder="Student ID" value="AB-2077-1001" readOnly />
            <input className="w-full p-2 rounded bg-slate-700" placeholder="Program" value="Decentralized Systems Engineer" readOnly />
            <input className="w-full p-2 rounded bg-slate-700" placeholder="Semester" value="Year 3 / Semester 6" readOnly />
          </div>

          {/* Credentials & Preferences */}
          <div className="bg-slate-800 p-4 rounded-xl shadow space-y-4 text-sm">
            <div>
              <h3 className="text-slate-300 font-semibold mb-2">Blockchain Verified Credentials</h3>
              <div className="grid grid-cols-2 gap-2">
                <span className="bg-slate-700 px-2 py-1 rounded text-center">AI Fundamentals</span>
                <span className="bg-slate-700 px-2 py-1 rounded text-center">Decentralized Finance</span>
                <span className="bg-slate-700 px-2 py-1 rounded text-center">Smart Contracts 101</span>
                <span className="bg-slate-700 px-2 py-1 rounded text-center">Data Structures</span>
              </div>
            </div>
            <div>
              <h3 className="text-slate-300 font-semibold mb-2">Academic Passport</h3>
              <button className="w-full py-2 rounded-full bg-purple-500 hover:bg-purple-600 font-medium">View All Academic Records</button>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-300 font-semibold">Preferences</h3>
              <ul className="list-disc ml-5 text-slate-400 space-y-1">
                <li>Data Sharing Preferences</li>
                <li>Notification Settings</li>
                <li>Multi-language Interface</li>
                <li>Enable Academic Recommendations (AI)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save Changes</button>
          <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded">Reset</button>
        </div>
      </div>
    </div>
  );
}
