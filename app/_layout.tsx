"use client"

import { Stack } from "expo-router"
import { useState, useCallback } from "react"
import { AuthProvider } from "@/context/AuthContext"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SplashScreen } from "@/components/SplashScreen"

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false)

  const onSplashComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  // Show the splash screen until we're ready
  if (!isReady) {
    return <SplashScreen onFinish={onSplashComplete} />
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

