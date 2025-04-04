"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function StorageTest() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const testStorage = async () => {
    try {
      setLoading(true)
      setError(null)
      setResults([])

      // Test AsyncStorage
      setResults((prev) => [...prev, "Testing AsyncStorage..."])

      // Write test data
      const testKey = `test-${Date.now()}`
      const testValue = `Test value created at ${new Date().toISOString()}`

      setResults((prev) => [...prev, `Writing test data with key: ${testKey}`])
      await AsyncStorage.setItem(testKey, testValue)

      // Read test data
      setResults((prev) => [...prev, "Reading test data..."])
      const readValue = await AsyncStorage.getItem(testKey)

      if (readValue === testValue) {
        setResults((prev) => [...prev, "✅ Successfully read test data from AsyncStorage"])
      } else {
        setResults((prev) => [...prev, "❌ Failed to read correct test data from AsyncStorage"])
      }

      // Get all keys
      setResults((prev) => [...prev, "Getting all keys..."])
      const allKeys = await AsyncStorage.getAllKeys()
      setResults((prev) => [...prev, `Found ${allKeys.length} keys in AsyncStorage`])

      // Clean up test data
      setResults((prev) => [...prev, "Cleaning up test data..."])
      await AsyncStorage.removeItem(testKey)

      // Verify cleanup
      const verifyCleanup = await AsyncStorage.getItem(testKey)
      if (verifyCleanup === null) {
        setResults((prev) => [...prev, "✅ Successfully cleaned up test data"])
      } else {
        setResults((prev) => [...prev, "❌ Failed to clean up test data"])
      }

      setResults((prev) => [...prev, "Storage test completed successfully!"])
    } catch (error: any) {
      console.error("Error in storage test:", error)
      setError(error.message || "Unknown error during storage test")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Test</Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={testStorage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Testing..." : "Test AsyncStorage"}</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0066cc" />
          <Text style={styles.loadingText}>Running storage test...</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {results.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          <ScrollView style={styles.resultsScroll}>
            {results.map((result, index) => (
              <Text key={index} style={styles.resultItem}>
                {index + 1}. {result}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
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
  button: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  errorText: {
    color: "#dc3545",
    marginBottom: 16,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  resultsScroll: {
    maxHeight: 200,
    backgroundColor: "#f1f3f5",
    padding: 8,
    borderRadius: 4,
  },
  resultItem: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: "monospace",
  },
})

