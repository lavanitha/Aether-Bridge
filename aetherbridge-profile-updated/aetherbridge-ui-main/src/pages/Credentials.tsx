import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Award, Download, Share, ExternalLink, QrCode, CheckCircle } from "lucide-react"

export default function CredentialsPage() {
  const nftCredentials = [
    {
      title: "Machine Learning Specialist",
      issuer: "Stanford University",
      date: "December 2024",
      tokenId: "#ML001",
      verified: true,
      image: "/api/placeholder/200/250",
      description: "Advanced certification in machine learning algorithms and applications",
      type: "NFT", // Added type
      status: "Verified", // Added status
      dateIssued: "December 2024" // Added dateIssued for consistency
    },
    {
      title: "Blockchain Fundamentals",
      issuer: "MIT",
      date: "November 2024",
      tokenId: "#BC001",
      verified: true,
      image: "/api/placeholder/200/250",
      description: "Comprehensive understanding of blockchain technology and smart contracts",
      type: "NFT",
      status: "Verified",
      dateIssued: "November 2024"
    },
    {
      title: "Data Science Professional",
      issuer: "UC Berkeley",
      date: "October 2024",
      tokenId: "#DS001",
      verified: true,
      image: "/api/placeholder/200/250",
      description: "Expert-level data analysis and statistical modeling certification",
      type: "NFT",
      status: "Verified",
      dateIssued: "October 2024"
    }
  ]

  const traditionalCredentials = [
    {
      title: "Bachelor of Science in Computer Science",
      issuer: "Stanford University",
      date: "June 2023",
      type: "Degree",
      gpa: "3.8/4.0",
      verified: true,
      dateIssued: "June 2023", // Added dateIssued
      status: "Verified", // Added status
      tokenId: "#DEG001" // Added tokenId for consistency
    },
    {
      title: "Digital Marketing Certificate",
      issuer: "Google",
      date: "March 2024",
      type: "Certificate",
      duration: "6 months",
      verified: true,
      dateIssued: "March 2024",
      status: "Verified",
      tokenId: "#DMC002"
    },
    {
      title: "Project Management Professional",
      issuer: "PMI",
      date: "August 2024",
      type: "Certification",
      validity: "3 years",
      verified: true,
      dateIssued: "August 2024",
      status: "Verified",
      tokenId: "#PMP003"
    }
  ]

  // Combine both types of credentials for the single display
  const credentials = [...nftCredentials.map(c => ({ ...c, type: c.type || "NFT", dateIssued: c.date, status: c.status || "Verified" })), 
                       ...traditionalCredentials.map(c => ({ ...c, type: c.type || "Traditional", dateIssued: c.date, status: c.status || "Verified" }))];

  const verificationStats = {
    totalCredentials: credentials.length,
    blockchainVerified: nftCredentials.filter(c => c.verified).length,
    institutionsCount: new Set([...nftCredentials.map(c => c.issuer), ...traditionalCredentials.map(c => c.issuer)]).size,
    trustScore: 98
  }

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Your Academic Credentials</h1>
        <p className="mb-4 text-lg text-gray-300">Manage and view all your academic credentials, verified on the blockchain.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {credentials.map((credential, index) => (
            <div key={index} className="bg-slate-800 rounded-xl shadow flex flex-col p-4">
              <h2 className="text-xl font-semibold mb-2 text-white">{credential.title}</h2>
              <p className="text-sm text-gray-400 mb-1">{credential.issuer}</p>
              <p className="text-sm text-gray-400 mb-2">Issued: {credential.dateIssued}</p>
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <Shield className="h-4 w-4 mr-1" /> {credential.type}
              </div>
              <Badge variant="outline" className="mb-3 border-gray-600 text-white">{credential.status}</Badge>
              <p className="text-xs opacity-75 mt-auto text-gray-400">Token ID: {credential.tokenId}</p>
              <button className="mt-2 py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}