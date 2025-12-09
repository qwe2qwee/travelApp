// ============================================
// components/LoadingMessages.tsx
// ============================================
import { Camera, Clock, MapPin, Sparkles, Utensils } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  View,
} from "react-native";

const LOADING_MESSAGES = [
  { text: "Researching your destination...", icon: MapPin },
  { text: "Finding the best restaurants...", icon: Utensils },
  { text: "Discovering hidden gems...", icon: Sparkles },
  { text: "Planning photo opportunities...", icon: Camera },
  { text: "Optimizing your schedule...", icon: Clock },
];

export function LoadingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const CurrentIcon = LOADING_MESSAGES[messageIndex].icon;

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.iconBg}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
        <View style={styles.iconBadge}>
          <CurrentIcon size={16} color="#6366f1" />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Animated.Text style={[styles.message, { opacity: fadeAnim }]}>
          {LOADING_MESSAGES[messageIndex].text}
        </Animated.Text>
        <Text style={styles.subtext}>This usually takes 10-20 seconds</Text>
      </View>

      <View style={styles.dots}>
        {LOADING_MESSAGES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === messageIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 24,
  },
  iconWrapper: {
    position: "relative",
  },
  iconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  dotActive: {
    backgroundColor: "#6366f1",
    width: 16,
  },
});
