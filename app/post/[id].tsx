// ============================================
// app/post/[id].tsx - Post Detail Screen (Fixed)
// ============================================
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/hooks/usePosts";
import { useSavedItems } from "@/hooks/useSavedItems";
import { supabase } from "@/integrations/supabase/client";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  MapPin,
  Navigation,
  Share2,
  Trash2,
  Video as VideoIcon,
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

interface PostDetail {
  id: string;
  user_id: string;
  title: string | null;
  caption: string | null;
  category: string | null;
  media_url: string;
  media_type: string;
  lat: number | null;
  lng: number | null;
  spot_name: string | null;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

const categoryEmoji: Record<string, string> = {
  food: "🍜",
  nature: "🌸",
  culture: "⛩️",
  nightlife: "🌃",
  shopping: "🛍️",
  transport: "🚅",
};

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const { deletePost } = usePosts();
  const { saveItem, removeItem, isSaved: checkIsSaved } = useSavedItems();
  const isOwner = user && post && user.id === post.user_id;

  // ✅ Initialize video player correctly - will be set when post loads
  const player = useVideoPlayer(
    post?.media_type === "video" ? post.media_url : "",
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  useEffect(() => {
    fetchPost();
  }, [id]);

  // ✅ استعادة حالة الحفظ من قاعدة البيانات عند التحميل
  useEffect(() => {
    if (id) {
      const saved = checkIsSaved(id, "post");
      setIsSaved(saved);
    }
  }, [id, checkIsSaved]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profile:profiles(display_name, avatar_url)
        `
        )
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
        // ✅ استعادة حالة الحفظ بعد تحميل البيانات
        const saved = checkIsSaved(id, "post");
        setIsSaved(saved);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = async () => {
    if (post?.lat && post?.lng) {
      const url = Platform.select({
        ios: `maps://app?daddr=${post.lat},${post.lng}`,
        android: `google.navigation:q=${post.lat},${post.lng}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`,
      });

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          await Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`
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
        message: post?.title || "Check out this post!",
        url: post?.media_url || "",
      });
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  const handleDelete = () => {
    if (!post) return;

    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            setDeleting(true);
            const result = await deletePost(post.id);
            setDeleting(false);

            if (result.success) {
              router.back();
            } else {
              Alert.alert("Error", result.error || "Failed to delete post");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Skeleton */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.skeletonText} />
            </View>
          </View>

          {/* Media Skeleton */}
          <View style={styles.mediaSkeleton} />

          {/* Content Skeleton */}
          <View style={styles.content}>
            <View style={[styles.skeletonText, { width: "75%" }]} />
            <View style={[styles.skeletonText, { width: "50%" }]} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
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
            <Text style={styles.headerTitle}>Post Not Found</Text>
          </View>
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>
              This post doesn't exist or has been removed.
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
            <View style={styles.userInfo}>
              {post.profile?.avatar_url ? (
                <Image
                  source={{ uri: post.profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarEmoji}>👤</Text>
                </View>
              )}
              <Text style={styles.userName}>
                {post.profile?.display_name || "Traveler"}
              </Text>
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
                  if (checkIsSaved(id, "post")) {
                    const success = await removeItem(id, "post");
                    if (success) setIsSaved(false);
                  } else {
                    const success = await saveItem(id, "post");
                    if (success) setIsSaved(true);
                  }
                } catch (error) {
                  Alert.alert("Error", "Failed to save post");
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
            {isOwner && (
              <TouchableOpacity
                onPress={handleDelete}
                disabled={deleting}
                style={styles.iconButton}
              >
                <Trash2 size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Media */}
        <View style={styles.mediaContainer}>
          {post.media_type === "video" ? (
            <VideoView
              style={styles.media}
              player={player}
              contentFit="cover"
              nativeControls
              allowsFullscreen
              allowsPictureInPicture
            />
          ) : (
            <Image
              source={{ uri: post.media_url }}
              style={styles.media}
              resizeMode="cover"
            />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgesRow}>
            {post.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {categoryEmoji[post.category] || "📍"} {post.category}
                </Text>
              </View>
            )}
            {post.media_type === "video" && (
              <View style={[styles.badge, styles.badgeOutline]}>
                <VideoIcon size={12} color="#666" />
                <Text style={styles.badgeTextOutline}>Video</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {post.title || post.spot_name || "Untitled Post"}
          </Text>

          {/* Info Card */}
          <View style={styles.infoCard}>
            {post.spot_name && (
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <MapPin size={16} color="#6366f1" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{post.spot_name}</Text>
                </View>
              </View>
            )}
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Calendar size={16} color="#6366f1" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Posted on</Text>
                <Text style={styles.infoValue}>
                  {formatDate(post.created_at)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {post.caption && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{post.caption}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsSection}>
            {post.lat && post.lng && (
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
              <Text style={styles.secondaryButtonText}>Share This Post</Text>
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 16,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  mediaContainer: {
    backgroundColor: "#000",
  },
  media: {
    width: "100%",
    aspectRatio: 1,
  },
  content: {
    padding: 16,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
  },
  badgeOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#334155",
  },
  badgeTextOutline: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
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
    gap: 12,
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
  skeletonAvatar: {
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
  mediaSkeleton: {
    width: "100%",
    aspectRatio: 1,
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
