"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Video, Target, Smile, ClipboardCheck, Play, ChevronRight, Mic, BookOpen } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getUserInitials } from "@/lib/auth"

const stats = [
  { 
    label: "Monologues", 
    value: "12",
    subtext: "Sessions",
    icon: Mic,
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-500/20"
  },
  { 
    label: "Analysis", 
    value: "8",
    subtext: "Reports",
    icon: Target,
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-400",
    borderColor: "border-cyan-500/20"
  },
  { 
    label: "Emotion Accuracy", 
    value: "82%", 
    subtext: "+8% this week",
    icon: Smile,
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-500/20"
  },
  { 
    label: "Assignments", 
    value: "8/12", 
    subtext: "Completed",
    icon: ClipboardCheck,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400",
    borderColor: "border-orange-500/20"
  },
]

const recentSessions = [
  { title: "Monologue1", date: "Yesterday", score: "12min" },
  { title: "Analysis", date: "2 days ago", score: "85%" },
]

const recommendedExercises = [
  { title: "Scene", icon: BookOpen },
  { title: "Recordings", icon: Video },
]

const emotionalRangeData = [
  { emotion: "Happiness", value: 85, color: "from-yellow-400 to-orange-400" },
  { emotion: "Sadness", value: 72, color: "from-blue-400 to-indigo-400" },
  { emotion: "Anger", value: 68, color: "from-red-400 to-rose-400" },
  { emotion: "Fear", value: 54, color: "from-purple-400 to-violet-400" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const displayName = user?.name || "User"
  const initials = user ? getUserInitials(user.name) : "?"

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-purple-500/30 shadow-lg shadow-purple-500/20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-white/50">Welcome,</p>
            <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          </div>
        </div>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-purple-500/25">
          <Link href="/dashboard/practice">
            <Play className="w-4 h-4 mr-2" />
            Start Practice
          </Link>
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Sessions & Recommended */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Sessions */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <Link
                  key={index}
                  href="/dashboard/analysis"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/20 transition-all group"
                >
                  <div>
                    <p className="font-medium text-white">{session.title}</p>
                    <p className="text-xs text-white/40">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50">{session.score}</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Progress Tracker Mini */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Progress Tracker</h3>
            <div className="space-y-4">
              {emotionalRangeData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/50">{item.emotion}</span>
                    <span className="text-white font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Exercises */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Recommended Exercises</h3>
            <div className="space-y-3">
              {recommendedExercises.map((exercise, index) => (
                <Link
                  key={index}
                  href="/dashboard/scripts"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center">
                      <exercise.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-medium text-white">{exercise.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* My Library */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">My Library</h3>
            <p className="text-sm text-white/50 mb-4">12 scripts saved</p>
            <Button variant="outline" className="w-full rounded-full border-white/10 text-white hover:bg-white/5" asChild>
              <Link href="/dashboard/scripts">View All</Link>
            </Button>
          </div>
        </div>

        {/* Right Column - Stats & Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className={`p-5 rounded-2xl bg-white/5 backdrop-blur-xl border ${stat.borderColor} hover:bg-white/[0.07] transition-all group`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/50 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/40">{stat.subtext}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} border border-white/5 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emotional Range Chart */}
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-6">Emotional Range</h3>
            <div className="h-48 flex items-end justify-around gap-4">
              {emotionalRangeData.map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-white/5 rounded-t-lg relative" style={{ height: '160px' }}>
                    <div 
                      className={`absolute bottom-0 w-full bg-gradient-to-t ${item.color} rounded-t-lg transition-all duration-700 shadow-lg`}
                      style={{ 
                        height: `${item.value}%`,
                        boxShadow: `0 0 20px 0 rgba(147, 51, 234, 0.2)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-white/40 text-center">{item.emotion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 backdrop-blur-xl border border-purple-500/20 hover:border-purple-500/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Start Practice</h3>
                  <p className="text-sm text-white/50">Record a new session</p>
                </div>
                <Button size="sm" className="rounded-full bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-500/25" asChild>
                  <Link href="/dashboard/practice">
                    <Play className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-all">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">View Analysis</h3>
                  <p className="text-sm text-white/50">Check your progress</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full border-white/10 text-white hover:bg-white/5" asChild>
                  <Link href="/dashboard/analysis">
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
