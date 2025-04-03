"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { usePathname } from "expo-router"
import { Link } from "@/components/ui/type-link"
import { Colors } from "@/constants/Colors"

interface SidebarItemProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  href: string
  isActive: boolean
}

function SidebarItem({ icon, label, href, isActive }: SidebarItemProps) {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={[styles.sidebarItem, isActive && styles.activeSidebarItem]}>
        <Ionicons name={icon} size={20} color={isActive ? Colors.primary : Colors.gray} />
        <Text style={[styles.sidebarItemText, isActive && styles.activeSidebarItemText]}>{label}</Text>
      </TouchableOpacity>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="cube-outline" size={24} color={Colors.primary} />
          <Text style={styles.logoText}>Inventory & Accounting</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MAIN MENU</Text>
          <SidebarItem
            icon="home-outline"
            label="Dashboard"
            href="/(tabs)"
            isActive={
              pathname === "/" || pathname === "/index" || pathname === "/(tabs)" || pathname === "/(tabs)/index"
            }
          />
          <SidebarItem
            icon="cube-outline"
            label="Inventory"
            href="/(tabs)/inventory"
            isActive={pathname === "/inventory" || pathname === "/(tabs)/inventory"}
          />
          <SidebarItem
            icon="cart-outline"
            label="Orders"
            href="/(tabs)/orders"
            isActive={pathname === "/orders" || pathname === "/(tabs)/orders"}
          />
          <SidebarItem
            icon="swap-horizontal-outline"
            label="Stock Management"
            href="/(tabs)/stock"
            isActive={pathname === "/stock" || pathname === "/(tabs)/stock"}
          />
          <SidebarItem
            icon="repeat-outline"
            label="Stock Adjustments"
            href="/(tabs)/adjustments"
            isActive={pathname === "/adjustments" || pathname === "/(tabs)/adjustments"}
          />
          <SidebarItem
            icon="barcode-outline"
            label="Stock Transfers"
            href="/(tabs)/transfers"
            isActive={pathname === "/transfers" || pathname === "/(tabs)/transfers"}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REPORTS</Text>
          <SidebarItem
            icon="bar-chart-outline"
            label="Reports"
            href="/(tabs)/reports"
            isActive={pathname === "/reports" || pathname === "/(tabs)/reports"}
          />
          <SidebarItem
            icon="document-text-outline"
            label="Invoices"
            href="/(tabs)/invoices"
            isActive={pathname === "/invoices" || pathname === "/(tabs)/invoices"}
          />
          <SidebarItem
            icon="people-outline"
            label="Customers"
            href="/(tabs)/customers"
            isActive={pathname === "/customers" || pathname === "/(tabs)/customers"}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <SidebarItem
            icon="settings-outline"
            label="Settings"
            href="/(tabs)/settings"
            isActive={pathname === "/settings" || pathname === "/(tabs)/settings"}
          />
          <SidebarItem
            icon="help-circle-outline"
            label="Help"
            href="/(tabs)/help"
            isActive={pathname === "/help" || pathname === "/(tabs)/help"}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: "100%",
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#eee",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter-SemiBold",
    color: Colors.gray,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeSidebarItem: {
    backgroundColor: `${Colors.primary}10`,
  },
  sidebarItemText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: Colors.text,
  },
  activeSidebarItemText: {
    color: Colors.primary,
    fontFamily: "Inter-Medium",
  },
})

