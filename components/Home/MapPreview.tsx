// ============================================
// components/Home/MapPreview.tsx
// ============================================
import { router } from "expo-router";
import { ChevronRight, Map } from "lucide-react-native";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const MapPreview = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Explore Map</Text>
      <TouchableOpacity
        style={styles.mapContainer}
        onPress={() => router.push("/map")}
        activeOpacity={0.9}
      >
        <Image
          source={{
            uri: "https://api.mapbox.com/styles/v1/mapbox/light-v11/static/139.6917,35.6895,5,0/400x200@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
          }}
          style={styles.mapImage}
        />
        <View style={styles.overlay}>
          <View style={styles.button}>
            <Map size={16} color="#0f172a" />
            <Text style={styles.buttonText}>View Full Map</Text>
            <ChevronRight size={16} color="#0f172a" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#0f172a",
  },
  mapContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
  },
  mapImage: {
    width: "100%",
    height: 128,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
});
