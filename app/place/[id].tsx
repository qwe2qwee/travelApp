// ============================================
// app/place/[id].tsx - Place Detail Screen
// ============================================
import { useSavedItems } from "@/hooks/useSavedItems";
import { supabase } from "@/integrations/supabase/client";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Bookmark,
  Landmark,
  MapPin,
  Navigation,
  Share2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PlaceDetail {
  id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  category: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

const categoryEmoji: Record<string, string> = {
  temple: "⛩️",
  shrine: "🏯",
  garden: "🌸",
  museum: "🏛️",
  market: "🏪",
  craft: "🎨",
  tea: "🍵",
  food: "🍜",
  nature: "🌲",
  culture: "🎎",
};

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { saveItem, removeItem, isSaved: checkIsSaved } = useSavedItems();

  useEffect(() => {
    fetchPlace();
  }, [id]);

  // ✅ استعادة حالة الحفظ من قاعدة البيانات عند التحميل
  useEffect(() => {
    if (id) {
      const saved = checkIsSaved(id, "place");
      setIsSaved(saved);
    }
  }, [id, checkIsSaved]);

  const fetchPlace = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching place:", error);
      } else {
        setPlace(data);
        // ✅ استعادة حالة الحفظ بعد تحميل البيانات
        const saved = checkIsSaved(id, "place");
        setIsSaved(saved);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = async () => {
    if (place?.lat && place?.lng) {
      const url = Platform.select({
        ios: `maps://app?daddr=${place.lat},${place.lng}`,
        android: `google.navigation:q=${place.lat},${place.lng}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`,
      });

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          await Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
          );
        }
      } catch (error) {
        console.error("Error opening maps:", error);
      }
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: place?.title || "Check out this place!",
        url: place?.photo_url || "",
      });
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Skeleton */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.skeletonIcon} />
              <View style={styles.skeletonText} />
            </View>
          </View>

          {/* Image Skeleton */}
          <View style={styles.imageSkeleton} />

          {/* Content Skeleton */}
          <View style={styles.content}>
            <View style={[styles.skeletonText, { width: "75%", height: 24 }]} />
            <View style={[styles.skeletonText, { width: "50%", height: 16 }]} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Place Not Found</Text>
          </View>
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>
              This place doesn't exist or has been removed.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.primaryButtonText}>Go Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <View style={styles.headerIconContainer}>
                <Landmark size={16} color="#6366f1" />
              </View>
              <Text style={styles.headerText}>Cultural Experience</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Share2 size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (!id) return;
                try {
                  if (checkIsSaved(id, "place")) {
                    const success = await removeItem(id, "place");
                    if (success) setIsSaved(false);
                  } else {
                    const success = await saveItem(id, "place");
                    if (success) setIsSaved(true);
                  }
                } catch (error) {
                  Alert.alert("Error", "Failed to save place");
                }
              }}
              style={styles.iconButton}
            >
              <Bookmark
                size={20}
                color={isSaved ? "#6366f1" : "#000"}
                fill={isSaved ? "#6366f1" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {place.photo_url ? (
            <Image source={{ uri: place.photo_url }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Landmark size={64} color="rgba(99, 102, 241, 0.3)" />
            </View>
          )}
          {/* Category Badge */}
          {place.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {categoryEmoji[place.category.toLowerCase()] || "🏯"}{" "}
                {place.category}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.primaryBadge}>
              <Landmark size={12} color="#6366f1" />
              <Text style={styles.primaryBadgeText}>Cultural Experience</Text>
            </View>
            {place.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {categoryEmoji[place.category.toLowerCase()] || "📍"}{" "}
                  {place.category}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{place.title}</Text>

          {/* Location Card */}
          {place.city && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <MapPin size={16} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{place.city}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          {place.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>About this place</Text>
              <Text style={styles.descriptionText}>{place.description}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsSection}>
            {place.lat && place.lng && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGetDirections}
                activeOpacity={0.7}
              >
                <Navigation size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Get Directions</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={18} color="#6366f1" />
              <Text style={styles.secondaryButtonText}>Share This Place</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  heroContainer: {
    position: "relative",
    backgroundColor: "#f1f5f9",
  },
  heroImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  heroPlaceholder: {
    width: "100%",
    height: 300,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
  },
  content: {
    padding: 16,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  primaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#ede9fe",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.2)",
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6366f1",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#000",
  },
  actionsSection: {
    gap: 12,
    paddingTop: 8,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#6366f1",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
  // Loading States
  skeletonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
  },
  skeletonText: {
    height: 16,
    borderRadius: 4,
    backgroundColor: "#f1f5f9",
    width: "40%",
  },
  imageSkeleton: {
    width: "100%",
    height: 300,
    backgroundColor: "#f1f5f9",
  },
  // Not Found
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notFoundText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
});
