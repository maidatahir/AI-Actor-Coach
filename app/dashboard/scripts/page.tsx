import dbConnect from "@/lib/mongodb"
import Script from "@/models/Script"
import { getSession } from "@/lib/session"
import ScriptLibraryClient from "./client-page"
// Required to safely pass mongoose documents to client components
import { preloadedScripts } from "@/lib/scripts-context"

export const dynamic = "force-dynamic"

export default async function ScriptLibraryPage() {
  await dbConnect()
  const session = await getSession()

  // Fetch from MongoDB, but filter dynamically on the client for now
  // Added standard plain object conversion for passing to Client Components
  let userScripts: any[] = []

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

  // Preloaded library can be mocked here until standard libraries are seeded in DB
  const libraryScripts = preloadedScripts

  return (
    <ScriptLibraryClient 
      libraryScripts={libraryScripts} 
      userScripts={userScripts} 
    />
  )
}
