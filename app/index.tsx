"use client"

import { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"
import { router } from "expo-router"

export default function Index() {
  useEffect(() => {
    // Navigate to the auth screen after a short delay
    const timer = setTimeout(() => {
      router.replace("/(auth)/login")
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
})

