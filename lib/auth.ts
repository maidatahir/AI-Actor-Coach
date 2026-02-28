// User authentication utilities — localStorage based (frontend-only)

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
  createdAt: string
}

interface StoredUser extends User {
  password: string
}

const USERS_KEY = "actorpro_users"
const SESSION_KEY = "actorpro_session"

// Simple hash for demo purposes (not cryptographically secure)
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : []
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signUp(
  name: string,
  email: string,
  password: string,
  role: "student" | "teacher"
): { user?: User; error?: string } {
  const users = getStoredUsers()

  // Check for duplicate email
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "An account with this email already exists" }
  }

  // Validate
  if (!name.trim()) return { error: "Name is required" }
  if (!email.trim()) return { error: "Email is required" }
  if (password.length < 6) return { error: "Password must be at least 6 characters" }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    password: simpleHash(password),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveStoredUsers(users)

  const { password: _, ...user } = newUser
  return { user }
}

export function logIn(
  email: string,
  password: string
): { user?: User; error?: string } {
  const users = getStoredUsers()
  const found = users.find((u) => u.email === email.trim().toLowerCase())

  if (!found) {
    return { error: "No account found with this email" }
  }

  if (found.password !== simpleHash(password)) {
    return { error: "Incorrect password" }
  }

  const { password: _, ...user } = found
  return { user }
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(SESSION_KEY)
  return data ? JSON.parse(data) : null
}

export function setSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function updateUserProfile(
  userId: string,
  updates: { name?: string; email?: string; newPassword?: string; currentPassword?: string }
): { user?: User; error?: string } {
  const users = getStoredUsers()
  const index = users.findIndex((u) => u.id === userId)

  if (index === -1) return { error: "User not found" }

  // If changing email, check for duplicates
  if (updates.email && updates.email.toLowerCase() !== users[index].email) {
    if (users.find((u, i) => i !== index && u.email === updates.email!.toLowerCase())) {
      return { error: "This email is already in use" }
    }
  }

  // If changing password, verify current password
  if (updates.newPassword) {
    if (!updates.currentPassword) {
      return { error: "Current password is required to change password" }
    }
    if (users[index].password !== simpleHash(updates.currentPassword)) {
      return { error: "Current password is incorrect" }
    }
    users[index].password = simpleHash(updates.newPassword)
  }

  if (updates.name) users[index].name = updates.name.trim()
  if (updates.email) users[index].email = updates.email.trim().toLowerCase()

  saveStoredUsers(users)

  const { password: _, ...user } = users[index]
  return { user }
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}
