import {
  TabList,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from "expo-router/ui";
import {
  CalendarDays,
  Home,
  Map,
  MessageCircle,
  PlusCircle,
} from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";

import { Colors } from "@/constants/theme";

const colors = Colors.light;

/* ================= TAB BUTTON ================= */

type TabButtonProps = TabTriggerSlotProps & {
  icon: React.ComponentType<{ size: number; color: string }>;
  isPrimary?: boolean;
};

const TabButton = React.memo(
  React.forwardRef<React.ElementRef<typeof TouchableOpacity>, TabButtonProps>(
    ({ icon: Icon, isFocused, isPrimary, ...props }, ref) => {
      // @ts-ignore: delayLongPress and disabled type mismatch fix
      const { delayLongPress, disabled, ...otherProps } = props;

      return (
        <TouchableOpacity
          ref={ref}
          {...(otherProps as any)}
          delayLongPress={
            typeof delayLongPress === "number" ? delayLongPress : undefined
          }
          disabled={disabled === null ? undefined : disabled}
          activeOpacity={0.8}
          style={[styles.tabButton, isPrimary && styles.primaryButton]}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              isPrimary && {
                backgroundColor: colors.tint,
                borderWidth: 4,
                borderColor: "#FFF",
              },
            ]}
          >
            <Icon
              size={isPrimary ? 28 : 24}
              color={isPrimary ? "#FFF" : isFocused ? colors.tint : "#A0A0A0"}
            />
          </Animated.View>

          {isFocused && !isPrimary && (
            <View
              style={[styles.activeDot, { backgroundColor: colors.tint }]}
            />
          )}
        </TouchableOpacity>
      );
    }
  )
);

TabButton.displayName = "TabButton";

/* ================= LAYOUT ================= */

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs>
        {/* SCREENS */}
        <TabSlot />

        {/* CUSTOM FLOATING TAB BAR */}
        <View style={styles.tabBar}>
          <TabTrigger name="index" href="/" asChild>
            <TabButton icon={Home} />
          </TabTrigger>

          <TabTrigger name="map" href="/map" asChild>
            <TabButton icon={Map} />
          </TabTrigger>

          <TabTrigger name="create" href="/create" asChild>
            <TabButton icon={PlusCircle} isPrimary />
          </TabTrigger>

          <TabTrigger name="chat" href="/chat" asChild>
            <TabButton icon={MessageCircle} />
          </TabTrigger>

          <TabTrigger name="itinerary" href="/itinerary" asChild>
            <TabButton icon={CalendarDays} />
          </TabTrigger>
        </View>

        {/* REQUIRED — HIDDEN TAB LIST */}
        <TabList style={{ display: "none" }}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="map" href="/map" />
          <TabTrigger name="create" href="/create" />
          <TabTrigger name="chat" href="/chat" />
          <TabTrigger name="itinerary" href="/itinerary" />
        </TabList>
      </Tabs>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "#FFF",
    borderRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 10,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  primaryButton: {
    marginBottom: 30,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  activeDot: {
    position: "absolute",
    bottom: 12,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
