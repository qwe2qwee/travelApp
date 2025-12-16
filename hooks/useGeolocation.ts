// hooks/useGeolocation.ts
import * as Location from "expo-location";
import { useCallback, useState } from "react";

export function useGeolocation() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [spotName, setSpotName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const getLocation = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ طلب الإذن
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setPermissionDenied(true);
        setError("Location permission was denied");
        setLoading(false);
        return;
      }

      // 2️⃣ جلب الموقع
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      setLat(latitude);
      setLng(longitude);

      // 3️⃣ جلب اسم المكان (اختياري)
      try {
        const places = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (places.length > 0) {
          const place = places[0];
          const name =
            place.city || place.district || place.subregion || place.region;

          setSpotName(name ?? null);
        }
      } catch {
        setSpotName(null);
      }
    } catch (err) {
      setError("Failed to get location");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  return {
    lat,
    lng,
    spotName,
    loading,
    error,
    permissionDenied,
    getLocation,
  };
}
