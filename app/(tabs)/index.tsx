// ============================================
// screens/Index.tsx
// ============================================
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { LoadingMessages } from "@/components/LoadingMessages";
import { PopularDestinations } from "@/components/PopularDestinations";
import { TripForm } from "@/components/TripForm";
import { useAuth } from "@/contexts/AuthContext";
import { Compass, LogOut, Plane } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Itinerary {
  days: {
    day: number;
    title: string;
    activities: { time: string; activity: string; description: string }[];
  }[];
}

export default function Index() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const handleGenerate = async (data: {
    destination: string;
    days: number;
    interests: string[];
  }) => {
    setIsLoading(true);
    setItinerary(null);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate itinerary");
      }

      const result = await response.json();
      setItinerary(result.itinerary);
      setDestination(data.destination);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to generate itinerary"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <LogOut size={24} color="#666" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Plane size={28} color="#6366f1" />
          </View>
          <Text style={styles.title}>Travel Itinerary Planner</Text>
          <Text style={styles.subtitle}>
            Get a personalized day-by-day travel plan powered by AI
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Plan Your Trip</Text>
          <TripForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
            destination={destination}
            onDestinationChange={setDestination}
          />
        </View>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          {isLoading && <LoadingMessages />}

          {!isLoading && itinerary && (
            <ItineraryDisplay itinerary={itinerary} destination={destination} />
          )}

          {!isLoading && !itinerary && (
            <View style={styles.emptyStateContainer}>
              {/* Empty State */}
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Compass size={32} color="#999" />
                </View>
                <Text style={styles.emptyStateTitle}>
                  Your itinerary will appear here
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  Fill in the form or pick a destination below
                </Text>
              </View>

              {/* Popular Destinations */}
              <View style={styles.popularCard}>
                <PopularDestinations onSelect={setDestination} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    position: "relative",
  },
  logoutButton: {
    position: "absolute",
    top: 32,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyStateContainer: {
    gap: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  popularCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});
