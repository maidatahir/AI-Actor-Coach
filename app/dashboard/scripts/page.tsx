import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import { getSession } from "@/lib/session"
import ScriptLibraryClient from "./client-page"
// Required to safely pass mongoose documents to client components
import { preloadedScripts } from "@/lib/preloaded-scripts"

export const dynamic = "force-dynamic"

export default async function ScriptLibraryPage() {
  console.log("ScriptLibraryPage [V4] starting")
  let userScripts: any[] = []

  try {
    await dbConnect()
    const session = await getSession()
    console.log("ScriptLibrary DB connected, session:", !!session)

    if (session?.userId) {
      const dbScripts = await Script.find({}).lean()
      userScripts = JSON.parse(JSON.stringify(
        dbScripts.map((s: any) => ({
          id: s._id.toString(),
          _id: s._id.toString(),
          title: s.title ?? "Untitled",
          author: s.author ?? "Unknown",
          scenes: s.totalScenes ?? (Array.isArray(s.scenes) ? s.scenes.length : 0),
          genre: s.genre ?? "Custom",
          difficulty: s.difficulty ?? "Custom",
          isUserUploaded: true,
        }))
      ))
    }
  } catch (error) {
    console.error("Script library database error:", error)
    // Page will still render with preloaded scripts
  }

  // Preloaded library can be mocked here until standard libraries are seeded in DB
  const libraryScripts = preloadedScripts

  return (
    <ScriptLibraryClient 
      libraryScripts={libraryScripts} 
      userScripts={userScripts} 
    />
  )
}
