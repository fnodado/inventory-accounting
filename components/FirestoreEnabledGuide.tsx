"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from "react-native"
import { isFirestoreEnabled, getFirestoreEnableUrl } from "@/utils/checkFirestoreEnabled"

export function FirestoreEnableGuide() {
  const [checking, setChecking] = useState(true)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    checkFirestore()
  }, [])

  const checkFirestore = async () => {
    setChecking(true)
    const firestoreEnabled = await isFirestoreEnabled()
    setEnabled(firestoreEnabled)
    setChecking(false)
  }

  const openEnableUrl = () => {
    Linking.openURL(getFirestoreEnableUrl())
  }

  if (checking) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Checking Firestore API Status</Text>
        <ActivityIndicator size="small" color="#0066cc" style={styles.loader} />
      </View>
    )
  }

  if (enabled) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <Text style={styles.title}>Firestore API is Enabled! 🎉</Text>
        <Text style={styles.description}>
          Your app is now ready to use Firestore. You can start adding, reading, and updating data.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firestore API Not Enabled</Text>

      <Text style={styles.description}>
        The Firestore API is not enabled for your project. You need to enable it before you can use Firestore.
      </Text>

      <View style={styles.steps}>
        <Text style={styles.stepTitle}>Follow these steps:</Text>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>Click the button below to open the Google Cloud Console</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>Sign in with your Google account if prompted</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>Click the "Enable" button on the page</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>Wait a few minutes for the change to propagate</Text>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>5</Text>
          <Text style={styles.stepText}>Come back here and click "Check Again"</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.enableButton} onPress={openEnableUrl}>
          <Text style={styles.enableButtonText}>Enable Firestore API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.checkButton} onPress={checkFirestore}>
          <Text style={styles.checkButtonText}>Check Again</Text>
        </TouchableOpacity>
      </View>
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
  successContainer: {
    backgroundColor: "#d1e7dd",
    borderColor: "#badbcc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
    lineHeight: 20,
  },
  loader: {
    marginVertical: 16,
  },
  steps: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  enableButton: {
    flex: 1,
    backgroundColor: "#0d6efd",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 8,
  },
  enableButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  checkButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    marginLeft: 8,
  },
  checkButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})

