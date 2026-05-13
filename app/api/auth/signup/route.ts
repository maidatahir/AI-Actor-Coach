import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/session"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()
    console.log("Signup attempt [V3]:", { name, email, role })
    if (!name || !email || !password || !role) {
      console.log("Signup validation failed:", { name, email, password: !!password, role })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    console.log("Checking if user exists...")
    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Hash password
    console.log("Hashing password...")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log("Password hashed successfully")

    // Create user and related profile
    console.log("Creating user in database...")
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        ...(role === 'student' ? { student: { create: {} } } : {}),
        ...(role === 'teacher' ? { teacher: { create: {} } } : {})
      },
    })
    console.log("User created successfully:", user.id)

    // Create JWT session cookie
    await createSession(user.id, user.role)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("Signup error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code
    })
    return NextResponse.json({ error: `DATABASE_CONNECTION_ERROR: ${error.message}` }, { status: 500 })
  }
}
