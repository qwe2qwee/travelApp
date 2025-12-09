// ============================================
// components/ChatMessage.tsx
// ============================================
import { Bot, User } from "lucide-react-native";
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
      <View
        style={[
          styles.avatarContainer,
          isUser ? styles.userAvatar : styles.assistantAvatar,
        ]}
      >
        {isUser ? (
          <User size={16} color={isUser ? "#6366f1" : "#fff"} />
        ) : (
          <Bot size={16} color="#6366f1" />
        )}
      </View>
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
    padding: 16,
    borderRadius: 16,
    maxWidth: "85%",
  },
  userMessage: {
    backgroundColor: "#6366f1",
    alignSelf: "flex-end",
  },
  assistantMessage: {
    backgroundColor: "#f3f4f6",
    alignSelf: "flex-start",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
