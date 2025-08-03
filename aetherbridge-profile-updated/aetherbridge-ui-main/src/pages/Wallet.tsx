import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, Link, Copy, ExternalLink, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function WalletPage() {
  const { toast } = useToast()

  const walletAddress = "0x1234567890abcdef1234567890abcdef12345678"

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleConnectWallet = () => {
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to MetaMask",
    });
  };

  const transactions = [
    { type: "Mint NFT", amount: "0.05", date: "Dec 15, 2024", status: "Completed" },
    { type: "Course Enrollment", amount: "0.01", date: "Dec 12, 2024", status: "Completed" },
    { type: "Skill Assessment", amount: "0.005", date: "Dec 10, 2024", status: "Pending" },
    { type: "Mentorship Session", amount: "0.02", date: "Dec 8, 2024", status: "Completed" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Your Web3 Wallet</h1>
        <p className="mb-4 text-lg text-gray-300">Connect and manage your blockchain wallet for AetherBridge decentralized services.</p>
        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Wallet Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1 font-medium text-white">Connection Status</label>
              <div className="p-2 rounded bg-slate-900 text-green-400 font-semibold">Connected</div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-white">Network</label>
              <div className="p-2 rounded bg-slate-900 text-white">Ethereum Mainnet</div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Wallet Address</label>
            <div className="p-2 rounded bg-slate-900 break-all text-blue-300 text-sm">0x7c4fC5E...345aA9b</div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-white">Balance</label>
            <div className="p-2 rounded bg-slate-900 text-white">5.23 ETH</div>
          </div>
          <button className="w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 mt-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11H9.41l3.3-3.29a1 1 0 0 0-1.42-1.42l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42-1.42L9.41 13H17a1 1 0 1 0 0-2z"/></svg>
            Disconnect Wallet
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-white">Type</th>
                  <th className="py-2 px-4 text-left text-white">Amount</th>
                  <th className="py-2 px-4 text-left text-white">Date</th>
                  <th className="py-2 px-4 text-left text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="border-t border-slate-700">
                    <td className="py-2 px-4 text-white">{tx.type}</td>
                    <td className="py-2 px-4 text-gray-300">{tx.amount} ETH</td>
                    <td className="py-2 px-4 text-gray-300">{tx.date}</td>
                    <td className="py-2 px-4"><span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'Completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}