import { NextResponse } from "next/server"

const HF_MODEL = "j-hartmann/emotion-english-distilroberta-base"
// Use the standard inference endpoint which is more stable for single-model calls
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    if (!text?.trim()) return NextResponse.json({ emotion: "neutral", score: 1 })

    const token = process.env.HUGGINGFACE_API_TOKEN?.trim()
    if (!token) {
      console.warn("[emotion] No HUGGINGFACE_API_TOKEN set")
      return NextResponse.json({ emotion: "neutral", score: 0.1, error: "No token set" })
    }

    console.log(`[emotion] Calling HF API for text: "${text.slice(0, 20)}..."`)

    const res = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        inputs: text.slice(0, 512),
        options: { wait_for_model: true } // Ensure model is loaded
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[emotion] HF API error ${res.status}:`, errText)
      return NextResponse.json({ 
        emotion: "neutral", 
        score: 0.1, 
        error: `HF API ${res.status}: ${errText.slice(0, 100)}` 
      })
    }

    const data = await res.json()
    console.log("[emotion] HF raw response:", JSON.stringify(data))

    // HF returns [[{label, score}, ...]] for classification
    let results: { label: string; score: number }[] = []
    if (Array.isArray(data?.[0])) results = data[0]
    else if (Array.isArray(data)) results = data

    if (results.length === 0) {
      console.error("[emotion] Unexpected response shape:", data)
      return NextResponse.json({ emotion: "neutral", score: 1 })
    }

    const sorted = [...results].sort((a, b) => b.score - a.score)
    const top = sorted[0]

    return NextResponse.json({
      emotion: top.label,
      score: top.score,
      all: Object.fromEntries(sorted.map((r) => [r.label, r.score])),
    })
  } catch (err) {
    console.error("[emotion] Unexpected error:", err)
    return NextResponse.json({ emotion: "neutral", score: 1 })
  }
}
