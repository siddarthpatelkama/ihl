import { useState, useCallback, useEffect } from "react";
import { Message } from "@/lib/ai/types";
import { useApiConfig } from "./use-api-config";
import { MockAIProvider } from "@/lib/ai/mock-provider";

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export function useChat(sessionId?: string) {
  const { config, isLoaded } = useApiConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from local storage based on sessionId
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    const saved = localStorage.getItem(`chat_${sessionId}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved chat", e);
      }
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  // Save to local storage when messages change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
      
      // Update recent sessions list
      const recentStr = localStorage.getItem("recent_sessions") || "[]";
      let recent: ChatSession[] = [];
      try {
        recent = JSON.parse(recentStr);
      } catch (e) {}

      const title = messages[0]?.content.slice(0, 30) || "New Conversation";
      const existingIdx = recent.findIndex(s => s.id === sessionId);
      
      if (existingIdx >= 0) {
        recent[existingIdx].updatedAt = Date.now();
        recent[existingIdx].title = title;
      } else {
        recent.unshift({
          id: sessionId,
          title,
          messages: [],
          updatedAt: Date.now()
        });
      }
      
      localStorage.setItem("recent_sessions", JSON.stringify(recent));
    }
  }, [messages, sessionId]);

  const sendMessage = useCallback(
    async (content: string, attachments?: MessageAttachment[]) => {
      if ((!content.trim() && (!attachments || attachments.length === 0)) || isGenerating || !isLoaded) return;

      const newUserMessage: Message = { role: "user", content, attachments };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);
      setIsGenerating(true);
      setError(null);

      try {
        if (!config.apiKey && config.provider !== "Custom") {
          throw new Error("Please configure your API key in settings first.");
        }

        let provider: AIProvider;
        if (config.provider === "Google Gemini" || (config.apiKey && config.apiKey.startsWith("AIza"))) {
          const { GeminiProvider } = await import("@/lib/ai/gemini");
          provider = new GeminiProvider();
        } else {
          // If they are on OpenAI but we haven't built the real OpenAI integration yet
          if (config.provider !== "Custom" && config.apiKey) {
             throw new Error(`You have an API key configured for ${config.provider}, but we have only implemented the real API for "Google Gemini" in this prototype. Please go to Settings and switch the provider to Google Gemini.`);
          }
          provider = new MockAIProvider(); 
        }
        
        // Setup empty assistant message for streaming
        setMessages([...newMessages, { role: "assistant", content: "" }]);
        
        await provider.streamChat!(newMessages, config, (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              // Create a new object to avoid mutating state directly (fixes Strict Mode double chunks)
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            } else {
              updated.push({ role: "assistant", content: chunk });
            }
            return updated;
          });
        });
      } catch (err: any) {
        setError(err.message || "Failed to generate response");
        // Remove the empty assistant message if it failed
        setMessages(newMessages);
      } finally {
        setIsGenerating(false);
      }
    },
    [messages, isGenerating, isLoaded, config]
  );

  const regenerate = useCallback(async () => {
    if (isGenerating || !isLoaded || messages.length === 0) return;

    const lastUserIdx = [...messages].reverse().findIndex(m => m.role === "user");
    if (lastUserIdx === -1) return;
    
    const actualIdx = messages.length - 1 - lastUserIdx;
    const newMessages = messages.slice(0, actualIdx + 1);
    
    setMessages(newMessages);
    setIsGenerating(true);
    setError(null);

    try {
      if (!config.apiKey && config.provider !== "Custom") {
        throw new Error("Please configure your API key in settings first.");
      }

      let provider: AIProvider;
      if (config.provider === "Google Gemini" || (config.apiKey && config.apiKey.startsWith("AIza"))) {
        const { GeminiProvider } = await import("@/lib/ai/gemini");
        provider = new GeminiProvider();
      } else {
        if (config.provider !== "Custom" && config.apiKey) {
           throw new Error(`You have an API key configured for ${config.provider}, but we have only implemented the real API for "Google Gemini" in this prototype. Please go to Settings and switch the provider to Google Gemini.`);
        }
        const { MockAIProvider } = await import("@/lib/ai/mock-provider");
        provider = new MockAIProvider(); 
      }
      
      setMessages([...newMessages, { role: "assistant", content: "" }]);
      
      await provider.streamChat!(newMessages, config, (chunk) => {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          } else {
            updated.push({ role: "assistant", content: chunk });
          }
          return updated;
        });
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate response");
      setMessages(newMessages);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, isGenerating, isLoaded, config]);

  const stopGeneration = () => {
    setIsGenerating(false);
    // Note: actual abort controller logic would be needed for a real API
  };

  const clearChat = () => {
    setMessages([]);
    if (sessionId) {
      localStorage.removeItem(`chat_${sessionId}`);
    }
  };

  return {
    messages,
    sendMessage,
    regenerate,
    isGenerating,
    error,
    stopGeneration,
    clearChat
  };
}
