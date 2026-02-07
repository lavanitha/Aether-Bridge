import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, FileCheck, Link } from "lucide-react"

export function BlockchainStatus() {
  return (
    <div className="bg-[#1a002a] p-4 rounded-xl shadow-card border border-[#6f00ff]">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-3 text-white">
        <Shield className="h-5 w-5" />
        Blockchain Status
      </h2>
      <div className="space-y-4">
        {/* Wallet Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Wallet Connected</p>
              <p className="text-xs text-gray-400">0x1234...5678</p>
            </div>
          </div>
          <Badge className="bg-[#8e44ad] text-white">Active</Badge>
        </div>

        {/* Credentials */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Verified Credentials</span>
            <Badge variant="secondary" className="bg-[#8e44ad] text-white">8</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FileCheck className="h-4 w-4" />
            Last verification 2 hours ago
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Network</span>
            <Badge className="bg-[#4a008c] text-white">Ethereum</Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link className="h-4 w-4" />
            Block: 18,542,891
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button variant="gradient" size="sm" className="w-full bg-gradient-to-r from-[#9b59b6] to-[#8e44ad] hover:from-[#8e44ad] hover:to-[#9b59b6] transition-all duration-300">
            View on Etherscan
          </Button>
        </div>
      </div>
    </div>
  )
}