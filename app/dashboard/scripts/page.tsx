import ScriptLibraryClient from "./client-page"
// Required to safely pass mongoose documents to client components
import { preloadedScripts } from "@/lib/preloaded-scripts"

export const dynamic = "force-dynamic"

export default async function ScriptLibraryPage() {
  // Page now loads instantly because we only serve static preloaded scripts
  // User scripts are fetched on the client side to avoid blocking the initial render
  const libraryScripts = preloadedScripts

  return (
    <ScriptLibraryClient 
      libraryScripts={libraryScripts} 
    />
  )
}
