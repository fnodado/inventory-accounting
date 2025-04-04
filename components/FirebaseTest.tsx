"use client"

import { useEffect, useState } from "react"
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native"
import { authInstance, firestoreInstance } from "@/config/firebase"
import firebase from "@react-native-firebase/app"
import { createTestDocument } from "@/utils/firebaseUtils"

export function FirebaseTest() {
  const [status, setStatus] = useState("Initializing...")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [details, setDetails] = useState<{ [key: string]: string }>({})

  const testFirebase = async () => {
    setIsLoading(true)
    setStatus("Testing Firebase...")
    setError(null)
    setDetails({})

    try {
      // Test Firebase app
      const appName = firebase.app().name
      setDetails((prev) => ({ ...prev, appName }))

      // Test Firebase options
      const options = firebase.app().options
      setDetails((prev) => ({
        ...prev,
        apiKey: options.apiKey || "Not found",
        projectId: options.projectId || "Not found",
        databaseURL: options.databaseURL || "Not found",
      }))

      // Check authentication status
      const currentUser = authInstance.currentUser
      setDetails((prev) => ({
        ...prev,
        authStatus: currentUser ? `Authenticated as ${currentUser.email}` : "Not authenticated",
      }))

      // Test Firestore
      try {
        // Try to access the public test document first
        const testDoc = await firestoreInstance.collection("test").doc("test").get()

        if (testDoc.exists) {
          setDetails((prev) => ({
            ...prev,
            firestoreTest: "Public test document accessible",
          }))
        } else {
          // If the test document doesn't exist, create it
          await createTestDocument()
          setDetails((prev) => ({
            ...prev,
            firestoreTest: "Created public test document",
          }))
        }
      } catch (firestoreError: any) {
        setDetails((prev) => ({
          ...prev,
          firestoreTest: `Error: ${firestoreError.message}`,
        }))
      }

      setStatus("Firebase test completed")
    } catch (err: any) {
      console.error("Firebase test error:", err)
      setError(err.message || "Unknown error")
      setStatus("Firebase test failed")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testFirebase()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Status</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.loadingText}>Testing Firebase...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.status}>{status}</Text>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <View style={styles.detailsContainer}>
              {Object.entries(details).map(([key, value]) => (
                <Text key={key} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{key}: </Text>
                  <Text style={styles.detailValue}>{value}</Text>
                </Text>
              ))}
            </View>
          )}

          <Button title="Test Again" onPress={testFirebase} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  loadingText: {
    marginLeft: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "500",
  },
  error: {
    fontSize: 14,
    color: "red",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#ffeeee",
    borderRadius: 4,
  },
  detailsContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: "#eef6ff",
    borderRadius: 4,
  },
  detailItem: {
    fontSize: 14,
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  detailValue: {
    fontWeight: "normal",
  },
})

