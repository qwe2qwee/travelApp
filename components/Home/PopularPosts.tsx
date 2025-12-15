// ============================================
// components/PopularPosts.tsx
// ============================================
import { usePosts } from "@/hooks/usePosts";
import { router } from "expo-router";
import { MapPin, Play } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const PopularPosts = () => {
  const { posts, loading } = usePosts(10);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📸 Popular Posts</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📸 Popular Posts</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No posts yet. Be the first to share your Japan experience!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📸 Popular Posts</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
      >
        {posts.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.card}
            onPress={() => router.push(`/post/${post.id}`)}
            activeOpacity={0.9}
          >
            {post.media_type === "video" ? (
              <View style={styles.videoContainer}>
                <Image source={{ uri: post.media_url }} style={styles.media} />
                <View style={styles.playOverlay}>
                  <Play size={32} color="#fff" fill="#fff" />
                </View>
              </View>
            ) : (
              <Image source={{ uri: post.media_url }} style={styles.media} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {post.title || post.spot_name || "Untitled"}
              </Text>
              {post.spot_name && post.title && (
                <View style={styles.locationRow}>
                  <MapPin size={12} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {post.spot_name}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#0f172a",
  },
  scroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  skeletonCard: {
    width: 160,
    height: 192,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    marginRight: 12,
  },
  emptyState: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  card: {
    width: 160,
    height: 192,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#f1f5f9",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
  },
});
