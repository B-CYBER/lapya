import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { NutritionChatbot } from "@/components/nutrition/NutritionChatbot";
import { streamChat } from "@/services/chat";
import type { ChatMessage } from "@/types/chat";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const INITIAL: Message = {
  id: "intro",
  sender: "bot",
  text: "Hi! I'm your AI nutrition assistant. Ask me anything about Nigerian foods, nutrition facts, or whether a meal is safe for your conditions. 🍲",
  timestamp: new Date(),
};

function toApiMessages(messages: Message[]): ChatMessage[] {
  return messages.map((m) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));
}

export function ChatbotRoute() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleSend = (text: string) => {
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date(),
    };
    const botId = `b-${Date.now() + 1}`;
    const botMessage: Message = {
      id: botId,
      sender: "bot",
      text: "",
      timestamp: new Date(),
    };
    const next: Message[] = [...messages, userMessage, botMessage];
    setMessages(next);
    setIsStreaming(true);

    const apiHistory = toApiMessages([...messages, userMessage]);
    abortRef.current = streamChat(apiHistory, {
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === botId ? { ...m, text: m.text + chunk } : m)),
        );
      },
      onDone: () => setIsStreaming(false),
      onError: (err) => {
        toast.error(err.message);
        setIsStreaming(false);
      },
    });
  };

  return (
    <NutritionChatbot
      onClose={() => navigate("/app")}
      messages={messages}
      onSend={handleSend}
      isStreaming={isStreaming}
    />
  );
}
