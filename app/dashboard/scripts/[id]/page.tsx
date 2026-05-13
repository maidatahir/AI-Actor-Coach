import 'server-only'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Play, Clock, Smile, BookOpen } from "lucide-react"
import Link from "next/link"
import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import { preloadedScripts } from "@/lib/preloaded-scripts"

export const dynamic = "force-dynamic"

const SCENE_PREVIEW_LIMIT = 30

function elementsToLines(elements: any[]): string[] {
  return (elements ?? [])
    .filter((el: any) => el.content?.trim())
    .map((el: any) =>
      el.type === "speaker" ? `[${el.content.trim()}]` : el.content.trim()
    )
}

function buildScenesFromEmbedded(embedded: any[], totalScenes: number) {
  const shown = embedded.slice(0, SCENE_PREVIEW_LIMIT)
  return shown.map((s: any) => ({
    number: s.sceneNumber,
    title: s.sceneHeading || `Scene ${s.sceneNumber}`,
    description: `Scene ${s.sceneNumber} of ${totalScenes}`,
    emotion: "To be determined",
    duration: `~${Math.max(1, Math.ceil((s.elements?.length ?? 0) / 10))} min`,
    lines: elementsToLines(s.elements ?? []).slice(0, 5),
  }))
}

export default async function ScriptDetailPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params

  let script: any = null
  let scenes: any[] = []
  let totalScenes = 0
  let hiddenCount = 0

  const preloaded = preloadedScripts.find((s) => s.id === id)
  if (preloaded) {
    script = preloaded
    scenes = preloaded.sceneData ?? []
    totalScenes = scenes.length
  } else if (id && id.length === 24) {
    await dbConnect()
    try {
      const dbScript = await Script.findById(id).lean<any>()
      if (dbScript) {
        const embedded: any[] = Array.isArray(dbScript.scenes) ? dbScript.scenes : []
        totalScenes = dbScript.totalScenes ?? embedded.length
        hiddenCount = Math.max(0, embedded.length - SCENE_PREVIEW_LIMIT)

        script = {
          id: dbScript._id.toString(),
          title: dbScript.title ?? "Untitled",
          author: dbScript.author ?? "Unknown",
          genre: dbScript.genre ?? "Custom",
          difficulty: dbScript.difficulty ?? "Custom",
          isUserUploaded: true,
        }

        scenes = buildScenesFromEmbedded(embedded, totalScenes)
      }
    } catch {
      // invalid id — script stays null
    }
  }

  if (!script) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="text-white/60 hover:text-white hover:bg-white/5">
          <Link href="/dashboard/scripts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Link>
        </Button>
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Script not found</h2>
          <p className="text-white/40">This script may have been removed</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="text-white/60 hover:text-white hover:bg-white/5">
        <Link href="/dashboard/scripts">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Link>
      </Button>

      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{script.title}</h1>
            <p className="text-lg text-white/50 mt-1">by {script.author}</p>
            {script.description && (
              <p className="text-white/40 mt-4 max-w-2xl leading-relaxed">{script.description}</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm border-white/10 text-white/60">
              {totalScenes} {totalScenes === 1 ? "Scene" : "Scenes"}
            </Badge>
            {script.genre && (
              <Badge className="text-sm bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {script.genre}
              </Badge>
            )}
            {script.difficulty && script.difficulty !== "Custom" && (
              <Badge className="text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {script.difficulty}
              </Badge>
            )}
            {script.isUserUploaded && (
              <Badge className="text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">Uploaded</Badge>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Available Scenes</h2>
          {hiddenCount > 0 && (
            <p className="text-sm text-white/40">Showing first {SCENE_PREVIEW_LIMIT} of {totalScenes} scenes</p>
          )}
        </div>
        <div className="grid gap-4">
          {scenes.map((scene) => (
            <div
              key={`scene-${scene.number}`}
              className="group p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
                    <span className="text-lg font-bold text-purple-400">{scene.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{scene.title}</h3>
                    <p className="text-sm text-white/40">{scene.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {scene.emotion && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Smile className="w-4 h-4" />
                    <span>Emotion: {scene.emotion}</span>
                  </div>
                )}
                {scene.duration && (
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Clock className="w-4 h-4" />
                    <span>{scene.duration}</span>
                  </div>
                )}
              </div>

              {scene.lines?.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/5 max-h-20 overflow-hidden">
                  {scene.lines.slice(0, 2).map((line: string) => (
                    <p key={line.slice(0, 30)} className="text-sm text-white/30 italic truncate">{line}</p>
                  ))}
                  {scene.lines.length > 2 && (
                    <p className="text-xs text-white/20 mt-1">...and {scene.lines.length - 2} more lines</p>
                  )}
                </div>
              )}

              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-purple-500/25"
              >
                <Link href={`/dashboard/practice?script=${id}&scene=${scene.number}`}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {scenes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No scenes available</h3>
          <p className="text-white/40">This script doesn&#39;t have scene data yet</p>
        </div>
      )}
    </div>
  )
}
