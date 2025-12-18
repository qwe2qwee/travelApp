// ============================================
// app/(tabs)/index.tsx - Home Screen
// ============================================
import { HeroSection } from "@/components/Home/HeroSection";
import { MapPreview } from "@/components/Home/MapPreview";
import { PopularPosts } from "@/components/Home/PopularPosts";
import { RecommendedPlaces } from "@/components/Home/RecommendedPlaces";
import { usePlaces } from "@/hooks/usePlaces";
import { usePosts } from "@/hooks/usePosts";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { posts, loading: postsLoading, refetch: refetchPosts } = usePosts(10);
  const {
    places,
    loading: placesLoading,
    refetch: refetchPlaces,
  } = usePlaces();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchPosts(), refetchPlaces()]);
    setRefreshing(false);
  }, [refetchPosts, refetchPlaces]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeroSection />
        <PopularPosts posts={posts} loading={postsLoading} />
        <RecommendedPlaces places={places} loading={placesLoading} />
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
