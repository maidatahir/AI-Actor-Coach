"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Mic, 
  Brain, 
  Scan, 
  Play, 
  ChevronRight,
  Menu,
  X
} from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Script Analysis",
    description: "AI-powered script analysis that identifies emotional beats and helps you understand your character deeply."
  },
  {
    icon: Mic,
    title: "Record Monologue",
    description: "Record your monologues and receive instant feedback on vocal delivery and emotional authenticity."
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Learn expressions, tone, body language, and timing with advanced AI performance coaching."
  },
  {
    icon: Scan,
    title: "Facial Tracking",
    description: "Real-time facial tracking analyzes your expressions to help you convey authentic emotions on screen."
  }
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-purple-400/60 rounded-full animate-float" />
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-60 left-1/2 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold text-lg">
                Actor<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pro</span> AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
                HOME
              </Link>
              <Link href="#features" className="text-white/60 hover:text-white transition-colors text-sm tracking-wide">
                FEATURES
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
                  SIGN IN
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-full px-6 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
                  GET STARTED
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e1a]/95 backdrop-blur-xl border-t border-white/5 p-4">
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-white/70 hover:text-white py-2">HOME</Link>
              <Link href="#features" className="text-white/70 hover:text-white py-2">FEATURES</Link>
              <Link href="/login">
                <Button variant="ghost" className="w-full text-white/70 hover:text-white justify-start">
                  SIGN IN
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-full">
                  GET STARTED
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?q=80&w=2076&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] via-[#0a0e1a]/95 to-[#0a0e1a]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-[#0a0e1a]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
              MASTER THE STAGE.{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                COMMAND THE SCREEN.
              </span>
            </h1>
            <p className="text-lg text-white/60 mb-8 max-w-lg text-pretty leading-relaxed">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold">ACTORPRO AI</span>: The intelligent acting coach for the modern actor. Get real-time feedback on your performance.
            </p>
            <Link href="/login">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full px-8 py-6 text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance">
              PRECISION TRAINING.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                ELEVATE PERFORMANCE.
              </span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto text-pretty">
              Our AI-powered platform provides comprehensive tools to help you become a better performer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all border border-white/10">
                    <feature.icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
                Powerful{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Dashboard
                </span>
              </h2>
              <p className="text-white/50 mb-8 text-pretty leading-relaxed">
                Track your progress, analyze your performances, and get personalized recommendations all in one place. Our intuitive dashboard makes it easy to see your growth as an actor.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border border-purple-500/20">
                    <Play className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Recent Sessions</h4>
                    <p className="text-white/40 text-sm">Quick access to your practice recordings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
                    <Brain className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Progress Tracker</h4>
                    <p className="text-white/40 text-sm">Visualize your improvement over time</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center border border-emerald-500/20">
                    <FileText className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Recommended Exercises</h4>
                    <p className="text-white/40 text-sm">AI-curated exercises based on your needs</p>
                  </div>
                </div>
              </div>
              <Link href="/login" className="inline-block mt-8">
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-full px-6 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              
              {/* Glass Card Preview */}
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">A</span>
                  </div>
                  <span className="text-white font-medium">ActorPro AI</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 border border-white/10" />
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-white/40 text-sm mb-1">Welcome,</p>
                  <h3 className="text-xl font-semibold text-white">Sarah J.</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/40 text-xs mb-1">Monologues</p>
                    <p className="text-white font-semibold">12 Sessions</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/40 text-xs mb-1">Analysis</p>
                    <p className="text-white font-semibold">8 Reports</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-purple-500/30 transition-colors cursor-pointer">
                    <span className="text-white/60 text-sm group-hover:text-white transition-colors">Progress Tracker</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-purple-500/30 transition-colors cursor-pointer">
                    <span className="text-white/60 text-sm group-hover:text-white transition-colors">My Library</span>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice & Diction Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Voice & Diction</h3>
                <p className="text-white/40 mb-6 text-pretty leading-relaxed">
                  Record any script or exercise and get detailed voice analysis including projection, word-per-minute reading and more.
                </p>
                <div className="space-y-5 mb-8">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Projection</span>
                      <span className="text-cyan-400 font-medium">85%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Clarity</span>
                      <span className="text-cyan-400 font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">Pacing</span>
                      <span className="text-cyan-400 font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30" />
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/25">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
                Community{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Feedback
                </span>
              </h2>
              <p className="text-white/50 mb-6 text-pretty leading-relaxed">
                Learn if you are in sync with other users. Your peers in acting will be able to give casting preferences and other tips, your personal AI acting assistant!
              </p>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full px-6 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
                  GET STARTED
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Glass card */}
          <div className="relative p-12 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-balance">
                UNLOCK YOUR POTENTIAL,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  TOGETHER.
                </span>
              </h2>
              <p className="text-white/50 mb-8 max-w-2xl mx-auto text-pretty">
                Join thousands of actors who are using AI to perfect their craft. Start your journey today.
              </p>
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-full px-10 py-6 text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  GET STARTED
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-white font-semibold">
                Actor<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Pro</span> AI
              </span>
            </Link>
            <p className="text-white/30 text-sm">
              2024 ActorPro AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
