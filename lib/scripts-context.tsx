"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { preloadedScripts as _preloadedScripts } from "./preloaded-scripts"
export type { ScriptScene, PreloadedScript } from "./preloaded-scripts"

export interface Script {
  id: string
  title: string
  author: string
  scenes: number
  genre: string
  difficulty: string
  description?: string
  sceneData?: import("./preloaded-scripts").ScriptScene[]
  isUserUploaded?: boolean
  uploadedAt?: string
  rawText?: string
}

export const preloadedScripts: Script[] = _preloadedScripts

const SCRIPTS_KEY = "actorpro_user_scripts"

interface ScriptsContextType {
  scripts: Script[]
  userScripts: Script[]
  allScripts: Script[]
  addUserScript: (title: string, author: string, genre: string, rawText: string) => Script
  deleteUserScript: (id: string) => void
  getScriptById: (id: string) => Script | undefined
}

const ScriptsContext = createContext<ScriptsContextType | undefined>(undefined)

function getStoredUserScripts(): Script[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(SCRIPTS_KEY)
  return data ? JSON.parse(data) : []
}

function saveUserScripts(scripts: Script[]): void {
  localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts))
}

function parseTextToScenes(rawText: string): Script["sceneData"] {
  const lines = rawText.split("\n").filter((l) => l.trim())
  const sceneMarkerRegex = /^(SCENE|ACT|---|\*\*\*|===)/i
  const scenes: NonNullable<Script["sceneData"]> = []
  let currentLines: string[] = []
  let sceneCount = 0

  for (const line of lines) {
    if (sceneMarkerRegex.test(line.trim()) && currentLines.length > 0) {
      sceneCount++
      scenes.push({
        number: sceneCount,
        title: `Scene ${sceneCount}`,
        emotion: "To be determined",
        duration: `${Math.max(2, Math.ceil(currentLines.join(" ").split(" ").length / 150))} min`,
        description: currentLines.slice(0, 2).join(" ").slice(0, 100),
        lines: currentLines,
      })
      currentLines = [line.trim()]
    } else {
      currentLines.push(line.trim())
    }
  }

  if (currentLines.length > 0) {
    sceneCount++
    scenes.push({
      number: sceneCount,
      title: sceneCount === 1 ? "Full Script" : `Scene ${sceneCount}`,
      emotion: "To be determined",
      duration: `${Math.max(2, Math.ceil(currentLines.join(" ").split(" ").length / 150))} min`,
      description: currentLines.slice(0, 2).join(" ").slice(0, 100),
      lines: currentLines,
    })
  }

  return scenes.length > 0
    ? scenes
    : [{ number: 1, title: "Full Script", emotion: "To be determined", duration: "5 min", description: "Uploaded script", lines }]
}

export function ScriptsProvider({ children }: { children: ReactNode }) {
  const [userScripts, setUserScripts] = useState<Script[]>([])

  useEffect(() => {
    setUserScripts(getStoredUserScripts())
  }, [])

  const addUserScript = useCallback((title: string, author: string, genre: string, rawText: string) => {
    const scenes = parseTextToScenes(rawText)
    const newScript: Script = {
      id: `user_${crypto.randomUUID()}`,
      title: title.trim(),
      author: author.trim() || "Personal Script",
      scenes: scenes?.length ?? 1,
      genre: genre || "Personal",
      difficulty: "Custom",
      description: `Uploaded script: ${title}`,
      sceneData: scenes,
      isUserUploaded: true,
      uploadedAt: new Date().toISOString(),
      rawText,
    }

    setUserScripts((prev) => {
      const updated = [...prev, newScript]
      saveUserScripts(updated)
      return updated
    })

    return newScript
  }, [])

  const deleteUserScript = useCallback((id: string) => {
    setUserScripts((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      saveUserScripts(updated)
      return updated
    })
  }, [])

  const allScripts = [...preloadedScripts, ...userScripts]

  const getScriptById = useCallback(
    (id: string) => [...preloadedScripts, ...userScripts].find((s) => s.id === id),
    [userScripts]
  )

  const contextValue = useMemo(
    () => ({ scripts: preloadedScripts, userScripts, allScripts, addUserScript, deleteUserScript, getScriptById }),
    [userScripts, allScripts, addUserScript, deleteUserScript, getScriptById]
  )

  return (
    <ScriptsContext.Provider value={contextValue}>
      {children}
    </ScriptsContext.Provider>
  )
}

export function useScripts() {
  const context = useContext(ScriptsContext)
  if (!context) throw new Error("useScripts must be used within a ScriptsProvider")
  return context
}
