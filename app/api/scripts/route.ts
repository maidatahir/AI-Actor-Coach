import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import { getSession } from "@/lib/session"
import { parseRawScript } from "@/lib/parse-raw-script"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ scripts: [] })
    }

    await dbConnect()
    const docs = await Script.find(
      {},
      { title: 1, author: 1, genre: 1, difficulty: 1, totalScenes: 1 }
    ).sort({ createdAt: -1 }).lean<any[]>()

    const scripts = docs.map((s: any) => ({
      id:            s._id.toString(),
      _id:           s._id.toString(),
      title:         s.title        ?? "Untitled",
      author:        s.author       ?? "Unknown",
      genre:         s.genre        ?? "Custom",
      difficulty:    s.difficulty   ?? "Custom",
      scenes:        s.totalScenes  ?? 0,
      isUserUploaded: true,
    }))

    return NextResponse.json({ scripts })
  } catch (error) {
    console.error("Script fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, author, genre, rawText } = await req.json()
    if (!title?.trim() || !rawText?.trim()) {
      return NextResponse.json({ error: "Title and script text are required" }, { status: 400 })
    }

    // Parse free-form text → structured scenes with typed elements
    const parsedScenes = parseRawScript(rawText)

    await dbConnect()

    const newScript = await Script.create({
      title:       title.trim(),
      author:      author?.trim() || "Unknown",
      genre:       genre?.trim()  || "Custom",
      difficulty:  "Custom",
      totalScenes: parsedScenes.length,
      scenes:      parsedScenes,
      userId:      session.userId,
    })

    return NextResponse.json({
      success: true,
      script: {
        _id:         newScript._id.toString(),
        id:          newScript._id.toString(),
        title:       newScript.title,
        totalScenes: parsedScenes.length,
      },
    })
  } catch (error) {
    console.error("Script upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
