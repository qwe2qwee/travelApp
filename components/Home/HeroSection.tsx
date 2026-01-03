// ============================================
// components/Home/HeroSection.tsx
// ============================================
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { MapPin, Plus } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const HeroSection = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Background Blur Elements */}
      <View style={styles.blurTop} />
      <View style={styles.blurBottom} />

      {/* Content */}
      <View style={styles.content}>
        {user && <Text style={styles.welcomeText}>Welcome back 👋</Text>}
        <Text style={styles.title}>Discover Saudi Arabia</Text>
        <Text style={styles.subtitle}>
          Explore posts from travelers & craft experiences
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/create")}
            activeOpacity={0.7}
          >
            <Plus size={16} color="#fff" />
            <Text style={styles.primaryButtonText}>Create Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/map")}
            activeOpacity={0.7}
          >
            <MapPin size={16} color="#6366f1" />
            <Text style={styles.secondaryButtonText}>Explore Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    backgroundColor: "#f0f4ff",
    overflow: "hidden",
  },
  blurTop: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "rgba(99, 102, 241, 0.05)",
  },
  blurBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  content: {
    position: "relative",
    zIndex: 10,
  },
  welcomeText: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#6366f1",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
});
