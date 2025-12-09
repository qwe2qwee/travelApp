// ============================================
// screens/ChatContainer.tsx
// ============================================
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { LogOut, MapPin, Trash2 } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatContainerProps {
  navigation: any;
}

export const ChatContainer = ({ navigation }: ChatContainerProps) => {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { user, signOut } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const handleClear = () => {
    Alert.alert("Clear Chat", "Are you sure you want to delete all messages?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          clearChat();
          Alert.alert("Cleared", "All messages have been deleted");
        },
      },
    ]);
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          navigation.navigate("Auth");
        },
      },
    ]);
  };

  const suggestions = [
    "Best time to visit Tokyo?",
    "How to use JR Pass?",
    "Halal restaurants in Osaka",
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleClear}
              disabled={messages.length === 0}
              activeOpacity={0.7}
            >
              <Trash2
                size={20}
                color={messages.length === 0 ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Japan Travel Assistant</Text>
              <Text style={styles.headerSubtitle}>{user?.email} 🇯🇵</Text>
            </View>
            <View style={styles.headerIcon}>
              <MapPin size={20} color="#6366f1" />
            </View>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyEmoji}>🗾</Text>
              </View>
              <Text style={styles.emptyTitle}>Welcome!</Text>
              <Text style={styles.emptySubtitle}>
                I'm your Japan travel assistant. Ask me about places,
                transportation, food, or anything else!
              </Text>
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionButton}
                    onPress={() => sendMessage(suggestion)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingDot} />
              <View style={[styles.loadingDot, styles.loadingDot2]} />
              <View style={[styles.loadingDot, styles.loadingDot3]} />
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  headerInfo: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ede9fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    maxWidth: 300,
    marginBottom: 16,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  suggestionText: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flexDirection: "row",
    gap: 4,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    maxWidth: "85%",
    alignSelf: "flex-start",
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
  },
  loadingDot2: {
    opacity: 0.6,
  },
  loadingDot3: {
    opacity: 0.3,
  },
});

export default ChatContainer;
