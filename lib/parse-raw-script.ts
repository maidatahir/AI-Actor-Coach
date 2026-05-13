export interface ScriptElement {
  type: "text" | "speaker" | "dialog"
  content: string
}

export interface ParsedScene {
  sceneNumber: number
  sceneHeading: string
  elements: ScriptElement[]
}

// Lines that mark a new scene
const SCENE_HEADING_RE =
  /^(INT\.|EXT\.|INT\/EXT\.|I\/E\.|SCENE\s+\d|ACT\s+(ONE|TWO|THREE|FOUR|\d+)|SCENE:)/i

function isSceneHeading(line: string): boolean {
  return SCENE_HEADING_RE.test(line)
}

// Common words that are all-caps but are NOT speaker names
const NOT_SPEAKERS = new Set([
  "YES","NO","OK","THE","AND","BUT","FOR","NOT","YOU","ALL","ARE","GET",
  "CAN","DID","HAS","HAD","HIM","HIS","HOW","ITS","NOW","OLD","ONE","OUR",
  "OUT","SAY","SHE","TOO","USE","WAY","WHO","WHY","WAS","STOP","WAIT",
  "HELP","COME","LOOK","HEAR","FADE","CUT","END",
])

// ALL-CAPS standalone speaker line (JOHN, MARY, VOICE OVER, etc.)
function isSpeakerLine(line: string): boolean {
  if (isSceneHeading(line)) return false
  if (line.length < 3) return false
  if (NOT_SPEAKERS.has(line.trim())) return false
  return /^[A-Z][A-Z\s'.()-]{1,39}$/.test(line) && line.trim().split(/\s+/).length <= 5
}

// Inline format — "SPEAKER: dialog" or "Speaker: dialog"
function parseInline(line: string): { speaker: string; dialog: string } | null {
  const m = line.match(/^([A-Z][A-Za-z\s'.-]{0,35}):\s+(.+)$/)
  if (!m) return null
  const words = m[1].trim().split(/\s+/)
  if (words.length > 5) return null
  return { speaker: m[1].trim(), dialog: m[2].trim() }
}

function parseSceneLines(lines: string[]): ScriptElement[] {
  const elements: ScriptElement[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) { i++; continue }

    // Bracketed stage directions → context
    if (/^\[.+\]$/.test(line)) {
      elements.push({ type: "text", content: line.slice(1, -1).trim() })
      i++; continue
    }

    // Parenthetical only lines → skip (stage directions mid-dialog)
    if (/^\(.+\)$/.test(line)) { i++; continue }

    // Inline speaker: dialog format
    const inline = parseInline(line)
    if (inline) {
      elements.push({ type: "speaker", content: inline.speaker })
      elements.push({ type: "dialog",  content: inline.dialog })
      i++
      // Collect any continuation dialog lines
      while (i < lines.length) {
        const next = lines[i].trim()
        if (!next) break
        if (isSpeakerLine(next) || parseInline(next) || isSceneHeading(next)) break
        if (/^\(.+\)$/.test(next)) { i++; continue }
        elements.push({ type: "dialog", content: next })
        i++
      }
      continue
    }

    // Standalone speaker name
    if (isSpeakerLine(line)) {
      elements.push({ type: "speaker", content: line })
      i++
      // Collect dialog lines below the speaker
      while (i < lines.length) {
        const next = lines[i].trim()
        if (!next) break
        if (isSpeakerLine(next) || parseInline(next) || isSceneHeading(next)) break
        if (/^\(.+\)$/.test(next)) { i++; continue }
        elements.push({ type: "dialog", content: next })
        i++
      }
      continue
    }

    // Everything else is narration/context
    elements.push({ type: "text", content: line })
    i++
  }

  return elements
}

export function parseRawScript(rawText: string): ParsedScene[] {
  const lines = rawText.split(/\r?\n/)

  // Find scene heading boundaries
  const starts: { lineIdx: number; heading: string }[] = []
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t && isSceneHeading(t)) starts.push({ lineIdx: i, heading: t })
  }

  // No scene headings → single scene
  if (starts.length === 0) {
    const elements = parseSceneLines(lines)
    return [{ sceneNumber: 1, sceneHeading: "Scene 1", elements }]
  }

  const scenes: ParsedScene[] = []
  for (let si = 0; si < starts.length; si++) {
    const { lineIdx, heading } = starts[si]
    const end = si + 1 < starts.length ? starts[si + 1].lineIdx : lines.length
    const sceneLines = lines.slice(lineIdx + 1, end)
    const elements = parseSceneLines(sceneLines)
    if (elements.length > 0) {
      scenes.push({ sceneNumber: si + 1, sceneHeading: heading, elements })
    }
  }

  return scenes.length > 0
    ? scenes
    : [{ sceneNumber: 1, sceneHeading: "Scene 1", elements: parseSceneLines(lines) }]
}
