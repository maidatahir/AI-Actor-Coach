import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import LibraryScript from "@/models/LibraryScript"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await dbConnect()

    const scripts = await LibraryScript
      .find({}, { title: 1, genre: 1, difficulty: 1, totalScenes: 1 })
      .sort({ title: 1 })
      .lean<any[]>()

    return NextResponse.json({
      scripts: scripts.map((s) => ({
        _id:        s._id.toString(),
        title:      s.title,
        author:     "Film",
        genre:      s.genre  ?? "Film",
        difficulty: s.difficulty ?? "Intermediate",
        scenes:     s.totalScenes ?? 0,
      })),
    })
  } catch (err) {
    console.error("[library-scripts GET]", err)
    return NextResponse.json({ scripts: [] })
  }
}
