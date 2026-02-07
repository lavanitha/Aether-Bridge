import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MessageCircle, Star, Globe, Video, Clock, User } from "lucide-react"

export default function Mentorship() {
  const activeMentors = [
    {
      name: "Dr. Sarah Johnson",
      title: "AI Research Director",
      institution: "Stanford University",
      specialties: ["Machine Learning", "Neural Networks"],
      rating: 4.9,
      sessions: 24,
      nextSession: "Dec 18, 2:00 PM",
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Prof. Michael Chen",
      title: "Blockchain Expert",
      institution: "MIT",
      specialties: ["Blockchain", "Cryptography"],
      rating: 4.8,
      sessions: 18,
      nextSession: "Dec 20, 4:00 PM",
      avatar: "/api/placeholder/40/40"
    }
  ]

  const availableMentors = [
    {
      name: "Dr. Elena Rodriguez",
      title: "Data Science Lead",
      institution: "UC Berkeley",
      specialties: ["Data Science", "Statistics"],
      rating: 4.9,
      experience: "8 years",
      rate: "$120/hour",
      languages: ["English", "Spanish"],
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Prof. James Wilson",
      title: "Quantum Computing Researcher",
      institution: "Harvard University",
      specialties: ["Quantum Computing", "Physics"],
      rating: 4.7,
      experience: "12 years",
      rate: "$150/hour",
      languages: ["English"],
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Dr. Aisha Patel",
      title: "Software Engineering Manager",
      institution: "Google",
      specialties: ["Software Engineering", "Leadership"],
      rating: 4.8,
      experience: "10 years",
      rate: "$100/hour",
      languages: ["English", "Hindi"],
      avatar: "/api/placeholder/40/40"
    }
  ]

  const upcomingSessions = [
    {
      mentor: "Dr. Sarah Johnson",
      topic: "Advanced Neural Network Architectures",
      date: "Dec 18, 2024",
      time: "2:00 PM - 3:00 PM",
      type: "Video Call"
    },
    {
      mentor: "Prof. Michael Chen",
      topic: "Blockchain Implementation Strategies",
      date: "Dec 20, 2024",
      time: "4:00 PM - 5:00 PM",
      type: "Video Call"
    }
  ]

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Mentorship Hub</h1>
        <p className="mb-4 text-lg text-gray-300">Connect with experienced mentors for personalized guidance and support.</p>

        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Featured Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeMentors.map((mentor, index) => (
              <div key={index} className="bg-slate-900 rounded-xl shadow overflow-hidden flex flex-col p-4 items-center text-center">
                <img src={mentor.avatar} alt={mentor.name} className="w-24 h-24 rounded-full mb-3" />
                <h3 className="text-xl font-semibold mb-1 text-white">{mentor.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{mentor.title}</p>
                <div className="text-sm text-gray-400 mb-2">
                  <span>{mentor.sessions} sessions completed</span>
                  <span>Next: {mentor.nextSession}</span>
                </div>
                <button className="mt-auto py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary">Find a Mentor</h2>
          <div className="mb-4">
            <input className="w-full p-2 rounded bg-slate-900 text-white" placeholder="Search mentors..." />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-white">Name</th>
                  <th className="py-2 px-4 text-left text-white">Field</th>
                  <th className="py-2 px-4 text-left text-white">Expertise</th>
                  <th className="py-2 px-4 text-left text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeMentors.map((mentor, index) => (
                  <tr key={index} className="border-t border-slate-700">
                    <td className="py-2 px-4 text-white font-medium">{mentor.name}</td>
                    <td className="py-2 px-4 text-gray-300">{mentor.title}</td>
                    <td className="py-2 px-4 text-gray-300">{mentor.specialties.join(', ')}</td>
                    <td className="py-2 px-4">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">View Profile</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-4">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming" className="text-white">Upcoming Sessions</TabsTrigger>
              <TabsTrigger value="sessions" className="text-white">Past Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Upcoming Sessions</h3>
              {upcomingSessions.map((session, index) => (
                <div key={index} className="bg-slate-900 p-3 rounded-lg flex items-center justify-between shadow">
                  <div>
                    <h4 className="font-medium text-white">{session.topic}</h4>
                    <p className="text-sm text-gray-400">with {session.mentor}</p>
                  </div>
                  <div className="text-right text-sm text-gray-300">
                    <span>{session.date}</span><br/>
                    <span>{session.time}</span><br/>
                    <Badge variant="outline" className="mt-1 border-gray-600 text-white">{session.type}</Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="sessions" className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold mb-2 text-white">Past Sessions</h3>
              {/* No past sessions data provided in the original file, so this will be empty */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}