import {
  Building2,
  Landmark,
  MapPin,
  Mountain,
  Star,
} from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DESTINATIONS = [
  {
    name: "Riyadh",
    emoji: "🏙️",
    image:
      "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=300&q=80",
    category: "city",
    categoryIcon: Building2,
  },
  {
    name: "Jeddah",
    emoji: "🌊",
    image:
      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=300&q=80",
    category: "coastal",
    categoryIcon: Building2,
  },
  {
    name: "Makkah",
    emoji: "🕋",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=300&q=80",
    category: "islamic",
    categoryIcon: Star,
  },
  {
    name: "Madinah",
    emoji: "🕌",
    image:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=300&q=80",
    category: "islamic",
    categoryIcon: Star,
  },
  {
    name: "AlUla",
    emoji: "🏛️",
    image:
      "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300&q=80",
    category: "heritage",
    categoryIcon: Landmark,
  },
  {
    name: "Dubai",
    emoji: "🌆",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&q=80",
    category: "modern",
    categoryIcon: Building2,
  },
  {
    name: "Abu Dhabi",
    emoji: "🕌",
    image:
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=300&q=80",
    category: "culture",
    categoryIcon: Landmark,
  },
  {
    name: "Abha",
    emoji: "⛰️",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
    category: "nature",
    categoryIcon: Mountain,
  },
];

interface PopularDestinationsProps {
  onSelect: (destination: string) => void;
}

export function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MapPin size={16} color="#6366f1" />
        <Text style={styles.headerTitle}>Popular in Saudi Arabia</Text>
      </View>

      {/* Grid using flexbox */}
      <View style={styles.grid}>
        {DESTINATIONS.map((item) => {
          const CategoryIcon = item.categoryIcon;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.card}
              onPress={() => onSelect(item.name)}
              activeOpacity={0.9}
            >
              {/* Background Image */}
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />

              {/* Gradient Overlay */}
              <View style={styles.gradientOverlay} />

              {/* Category Badge */}
              <View style={styles.categoryBadge}>
                <CategoryIcon size={9} color="#0f172a" />
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  card: {
    width: "48.5%", // Responsive width
    height: 100, // Fixed height for consistency
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  categoryBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  categoryText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#0f172a",
    letterSpacing: 0.2,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  emoji: {
    fontSize: 14,
  },
  name: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    flex: 1,
  },
});
