"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface SplashScreenProps {
  onFinish?: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const translateYAnim = useRef(new Animated.Value(10)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Progress animation
    const progressTimer = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start()
      setProgress(100)

      // Call onFinish after animations complete
      const finishTimer = setTimeout(() => {
        if (onFinish) onFinish()
      }, 1200)

      return () => clearTimeout(finishTimer)
    }, 1000)

    // Scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    // Fade in animation for text
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start()

    return () => {
      clearTimeout(progressTimer)
    }
  }, [onFinish])

  // Hardcoded colors instead of theme-based
  const primaryColor = "#000"
  const backgroundColor = "#fff"
  const mutedColor = "#f0f0f0"

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <MaterialCommunityIcons name="package-variant" size={96} color={primaryColor} />
          <View style={styles.textOverlay}>
            <Text style={[styles.iconText, { color: primaryColor }]}>I&A</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: opacityAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: primaryColor }]}>Inventory & Accounting</Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: mutedColor }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: primaryColor,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  textOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  progressContainer: {
    width: width * 0.5, // 50% of screen width
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
})

