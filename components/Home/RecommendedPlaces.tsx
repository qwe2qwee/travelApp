// ============================================
// components/RecommendedPlaces.tsx
// ============================================
import { usePlaces } from "@/hooks/usePlaces";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const categoryEmoji: Record<string, string> = {
  shrine: "⛩️",
  temple: "🏯",
  food: "🍜",
  nature: "🌸",
  landmark: "🗼",
  market: "🛍️",
};

export const RecommendedPlaces = () => {
  const { places, loading } = usePlaces();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎎 Craft & Cultural Experiences</Text>
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎎 Craft & Cultural Experiences</Text>
      <View style={styles.grid}>
        {places.slice(0, 6).map((place) => (
          <TouchableOpacity
            key={place.id}
            style={styles.card}
            onPress={() => router.push(`/place/${place.id}`)}
            activeOpacity={0.9}
          >
            {place.photo_url ? (
              <Image source={{ uri: place.photo_url }} style={styles.media} />
            ) : (
              <View style={styles.placeholderMedia}>
                <Text style={styles.placeholderEmoji}>
                  {categoryEmoji[place.category || ""] || "📍"}
                </Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {place.title}
              </Text>
              <View style={styles.metaRow}>
                {place.city && (
                  <View style={styles.cityRow}>
                    <MapPin size={12} color="rgba(255, 255, 255, 0.8)" />
                    <Text style={styles.cityText}>{place.city}</Text>
                  </View>
                )}
                {place.category && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{place.category}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  skeletonCard: {
    width: "48%",
    height: 144,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  card: {
    width: "48%",
    height: 144,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  placeholderMedia: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 40,
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cityText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#0f172a",
  },
});
