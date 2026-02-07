import React from "react";

export default function VerifyCredentials() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-black bg-opacity-70 rounded-2xl shadow-card p-6 border border-border space-y-6">
        {/* Top Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-left text-white">Verify Credentials</h1>
          <p className="mb-4 text-left text-lg text-gray-300">Securely verify academic credentials by entering the unique Token ID provided to each student.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Enter Token ID */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 text-primary">Enter Token ID</h2>
              <p className="mb-2 text-gray-400">Securely verify academic credentials by entering the unique Token ID provided to each student.</p>
              <div className="mb-4">
                <label className="block mb-1 font-medium text-white">Student's Token ID</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded bg-slate-900 text-white placeholder-gray-300"
                  placeholder="e.g., ATHER-IP-CS101-ALEXDOE"
                />
              </div>
              <button className="w-full py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2 mt-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
                Verify Credential
              </button>
            </div>

            {/* Instant Credential Evaluation */}
            <div className="bg-slate-800 rounded-xl p-4 text-center">
              <h2 className="text-xl font-semibold mb-2 text-primary">Instant Credential Evaluation</h2>
              <div className="relative w-32 h-32 mx-auto mb-4">
                {/* Trust Score Gauge Placeholder */}
                <div className="w-full h-full rounded-full flex items-center justify-center text-5xl font-bold text-green-400 border-4 border-green-400">
                  91
                </div>
              </div>
              <p className="text-gray-400 text-sm">Trust Score: calculated using AI, semantic analysis</p>
            </div>

            {/* Blockchain-Anchor Authentication (bottom-left) */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 text-primary">Blockchain-Anchor Authentication</h2>
              <div className="flex items-center gap-2 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4Z" fill="currentColor"/><path d="M12 9C10.343 9 9 10.343 9 12C9 13.657 10.343 15 12 15C13.657 15 15 13.657 15 12C15 10.343 13.657 9 12 9Z" fill="currentColor"/></svg>
                <span>Permanent & Immutable</span>
              </div>
              <p className="break-all text-gray-400 text-sm mt-2"><span className="font-medium">IPFS Hash:</span> bafybeighdyt7kfp...7u7dm</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Blockchain-Anchor Authentication (right column) */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h2 className="text-xl font-semibold mb-2 text-primary">Blockchain-Anchor Authentication</h2>
              <div className="space-y-2 text-white">
                <p className="break-all"><span className="font-medium">IPFS Hash:</span> barybeighdyt2kik5p...7u7dm</p>
                <p><span className="font-medium">Mint Date:</span> 07/25/2024 3:40 PM</p>
                <p className="break-all"><span className="font-medium">Verification Tx:</span> 0x123...abc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 