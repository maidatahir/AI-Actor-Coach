"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

function LoginContent() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login"
  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [role, setRole] = useState<"student" | "teacher">("student")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { login, signup, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace("/dashboard")
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords do not match")
          setIsLoading(false)
          return
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to sign up")

        // Trigger context update if needed
        window.location.href = "/dashboard"
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to log in")
        
        window.location.href = "/dashboard"
      }
    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  // Clear error when switching modes
  useEffect(() => {
    setError("")
  }, [mode])

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          {/* Glass Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl" />
            
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-8">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  Actor<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pro</span> AI
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-white/50 mb-6">
                {mode === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Sign up to start improving your acting skills"}
              </p>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/70">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-white/70">Confirm Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-400 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl h-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white/70">I am a</Label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("student")}
                          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all ${
                            role === "student"
                              ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20"
                              : "border-white/10 hover:border-white/20 text-white/50 bg-white/5"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <User className="w-5 h-5" />
                            <span className="font-medium text-sm">Student</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("teacher")}
                          className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all ${
                            role === "teacher"
                              ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20"
                              : "border-white/10 hover:border-white/20 text-white/50 bg-white/5"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="font-medium text-sm">Teacher</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500" />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-white/50">
                        Remember me
                      </Label>
                    </div>
                    <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl h-12 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {mode === "login" ? "Signing in..." : "Creating account..."}
                    </span>
                  ) : (
                    mode === "login" ? "Sign In" : "Create Account"
                  )}
                </Button>

                <p className="text-center text-sm text-white/50">
                  {mode === "login" ? (
                    <>
                      {"Don't have an account? "}
                      <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative z-10">
        <div className="relative max-w-md text-center">
          {/* Animated rings */}
          <div className="w-40 h-40 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 animate-pulse" />
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl shadow-purple-500/40">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Master Your Craft with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI</span>
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Get real-time feedback on your facial expressions, voice modulation, and body language to become a better performer.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full text-sm font-medium border border-purple-500/20 backdrop-blur-sm">
              Emotion Analysis
            </span>
            <span className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-medium border border-cyan-500/20 backdrop-blur-sm">
              Voice Coaching
            </span>
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20 backdrop-blur-sm">
              Body Language
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center text-white/50">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
