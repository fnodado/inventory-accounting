"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Switch } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Storage type key
const STORAGE_TYPE_KEY = "app_storage_type"

export function StorageSwitcher() {
  const [useLocalStorage, setUseLocalStorage] = useState(true)

  // Load the storage preference on mount
  useEffect(() => {
    const loadStoragePreference = async () => {
      try {
        const storageType = await AsyncStorage.getItem(STORAGE_TYPE_KEY)
        // If storageType is "cloud", set useLocalStorage to false
        setUseLocalStorage(storageType !== "cloud")
      } catch (error) {
        console.error("Error loading storage preference:", error)
      }
    }

    loadStoragePreference()
  }, [])

  // Save the storage preference when it changes
  const handleToggle = async (value: boolean) => {
    try {
      setUseLocalStorage(value)
      await AsyncStorage.setItem(STORAGE_TYPE_KEY, value ? "local" : "cloud")
    } catch (error) {
      console.error("Error saving storage preference:", error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Settings</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Use Local Storage:</Text>
        <Switch value={useLocalStorage} onValueChange={handleToggle} />
      </View>

      <Text style={styles.infoText}>
        {useLocalStorage
          ? "Using local storage. Your data is stored only on this device."
          : "Using cloud storage preference. Note: Currently all data is still stored locally as cloud storage is not implemented yet."}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    margin: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
  },
})

