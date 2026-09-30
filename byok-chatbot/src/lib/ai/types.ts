export interface AIConfig {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface MessageAttachment {
  type: "image";
  url: string; // base64 string
  mimeType: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  attachments?: MessageAttachment[];
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  chat(messages: Message[], config: AIConfig): Promise<AIResponse>;
  streamChat?(messages: Message[], config: AIConfig, onUpdate: (chunk: string) => void): Promise<void>;
}
