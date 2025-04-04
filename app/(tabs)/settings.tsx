"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"
import { useAuth } from "@/context/AuthContext"
import { StorageSwitcher } from "@/components/StorageSwitcher"

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const { user, signOut } = useAuth()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Add the StorageSwitcher here */}
        <StorageSwitcher />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.profileSection}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitial}>{user?.name.charAt(0) || "U"}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || "User"}</Text>
              <Text style={styles.profileEmail}>{user?.email || "user@example.com"}</Text>
            </View>
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="person-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Security</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <Ionicons name="globe-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Language</Text>
            <Text style={styles.settingValue}>English</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="moon-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Dark Mode</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <View style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="document-text-outline" size={20} color={Colors.text} />
            <Text style={styles.settingText}>Terms & Policies</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.gray} style={styles.settingArrow} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    marginRight: 8,
  },
  settingArrow: {
    marginLeft: "auto",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: Colors.danger,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: Colors.gray,
    textAlign: "center",
    marginVertical: 16,
  },
})

