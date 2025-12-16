// ============================================
// components/Post/MediaPicker.tsx
// ============================================
import * as ImagePicker from "expo-image-picker";
import { MediaTypeOptions } from "expo-image-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import {
  Camera,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MediaPickerProps {
  media: {
    uri: string;
    type: "image" | "video";
  } | null;
  onMediaSelect: (
    media: { uri: string; type: "image" | "video" } | null
  ) => void;
}

export const MediaPicker = ({ media, onMediaSelect }: MediaPickerProps) => {
  const [loading, setLoading] = useState(false);

  // Initialize video player for preview
  const player = useVideoPlayer(
    media?.type === "video" ? media.uri : "",
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  const checkVideoDuration = async (uri: string): Promise<boolean> => {
    // Note: With expo-video, duration checking needs to be done differently
    // For now, we rely on the 10-second limit set in the picker
    return true;
  };

  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to take photos"
        );
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onMediaSelect({
          uri: result.assets[0].uri,
          type: "image",
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    } finally {
      setLoading(false);
    }
  };

  const takeVideo = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera permission is required to record videos"
        );
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 10,
      });

      if (!result.canceled && result.assets[0]) {
        const isValid = await checkVideoDuration(result.assets[0].uri);
        if (isValid) {
          onMediaSelect({
            uri: result.assets[0].uri,
            type: "video",
          });
        }
      }
    } catch (error) {
      console.error("Error recording video:", error);
      Alert.alert("Error", "Failed to record video");
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Gallery permission is required to select media"
        );
        return;
      }

      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        videoMaxDuration: 10,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const mediaType = asset.type === "video" ? "video" : "image";

        if (mediaType === "video") {
          const isValid = await checkVideoDuration(asset.uri);
          if (!isValid) return;
        }

        onMediaSelect({
          uri: asset.uri,
          type: mediaType,
        });
      }
    } catch (error) {
      console.error("Error picking media:", error);
      Alert.alert("Error", "Failed to select media");
    } finally {
      setLoading(false);
    }
  };

  const clearMedia = () => {
    onMediaSelect(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Preview mode
  if (media) {
    return (
      <View style={styles.previewContainer}>
        {media.type === "video" ? (
          <VideoView
            player={player}
            style={styles.preview}
            contentFit="cover"
            nativeControls
          />
        ) : (
          <Image source={{ uri: media.uri }} style={styles.preview} />
        )}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearMedia}
          activeOpacity={0.7}
        >
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  // Picker mode
  return (
    <View style={styles.container}>
      {/* Camera Options */}
      <View style={styles.buttonsGrid}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={takePhoto}
          activeOpacity={0.7}
        >
          <Camera size={24} color="#6366f1" />
          <Text style={styles.optionButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={takeVideo}
          activeOpacity={0.7}
        >
          <VideoIcon size={24} color="#6366f1" />
          <Text style={styles.optionButtonText}>Take Video</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Gallery Button */}
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={pickFromGallery}
        activeOpacity={0.7}
      >
        <ImageIcon size={20} color="#6366f1" />
        <Text style={styles.galleryButtonText}>Select from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
  },
  buttonsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    height: 96,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  galleryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6366f1",
  },
  previewContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  preview: {
    width: "100%",
    aspectRatio: 1,
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
