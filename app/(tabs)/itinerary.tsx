// ============================================
// itinerary.tsx - Enhanced Version
// ============================================
import { Confetti } from "@/components/Itinerary/Confetti";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { LoadingMessages } from "@/components/LoadingMessages";
import { PopularDestinations } from "@/components/PopularDestinations";
import { TripForm } from "@/components/TripForm";
import { useAuth } from "@/contexts/AuthContext";
import { Compass, LogOut, Plane } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Itinerary {
  days: {
    day: number;
    title: string;
    activities: { time: string; activity: string; description: string }[];
  }[];
}

export default function Itinerary() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { signOut } = useAuth();
  const inset = useSafeAreaInsets();

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

      // Show confetti on success! 🎉
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to generate itinerary",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { paddingTop: inset.top, paddingBottom: inset.bottom + 40 },
      ]}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleSignOut}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <LogOut size={22} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <Plane size={28} color="#6366f1" />
              </View>
              <Text style={styles.title}>Japan Travel OS</Text>
              <Text style={styles.subtitle}>
                Get a personalized day-by-day travel plan powered by AI
              </Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Compass size={20} color="#6366f1" />
              <Text style={styles.sectionTitle}>Plan Your Trip</Text>
            </View>
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
              <ItineraryDisplay
                itinerary={itinerary}
                destination={destination}
              />
            )}

            {!isLoading && !itinerary && (
              <View style={styles.emptyStateContainer}>
                {/* Empty State */}
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Compass size={32} color="#94a3b8" />
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
      </KeyboardAvoidingView>

      {/* Confetti Celebration */}
      <Confetti isActive={showConfetti} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    position: "relative",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  logoutButton: {
    position: "absolute",
    top: 24,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  resultsSection: {
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    gap: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
  popularCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
