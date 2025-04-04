"use client"

// Import Firebase initialization first - this is critical
import firebaseApp from "@/config/firebaseInit"

// Add this import
import { initializeDatabase } from "@/services/database/databaseFactory"

import { Stack } from "expo-router"
import { useState, useCallback, useEffect } from "react"
import { View, Text } from "react-native"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SplashScreen } from "@/components/SplashScreen"

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    // Check if Firebase is initialized and initialize the database
    const initialize = async () => {
      try {
        // Check if Firebase is initialized
        if (firebaseApp) {
          console.log("Firebase verified in layout:", firebaseApp.name)
          setFirebaseInitialized(true)

          // Initialize the database (will use SQLite if Firebase is not available)
          await initializeDatabase()
        } else {
          console.error("Firebase app is undefined in layout")
          setInitError("Firebase app is undefined")
        }
      } catch (error: any) {
        console.error("Initialization error in layout:", error)
        setInitError(error.message || "Unknown initialization error")
      }
    }

    initialize()
  }, [])

  const onSplashComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  // Show the splash screen until we're ready and Firebase is initialized
  if (!isReady || !firebaseInitialized) {
    return <SplashScreen onFinish={onSplashComplete} />
  }

  // If there was an error initializing Firebase, show an error screen
  if (initError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Firebase Initialization Error</Text>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>{initError}</Text>
        <Text>Please restart the app or contact support.</Text>
      </View>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  )
}

