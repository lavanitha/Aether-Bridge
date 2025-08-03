import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Clock, Target, TrendingUp, Brain, Code, Users, Globe, Shield } from "lucide-react"
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SkillAssessment() {
  const [activeTab, setActiveTab] = useState("overview");

  const skillDomains = [
    {
      name: "Technical Skills",
      icon: Code,
      progress: 85,
      level: "Advanced",
      lastAssessed: "2 weeks ago",
      nextAssessment: "Available now",
      certifications: 5
    },
    {
      name: "Critical Thinking",
      icon: Brain,
      progress: 72,
      level: "Intermediate",
      lastAssessed: "1 month ago",
      nextAssessment: "Dec 25, 2024",
      certifications: 3
    },
    {
      name: "Leadership",
      icon: Users,
      progress: 68,
      level: "Intermediate",
      lastAssessed: "3 weeks ago",
      nextAssessment: "Jan 5, 2025",
      certifications: 2
    },
    {
      name: "Global Awareness",
      icon: Globe,
      progress: 90,
      level: "Expert",
      lastAssessed: "1 week ago",
      nextAssessment: "Available now",
      certifications: 6
    }
  ]

  const recentAssessments = [
    {
      title: "Advanced JavaScript Proficiency",
      domain: "Technical Skills",
      score: 92,
      date: "Dec 10, 2024",
      blockchain: true,
      time: "45 minutes"
    },
    {
      title: "Cross-Cultural Communication",
      domain: "Global Awareness",
      score: 88,
      date: "Dec 8, 2024",
      blockchain: true,
      time: "30 minutes"
    },
    {
      title: "Problem-Solving Framework",
      domain: "Critical Thinking",
      score: 76,
      date: "Dec 5, 2024",
      blockchain: true,
      time: "60 minutes"
    }
  ]

  const availableAssessments = [
    {
      title: "Machine Learning Fundamentals",
      domain: "Technical Skills",
      difficulty: "Intermediate",
      duration: "60 minutes",
      questions: 40,
      blockchain: true,
      badge: "ML Practitioner"
    },
    {
      title: "Ethical Decision Making",
      domain: "Critical Thinking",
      difficulty: "Advanced",
      duration: "45 minutes",
      questions: 25,
      blockchain: true,
      badge: "Ethics Expert"
    },
    {
      title: "Team Collaboration Dynamics",
      domain: "Leadership",
      difficulty: "Beginner",
      duration: "30 minutes",
      questions: 20,
      blockchain: true,
      badge: "Team Leader"
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Expert": return "bg-gradient-success text-accent-foreground"
      case "Advanced": return "bg-gradient-primary text-primary-foreground"
      case "Intermediate": return "bg-warning text-warning-foreground"
      default: return "bg-secondary text-secondary-foreground"
    }
  }

  const skillData = [
    { name: 'Jan 2024', proficiency: 70 },
    { name: 'Feb 2024', proficiency: 72 },
    { name: 'Mar 2024', proficiency: 75 },
    { name: 'Apr 2024', proficiency: 78 },
    { name: 'May 2024', proficiency: 80 },
    { name: 'Jun 2024', proficiency: 82 },
    { name: 'Jul 2024', proficiency: 84 },
    { name: 'Aug 2024', proficiency: 86 },
    { name: 'Sep 2024', proficiency: 88 },
    { name: 'Oct 2024', proficiency: 90 },
    { name: 'Nov 2024', proficiency: 92 },
    { name: 'Dec 2024', proficiency: 94 },
  ];

  const assessments = [
    { title: "Blockchain Architecture", description: "Understanding the fundamentals of blockchain technology.", duration: "60 minutes", questions: 40 },
    { title: "Smart Contract Security", description: "Learn how to audit and secure smart contracts.", duration: "45 minutes", questions: 25 },
    { title: "Decentralized Finance (DeFi)", description: "Introduction to decentralized finance protocols.", duration: "30 minutes", questions: 20 },
  ];

  const results = [
    { title: "Advanced JavaScript Proficiency", score: 92, date: "Dec 10, 2024", feedback: "Excellent understanding of modern JavaScript features and best practices." },
    { title: "Cross-Cultural Communication", score: 88, date: "Dec 8, 2024", feedback: "Good grasp of cultural nuances and effective communication strategies." },
    { title: "Problem-Solving Framework", score: 76, date: "Dec 5, 2024", feedback: "Solid foundation in problem-solving methodologies and frameworks." },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Skill Assessment</h1>
        <p className="mb-4 text-lg text-gray-300">Evaluate your skills and receive personalized recommendations for improvement.</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 text-white">
            <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
            <TabsTrigger value="assessments" className="text-white">Assessments</TabsTrigger>
            <TabsTrigger value="results" className="text-white">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="bg-slate-800 p-4 rounded-xl shadow-card border border-slate-700">
              <h2 className="text-xl font-semibold mb-2 text-primary">Your Skill Profile</h2>
              <p className="mb-4 text-gray-400">This section provides a summary of your skills and areas for development.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 text-white">Top Skills</h3>
                  <ul className="list-disc ml-4 space-y-1 text-gray-300">
                    <li>Blockchain Development</li>
                    <li>Smart Contract Auditing</li>
                    <li>Decentralized Finance (DeFi)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-white">Areas for Improvement</h3>
                  <ul className="list-disc ml-4 space-y-1 text-gray-300">
                    <li>Advanced Cryptography</li>
                    <li>Layer 2 Scaling Solutions</li>
                    <li>Decentralized Autonomous Organizations (DAOs)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl shadow-card border border-slate-700">
              <h2 className="text-xl font-semibold mb-2 text-primary">Skill Trends</h2>
              <p className="mb-4 text-gray-400">Visualize your skill progression over time.</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={skillData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                  <XAxis dataKey="name" stroke="#CBD5E0" />
                  <YAxis stroke="#CBD5E0" />
                  <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: 'none' }} itemStyle={{ color: '#FFFFFF' }} />
                  <Legend />
                  <Line type="monotone" dataKey="proficiency" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4 pt-4">
            <div className="bg-slate-800 p-4 rounded-xl shadow-card border border-slate-700">
              <h2 className="text-xl font-semibold mb-2 text-primary">Available Assessments</h2>
              <p className="mb-4 text-gray-400">Take an assessment to evaluate your proficiency in various domains.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableAssessments.map((assessment, index) => (
                  <div key={index} className="bg-slate-900 p-3 rounded-lg shadow">
                    <h3 className="font-medium mb-1 text-white">{assessment.title}</h3>
                    <p className="text-sm text-gray-400">{assessment.domain}</p>
                    <div className="flex items-center text-sm text-gray-400 mt-2">
                      <Clock className="h-4 w-4 mr-1" /> {assessment.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Award className="h-4 w-4 mr-1" /> {assessment.questions} Questions
                    </div>
                    <button className="w-full py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2 mt-3">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11H9.41l3.3-3.29a1 1 0 0 0-1.42-1.42l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42-1.42L9.41 13H17a1 1 0 1 0 0-2z"/></svg>
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 pt-4">
            <div className="bg-slate-800 p-4 rounded-xl shadow-card border border-slate-700">
              <h2 className="text-xl font-semibold mb-2 text-primary">Your Assessment Results</h2>
              <p className="mb-4 text-gray-400">Review your past assessment scores and detailed feedback.</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 text-left text-white">Assessment</th>
                      <th className="py-2 px-4 text-left text-white">Score</th>
                      <th className="py-2 px-4 text-left text-white">Date</th>
                      <th className="py-2 px-4 text-left text-white">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-t border-slate-700">
                        <td className="py-2 px-4 text-white font-medium">{result.title}</td>
                        <td className="py-2 px-4 text-gray-300">{result.score}%</td>
                        <td className="py-2 px-4 text-gray-300">{result.date}</td>
                        <td className="py-2 px-4 text-gray-300">{result.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}