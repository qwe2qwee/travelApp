import {
  Camera,
  Clock,
  Hotel,
  Map,
  MapPin,
  Plane,
  Sparkles,
  Utensils,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const LOADING_MESSAGES = [
  { text: "Researching your destination...", icon: MapPin },
  { text: "Finding the best restaurants...", icon: Utensils },
  { text: "Discovering hidden gems...", icon: Sparkles },
  { text: "Planning photo opportunities...", icon: Camera },
  { text: "Optimizing your schedule...", icon: Clock },
  { text: "Checking top attractions...", icon: Map },
  { text: "Finding best accommodations...", icon: Hotel },
];

const TRAVEL_TIPS = [
  "💡 Pack a portable charger for long days of exploring",
  "💡 Learn a few basic phrases in the local language",
  "💡 Always carry some local currency for small purchases",
  "💡 Download offline maps before your trip",
  "💡 Book popular attractions in advance when possible",
];

export function LoadingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for main circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float animation for plane
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Scale animation for icon change
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [messageIndex]);

  useEffect(() => {
    // Fade animation for text/tip change
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [messageIndex, tipIndex]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TRAVEL_TIPS.length);
    }, 5000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 95));
    }, 200);

    return () => {
      clearInterval(messageInterval);
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = LOADING_MESSAGES[messageIndex];
  const Icon = currentMessage.icon;

  return (
    <View style={styles.container}>
      {/* Main Loading Animation */}
      <View style={styles.mainLoadingContainer}>
        <Animated.View
          style={[
            styles.mainCircle,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ translateY: floatAnim }],
            }}
          >
            <Plane size={40} color="#fff" />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Icon size={20} color="#6366f1" />
        </Animated.View>
      </View>

      {/* Status Message */}
      <Animated.View style={[styles.statusContainer, { opacity: fadeAnim }]}>
        <Text style={styles.statusText}>{currentMessage.text}</Text>
        <Text style={styles.subStatusText}>
          Creating your personalized itinerary...
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>Processing...</Text>
          <Text style={styles.progressLabel}>{progress}%</Text>
        </View>
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {LOADING_MESSAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === messageIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Travel Tip */}
      <Animated.View style={[styles.tipContainer, { opacity: fadeAnim }]}>
        <Text style={styles.tipText}>{TRAVEL_TIPS[tipIndex]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 32,
  },
  mainLoadingContainer: {
    position: "relative",
    width: 80,
    height: 80,
  },
  mainCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconCircle: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  statusContainer: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },
  subStatusText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  progressContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f1f5f9",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#6366f1",
  },
  dotInactive: {
    width: 8,
    backgroundColor: "rgba(100, 116, 139, 0.3)",
  },
  tipContainer: {
    width: "100%",
    maxWidth: 384,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  tipText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});
