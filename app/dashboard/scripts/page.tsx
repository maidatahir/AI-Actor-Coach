import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import { getSession } from "@/lib/session"
import ScriptLibraryClient from "./client-page"
// Required to safely pass mongoose documents to client components
import { preloadedScripts } from "@/lib/preloaded-scripts"

export const dynamic = "force-dynamic"

export default async function ScriptLibraryPage() {
  console.log("ScriptLibraryPage optimized start")
  
  // Parallelize session fetching and DB connection
  const [session, _] = await Promise.all([
    getSession(),
    dbConnect()
  ])

  let userScripts: any[] = []

  try {
    if (session?.userId) {
      // Use projection to fetch only needed fields
      const dbScripts = await Script.find({}, 'title author totalScenes genre difficulty scenes')
        .lean()
        .exec()
      
      userScripts = dbScripts.map((s: any) => ({
        id: s._id.toString(),
        _id: s._id.toString(),
        title: s.title ?? "Untitled",
        author: s.author ?? "Unknown",
        scenes: s.totalScenes ?? (Array.isArray(s.scenes) ? s.scenes.length : 0),
        genre: s.genre ?? "Custom",
        difficulty: s.difficulty ?? "Custom",
        isUserUploaded: true,
      }))
    }
  } catch (error) {
    console.error("Script library database error:", error)
  }

  const libraryScripts = preloadedScripts

  return (
    <ScriptLibraryClient 
      libraryScripts={libraryScripts} 
      userScripts={userScripts} 
    />
  )
}
