"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, Play, User, Layers, Upload, Plus, FileText, Trash2 } from "lucide-react"
import Link from "next/link"
import UploadScriptModal from "./upload-modal"

// Props representing fetched data from the server
interface ScriptLibraryClientProps {
  libraryScripts: any[]
  userScripts: any[]
}

export default function ScriptLibraryClient({ libraryScripts, userScripts }: ScriptLibraryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"library" | "my-scripts">("library")
  const [showUploadModal, setShowUploadModal] = useState(false)

  const displayScripts = activeTab === "library" ? libraryScripts : userScripts
  const genres = Array.from(new Set(displayScripts.map((s) => s.genre)))

  const filteredScripts = displayScripts.filter((script) => {
    const matchesSearch =
      script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      script.author?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = !selectedGenre || script.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  // We handle deletions using a server action / api route
  const handleDeleteUserScript = async (id: string) => {
    if (!confirm("Are you sure you want to delete this script?")) return
    try {
      await fetch(`/api/scripts/${id}`, { method: 'DELETE' })
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("Failed to delete script")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Script Library</h1>
          <p className="text-white/50">Browse our collection or upload your own scripts</p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-lg shadow-purple-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Script
        </Button>
      </div>

      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => { setActiveTab("library"); setSelectedGenre(null) }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "library"
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
              : "text-white/50 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Pre-loaded Library ({libraryScripts.length})
        </button>
        <button
          onClick={() => { setActiveTab("my-scripts"); setSelectedGenre(null) }}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "my-scripts"
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30"
              : "text-white/50 hover:text-white"
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          My Scripts ({userScripts.length})
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            type="search"
            placeholder="Search scripts or authors..."
            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGenre(null)}
            className={selectedGenre === null
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
              : "rounded-full border-white/10 text-white/60 hover:text-white hover:bg-white/5"
            }
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
              className={selectedGenre === genre
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
                : "rounded-full border-white/10 text-white/60 hover:text-white hover:bg-white/5"
              }
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredScripts.map((script) => (
          <div key={script._id || script.id} className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <Badge
                  className={`text-xs ${
                    script.difficulty === "Beginner"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : script.difficulty === "Intermediate"
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      : script.difficulty === "Advanced"
                      ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  }`}
                >
                  {script.difficulty || "Custom"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{script.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <User className="w-4 h-4" />
                  {script.author || "Unknown"}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Layers className="w-4 h-4" />
                  {script.scenes || 0} scenes
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-white/10 text-white/50 text-xs">
                  {script.genre}
                </Badge>
                {activeTab === "my-scripts" && (
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Uploaded
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl" asChild>
                  <Link href={`/dashboard/scripts/${script._id || script.id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    View Scenes
                  </Link>
                </Button>
                {activeTab === "my-scripts" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 rounded-xl z-20"
                    onClick={() => handleDeleteUserScript(script._id || script.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredScripts.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {activeTab === "my-scripts" ? "No uploaded scripts yet" : "No scripts found"}
          </h3>
          <p className="text-white/40 mb-4">
            {activeTab === "my-scripts"
              ? "Upload your own acting scripts to get started"
              : "Try adjusting your search or filter"}
          </p>
          {activeTab === "my-scripts" && (
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Script
            </Button>
          )}
        </div>
      )}

      {showUploadModal && <UploadScriptModal onClose={() => setShowUploadModal(false)} />}
    </div>
  )
}
