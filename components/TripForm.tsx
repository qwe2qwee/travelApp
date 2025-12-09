// ============================================
// components/TripForm.tsx
// ============================================
import Slider from "@react-native-community/slider";
import {
  Calendar,
  Camera,
  Check,
  Landmark,
  MapPin,
  Moon,
  Mountain,
  ShoppingBag,
  Sparkles,
  TreePine,
  Utensils,
} from "lucide-react-native";
import React, { useState } from "react";
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
  { label: "Extended", value: 14, description: "10-14 days" },
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
      days,
      interests: selectedInterests,
    });
  };

  const isInRange = (value: number, min: number, max: number) => {
    return value >= min && value <= max;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Destination */}
      <View style={styles.section}>
        <View style={styles.label}>
          <MapPin size={16} color="#666" />
          <Text style={styles.labelText}>Destination</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="e.g., Paris, France"
          placeholderTextColor="#999"
          value={destination}
          onChangeText={onDestinationChange}
        />
      </View>

      {/* Days Selection */}
      <View style={styles.section}>
        <View style={styles.label}>
          <Calendar size={16} color="#666" />
          <Text style={styles.labelText}>
            Duration:{" "}
            <Text style={styles.daysValue}>
              {days} {days === 1 ? "day" : "days"}
            </Text>
          </Text>
        </View>

        {/* Quick Select Buttons */}
        <View style={styles.quickDaysContainer}>
          {QUICK_DAYS.map((option) => {
            const minValue =
              option.value === 3 ? 2 : option.value === 7 ? 5 : 10;
            const isActive = isInRange(days, minValue, option.value);

            return (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.quickDayButton,
                  isActive && styles.quickDayButtonActive,
                ]}
                onPress={() => setDays(option.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.quickDayLabel,
                    isActive && styles.quickDayLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.quickDayDescription,
                    isActive && styles.quickDayDescriptionActive,
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
            maximumValue={14}
            step={1}
            value={days}
            onValueChange={setDays}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#6366f1"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1 day</Text>
            <Text style={styles.sliderLabel}>14 days</Text>
          </View>
        </View>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.labelText}>Interests (optional)</Text>
        <View style={styles.interestsContainer}>
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
              >
                {isSelected ? (
                  <Check size={16} color="#fff" />
                ) : (
                  <Icon size={16} color="#666" />
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

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (!destination.trim() || isLoading) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isLoading || !destination.trim()}
        activeOpacity={0.7}
      >
        <Sparkles size={16} color="#fff" />
        <Text style={styles.submitButtonText}>
          {isLoading ? "Generating..." : "Generate Itinerary"}
        </Text>
      </TouchableOpacity>
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
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  daysValue: {
    color: "#6366f1",
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  quickDaysContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  quickDayButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  quickDayButtonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  quickDayLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  quickDayLabelActive: {
    color: "#fff",
  },
  quickDayDescription: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },
  quickDayDescriptionActive: {
    color: "#fff",
    opacity: 0.9,
  },
  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  interestButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  interestButtonActive: {
    backgroundColor: "#6366f1",
  },
  interestLabel: {
    fontSize: 14,
    color: "#666",
  },
  interestLabelActive: {
    color: "#fff",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
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
