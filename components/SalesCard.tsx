import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

interface SalesCardProps {
  title: string
  value: string
  icon: keyof typeof Ionicons.glyphMap
  color: string
}

export function SalesCard({ title, value, icon, color }: SalesCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: Colors.gray,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cardValue: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: Colors.text,
  },
})

