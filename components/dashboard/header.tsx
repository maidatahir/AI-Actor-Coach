"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Search, LogOut, User as UserIcon, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUserInitials } from "@/lib/auth"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const initials = user ? getUserInitials(user.name) : "?"
  const displayName = user?.name || "User"
  const displayEmail = user?.email || ""

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Search - hidden on mobile to make room for menu button */}
        <div className="hidden md:flex relative max-w-md flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            type="search"
            placeholder="Search scripts, sessions..."
            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl"
          />
        </div>

        {/* Spacer for mobile */}
        <div className="md:hidden" />

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => {
                setNotifOpen(!notifOpen)
                setUserMenuOpen(false)
              }}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg shadow-purple-500/50" />
              <span className="sr-only">Notifications</span>
            </Button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#12162a]/95 backdrop-blur-xl border border-white/10 text-white rounded-lg shadow-xl shadow-black/40 overflow-hidden z-[100] animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-semibold text-white/70">Notifications</h3>
                </div>
                <div
                  className="flex flex-col items-start gap-1 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setNotifOpen(false)}
                >
                  <span className="font-medium text-white">New feedback received</span>
                  <span className="text-sm text-white/50">
                    Sarah commented on your Hamlet performance
                  </span>
                </div>
                <div
                  className="flex flex-col items-start gap-1 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setNotifOpen(false)}
                >
                  <span className="font-medium text-white">Assignment due soon</span>
                  <span className="text-sm text-white/50">
                    Romeo and Juliet - Scene 2 is due tomorrow
                  </span>
                </div>
                <div
                  className="flex flex-col items-start gap-1 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => setNotifOpen(false)}
                >
                  <span className="font-medium text-white">Performance milestone</span>
                  <span className="text-sm text-white/50">
                    You completed 10 practice sessions this week
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full p-0"
              onClick={() => {
                setUserMenuOpen(!userMenuOpen)
                setNotifOpen(false)
              }}
            >
              <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User avatar" />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">{initials}</AvatarFallback>
              </Avatar>
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#12162a]/95 backdrop-blur-xl border border-white/10 text-white rounded-lg shadow-xl shadow-black/40 overflow-hidden z-[100] animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{displayName}</p>
                  <p className="text-xs text-white/50">{displayEmail}</p>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  Progress
                </Link>
                <div className="border-t border-white/10">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
