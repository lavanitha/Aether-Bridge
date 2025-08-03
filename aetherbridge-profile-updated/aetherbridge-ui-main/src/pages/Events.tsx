import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, Video, Globe, Award } from "lucide-react"

export default function Events() {
  const upcomingEvents = [
    {
      title: "Global Education Summit 2024",
      description: "Join world leaders in education to discuss the future of global academic mobility",
      date: "December 15, 2024",
      time: "9:00 AM - 6:00 PM EST",
      location: "Virtual & Singapore",
      attendees: 2500,
      type: "Conference",
      nftBadge: true,
      free: true
    },
    {
      title: "Blockchain in Education Webinar",
      description: "Explore how blockchain technology is revolutionizing credential verification",
      date: "December 20, 2024",
      time: "2:00 PM - 3:30 PM EST",
      location: "Virtual",
      attendees: 450,
      type: "Webinar",
      nftBadge: true,
      free: true
    },
    {
      title: "International Student Exchange Fair",
      description: "Discover exchange opportunities with top universities worldwide",
      date: "January 10, 2025",
      time: "10:00 AM - 4:00 PM EST",
      location: "New York, NY",
      attendees: 1200,
      type: "Fair",
      nftBadge: false,
      free: false
    }
  ]

  const pastEvents = [
    {
      title: "AI in Academic Assessment Workshop",
      date: "November 28, 2024",
      attendees: 380,
      recording: true,
      nftEarned: true,
      rating: 4.8
    },
    {
      title: "Cross-Border Credit Transfer Panel",
      date: "November 15, 2024",
      attendees: 620,
      recording: true,
      nftEarned: true,
      rating: 4.9
    },
    {
      title: "Future of Digital Credentials Symposium",
      date: "October 22, 2024",
      attendees: 890,
      recording: true,
      nftEarned: false,
      rating: 4.7
    }
  ]

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Upcoming Events</h1>
        <p className="mb-4 text-lg text-gray-300">Stay informed about global academic events, workshops, and conferences.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-slate-800 rounded-xl shadow overflow-hidden flex flex-col p-4">
              <img src={`https://via.placeholder.com/150`} alt={event.title} className="w-full h-32 object-cover rounded-md mb-3" />
              <h2 className="text-xl font-semibold mb-1 text-white">{event.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{event.date} | {event.location}</p>
              <Badge variant="outline" className="mb-3 border-gray-600 text-white">{event.type}</Badge>
              <button className="mt-auto py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
                Register Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h2 className="text-xl font-semibold mb-2 text-white">My Registered Events</h2>
        {pastEvents.length === 0 ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">No Registered Events</h3>
            <p className="text-gray-400">Register for events to track your participation and earn NFT badges</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-slate-800 rounded-xl shadow overflow-hidden flex flex-col p-4">
                <h3 className="text-xl font-semibold mb-1 text-white">{event.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{event.date}</p>
                <Badge variant="outline" className="mb-3 border-gray-600 text-white">Past Event</Badge>
                <button className="mt-auto py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17 11H9.41l3.3-3.29a1 1 0 0 0-1.42-1.42l-5 5a1 1 0 0 0 0 1.42l5 5a1 1 0 0 0 1.42-1.42L9.41 13H17a1 1 0 1 0 0-2z"/></svg>
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}