"use client"

import { View, Text, StyleSheet } from "react-native"
import { useAuth } from "@/context/AuthContext"
import { Colors } from "@/constants/Colors"

export function AuthStatus() {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Status</Text>

      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.value}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Using AsyncStorage Authentication</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.notLoggedIn}>Not logged in</Text>
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
    marginBottom: 12,
  },
  userInfo: {
    backgroundColor: "#e9f5fe",
    padding: 12,
    borderRadius: 6,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  email: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 8,
  },
  notLoggedIn: {
    fontSize: 14,
    color: Colors.danger,
    fontStyle: "italic",
  },
  badge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 12,
    color: "#1e40af",
    fontWeight: "500",
  },
})

