import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) {
      return NextResponse.json({ scripts: [] })
    }

    await dbConnect()
    const dbScripts = await Script.find({}, 'title author totalScenes genre difficulty scenes')
      .lean()
      .exec()
    
    const userScripts = dbScripts.map((s: any) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      title: s.title ?? "Untitled",
      author: s.author ?? "Unknown",
      scenes: s.totalScenes ?? (Array.isArray(s.scenes) ? s.scenes.length : 0),
      genre: s.genre ?? "Custom",
      difficulty: s.difficulty ?? "Custom",
      isUserUploaded: true,
    }))

    return NextResponse.json({ scripts: userScripts })
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

    if (!title || !rawText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // 1. Create the Script record in MongoDB
    const newScript = await Script.create({
      title,
      author: author || "Unknown",
      // Note: If you want to store genre, you'll need to update models/Script.ts
      // source: rawText (storing full raw is usually done in blob storage, but we can save it on the model)
      source: rawText.substring(0, 500) + "..." // truncated for space in DB strings
    })

    // 2. We can optionally parse and save the Scene subdocuments:
    const lines = rawText.split("\n").filter((l: string) => l.trim())
    const sceneMarkerRegex = /^(SCENE|ACT|---|\*\*\*|===)/i
    let sceneCount = 0
    let currentLines: string[] = []
    
    // We will save each delimited section as a separate Scene model relation
    for (const line of lines) {
      if (sceneMarkerRegex.test(line.trim()) && currentLines.length > 0) {
        sceneCount++
        await Scene.create({
          scriptId: newScript._id,
          sceneNumber: sceneCount,
        })
        currentLines = [line.trim()]
      } else {
        currentLines.push(line.trim())
      }
    }

    // Final scene
    if (currentLines.length > 0) {
      sceneCount++
      await Scene.create({
        scriptId: newScript._id,
        sceneNumber: sceneCount,
      })
    }

    // If no scenes detected, create at least 1 scene record for the full text
    if (sceneCount === 0) {
      await Scene.create({
        scriptId: newScript._id,
        sceneNumber: 1,
      })
    }

    return NextResponse.json({ success: true, script: newScript })
  } catch (error) {
    console.error("Script upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
