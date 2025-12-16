import {
  Building2,
  Landmark,
  MapPin,
  Mountain,
  TreePine,
} from "lucide-react-native";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const DESTINATIONS = [
  {
    name: "Tokyo",
    emoji: "🗼",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80",
    category: "City",
    categoryIcon: Building2,
  },
  {
    name: "Kyoto",
    emoji: "⛩️",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80",
    category: "Culture",
    categoryIcon: Landmark,
  },
  {
    name: "Osaka",
    emoji: "🏯",
    image:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=300&q=80",
    category: "City",
    categoryIcon: Building2,
  },
  {
    name: "Hakone",
    emoji: "🗻",
    image:
      "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=300&q=80",
    category: "Nature",
    categoryIcon: Mountain,
  },
  {
    name: "Nara",
    emoji: "🦌",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=300&q=80",
    category: "Culture",
    categoryIcon: Landmark,
  },
  {
    name: "Hokkaido",
    emoji: "❄️",
    image:
      "https://images.unsplash.com/photo-1605452929007-91d875f665ad?w=300&q=80",
    category: "Nature",
    categoryIcon: TreePine,
  },
];

interface PopularDestinationsProps {
  onSelect: (destination: string) => void;
}

export function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  const renderDestination = ({
    item,
    index,
  }: {
    item: (typeof DESTINATIONS)[0];
    index: number;
  }) => {
    const CategoryIcon = item.categoryIcon;

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_WIDTH }]}
        onPress={() => onSelect(item.name)}
        activeOpacity={0.95}
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
          <CategoryIcon size={12} color="#0f172a" />
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.nameContainer}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MapPin size={20} color="#6366f1" />
        <Text style={styles.headerTitle}>Popular Destinations</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={DESTINATIONS}
        renderItem={renderDestination}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    height: CARD_WIDTH * 0.75, // 4:3 aspect ratio
    borderRadius: 12,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#0f172a",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  emoji: {
    fontSize: 18,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
