import { useEffect, useState } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  isCircle: boolean;
  rotation: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  opacity: Animated.Value;
}

export function Confetti({ isActive }: { isActive: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const colors = [
        "#6366f1", // Primary (Indigo)
        "#8b5cf6", // Accent (Purple)
        "#fbbf24", // Gold/Yellow
        "#ec4899", // Pink
        "#10b981", // Green
      ];

      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2,
        isCircle: Math.random() > 0.5,
        rotation: new Animated.Value(0),
        translateY: new Animated.Value(0),
        translateX: new Animated.Value(0),
        opacity: new Animated.Value(1),
      }));

      setPieces(newPieces);

      // Start animations for each piece
      newPieces.forEach((piece) => {
        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 100;

        Animated.parallel([
          // Fall down
          Animated.timing(piece.translateY, {
            toValue: SCREEN_HEIGHT + 50,
            duration: piece.duration * 1000,
            delay: piece.delay * 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          // Horizontal drift
          Animated.timing(piece.translateX, {
            toValue: drift,
            duration: piece.duration * 1000,
            delay: piece.delay * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          // Rotation
          Animated.timing(piece.rotation, {
            toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
            duration: piece.duration * 1000,
            delay: piece.delay * 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Fade out at the end
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: 500,
            delay: piece.delay * 1000 + piece.duration * 1000 - 500,
            useNativeDriver: true,
          }),
        ]).start();
      });

      // Clear pieces after animation
      const timer = setTimeout(() => setPieces([]), 3500);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!pieces.length) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.piece,
            piece.isCircle ? styles.circle : styles.square,
            {
              left: `${piece.x}%`,
              backgroundColor: piece.color,
              opacity: piece.opacity,
              transform: [
                { translateY: piece.translateY },
                { translateX: piece.translateX },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    overflow: "hidden",
  },
  piece: {
    position: "absolute",
    top: -20,
    width: 10,
    height: 10,
  },
  circle: {
    borderRadius: 5,
  },
  square: {
    borderRadius: 2,
  },
});
