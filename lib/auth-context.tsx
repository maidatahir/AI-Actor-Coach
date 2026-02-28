"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (name: string, email: string, password: string, role: "student" | "teacher") => Promise<{ error?: string }>
  logout: () => void
  updateProfile: (updates: { name?: string; email?: string; newPassword?: string; currentPassword?: string }) => { error?: string }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on mount via API
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user)
      })
      .catch((err) => console.error("Session error:", err))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Implementations are now on the login page directly for form handeling
    return { error: "Depreciated Context fn. Use the `/api/auth/login` route directly" }
  }, [])

  const signup = useCallback(
    async (name: string, email: string, password: string, role: "student" | "teacher") => {
      return { error: "Depreciated Context fn. Use the `/api/auth/signup` route directly" }
    },
    []
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
    window.location.href = "/login"
  }, [])

  const updateProfile = useCallback(
    (updates: { name?: string; email?: string; newPassword?: string; currentPassword?: string }) => {
      if (!user) return { error: "Not logged in" }
      // Mocked for now - API route needs to be added later
      const updatedUser = { ...user, ...updates } as User
      setUser(updatedUser)
      return {}
    },
    [user]
  )

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
