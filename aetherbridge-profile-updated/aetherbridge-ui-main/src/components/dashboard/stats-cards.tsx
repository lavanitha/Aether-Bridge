import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Enrolled Courses",
    value: "12",
    change: "+2 this month",
    icon: BookOpen,
    color: "text-accent"
  },
  {
    title: "Active Mentors",
    value: "5",
    change: "+1 this week",
    icon: Users,
    color: "text-primary"
  },
  {
    title: "Certificates Earned",
    value: "8",
    change: "+3 this month",
    icon: Award,
    color: "text-warning"
  },
  {
    title: "Academic Progress",
    value: "87%",
    change: "+5% this week",
    icon: TrendingUp,
    color: "text-accent"
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#1a002a] p-4 rounded-xl shadow-card border border-[#6f00ff]">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-white">
              {stat.title}
            </h3>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
          <p className="text-xs text-gray-400 mt-1">
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  )
}