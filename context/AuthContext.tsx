"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { router } from "expo-router"
import * as authService from "@/services/authStorageService"
import type { User } from "@/services/authStorageService"

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

  // Initialize the storage and load user on startup
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize the auth storage
        await authService.initializeAuthStorage()

        // Load current user from AsyncStorage
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      console.log("Attempting to sign in:", email)

      // Sign in with our AsyncStorage service
      const authenticatedUser = await authService.signIn(email, password)
      setUser(authenticatedUser)

      console.log("Sign in successful")

      // Navigate to the main app
      router.replace("/(tabs)")
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
      console.log("Attempting to sign up:", email)

      // Sign up with our AsyncStorage service
      const newUser = await authService.signUp(email, password, name)
      setUser(newUser)

      console.log("Sign up successful")

      // Navigate to the main app
      router.replace("/(tabs)")
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
      console.log("Attempting to sign out")

      // Sign out with our AsyncStorage service
      await authService.signOut()

      // Update state
      setUser(null)

      console.log("Sign out successful")
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

