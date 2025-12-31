// ============================================
// components/ChatMessage.tsx
// ============================================
import { Bot } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.messageContainer,
        isUser ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      {/* Avatar code remains but hidden via style if desired, or we can remove it. User asked to "improve it". Cleaner usually means no avatar inside the bubble. Use simple bubbles. */}
      {/* Actually, let's keep the avatar logic but maybe put it outside? No, let's just Hide it for now as per style. */}
      {/* Wait, the previous code had View inside View. Let's simplify. */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Bot size={16} color="#6366f1" />
        </View>
      )}

      <View style={styles.contentContainer}>
        <Markdown style={markdownStyles}>{content}</Markdown>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: "#6366f1", // Primary Color
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: "#fff", // White for clean look
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    display: "none", // Hide avatar inside bubble, usually shown outside or not needed if alignment is clear
  },
  userAvatar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  assistantAvatar: {
    backgroundColor: "#ede9fe",
  },
  contentContainer: {
    flex: 1,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: "#000",
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  list_item: {
    marginTop: 0,
    marginBottom: 4,
  },
});
