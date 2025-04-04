"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { testDirectFirestore } from "@/config/directFirestore"

export function DirectFirestoreTest() {
  const [status, setStatus] = useState<string>("Not tested")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)

  const runTest = async () => {
    setIsLoading(true)
    setStatus("Testing direct Firestore access...")

    try {
      const testResult = await testDirectFirestore()
      setResult(testResult)

      if (testResult.success) {
        setStatus("Direct Firestore test successful!")
      } else {
        setStatus(`Test failed: ${testResult.error}`)
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`)
      setResult({ success: false, error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Direct Firestore Test</Text>

      <Text style={styles.description}>This test uses a separate Firebase instance to access Firestore directly.</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text
          style={[
            styles.statusText,
            status.includes("successful")
              ? styles.success
              : status.includes("failed") || status.includes("Error")
                ? styles.error
                : styles.pending,
          ]}
        >
          {status}
        </Text>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Result:</Text>
            <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
          </View>
        )}

        {isLoading && <ActivityIndicator style={styles.loader} size="small" color="#0066cc" />}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={runTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Testing..." : "Run Direct Firestore Test"}</Text>
      </TouchableOpacity>
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
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f1f3f5",
    borderRadius: 6,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
  },
  success: {
    color: "#198754",
  },
  error: {
    color: "#dc3545",
  },
  pending: {
    color: "#0d6efd",
  },
  resultContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: "#e9ecef",
    borderRadius: 4,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  loader: {
    marginTop: 8,
  },
  button: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})

