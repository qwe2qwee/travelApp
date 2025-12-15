// ============================================
// app/(tabs)/index.tsx - Home Screen
// ============================================
import { HeroSection } from "@/components/Home/HeroSection";
import { MapPreview } from "@/components/Home/MapPreview";
import { PopularPosts } from "@/components/Home/PopularPosts";
import { RecommendedPlaces } from "@/components/Home/RecommendedPlaces";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroSection />
        <PopularPosts />
        <RecommendedPlaces />
        <MapPreview />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Extra padding for tab bar
  },
});
