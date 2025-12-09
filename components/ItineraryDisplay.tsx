// ============================================
// components/ItineraryDisplay.tsx
// ============================================
import { ChevronDown, CloudSun, Moon, Sun } from "lucide-react-native";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Activity {
  time: string;
  activity: string;
  description: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryDisplayProps {
  itinerary: { days: Day[] };
  destination: string;
}

const getTimeIcon = (time: string) => {
  const lower = time.toLowerCase();
  if (lower.includes("morning")) return <Sun size={16} color="#f59e0b" />;
  if (lower.includes("afternoon"))
    return <CloudSun size={16} color="#f97316" />;
  return <Moon size={16} color="#6366f1" />;
};

export function ItineraryDisplay({
  itinerary,
  destination,
}: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (dayNum: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNum)) {
        newSet.delete(dayNum);
      } else {
        newSet.add(dayNum);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.destinationTitle}>{destination}</Text>
        <Text style={styles.subtitle}>
          {itinerary.days.length}-day itinerary
        </Text>
      </View>

      <View style={styles.accordionContainer}>
        {itinerary.days.map((day) => (
          <View key={day.day} style={styles.accordionItem}>
            <TouchableOpacity
              style={styles.accordionTrigger}
              onPress={() => toggleDay(day.day)}
              activeOpacity={0.7}
            >
              <View style={styles.dayHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day.day}</Text>
                </View>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Animated.View
                  style={{
                    transform: [
                      { rotate: expandedDays.has(day.day) ? "180deg" : "0deg" },
                    ],
                  }}
                >
                  <ChevronDown size={20} color="#666" />
                </Animated.View>
              </View>
            </TouchableOpacity>

            {expandedDays.has(day.day) && (
              <View style={styles.accordionContent}>
                {day.activities.map((activity, idx) => (
                  <View key={idx} style={styles.activityCard}>
                    <View style={styles.activityContent}>
                      <View style={styles.timeIconContainer}>
                        {getTimeIcon(activity.time)}
                      </View>
                      <View style={styles.activityDetails}>
                        <Text style={styles.activityTime}>
                          {activity.time.toUpperCase()}
                        </Text>
                        <Text style={styles.activityName}>
                          {activity.activity}
                        </Text>
                        <Text style={styles.activityDescription}>
                          {activity.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingBottom: 16,
  },
  destinationTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  accordionContainer: {
    gap: 12,
  },
  accordionItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },
  accordionTrigger: {
    padding: 16,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  dayBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
  },
  dayTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  accordionContent: {
    paddingLeft: 44,
    paddingRight: 16,
    paddingBottom: 16,
    gap: 12,
  },
  activityCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
  },
  activityContent: {
    flexDirection: "row",
    gap: 12,
  },
  timeIconContainer: {
    marginTop: 2,
  },
  activityDetails: {
    flex: 1,
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: "500",
    color: "#666",
    letterSpacing: 0.5,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  activityDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
