import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface SelectedItem {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  lat?: number;
  lng?: number;
  type: "post" | "place";
  media_type?: "photo" | "video";
}

interface MapBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  item: SelectedItem | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const MapBottomSheet: React.FC<MapBottomSheetProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [slideAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setIsSaved(false);
  }, [item?.id]);

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  const handleGetDirections = useCallback(() => {
    if (item?.lat && item?.lng) {
      const scheme = Platform.select({
        ios: "maps://",
        android: "geo:",
      });
      const url = Platform.select({
        ios: `${scheme}?daddr=${item.lat},${item.lng}`,
        android: `${scheme}${item.lat},${item.lng}`,
      });

      Linking.canOpenURL(url!).then((supported) => {
        if (supported) {
          Linking.openURL(url!);
        } else {
          // Fallback to Google Maps web
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
          );
        }
      });
    }
  }, [item]);

  const handleViewDetails = useCallback(() => {
    console.log(`Navigating to details for ${item?.id}`);
    // Add navigation logic here
    // navigation.navigate('Details', { id: item?.id, type: item?.type });
  }, [item]);

  const handleSave = useCallback(() => {
    setIsSaved((prev) => !prev);
  }, []);

  if (!item) return null;

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[styles.sheetContainer, { transform: [{ translateY }] }]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheet}>
              {/* Drag Handle */}
              <View style={styles.dragHandle} />

              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>

              <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                  {/* Image/Video Thumbnail */}
                  <View style={styles.thumbnailContainer}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.thumbnailPlaceholder}>
                        <Text style={styles.placeholderEmoji}>
                          {item.type === "post"
                            ? item.media_type === "video"
                              ? "🎥"
                              : "📸"
                            : "🏯"}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Title and Subtitle */}
                  <View style={styles.headerText}>
                    <View style={styles.typeRow}>
                      <View
                        style={[
                          styles.typeDot,
                          {
                            backgroundColor:
                              item.type === "post" ? "#ef4444" : "#6366f1",
                          },
                        ]}
                      />
                      <Text style={styles.typeLabel}>
                        {item.type === "post"
                          ? item.media_type === "video"
                            ? "📹 USER POST"
                            : "📷 USER POST"
                          : "LANDMARK"}
                      </Text>
                    </View>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <View style={styles.subtitleRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.subtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsRow}>
                  {/* Get Directions Button */}
                  <TouchableOpacity
                    onPress={handleGetDirections}
                    style={styles.directionsButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.navigationIcon}>🧭</Text>
                    <Text style={styles.directionsText}>Get Directions</Text>
                  </TouchableOpacity>

                  {/* View Details Button */}
                  <TouchableOpacity
                    onPress={handleViewDetails}
                    style={styles.iconButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.iconButtonText}>🔗</Text>
                  </TouchableOpacity>

                  {/* Save Button */}
                  <TouchableOpacity
                    onPress={handleSave}
                    style={[
                      styles.iconButton,
                      isSaved && styles.iconButtonSaved,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.iconButtonText}>
                      {isSaved ? "🔖" : "📌"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 90 : 90,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 24,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 24,
    overflow: "hidden",
  },
  dragHandle: {
    width: 48,
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
    paddingRight: 32,
  },
  thumbnailContainer: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 24,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  locationIcon: {
    fontSize: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navigationIcon: {
    fontSize: 18,
  },
  directionsText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  iconButton: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  iconButtonSaved: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  iconButtonText: {
    fontSize: 20,
  },
});
