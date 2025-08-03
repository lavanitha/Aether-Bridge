import React from "react";

export default function MintNFT() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl bg-black bg-opacity-70 rounded-2xl shadow-card p-4 border border-border">
        <h1 className="text-3xl font-bold mb-2 text-left text-white">Mint NFT Credential</h1>
        <p className="mb-4 text-left text-lg text-gray-300">Securely tokenize a record of your academic credential by tokenizing it on the blockchain. When you mint your credential, you will receive a unique Token ID that institutions can use to verify your record.</p>
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Select Credential to Mint</h2>
          <p className="mb-2 text-gray-400">Choose the academic credential you wish to mint as an NFT.</p>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Credential</label>
            <select className="w-full p-2 rounded bg-slate-900 text-white">
              <option>Introduction to Computer Science</option>
              <option>Advanced Calculus</option>
              <option>Blockchain Fundamentals</option>
            </select>
          </div>
          <button className="w-full py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2 mt-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
            Mint Credential NFT
          </button>
        </div>
      </div>
    </div>
  );
} 