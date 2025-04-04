"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Storage type key
const STORAGE_TYPE_KEY = "app_storage_type"

export function StorageIndicator() {
  const [storageType, setStorageType] = useState<string>("local")
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const checkStorage = async () => {
      try {
        setInitializing(true)
        // Get the storage type preference
        const type = await AsyncStorage.getItem(STORAGE_TYPE_KEY)
        setStorageType(type === "cloud" ? "cloud" : "local")
      } catch (error) {
        console.error("Error checking storage type:", error)
      } finally {
        setInitializing(false)
      }
    }

    checkStorage()
  }, [])

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Initializing storage...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Storage Type:</Text>
      <Text style={[styles.value, storageType === "cloud" ? styles.cloud : styles.local]}>
        {storageType === "cloud" ? "Cloud (Preference Only)" : "Local (AsyncStorage)"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  text: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cloud: {
    backgroundColor: "#ffedd5",
    color: "#c2410c",
  },
  local: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
})

