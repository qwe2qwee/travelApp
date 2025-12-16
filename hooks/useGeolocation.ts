// ============================================
// hooks/useGeolocation.ts - مُحسَّن
// ============================================
import * as Location from "expo-location";
import { useCallback, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  spotName: string | null;
  loading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    spotName: null,
    loading: false,
    error: null,
    permissionStatus: null,
  });

  const getLocation = useCallback(async () => {
    console.log("🔍 Getting location...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 1️⃣ فحص الصلاحية الحالية أولاً
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log("📍 Current permission status:", status);

      // 2️⃣ إذا ما كانت ممنوحة، اطلبها
      if (status !== Location.PermissionStatus.GRANTED) {
        console.log("🔔 Requesting permission...");
        const response = await Location.requestForegroundPermissionsAsync();
        status = response.status;
        console.log("📍 New permission status:", status);
      }

      // 3️⃣ إذا رفض المستخدم
      if (status !== Location.PermissionStatus.GRANTED) {
        // تحقق إذا رفض نهائياً (can't ask again)
        if (status === Location.PermissionStatus.DENIED) {
          Alert.alert(
            "Location Permission Required",
            "Please enable location access in your device settings to use this feature.",
            [
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Location permission denied",
          permissionStatus: status,
        }));
        return;
      }

      console.log("✅ Permission granted, getting position...");

      // 4️⃣ جلب الموقع
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      console.log("📍 Location:", latitude, longitude);

      // 5️⃣ Reverse Geocoding
      let spotName = null;
      try {
        console.log("🌍 Getting place name...");
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "YourAppName/1.0", // مهم لـ OpenStreetMap
            },
          }
        );
        const data = await response.json();

        if (data.address) {
          const { name, road, city, town, village, state, country } =
            data.address;
          const place = name || road || "";
          const area = city || town || village || state || "";
          spotName = [place, area, country]
            .filter(Boolean)
            .slice(0, 2)
            .join(", ");
          console.log("📍 Place name:", spotName);
        }
      } catch (err) {
        console.log("⚠️ Reverse geocoding failed:", err);
      }

      setState({
        lat: latitude,
        lng: longitude,
        spotName,
        loading: false,
        error: null,
        permissionStatus: status,
      });

      console.log("✅ Location updated successfully");
    } catch (error) {
      console.error("❌ Location error:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to get location",
        permissionStatus: prev.permissionStatus,
      }));
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState({
      lat: null,
      lng: null,
      spotName: null,
      loading: false,
      error: null,
      permissionStatus: null,
    });
  }, []);

  return { ...state, getLocation, clearLocation };
};
