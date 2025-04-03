import { View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/Colors"

export default function Logo({ size = 24, color = Colors.primary }) {
  return (
    <View style={{ width: size, height: size }}>
      <Ionicons name="cube-outline" size={size} color={color} />
    </View>
  )
}

