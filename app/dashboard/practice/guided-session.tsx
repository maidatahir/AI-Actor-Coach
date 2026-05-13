"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Mic, MicOff, Volume2, ChevronRight, CheckCircle,
  Play, Users, BookOpen, Loader2,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type ContextBlock = { type: "context"; text: string }
type SpeechBlock  = { type: "speech";  speaker: string; lines: string[] }
type Block        = ContextBlock | SpeechBlock

type EmotionData = { top: string; all: Record<string, number> }
type LineEmotion = { top: string; all: Record<string, number> }

type Phase = "start" | "running" | "complete"

// ─── Constants ────────────────────────────────────────────────────────────────

const EMOTION_ORDER = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]

const EMOTION_BADGE_CLS: Record<string, string> = {
  anger:    "bg-red-500/20 text-red-300 border-red-500/30",
  disgust:  "bg-green-700/20 text-green-300 border-green-700/30",
  fear:     "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  joy:      "bg-yellow-400/20 text-yellow-200 border-yellow-400/30",
  neutral:  "bg-white/10 text-white/60 border-white/20",
  sadness:  "bg-blue-500/20 text-blue-300 border-blue-500/30",
  surprise: "bg-purple-500/20 text-purple-300 border-purple-500/30",
}

const EMOTION_BAR_CLS: Record<string, string> = {
  anger:    "bg-red-500",
  disgust:  "bg-green-600",
  fear:     "bg-yellow-500",
  joy:      "bg-yellow-300",
  neutral:  "bg-white/50",
  sadness:  "bg-blue-500",
  surprise: "bg-purple-500",
}

const EMOTION_TIPS: Record<string, string> = {
  anger:    "Tense jaw, raised voice, sharp movements.",
  disgust:  "Wrinkle your nose, lean slightly back.",
  fear:     "Wide eyes, quick breaths, trembling voice.",
  joy:      "Bright eyes, open posture, warm smile.",
  neutral:  "Calm, measured delivery.",
  sadness:  "Sunken posture, slow pace, soft voice.",
  surprise: "Raised brows, open mouth, gasping breath.",
}

// ─── TTS / STT helpers ───────────────────────────────────────────────────────

function selectVoice(): SpeechSynthesisVoice | undefined {
  const voices = globalThis.speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang === "en-GB" && !v.localService) ??
    voices.find((v) => v.lang.startsWith("en") && !v.localService) ??
    voices.find((v) => v.lang.startsWith("en"))
  )
}

function buildUtterance(text: string, resolve: () => void): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = selectVoice()
  if (voice) utterance.voice = voice
  utterance.rate  = 0.88
  utterance.pitch = 1
  utterance.onend   = resolve
  utterance.onerror = resolve
  return utterance
}

function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (globalThis.window === undefined) { resolve(); return }
    globalThis.speechSynthesis.cancel()
    if (globalThis.speechSynthesis.getVoices().length > 0) {
      globalThis.speechSynthesis.speak(buildUtterance(text, resolve))
    } else {
      globalThis.speechSynthesis.onvoiceschanged = () => {
        globalThis.speechSynthesis.speak(buildUtterance(text, resolve))
      }
    }
  })
}

function parseRecognitionResult(event: any): string {
  let interim = ""
  let final   = ""
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const text = event.results[i][0].transcript
    if (event.results[i].isFinal) final += text
    else interim += text
  }
  return final || interim
}

async function fetchEmotionData(text: string): Promise<EmotionData | null> {
  if (!text || text.trim().length < 4) return null
  try {
    const res = await fetch("/api/emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown" }))
      console.error("[GuidedSession] Emotion fetch failed:", err)
      return null
    }
    const data = await res.json()
    if (!data?.emotion) return null
    return { top: data.emotion, all: data.all ?? { [data.emotion]: data.score ?? 1 } }
  } catch (err) {
    console.error("[GuidedSession] Emotion fetch error:", err)
    return null
  }
}

// ─── Emotion UI components ────────────────────────────────────────────────────

function EmotionBadge({ emotion }: Readonly<{ emotion: string }>) {
  const cls = EMOTION_BADGE_CLS[emotion.toLowerCase()] ?? EMOTION_BADGE_CLS.neutral
  return (
    <Badge className={`capitalize border ${cls}`}>
      {emotion}
    </Badge>
  )
}

function DetectingBadge() {
  return (
    <Badge className="bg-white/5 border-white/10 text-white/30 border animate-pulse gap-1">
      <Loader2 className="w-3 h-3 animate-spin" /> Detecting…
    </Badge>
  )
}

function EmotionBreakdown({ data }: Readonly<{ data: EmotionData }>) {
  // Sort all emotions by their intensity, but always include all 7 categories
  const sorted = [...EMOTION_ORDER].sort((a, b) => (data.all[b] ?? 0) - (data.all[a] ?? 0))

  return (
    <div className="space-y-2 py-1">
      {sorted.map((emotion) => {
        const pct   = Math.round((data.all[emotion] ?? 0) * 100)
        const isDom = emotion === data.top.toLowerCase()
        const bar   = EMOTION_BAR_CLS[emotion] ?? "bg-white/40"
        return (
          <div key={emotion} className="flex items-center gap-2">
            <span className={`text-[10px] w-[4.5rem] text-right capitalize shrink-0 ${isDom ? "text-white font-bold" : "text-white/50"}`}>
              {emotion}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${bar} ${isDom ? "opacity-90" : "opacity-50"}`}
                style={{ width: `${Math.max(pct, 1.5)}%` }}
              />
            </div>
            <span className={`text-[10px] w-7 shrink-0 tabular-nums ${isDom ? "text-white font-bold" : "text-white/50"}`}>
              {pct}%
            </span>
            {isDom && <span className="text-[9px] text-green-400 shrink-0">✓</span>}
          </div>
        )
      })}
    </div>
  )
}

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: Readonly<{ current: number; total: number }>) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-white/40">
        <span>Segment {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Context Block UI ─────────────────────────────────────────────────────────

function ContextBlockUI({ block, ttsPlaying, isLast, onNext }: Readonly<{
  block:      ContextBlock
  ttsPlaying: boolean
  isLast:     boolean
  onNext:     () => void
}>) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          ttsPlaying
            ? "bg-blue-500/20 border border-blue-500/40 animate-pulse"
            : "bg-white/10 border border-white/20"
        }`}>
          <Volume2 className={`w-5 h-5 ${ttsPlaying ? "text-blue-400" : "text-white/50"}`} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Narrator</p>
          <p className="text-sm text-white/60">{ttsPlaying ? "Speaking…" : "Done speaking"}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/20 border border-white/5">
        <p className="text-sm text-white/60 italic leading-relaxed">{block.text}</p>
      </div>

      {ttsPlaying ? (
        <div className="flex items-center justify-center gap-1.5 py-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 bg-blue-400 rounded-full animate-pulse"
              style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      ) : (
        <Button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl gap-2"
        >
          {isLast ? "Finish Scene" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}

// ─── Speech Block UI ──────────────────────────────────────────────────────────

function SpeechBlockUI({ block, emotionData, lineEmotionList, isLast, isRecording, recorded, transcript, onStartRecording, onStopRecording, onNext }: Readonly<{
  block:            SpeechBlock
  emotionData:      EmotionData | undefined
  lineEmotionList:  (LineEmotion | null)[] | undefined
  isLast:           boolean
  isRecording:      boolean
  recorded:         boolean
  transcript:       string
  onStartRecording: () => void
  onStopRecording:  () => void
  onNext:           () => void
}>) {
  return (
    <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/70 mb-1">Your turn to speak</p>
          <p className="text-2xl font-bold text-white">{block.speaker}</p>
        </div>
        {liveEmotion 
          ? <div className="flex flex-col items-end gap-1">
              <p className="text-[10px] text-white/30 uppercase font-bold">Live</p>
              <EmotionBadge emotion={liveEmotion.top} />
            </div>
          : emotionData
            ? <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-white/30 uppercase font-bold">Target</p>
                <EmotionBadge emotion={emotionData.top} />
              </div>
            : <DetectingBadge />
        }
      </div>

      {/* Emotion breakdown */}
      {(liveEmotion ?? emotionData) ? (
        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
            {(liveEmotion) ? "Live Performance Analysis" : "Script Analysis (Target)"}
          </p>
          <EmotionBreakdown data={(liveEmotion ?? emotionData) as EmotionData} />
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-black/20 border border-white/5 animate-pulse">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Emotion Breakdown</p>
          <p className="text-xs text-white/20">Analysing lines…</p>
        </div>
      )}

      {/* Acting tip */}
      {emotionData && EMOTION_TIPS[emotionData.top.toLowerCase()] && (
        <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/15">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400/70 mb-1">Acting tip</p>
          <p className="text-sm text-white/60">{EMOTION_TIPS[emotionData.top.toLowerCase()]}</p>
        </div>
      )}

      {/* Lines to say — with per-line emotion chips */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">
          <BookOpen className="w-3 h-3 inline mr-1" />
          Say these lines:
        </p>
        {block.lines.map((line, idx) => {
          const lineEd      = lineEmotionList?.[idx]
          const isLoading   = lineEmotionList !== undefined && lineEmotionList.length <= idx
          return (
            <div key={`${idx}-${line.slice(0, 20)}`} className="flex items-start gap-2">
              <p className="text-white/85 leading-relaxed text-sm flex-1">{line}</p>
              <div className="shrink-0 pt-0.5">
                {isLoading && (
                  <Badge className="bg-white/5 border-white/10 text-white/20 border text-[10px] px-1.5 h-5 gap-1 animate-pulse">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  </Badge>
                )}
                {!isLoading && lineEd && <EmotionBadge emotion={lineEd.top} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recording controls */}
      <div className="space-y-3">
        {recorded ? (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl gap-2 shadow-lg shadow-green-500/25"
          >
            <CheckCircle className="w-4 h-4" />
            {isLast ? "Finish Scene" : "Next"}
          </Button>
        ) : (
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            size="lg"
            className={`w-full rounded-xl gap-2 transition-all ${
              isRecording
                ? "bg-red-500 hover:bg-red-400 shadow-lg shadow-red-500/30"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-500/25"
            } text-white`}
          >
            {isRecording
              ? <><MicOff className="w-4 h-4" /> Stop Recording</>
              : <><Mic className="w-4 h-4" /> Start Speaking</>
            }
          </Button>
        )}
      </div>

      {/* Live transcript */}
      {(isRecording || transcript) && (
        <div className="p-4 rounded-xl bg-black/30 border border-white/10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-2">
            {isRecording ? "Listening…" : "You said:"}
          </p>
          <p className={`text-sm leading-relaxed ${isRecording ? "text-white/50 animate-pulse" : "text-white/80"}`}>
            {transcript || "…"}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Start Screen ─────────────────────────────────────────────────────────────

export function StartScreen({
  scriptTitle, sceneTitle, blocks, emotions, onStart,
}: Readonly<{
  scriptTitle: string
  sceneTitle:  string
  blocks:      Block[]
  emotions:    Record<number, EmotionData>
  onStart:     () => void
}>) {
  const speakers     = [...new Set(blocks.filter((b): b is SpeechBlock => b.type === "speech").map((b) => b.speaker))]
  const contextCount = blocks.filter((b) => b.type === "context").length
  const speechCount  = blocks.filter((b) => b.type === "speech").length

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="text-purple-400 text-sm font-medium uppercase tracking-widest mb-3">{scriptTitle}</p>
        <h1 className="text-3xl font-bold text-white mb-2">{sceneTitle}</h1>
        <p className="text-white/50 text-sm">
          {blocks.length} segments · {contextCount} context · {speechCount} speeches
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <Volume2 className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-xs text-white/40 mb-1">Computer speaks</p>
          <p className="text-sm text-white">Stage directions are narrated automatically</p>
        </div>
        <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <Mic className="w-5 h-5 text-purple-400 mb-2" />
          <p className="text-xs text-purple-400/80 mb-1">You speak</p>
          <p className="text-sm text-white">Your voice is recorded &amp; transcribed live</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <Users className="w-5 h-5 text-cyan-400 mb-2" />
          <p className="text-xs text-white/40 mb-1">Your characters</p>
          <p className="text-sm text-white">{speakers.length > 0 ? speakers.join(", ") : "All"}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Full Scene Script</p>
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {blocks.map((block, i) => {
            if (block.type === "context") {
              return (
                <div
                  key={`ctx-${block.text.slice(0, 30)}`}
                  className="rounded-xl border border-white/8 px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="w-3 h-3 text-blue-400/60" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60">
                      Context — Computer reads aloud
                    </p>
                  </div>
                  <p className="text-sm text-white/40 italic leading-relaxed">{block.text}</p>
                </div>
              )
            }
            const ed = emotions[i]
            return (
              <div
                key={`spk-${block.speaker}-${block.lines[0]?.slice(0, 20)}`}
                className="rounded-xl bg-purple-500/8 border border-purple-500/20 px-4 py-3"
              >
                {/* Speaker header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Mic className="w-3 h-3 text-purple-400/60" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/70">You speak</p>
                    </div>
                    <p className="text-base font-bold text-white">{block.speaker}</p>
                  </div>
                  {ed ? <EmotionBadge emotion={ed.top} /> : <DetectingBadge />}
                </div>

                {/* Emotion breakdown */}
                {ed ? (
                  <div className="mb-3 p-2.5 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1.5">Emotion Breakdown</p>
                    <EmotionBreakdown data={ed} />
                  </div>
                ) : (
                  <div className="mb-3 p-2.5 rounded-lg bg-black/20 border border-white/5 animate-pulse">
                    <p className="text-[10px] text-white/20">Analysing…</p>
                  </div>
                )}

                {/* Acting tip */}
                {ed && EMOTION_TIPS[ed.top.toLowerCase()] && (
                  <div className="mb-3 p-2 rounded-lg bg-orange-500/5 border border-orange-500/10">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-orange-400/60 mb-0.5">Acting tip</p>
                    <p className="text-xs text-white/50">{EMOTION_TIPS[ed.top.toLowerCase()]}</p>
                  </div>
                )}

                {/* Lines */}
                <div className="space-y-1">
                  {block.lines.map((line) => (
                    <p key={line.slice(0, 40)} className="text-sm text-white/80 leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onStart}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full px-14 py-6 text-lg shadow-xl shadow-purple-500/30 gap-3"
        >
          <Play className="w-5 h-5" />
          Begin Practice
        </Button>
        <p className="text-xs text-white/25">
          Make sure your microphone is enabled · Works best in Chrome or Edge
        </p>
      </div>
    </div>
  )
}

// ─── Completion Screen ────────────────────────────────────────────────────────

export function CompletionScreen({ onRestart }: Readonly<{ onRestart: () => void }>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6">
      <div className="w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-green-400" />
      </div>
      <h2 className="text-3xl font-bold text-white">Scene Complete!</h2>
      <p className="text-white/50 max-w-sm">
        Great work! You&apos;ve finished this scene. Practice again to improve your delivery.
      </p>
      <Button
        onClick={onRestart}
        size="lg"
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full px-10"
      >
        Practice Again
      </Button>
    </div>
  )
}

// ─── Main Guided Session ──────────────────────────────────────────────────────

export default function GuidedSession({
  blocks, scriptTitle, sceneTitle,
}: Readonly<{
  blocks:      Block[]
  scriptTitle: string
  sceneTitle:  string
}>) {
  const [phase,       setPhase]       = useState<Phase>("start")
  const [blockIndex,  setBlockIndex]  = useState(0)
  const [ttsPlaying,  setTtsPlaying]  = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript,  setTranscript]  = useState("")
  const [recorded,    setRecorded]    = useState(false)
  const [emotions,     setEmotions]     = useState<Record<number, EmotionData>>({})
  const [lineEmotions, setLineEmotions] = useState<Record<number, (LineEmotion | null)[]>>({})
  const [liveEmotion,  setLiveEmotion]  = useState<EmotionData | null>(null)

  const recognitionRef        = useRef<any>(null)
  const loadedLineBlocksRef   = useRef<Set<number>>(new Set())
  const currentBlock   = blocks[blockIndex]
  const isLast         = blockIndex === blocks.length - 1

  // Fetch all emotions sequentially, set them all at once
  useEffect(() => {
    let cancelled = false
    async function loadEmotions() {
      const updates: Record<number, EmotionData> = {}
      for (const [i, block] of blocks.entries()) {
        if (block.type !== "speech") continue
        const ed = await fetchEmotionData(block.lines.join(" "))
        if (ed) updates[i] = ed
      }
      if (!cancelled && Object.keys(updates).length > 0) setEmotions(updates)
    }
    loadEmotions().catch(() => {})
    return () => { cancelled = true }
  }, [blocks])

  // Load per-line emotions for the active speech block when it becomes visible
  useEffect(() => {
    if (phase !== "running") return
    const block = blocks[blockIndex]
    if (block?.type !== "speech") return
    if (loadedLineBlocksRef.current.has(blockIndex)) return

    loadedLineBlocksRef.current.add(blockIndex)
    let cancelled = false

    async function loadLines() {
      const speechBlock = blocks[blockIndex] as SpeechBlock
      // Mark the slot so the UI shows loading chips immediately
      setLineEmotions(prev => ({ ...prev, [blockIndex]: [] }))
      const partial: (LineEmotion | null)[] = []
      for (const line of speechBlock.lines) {
        if (line.trim().length < 8) {
          partial.push(null)
        } else {
          const ed = await fetchEmotionData(line)
          if (cancelled) return
          partial.push(ed ?? null)
        }
        // Update incrementally so chips appear one by one as each line is analysed
        setLineEmotions(prev => ({ ...prev, [blockIndex]: [...partial] }))
      }
    }

    loadLines().catch(() => {})
    return () => { cancelled = true }
  }, [blockIndex, phase, blocks])

  useEffect(() => {
    if (phase !== "running" || currentBlock?.type !== "context") return
    setTtsPlaying(true)
    setTranscript("")
    setRecorded(false)
    speakText(currentBlock.text).then(() => setTtsPlaying(false))
    return () => { globalThis.speechSynthesis.cancel() }
  }, [blockIndex, phase])

  useEffect(() => {
    if (phase !== "running" || currentBlock?.type !== "speech") return
    setTranscript("")
    setRecorded(false)
    setLiveEmotion(null)
  }, [blockIndex, phase])

  // Live emotion detection for transcript
  useEffect(() => {
    if (!isRecording || transcript.length < 15) return
    const timer = setTimeout(async () => {
      const ed = await fetchEmotionData(transcript)
      if (ed) setLiveEmotion(ed)
    }, 1000) // Debounce 1s
    return () => clearTimeout(timer)
  }, [transcript, isRecording])

  const goNext = useCallback(() => {
    if (isLast) {
      setPhase("complete")
    } else {
      setBlockIndex((prev) => prev + 1)
    }
  }, [isLast])

  const startRecording = useCallback(() => {
    const SR = (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition
    if (!SR) {
      alert("Speech recognition is not supported. Please use Chrome or Edge.")
      return
    }
    const recognition = new SR()
    recognitionRef.current     = recognition
    recognition.continuous     = true
    recognition.interimResults = true
    recognition.lang           = "en-US"
    recognition.onresult = (event: any) => { setTranscript(parseRecognitionResult(event)) }
    recognition.onerror  = () => { setIsRecording(false) }
    recognition.onend    = () => { setIsRecording(false) }
    recognition.start()
    setIsRecording(true)
    setRecorded(false)
    setTranscript("")
  }, [])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
    setRecorded(true)
  }, [])

  if (phase === "start") {
    return (
      <StartScreen
        scriptTitle={scriptTitle}
        sceneTitle={sceneTitle}
        blocks={blocks}
        emotions={emotions}
        onStart={() => setPhase("running")}
      />
    )
  }

  if (phase === "complete") {
    return (
      <CompletionScreen
        onRestart={() => {
          setPhase("start")
          setBlockIndex(0)
          setTranscript("")
          setRecorded(false)
          setLineEmotions({})
          loadedLineBlocksRef.current.clear()
        }}
      />
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <ProgressBar current={blockIndex + 1} total={blocks.length} />

      {currentBlock?.type === "context" && (
        <ContextBlockUI
          block={currentBlock}
          ttsPlaying={ttsPlaying}
          isLast={isLast}
          onNext={goNext}
        />
      )}

      {currentBlock?.type === "speech" && (
        <SpeechBlockUI
          block={currentBlock}
          emotionData={emotions[blockIndex]}
          lineEmotionList={lineEmotions[blockIndex]}
          isLast={isLast}
          isRecording={isRecording}
          recorded={recorded}
          transcript={transcript}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onNext={goNext}
        />
      )}
    </div>
  )
}
