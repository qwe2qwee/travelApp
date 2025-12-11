import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const AnimatedTabButton = ({ children, isFocused, onPress, colors }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(scale.value, { damping: 15, stiffness: 150 }) },
        {
          translateY: withSpring(isFocused ? -4 : 0, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  React.useEffect(() => {
    scale.value = isFocused ? 1.1 : 1;
  }, [isFocused]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.tabButton}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {isFocused && (
          <View
            style={[styles.activeIndicator, { backgroundColor: colors.tint }]}
          />
        )}
        <View
          style={[
            styles.iconWrapper,
            isFocused && {
              backgroundColor: `${colors.tint}15`,
              borderColor: `${colors.tint}30`,
            },
          ]}
        >
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const TabBarBackground = () => {
    if (Platform.OS === "ios") {
      return (
        <BlurView
          intensity={80}
          tint={colorScheme ?? "light"}
          style={StyleSheet.absoluteFill}
        />
      );
    }
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.background },
        ]}
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarBackground: TabBarBackground,
        tabBarButton: (props) => {
          const { children, onPress, accessibilityState } = props;
          const isFocused = accessibilityState?.selected;

          return (
            <AnimatedTabButton
              isFocused={isFocused}
              onPress={onPress}
              colors={colors}
            >
              {children}
            </AnimatedTabButton>
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={24}
              name="house.fill"
              color={
                focused ? colors.tint : colors.tabIconDefault || colors.icon
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={24}
              name="map.fill"
              color={
                focused ? colors.tint : colors.tabIconDefault || colors.icon
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={24}
              name="paperplane.fill"
              color={
                focused ? colors.tint : colors.tabIconDefault || colors.icon
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    height: 70,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  iconContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  activeIndicator: {
    position: "absolute",
    top: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
