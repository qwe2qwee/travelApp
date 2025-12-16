import Slider from "@react-native-community/slider";
import {
  Calendar,
  Camera,
  Check,
  Landmark,
  Moon,
  Mountain,
  Search,
  ShoppingBag,
  Sparkles,
  TreePine,
  Utensils,
} from "lucide-react-native";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const INTERESTS = [
  { id: "sightseeing", label: "Sightseeing", icon: Camera },
  { id: "food", label: "Food & Dining", icon: Utensils },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "culture", label: "Culture & History", icon: Landmark },
  { id: "nature", label: "Nature", icon: TreePine },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "adventure", label: "Adventure", icon: Mountain },
];

const QUICK_DAYS = [
  { label: "Weekend", value: 3, description: "2-3 days" },
  { label: "Week", value: 7, description: "5-7 days" },
];

interface TripFormProps {
  onSubmit: (data: {
    destination: string;
    days: number;
    interests: string[];
  }) => void;
  isLoading: boolean;
  destination: string;
  onDestinationChange: (value: string) => void;
}

export function TripForm({
  onSubmit,
  isLoading,
  destination,
  onDestinationChange,
}: TripFormProps) {
  const [days, setDays] = useState(5);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!destination.trim()) return;
    onSubmit({
      destination: destination.trim(),
      days: days,
      interests: selectedInterests,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Step 1: Destination */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Where are you going?</Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.searchIconContainer}>
            <Search size={18} color="#64748b" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Search for a destination..."
            placeholderTextColor="#94a3b8"
            value={destination}
            onChangeText={onDestinationChange}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Step 2: Days Selection */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <Text style={styles.stepTitle}>How long is your trip?</Text>
        </View>

        <View style={styles.contentIndent}>
          {/* Days Display */}
          <View style={styles.daysDisplay}>
            <Calendar size={18} color="#6366f1" />
            <Text style={styles.daysNumber}>{days}</Text>
            <Text style={styles.daysLabel}>{days === 1 ? "day" : "days"}</Text>
          </View>

          {/* Quick Select Buttons */}
          <View style={styles.quickSelectRow}>
            {QUICK_DAYS.map((option) => {
              const isActive =
                days >= (option.value === 3 ? 2 : 5) && days <= option.value;
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.quickButton,
                    isActive && styles.quickButtonActive,
                  ]}
                  onPress={() => setDays(option.value)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text
                    style={[
                      styles.quickButtonLabel,
                      isActive && styles.quickButtonLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.quickButtonDescription,
                      isActive && styles.quickButtonDescriptionActive,
                    ]}
                  >
                    {option.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={7}
              step={1}
              value={days}
              onValueChange={setDays}
              minimumTrackTintColor="#6366f1"
              maximumTrackTintColor="#e2e8f0"
              thumbTintColor="#6366f1"
              disabled={isLoading}
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1 day</Text>
              <Text style={styles.sliderLabel}>7 days</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Step 3: Interests */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>3</Text>
          </View>
          <Text style={styles.stepTitle}>What interests you?</Text>
          <Text style={styles.optionalLabel}>(optional)</Text>
        </View>

        <View style={styles.contentIndent}>
          <View style={styles.interestsGrid}>
            {INTERESTS.map((interest) => {
              const Icon = interest.icon;
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestButton,
                    isSelected && styles.interestButtonActive,
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  {isSelected ? (
                    <Check size={16} color="#fff" />
                  ) : (
                    <Icon size={16} color="#64748b" />
                  )}
                  <Text
                    style={[
                      styles.interestLabel,
                      isSelected && styles.interestLabelActive,
                    ]}
                  >
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!destination.trim() || isLoading) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          activeOpacity={0.9}
          disabled={isLoading || !destination.trim()}
        >
          <Sparkles size={20} color="#fff" />
          <Text style={styles.submitButtonText}>
            {isLoading ? "Creating your itinerary..." : "Generate Itinerary"}
          </Text>
        </TouchableOpacity>

        {!destination.trim() && (
          <Text style={styles.helperText}>
            Enter a destination to get started
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },
  optionalLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  contentIndent: {
    marginLeft: 40,
  },
  inputContainer: {
    position: "relative",
    marginLeft: 40,
  },
  searchIconContainer: {
    position: "absolute",
    left: 12,
    top: 14,
    zIndex: 1,
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingLeft: 40,
    paddingRight: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  daysDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  daysNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#6366f1",
  },
  daysLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  quickSelectRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  quickButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quickButtonLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  quickButtonLabelActive: {
    color: "#fff",
  },
  quickButtonDescription: {
    fontSize: 11,
    color: "#64748b",
  },
  quickButtonDescriptionActive: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  sliderContainer: {
    paddingTop: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  interestButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  interestLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  interestLabelActive: {
    color: "#fff",
  },
  submitContainer: {
    marginLeft: 40,
    marginTop: 8,
    marginBottom: 32,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#94a3b8",
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  helperText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
  },
});
