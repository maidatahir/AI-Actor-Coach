import { NextResponse } from "next/server"
import mongoose from "mongoose"
import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import Scene from "@/models/Scene"
import { getSession } from "@/lib/session"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }
  try {
    await dbConnect()
    const dbScript = await Script.findById(id).lean<any>()
    if (!dbScript) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const dbScenes = await Scene.find({ scriptId: id }).sort({ sceneNumber: 1 }).lean<any[]>()
    // Scripts store content as an embedded scenes array (Python backend format)
    const embedded: any[] = Array.isArray(dbScript.scenes) ? dbScript.scenes : []
    const totalScenes: number = dbScript.totalScenes ?? embedded.length

    // Parse elements into context blocks and speech blocks
    function parseElements(elements: any[]) {
      const blocks: any[] = []
      let currentSpeaker: string | null = null
      let currentLines: string[] = []
      const contextBuffer: string[] = []

      function flushContext() {
        if (contextBuffer.length > 0) {
          blocks.push({ type: "context", text: contextBuffer.join(" ") })
          contextBuffer.length = 0
        }
      }
      function flushSpeech() {
        if (currentSpeaker && currentLines.length > 0) {
          blocks.push({ type: "speech", speaker: currentSpeaker, lines: [...currentLines] })
        }
        currentSpeaker = null
        currentLines = []
      }

      for (const el of elements ?? []) {
        const content = el.content?.trim()
        if (!content) continue
        if (el.type === "text") {
          flushSpeech()
          contextBuffer.push(content)
        } else if (el.type === "speaker") {
          flushSpeech()
          flushContext()
          currentSpeaker = content
        } else if (el.type === "dialog") {
          if (currentSpeaker) {
            currentLines.push(content)
          } else {
            contextBuffer.push(content)
          }
        }
      }
      flushSpeech()
      flushContext()
      return blocks
    }

    const sceneData = embedded.length > 0
      ? embedded.map((s: any) => ({
          number: s.sceneNumber,
          title: s.sceneHeading || `Scene ${s.sceneNumber}`,
          description: `Scene ${s.sceneNumber} of ${totalScenes}`,
          emotion: "To be determined",
          duration: `~${Math.max(1, Math.ceil((s.elements?.length ?? 0) / 10))} min`,
          blocks: parseElements(s.elements ?? []),
          // keep lines for preview cards (first few dialog lines only)
          lines: (s.elements ?? [])
            .filter((el: any) => el.type === "dialog" && el.content?.trim())
            .slice(0, 3)
            .map((el: any) => el.content.trim()),
        }))
      : [{
          number: 1,
          title: dbScript.title ?? "Full Script",
          description: "No scene data available",
          emotion: "To be determined",
          duration: "Unknown",
          blocks: [] as any[],
          lines: [] as string[],
        }]

    return NextResponse.json({
      id: dbScript._id.toString(),
      title: dbScript.title ?? "Untitled",
      author: dbScript.author ?? "Unknown",
      genre: dbScript.genre ?? "Custom",
      difficulty: dbScript.difficulty ?? "Custom",
      totalScenes,
      isUserUploaded: true,
      sceneData,
    })
  } catch (error) {
    console.error("Script fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

    await dbConnect()

    // Optionally check if user owns the script in a real app
    
    // Delete script and its scenes
    await Script.findByIdAndDelete(id)
    await Scene.deleteMany({ scriptId: id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Script deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
