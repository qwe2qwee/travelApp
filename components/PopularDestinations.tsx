// ============================================
// components/PopularDestinations.tsx
// ============================================
import { MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DESTINATIONS = [
  { name: "Paris, France", emoji: "🗼" },
  { name: "Tokyo, Japan", emoji: "🗾" },
  { name: "New York, USA", emoji: "🗽" },
  { name: "Dubai, UAE", emoji: "🏙️" },
  { name: "Rome, Italy", emoji: "🏛️" },
  { name: "Bali, Indonesia", emoji: "🏝️" },
];

interface PopularDestinationsProps {
  onSelect: (destination: string) => void;
}

export function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MapPin size={16} color="#666" />
        <Text style={styles.headerText}>Popular Destinations</Text>
      </View>
      <View style={styles.grid}>
        {DESTINATIONS.map((dest) => (
          <TouchableOpacity
            key={dest.name}
            style={styles.button}
            onPress={() => onSelect(dest.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{dest.emoji}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {dest.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    width: "48%",
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
});
