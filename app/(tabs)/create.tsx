// ============================================
// app/(tabs)/create.tsx - Enhanced version with Modal
// ============================================
import { MediaPicker } from "@/components/Post/MediaPicker";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { router } from "expo-router";
import { AlertCircle, MapPin, Send, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreatePostScreen() {
  const [media, setMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 🎯 Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);

  const insets = useSafeAreaInsets();
  const {
    lat,
    lng,
    spotName,
    loading: locationLoading,
    error,
    getLocation,
  } = useGeolocation();

  const { user } = useAuth();

  const categories = [
    { value: "food", label: "🍜 Food" },
    { value: "nature", label: "🌸 Nature" },
    { value: "culture", label: "⛩️ Culture" },
    { value: "nightlife", label: "🌃 Nightlife" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "transport", label: "🚅 Transport" },
  ];

  const compressImage = async (uri: string): Promise<string> => {
    try {
      const manipulator = await ImageManipulator.manipulate(uri);
      const result = await manipulator.resize({ width: 1080 }).renderAsync();
      const compressed = await result.saveAsync({
        compress: 0.7,
        format: SaveFormat.JPEG,
      });
      return compressed.uri;
    } catch (error) {
      console.error("Error compressing image:", error);
      return uri;
    }
  };

  const uploadVideo = async (uri: string): Promise<string> => {
    const file = new File(uri);
    const base64 = await file.base64();
    const timestamp = Date.now();
    const filePath = `${user!.id}/${timestamp}.mp4`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, decode(base64), {
        contentType: "video/mp4",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadImage = async (uri: string): Promise<string> => {
    const compressedUri = await compressImage(uri);
    const timestamp = Date.now();
    const filePath = `${user!.id}/${timestamp}.jpg`;

    const response = await fetch(compressedUri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("posts").getPublicUrl(filePath);

    return publicUrl;
  };

  // 🎯 Handle Location Modal
  const handleEnableLocation = async () => {
    setShowLocationModal(false);
    await getLocation();
  };

  const handleSubmit = async () => {
    if (!media || !user || !title.trim()) {
      Alert.alert("Missing Info", "Please add a title and media to your post.");
      return;
    }

    // 🎯 Show Modal if location unavailable
    if (!lat || !lng) {
      setShowLocationModal(true);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(10);
      let mediaUrl: string;

      if (media.type === "video") {
        mediaUrl = await uploadVideo(media.uri);
      } else {
        mediaUrl = await uploadImage(media.uri);
      }

      setUploadProgress(70);

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        media_url: mediaUrl,
        media_type: media.type === "video" ? "video" : "photo",
        title: title.trim(),
        caption: caption.trim() || null,
        category: category || null,
        lat,
        lng,
        spot_name: spotName,
      });

      if (insertError) throw insertError;

      setUploadProgress(100);

      Alert.alert("Success", "Your post has been shared successfully!", [
        {
          text: "OK",
          onPress: () => {
            setMedia(null);
            setTitle("");
            setCaption("");
            setCategory("");
            router.replace("/(tabs)");
          },
        },
      ]);
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error?.message || "Failed to create post. Please try again."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const isSubmitDisabled = !media || !title.trim() || uploading || !lat || !lng;

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MediaPicker media={media} onMediaSelect={setMedia} />

          <View
            style={[styles.form, { marginBottom: insets.bottom + insets.top }]}
          >
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Give your post a title..."
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
                editable={!uploading}
                maxLength={100}
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category (optional)</Text>
              <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryChip,
                      category === cat.value && styles.categoryChipActive,
                    ]}
                    onPress={() =>
                      setCategory(category === cat.value ? "" : cat.value)
                    }
                    activeOpacity={0.7}
                    disabled={uploading}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === cat.value && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Caption */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your experience..."
                value={caption}
                onChangeText={setCaption}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
                editable={!uploading}
                maxLength={500}
              />
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithRequired}>
                <Text style={styles.label}>Location *</Text>
                {!lat && !lng && !locationLoading && !uploading && (
                  <Text style={styles.requiredText}>Required</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.locationCard, error && styles.locationCardError]}
                onPress={getLocation}
                disabled={uploading || locationLoading}
                activeOpacity={0.7}
              >
                <MapPin size={20} color={error ? "#ef4444" : "#6366f1"} />

                <View style={styles.locationContent}>
                  {locationLoading ? (
                    <View style={styles.locationRow}>
                      <ActivityIndicator size="small" color="#6366f1" />
                      <Text style={styles.locationText}>
                        Getting location...
                      </Text>
                    </View>
                  ) : error ? (
                    <View>
                      <Text style={styles.locationError}>{error}</Text>
                      <Text style={styles.retryButtonText}>
                        Tap to try again
                      </Text>
                    </View>
                  ) : spotName ? (
                    <Text style={styles.locationName} numberOfLines={1}>
                      📍 {spotName}
                    </Text>
                  ) : lat && lng ? (
                    <Text style={styles.locationText}>
                      📍 {lat.toFixed(4)}, {lng.toFixed(4)}
                    </Text>
                  ) : (
                    <View style={styles.enableButton}>
                      <AlertCircle size={16} color="#ef4444" />
                      <Text style={styles.enableLocationText}>
                        Tap to enable location
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitDisabled && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              activeOpacity={0.7}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.submitButtonText}>
                    {media?.type === "video" ? "Uploading video" : "Posting"}...{" "}
                    {uploadProgress}%
                  </Text>
                </>
              ) : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitButtonText}>Post</Text>
                </>
              )}
            </TouchableOpacity>

            {uploading && (
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${uploadProgress}%` },
                  ]}
                />
              </View>
            )}

            {!lat && !lng && !locationLoading && (
              <View style={styles.warningCard}>
                <AlertCircle size={18} color="#f59e0b" />
                <Text style={styles.warningText}>
                  Location is required to create a post. Please enable location
                  access.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🎯 Location Modal */}
      <Modal
        isVisible={showLocationModal}
        onBackdropPress={() => {}} // 🔥 Cannot close by tapping backdrop
        onBackButtonPress={() => setShowLocationModal(false)} // Android back button
        backdropOpacity={0.5}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={styles.modal}
        useNativeDriver
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.iconContainer}>
              <MapPin size={32} color="#6366f1" />
            </View>
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalTitle}>Location Required</Text>
          <Text style={styles.modalDescription}>
            Location is required to create a post. This helps others discover
            amazing places near them.
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={handleEnableLocation}
              activeOpacity={0.8}
            >
              <MapPin size={18} color="#fff" />
              <Text style={styles.modalButtonPrimaryText}>Enable Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButtonSecondary}
              onPress={() => setShowLocationModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  form: {
    marginTop: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  labelWithRequired: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  requiredText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  locationCardError: {
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
  },
  locationContent: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  locationText: {
    fontSize: 14,
    color: "#64748b",
  },
  enableButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  enableLocationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ef4444",
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6366f1",
  },
  locationError: {
    fontSize: 14,
    color: "#ef4444",
    marginBottom: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: "#6366f1",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 2,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#92400e",
    lineHeight: 18,
  },
  // 🎯 Modal Styles
  modal: {
    justifyContent: "center",
    margin: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#eef2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    gap: 12,
  },
  modalButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#6366f1",
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  modalButtonSecondary: {
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
});
