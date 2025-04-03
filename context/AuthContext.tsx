"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { router } from "expo-router"
import { secureStorage } from "@/utils/secureStorage"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const userString = await secureStorage.getItem("user")
        if (userString) {
          const userData = JSON.parse(userString)
          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Check for demo credentials
      if (
        (email === "admin@example.com" && password === "password") ||
        (email === "admin@gmail.com" && password === "admin")
      ) {
        const userData: User = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
        }

        await secureStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        return
      }

      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll just simulate a successful login
      if (email && password) {
        const userData: User = {
          id: "1",
          email,
          name: "Demo User",
        }

        await secureStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        return
      }

      throw new Error("Invalid credentials")
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)

      // In a real app, you would make an API call to register
      // For demo purposes, we'll just simulate a successful registration
      if (email && password && name) {
        const userData: User = {
          id: "1",
          email,
          name,
        }

        await secureStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
        return
      }

      throw new Error("Invalid registration data")
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      await secureStorage.removeItem("user")
      setUser(null)
      router.replace("/(auth)/login")
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

