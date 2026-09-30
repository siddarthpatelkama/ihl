import { useState, useEffect } from "react";
import { AIConfig } from "@/lib/ai/types";

const STORAGE_KEY = "byok_ai_config";

const defaultConfig: AIConfig = {
  provider: process.env.NEXT_PUBLIC_DEFAULT_PROVIDER || "OpenAI",
  apiKey: "",
  model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || "gpt-4-turbo",
  temperature: 0.7,
  maxTokens: 2048,
};

export function useApiConfig() {
  const [config, setConfig] = useState<AIConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Force upgrade legacy mock configs to the real Gemini integration
        if (parsed.provider === "OpenAI" && !parsed.apiKey) {
          parsed.provider = "Google Gemini";
          parsed.model = "gemini-1.5-pro";
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        setConfig(parsed);
      }
    } catch (e) {
      console.error("Failed to load config from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const saveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error("Failed to save config to localStorage", e);
    }
  };

  const clearConfig = () => {
    setConfig(defaultConfig);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear config from localStorage", e);
    }
  };

  return { config, saveConfig, clearConfig, isLoaded };
}
