// ============================================
// hooks/useChat.ts
// ============================================
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Initialize or load existing conversation
  useEffect(() => {
    if (!user) return;

    const initConversation = async () => {
      // Try to find existing conversation for this user
      const { data: existingConv } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv) {
        setConversation({
          id: existingConv.id,
          user_id: existingConv.user_id!,
        });
        // Load messages
        const { data: msgs } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", existingConv.id)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(msgs as Message[]);
        }
      } else {
        // Create new conversation
        const { data: newConv, error } = await supabase
          .from("conversations")
          .insert({ user_id: user.id, session_id: user.id })
          .select()
          .single();

        if (newConv) {
          setConversation({ id: newConv.id, user_id: newConv.user_id! });
        }
        if (error) {
          console.error("Error creating conversation:", error);
        }
      }
    };

    initConversation();
  }, [user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversation || !content.trim()) return;

      setIsLoading(true);
      setError(null);

      // Add user message optimistically
      const userMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "user",
        content: content.trim(),
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        // Save user message to database
        await supabase.from("messages").insert({
          conversation_id: conversation.id,
          role: "user",
          content: content.trim(),
        });

        // Send to AI
        const response = await supabase.functions.invoke("japan-chat", {
          body: {
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        const aiContent =
          response.data?.message ||
          "Sorry, an error occurred. Please try again.";

        // Add AI message
        const aiMessage: Message = {
          id: Math.random().toString(36).substring(7),
          role: "assistant",
          content: aiContent,
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Save AI message to database
        await supabase.from("messages").insert({
          conversation_id: conversation.id,
          role: "assistant",
          content: aiContent,
        });
      } catch (err) {
        console.error("Error sending message:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        // Remove the optimistic user message on error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [conversation, messages]
  );

  const clearChat = useCallback(async () => {
    if (!conversation) return;

    // Delete messages from database
    await supabase
      .from("messages")
      .delete()
      .eq("conversation_id", conversation.id);

    setMessages([]);
  }, [conversation]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
};
