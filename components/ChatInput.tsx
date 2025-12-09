// ============================================
// components/ChatInput.tsx
// ============================================
import { Send } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ask about traveling to Japan..."
        placeholderTextColor="#999"
        editable={!disabled && !isLoading}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!input.trim() || isLoading || disabled) && styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        disabled={!input.trim() || isLoading || disabled}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Send size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
});
