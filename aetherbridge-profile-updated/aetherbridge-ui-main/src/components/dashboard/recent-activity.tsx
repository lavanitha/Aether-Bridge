import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User, BookOpen } from "lucide-react"

const activities = [
  {
    type: "course",
    title: "Completed Advanced Calculus Module",
    institution: "MIT OpenCourseWare",
    time: "2 hours ago",
    status: "completed",
    icon: CheckCircle,
    iconColor: "text-accent"
  },
  {
    type: "mentorship",
    title: "1:1 Session with Dr. Sarah Johnson",
    institution: "Stanford University",
    time: "1 day ago",
    status: "scheduled",
    icon: User,
    iconColor: "text-primary"
  },
  {
    type: "certificate",
    title: "Blockchain Fundamentals Certificate Issued",
    institution: "Harvard Extension School",
    time: "3 days ago",
    status: "verified",
    icon: CheckCircle,
    iconColor: "text-accent"
  },
  {
    type: "course",
    title: "Started Machine Learning Specialization",
    institution: "University of Washington",
    time: "1 week ago",
    status: "in-progress",
    icon: BookOpen,
    iconColor: "text-warning"
  }
]

const statusColors = {
  completed: "bg-accent text-accent-foreground",
  scheduled: "bg-primary text-primary-foreground",
  verified: "bg-accent text-accent-foreground",
  "in-progress": "bg-warning text-warning-foreground"
}

export function RecentActivity() {
  return (
    <div className="col-span-2 bg-[#1a002a] p-4 rounded-xl shadow-card border border-[#6f00ff]">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-3 text-white">
        <Clock className="h-5 w-5" />
        Recent Activity
      </h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-slate-800">
            <activity.icon className={`h-5 w-5 mt-0.5 ${activity.iconColor}`} />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="text-xs text-gray-400">{activity.institution}</p>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                  {activity.status.replace('-', ' ')}
                </Badge>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}