// ============================================
// components/Itinerary/ItineraryDisplay.tsx
// ============================================
import {
  Check,
  ChevronDown,
  CloudSun,
  Copy,
  Moon,
  RefreshCw,
  Share2,
  Sun,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Clipboard,
  ScrollView,
  Share,
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
  onRegenerate?: () => void;
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
  onRegenerate,
}: ItineraryDisplayProps) {
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    const text = itinerary.days
      .map((day) => {
        const activities = day.activities
          .map((a) => `  ${a.time}: ${a.activity} - ${a.description}`)
          .join("\n");
        return `Day ${day.day}: ${day.title}\n${activities}`;
      })
      .join("\n\n");

    const fullText = `${destination} - ${itinerary.days.length}-day Itinerary\n\n${text}`;

    try {
      Clipboard.setString(fullText);
      setCopied(true);
      Alert.alert("Copied!", "Itinerary copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert("Failed to copy", "Please try again");
    }
  };

  const handleShare = async () => {
    try {
      const text = itinerary.days
        .map((day) => {
          const activities = day.activities
            .map((a) => `${a.time}: ${a.activity}`)
            .join("\n");
          return `Day ${day.day}: ${day.title}\n${activities}`;
        })
        .join("\n\n");

      await Share.share({
        message: `${destination} - ${itinerary.days.length}-day Itinerary\n\n${text}`,
      });
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ Your itinerary is ready!</Text>
        </View>
        <Text style={styles.title}>{destination}</Text>
        <Text style={styles.subtitle}>
          {itinerary.days.length}-day adventure awaits
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          {copied ? (
            <Check size={16} color="#22c55e" />
          ) : (
            <Copy size={16} color="#64748b" />
          )}
          <Text style={styles.actionButtonText}>
            {copied ? "Copied!" : "Copy"}
          </Text>
        </TouchableOpacity>

        {onRegenerate && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onRegenerate}
            activeOpacity={0.7}
          >
            <RefreshCw size={16} color="#64748b" />
            <Text style={styles.actionButtonText}>Regenerate</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Share2 size={16} color="#64748b" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Itinerary Days */}
      <View style={styles.daysContainer}>
        {itinerary.days.map((day, dayIndex) => (
          <View key={day.day} style={styles.dayCard}>
            <TouchableOpacity
              style={styles.dayHeader}
              onPress={() => toggleDay(day.day)}
              activeOpacity={0.7}
            >
              <View style={styles.dayHeaderContent}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day.day}</Text>
                </View>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>
              <View
                style={{
                  transform: [
                    { rotate: expandedDays.has(day.day) ? "180deg" : "0deg" },
                  ],
                }}
              >
                <ChevronDown size={20} color="#64748b" />
              </View>
            </TouchableOpacity>

            {expandedDays.has(day.day) && (
              <View style={styles.activitiesContainer}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#ede9fe",
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6366f1",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
  },
  daysContainer: {
    gap: 12,
  },
  dayCard: {
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  dayHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dayBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  activitiesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 48,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  activityDetails: {
    flex: 1,
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  activityDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});
