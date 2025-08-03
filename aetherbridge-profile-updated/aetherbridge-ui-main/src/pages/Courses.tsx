import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Award, Star, Globe, CheckCircle } from "lucide-react"

export default function Courses() {
  const enrolledCourses = [
    {
      title: "Advanced Machine Learning",
      institution: "Stanford University",
      progress: 78,
      credits: 4,
      rating: 4.8,
      blockchain: true,
      deadline: "Jan 15, 2025",
      category: "AI"
    },
    {
      title: "Blockchain Fundamentals",
      institution: "MIT",
      progress: 92,
      credits: 3,
      rating: 4.9,
      blockchain: true,
      deadline: "Dec 20, 2024",
      category: "Blockchain"
    },
    {
      title: "Data Structures & Algorithms",
      institution: "UC Berkeley",
      progress: 45,
      credits: 4,
      rating: 4.7,
      blockchain: true,
      deadline: "Feb 28, 2025",
      category: "Computer Science"
    }
  ]

  const availableCourses = [
    {
      title: "Quantum Computing Introduction",
      institution: "Harvard University",
      duration: "8 weeks",
      credits: 3,
      rating: 4.9,
      price: "Free",
      level: "Beginner",
      blockchain: true,
      category: "Quantum Computing",
      description: "An introductory course to the principles of quantum computing."
    },
    {
      title: "Digital Ethics & Society",
      institution: "University of Edinburgh",
      duration: "6 weeks",
      credits: 2,
      rating: 4.6,
      price: "$299",
      level: "Intermediate",
      blockchain: true,
      category: "Ethics",
      description: "Explore the ethical implications of digital technologies."
    },
    {
      title: "Global Business Strategy",
      institution: "INSEAD",
      duration: "10 weeks",
      credits: 4,
      rating: 4.8,
      price: "$499",
      level: "Advanced",
      blockchain: false,
      category: "Business",
      description: "Develop strategies for international business success."
    }
  ]

  // Define featuredCourses and allCourses based on existing data for the new layout
  const featuredCourses = availableCourses.slice(0, 3); // Take first 3 available courses as featured
  const allCourses = [...enrolledCourses, ...availableCourses]; // Combine all courses

  return (
    <div className="space-y-4">
      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h1 className="text-3xl font-bold mb-2 text-white">Featured Courses</h1>
        <p className="mb-4 text-lg text-gray-300">Explore a wide range of academic courses from leading institutions worldwide.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCourses.map((course, index) => (
            <div key={index} className="bg-slate-800 rounded-xl shadow overflow-hidden flex flex-col p-4">
              <h2 className="text-xl font-semibold mb-2 text-white">{course.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{course.institution}</p>
              <p className="text-sm text-gray-400 mb-2">{course.description}</p>
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <BookOpen className="h-4 w-4 mr-1" /> {course.credits} Credits
              </div>
              <Badge variant="outline" className="mb-3 border-gray-600 text-white">{course.category}</Badge>
              <button className="mt-auto py-2 rounded bg-primary hover:bg-primary/80 text-white font-medium flex items-center justify-center gap-2">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.25 12h-10l3.75-3.75a.75.75 0 0 0-1.06-1.06l-5 5a.75.75 0 0 0 0 1.06l5 5a.75.75 0 0 0 1.06-1.06L7.25 12.75h10a.75.75 0 0 0 0-1.5z"/></svg>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black bg-opacity-70 p-4 rounded-xl shadow-card border border-border">
        <h2 className="text-xl font-semibold mb-2 text-white">Browse Courses</h2>
        <div className="mb-4">
          <input className="w-full p-2 rounded bg-slate-900 text-white" placeholder="Search courses..." />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left text-white">Title</th>
                <th className="py-2 px-4 text-left text-white">Institution</th>
                <th className="py-2 px-4 text-left text-white">Category</th>
                <th className="py-2 px-4 text-left text-white">Credits</th>
                <th className="py-2 px-4 text-left text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allCourses.map((course, index) => (
                <tr key={index} className="border-t border-slate-700">
                  <td className="py-2 px-4 text-white font-medium">{course.title}</td>
                  <td className="py-2 px-4 text-gray-300">{course.institution}</td>
                  <td className="py-2 px-4"><Badge variant="secondary" className="text-white bg-slate-700">{course.category}</Badge></td>
                  <td className="py-2 px-4 text-gray-300">{course.credits}</td>
                  <td className="py-2 px-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">Enroll</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}