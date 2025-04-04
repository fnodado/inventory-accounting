"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { firestoreInstance } from "@/config/firebase"

export function FirestorePublicTest() {
  const [status, setStatus] = useState<string>("Idle")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const testPublicAccess = async () => {
    setIsLoading(true)
    setStatus("Testing public Firestore access...")
    setError(null)

    try {
      // Try to write to the public test document
      await firestoreInstance
        .collection("test")
        .doc("public-test")
        .set({
          message: "This is a public test document",
          timestamp: new Date().toISOString(),
          testId: Math.random().toString(36).substring(7),
        })

      setStatus("Write successful! Now trying to read...")

      // Try to read the document we just wrote
      const docRef = await firestoreInstance.collection("test").doc("public-test").get()

      if (docRef.exists) {
        const data = docRef.data()
        setStatus(`Success! Read document: ${JSON.stringify(data)}`)
      } else {
        setStatus("Document written but not found on read")
      }
    } catch (err: any) {
      console.error("Firestore public test error:", err)
      setError(err.message || "Unknown error")
      setStatus("Test failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Public Firestore Test</Text>

      <Text style={styles.description}>
        This test tries to write and read from a public document without requiring authentication. If this fails, you
        need to update your Firestore security rules.
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text
          style={[
            styles.statusText,
            status.includes("Success") ? styles.success : status.includes("failed") ? styles.error : styles.pending,
          ]}
        >
          {status}
        </Text>

        {error && <Text style={styles.errorText}>Error: {error}</Text>}

        {isLoading && <ActivityIndicator style={styles.loader} size="small" color="#0066cc" />}
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={testPublicAccess}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Testing..." : "Test Public Access"}</Text>
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
  errorText: {
    marginTop: 8,
    color: "#dc3545",
    fontSize: 14,
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

