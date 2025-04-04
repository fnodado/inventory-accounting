"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { authInstance, firestoreInstance } from "@/config/firebase"
import firebase from "@react-native-firebase/app"

export function FirebaseErrorHandler() {
  const [authStatus, setAuthStatus] = useState<string>("Checking authentication...")
  const [firestoreStatus, setFirestoreStatus] = useState<string>("Checking Firestore...")
  const [testDocStatus, setTestDocStatus] = useState<string>("Not tested")
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    // Check authentication status
    const unsubscribe = authInstance.onAuthStateChanged((user) => {
      if (user) {
        setAuthStatus(`Authenticated as: ${user.email || "Unknown email"} (${user.uid})`)
      } else {
        setAuthStatus("Not authenticated - this will cause permission errors")
      }
    })

    // Check Firestore connection
    checkFirestore()

    return () => unsubscribe()
  }, [])

  const checkFirestore = async () => {
    try {
      setFirestoreStatus("Testing Firestore connection...")

      // Try to access Firestore
      const testCollection = firestoreInstance.collection("test")
      await testCollection.get()

      setFirestoreStatus("Firestore connection successful")
    } catch (error: any) {
      setFirestoreStatus(`Firestore error: ${error.message}`)
    }
  }

  const createTestDocument = async () => {
    try {
      setTestDocStatus("Creating test document...")

      // Create a test document that anyone can access
      await firestoreInstance.collection("test").doc("test").set({
        message: "This is a test document",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })

      setTestDocStatus("Test document created successfully")
    } catch (error: any) {
      setTestDocStatus(`Error creating test document: ${error.message}`)
    }
  }

  const readTestDocument = async () => {
    try {
      setTestDocStatus("Reading test document...")

      // Try to read the test document
      const docSnapshot = await firestoreInstance.collection("test").doc("test").get()

      if (docSnapshot.exists) {
        const data = docSnapshot.data()
        setTestDocStatus(`Test document read successfully: ${JSON.stringify(data)}`)
      } else {
        setTestDocStatus("Test document does not exist")
      }
    } catch (error: any) {
      setTestDocStatus(`Error reading test document: ${error.message}`)
    }
  }

  if (!expanded) {
    return (
      <TouchableOpacity style={styles.collapsedContainer} onPress={() => setExpanded(true)}>
        <Text style={styles.collapsedTitle}>Firebase Debug (Tap to expand)</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Firebase Debug</Text>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Text style={styles.closeButton}>Collapse</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication Status</Text>
          <Text style={styles.statusText}>{authStatus}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firestore Status</Text>
          <Text style={styles.statusText}>{firestoreStatus}</Text>
          <TouchableOpacity style={styles.button} onPress={checkFirestore}>
            <Text style={styles.buttonText}>Test Firestore Connection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Document</Text>
          <Text style={styles.statusText}>{testDocStatus}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={createTestDocument}>
              <Text style={styles.buttonText}>Create Test Doc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={readTestDocument}>
              <Text style={styles.buttonText}>Read Test Doc</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Rules Help</Text>
          <Text style={styles.helpText}>
            If you're seeing permission errors, you need to update your Firestore security rules in the Firebase
            Console. Make sure you're authenticated before accessing Firestore data.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  collapsedContainer: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  collapsedTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  container: {
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 14,
    color: "#0066cc",
  },
  content: {
    padding: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
})

