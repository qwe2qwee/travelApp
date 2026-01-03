// ============================================
// app/create.tsx - Complete Create Post Screen
// ============================================
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import { MapPin, Send, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MediaPicker } from "./MediaPicker";

export default function CreatePostScreen() {
  const [media, setMedia] = useState<{
    uri: string;
    type: "image" | "video";
  } | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const {
    lat,
    lng,
    spotName,
    loading: locationLoading,
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

  // Get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async () => {
    if (!media || !user || !title.trim()) {
      Alert.alert("Missing Info", "Please add a title and media to your post.");
      return;
    }

    setUploading(true);
    let uploadedFilePath: string | null = null;

    try {
      // 1. Read file as base64 using the new File API
      const base64 = await FileSystem.readAsStringAsync(media.uri, {
        encoding: "base64",
      });

      // 2. Determine file extension
      const ext = media.type === "video" ? "mp4" : "jpg";
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}.${ext}`;
      uploadedFilePath = filePath;

      // 3. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(filePath, decode(base64), {
          contentType: media.type === "video" ? "video/mp4" : "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // 4. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filePath);

      // 5. Insert post record
      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: media.type === "video" ? "video" : "photo",
        title: title.trim(),
        caption: caption || null,
        category: category || null,
        lat,
        lng,
        spot_name: spotName,
      });

      if (insertError) {
        throw new Error(insertError.message || "Failed to save post data");
      }

      Alert.alert("Success", "Your post has been shared successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (error) {
      console.error("Error creating post:", error);

      // If upload was successful but database insert failed, clean up the file
      if (uploadedFilePath) {
        try {
          await supabase.storage.from("posts").remove([uploadedFilePath]);
          console.log("Cleaned up uploaded file after failed post creation");
        } catch (cleanupError) {
          console.error("Failed to cleanup uploaded file:", cleanupError);
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : "Failed to create post";
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} disabled={uploading}>
            <X size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Media Picker */}
          <MediaPicker media={media} onMediaSelect={setMedia} />

          {/* Form */}
          <View style={styles.form}>
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
              />
            </View>

            {/* Location */}
            <View style={styles.locationCard}>
              <MapPin size={20} color="#6366f1" />
              <View style={styles.locationContent}>
                {locationLoading ? (
                  <Text style={styles.locationText}>Getting location...</Text>
                ) : spotName ? (
                  <Text style={styles.locationName} numberOfLines={1}>
                    {spotName}
                  </Text>
                ) : lat && lng ? (
                  <Text style={styles.locationText}>
                    {lat.toFixed(4)}, {lng.toFixed(4)}
                  </Text>
                ) : (
                  <TouchableOpacity onPress={getLocation} disabled={uploading}>
                    <Text style={styles.enableLocationText}>
                      Enable location
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!media || !title.trim() || uploading) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!media || !title.trim() || uploading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.submitButtonText}>Posting...</Text>
                </>
              ) : (
                <>
                  <Send size={18} color="#fff" />
                  <Text style={styles.submitButtonText}>Post</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
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
  },
  locationContent: {
    flex: 1,
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
  enableLocationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6366f1",
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
});
