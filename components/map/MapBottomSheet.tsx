import { useSavedItems } from "@/hooks/useSavedItems";
import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Bookmark,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Navigation,
  Video as VideoIcon,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
  const { saveItem, removeItem, isSaved: checkIsSaved } = useSavedItems();
  const [slideAnim] = useState(new Animated.Value(1));
  const player = useVideoPlayer(
    item?.image ? { uri: item.image } : null,
    (player) => {
      if (player) {
        player.loop = true;
        player.muted = true;
      }
    }
  );

  // ✅ استعادة حالة الحفظ من قاعدة البيانات عند تغيير العنصر
  useEffect(() => {
    if (item?.id) {
      const saved = checkIsSaved(item.id, item.type);
      setIsSaved(saved);
    } else {
      setIsSaved(false);
    }
  }, [item?.id, item?.type, checkIsSaved]);

  const handleSave = useCallback(async () => {
    if (!item?.id) {
      Alert.alert("Error", "Cannot save item. Missing ID.");
      return;
    }

    try {
      if (checkIsSaved(item.id, item.type)) {
        const success = await removeItem(item.id, item.type);
        if (success) {
          setIsSaved(false);
          Alert.alert("Removed", "Item removed from saved items");
        }
      } else {
        const success = await saveItem(item.id, item.type);
        if (success) {
          setIsSaved(true);
          Alert.alert("Saved", "Item saved to your favorites");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save item. Please try again.");
      console.error("Save error:", error);
    }
  }, [item, saveItem, removeItem, checkIsSaved]);

  useEffect(() => {
    if (isOpen && player) {
      player.play();
    } else if (player) {
      player.pause();
    }
  }, [isOpen, player]);

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
    if (!item || item.lat == null || item.lng == null) return;
    const url = Platform.select({
      ios: `maps://app?daddr=${item.lat},${item.lng}`,
      android: `google.navigation:q=${item.lat},${item.lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`,
    });

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
        );
      }
    });
  }, [item]);

  const handleViewDetails = useCallback(() => {
    if (!item) return;
    if (item.type === "post") {
      router.push(`/post/${item.id}`);
    } else {
      router.push(`/place/${item.id}`);
    }
    onClose();
  }, [item, onClose]);

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
                <X size={20} color="#64748b" />
              </TouchableOpacity>

              <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                  {/* Image/Video Thumbnail */}
                  <View style={styles.thumbnailContainer}>
                    {item.image ? (
                      item.media_type === "video" ? (
                        <>
                          <VideoView
                            player={player}
                            style={styles.thumbnail}
                            contentFit="cover"
                          />
                          {/* Video Badge */}
                          <View style={styles.videoBadge}>
                            <VideoIcon size={12} color="#fff" />
                          </View>
                        </>
                      ) : (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.thumbnail}
                          resizeMode="cover"
                        />
                      )
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
                      <View style={styles.typeLabel}>
                        {item.type === "post" ? (
                          item.media_type === "video" ? (
                            <VideoIcon size={10} color="#64748b" />
                          ) : (
                            <ImageIcon size={10} color="#64748b" />
                          )
                        ) : null}
                        <Text style={styles.typeLabelText}>
                          {item.type === "post" ? "USER POST" : "LANDMARK"}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.title} numberOfLines={2}>
                      {item.title}
                    </Text>
                    {item.subtitle && (
                      <View style={styles.subtitleRow}>
                        <MapPin size={14} color="#64748b" />
                        <Text style={styles.subtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Actions Row */}
                <View style={styles.actionsContainer}>
                  {/* Primary Actions - Two Columns */}
                  <View style={styles.primaryActions}>
                    <TouchableOpacity
                      onPress={handleGetDirections}
                      style={styles.directionsButton}
                      activeOpacity={0.8}
                    >
                      <Navigation size={18} color="#fff" />
                      <Text style={styles.directionsText}>Directions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleViewDetails}
                      style={styles.detailsButton}
                      activeOpacity={0.8}
                    >
                      <ExternalLink size={18} color="#0f172a" />
                      <Text style={styles.detailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Save Button - Full Width */}
                  <TouchableOpacity
                    onPress={handleSave}
                    style={[
                      styles.saveButton,
                      isSaved && styles.saveButtonActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Bookmark
                      size={18}
                      color={isSaved ? "#ef4444" : "#64748b"}
                      fill={isSaved ? "#ef4444" : "none"}
                    />
                    <Text
                      style={[
                        styles.saveButtonText,
                        isSaved && styles.saveButtonTextActive,
                      ]}
                    >
                      {isSaved ? "Saved" : "Save for Later"}
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    paddingRight: 32,
  },
  thumbnailContainer: {
    width: 96,
    height: 96,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  videoBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 12,
    padding: 6,
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
    gap: 8,
    marginBottom: 4,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typeLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeLabelText: {
    fontSize: 11,
    fontWeight: "600",
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
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  actionsContainer: {
    gap: 8,
  },
  primaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
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
  directionsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  detailsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  saveButtonActive: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  saveButtonTextActive: {
    color: "#ef4444",
  },
});
