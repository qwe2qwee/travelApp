import { usePlaces } from "@/hooks/usePlaces";
import { usePosts } from "@/hooks/usePosts";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { MapBottomSheet, SelectedItem } from "./MapBottomSheet";

const JAPAN_CENTER: Region = {
  latitude: 36.2048,
  longitude: 138.2529,
  latitudeDelta: 10,
  longitudeDelta: 10,
};

// Helper function to safely parse coordinates
const parseCoordinate = (value: any): number | null => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};

// Validate coordinates are within valid ranges
const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const ClusteredMapView: React.FC = () => {
  const { posts, loading: postsLoading, error: postsError } = usePosts(50);
  const { places, loading: placesLoading, error: placesError } = usePlaces();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Log data for debugging
  useEffect(() => {
    // Always log posts/places when loading finished to help Android debugging
    if (!postsLoading && !placesLoading) {
      try {
        console.log(`Posts total: ${posts.length}`, posts.slice(0, 5));
      } catch (e) {
        console.log("Could not stringify posts", e);
      }

      try {
        console.log(`Places total: ${places.length}`, places.slice(0, 5));
      } catch (e) {
        console.log("Could not stringify places", e);
      }

      // Log first valid post for quick coordinate checks
      const firstPost = posts.find((p) => p.lat && p.lng);
      if (firstPost) {
        console.log("Sample post:", {
          id: firstPost.id,
          lat: firstPost.lat,
          lng: firstPost.lng,
          latType: typeof firstPost.lat,
          lngType: typeof firstPost.lng,
        });
      }
    }
  }, [posts, places, postsLoading, placesLoading]);

  const handleMarkerPress = useCallback((item: SelectedItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  }, []);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    console.log("Map is ready");
  }, []);

  // Filter and parse posts with valid coordinates
  const validPosts = posts
    .map((post) => {
      const lat = parseCoordinate(post.lat);
      const lng = parseCoordinate(post.lng);

      if (lat !== null && lng !== null && isValidCoordinate(lat, lng)) {
        return { ...post, lat, lng };
      }
      return null;
    })
    .filter((post): post is NonNullable<typeof post> => post !== null);

  // Filter and parse places with valid coordinates
  const validPlaces = places
    .map((place) => {
      const lat = parseCoordinate(place.lat);
      const lng = parseCoordinate(place.lng);

      if (lat !== null && lng !== null && isValidCoordinate(lat, lng)) {
        return { ...place, lat, lng };
      }
      return null;
    })
    .filter((place): place is NonNullable<typeof place> => place !== null);

  if (postsLoading || placesLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: 80 }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={JAPAN_CENTER}
        showsCompass
        showsScale
        onMapReady={handleMapReady}
        loadingEnabled
        loadingIndicatorColor="#6366f1"
        loadingBackgroundColor="#f9fafb"
        moveOnMarkerPress={false}
        showsBuildings
        showsIndoors
      >
        {/* Post Markers */}
        {mapReady &&
          validPosts.map((post) => (
            <Marker
              key={`post-${post.id}`}
              coordinate={{
                latitude: post.lat,
                longitude: post.lng,
              }}
              onPress={() =>
                handleMarkerPress({
                  id: post.id,
                  title: post.title || post.spot_name || "User Post",
                  subtitle: post.spot_name || undefined,
                  image: post.media_url,
                  lat: post.lat,
                  lng: post.lng,
                  type: "post",
                  media_type: post.media_type,
                })
              }
            >
              <View style={styles.postMarker}>
                <Text style={styles.markerEmoji}>📸</Text>
              </View>
            </Marker>
          ))}

        {/* Place Markers */}
        {mapReady &&
          validPlaces.map((place) => (
            <Marker
              key={`place-${place.id}`}
              coordinate={{
                latitude: place.lat,
                longitude: place.lng,
              }}
              onPress={() =>
                handleMarkerPress({
                  id: place.id,
                  title: place.title,
                  subtitle: place.city || undefined,
                  image: place.photo_url || undefined,
                  lat: place.lat,
                  lng: place.lng,
                  type: "place",
                })
              }
            >
              <View style={styles.placeMarker}>
                <Text style={styles.markerEmoji}>🏯</Text>
              </View>
            </Marker>
          ))}
      </MapView>

      {/* Debug Info Overlay */}
      <View style={styles.debugOverlay}>
        <Text style={styles.debugTitle}>Debug Info:</Text>
        <Text style={styles.debugText}>
          Posts: {posts.length} ({validPosts.length} valid)
        </Text>
        <Text style={styles.debugText}>
          Places: {places.length} ({validPlaces.length} valid)
        </Text>
        <Text style={styles.debugText}>Map Ready: {mapReady ? "✓" : "✗"}</Text>
      </View>

      <MapBottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        item={selectedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  postMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ef4444",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  placeMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f59e0b",
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  markerEmoji: {
    fontSize: 18,
  },
  debugOverlay: {
    position: "absolute",
    top: 60,
    left: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 12,

    minWidth: 200,
  },
  debugTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
    color: "#1f2937",
  },
  debugText: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 2,
  },
});
