"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { firestoreInstance } from "@/config/firebase"

export function FirestoreAPITest() {
  const [status, setStatus] = useState<string>("Not tested")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const testFirestore = async () => {
    setIsLoading(true)
    setStatus("Testing Firestore API...")

    try {
      // Try to create a test collection and document
      const testCollection = firestoreInstance.collection("api_test")

      // Add a document with a timestamp
      await testCollection.add({
        message: "Firestore API test",
        timestamp: new Date().toISOString(),
        testId: Math.random().toString(36).substring(7),
      })

      setStatus("Firestore API is working! 🎉")
    } catch (error: any) {
      console.error("Firestore API test error:", error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firestore API Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text
          style={[
            styles.statusText,
            status.includes("working") ? styles.success : status.includes("Error") ? styles.error : styles.pending,
          ]}
        >
          {status}
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#0066cc" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={testFirestore}>
          <Text style={styles.buttonText}>Test Firestore API</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.note}>
        Note: Make sure you've enabled the Firestore API in the Google Cloud Console and created a Firestore database in
        the Firebase Console.
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
    marginBottom: 12,
  },
  statusContainer: {
    marginVertical: 12,
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
  button: {
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6c757d",
  },
})

