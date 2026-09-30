import { AIProvider, AIConfig, Message, AIResponse } from "./types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  async chat(messages: Message[], config: AIConfig): Promise<AIResponse> {
    if (!config.apiKey) {
      throw new Error("API key is required for Google Gemini");
    }

    const genAI = new GoogleGenerativeAI(config.apiKey);
    const sanitizedModel = config.model.trim().toLowerCase().replace(/\s+/g, '-');
    const model = genAI.getGenerativeModel({ model: sanitizedModel });

    const systemInstruction = messages.find(m => m.role === "system")?.content;
    const history = messages.filter(m => m.role !== "system");
    
    const parseParts = (msg: Message) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachments) {
        for (const att of msg.attachments) {
          if (att.type === "image" && att.url.includes("base64,")) {
            parts.push({
              inlineData: {
                data: att.url.split(",")[1],
                mimeType: att.mimeType
              }
            });
          }
        }
      }
      return parts;
    };

    const formattedHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: parseParts(msg)
    }));

    const lastMessageObj = history[history.length - 1];
    const lastMessageParts = lastMessageObj ? parseParts(lastMessageObj) : [{ text: "" }];

    const chatSession = model.startChat({
      history: formattedHistory as any,
      systemInstruction,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      }
    });

    const result = await chatSession.sendMessage(lastMessageParts as any);
    const responseText = result.response.text();

    return {
      content: responseText,
      usage: {
        promptTokens: result.response.usageMetadata?.promptTokenCount || 0,
        completionTokens: result.response.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: result.response.usageMetadata?.totalTokenCount || 0,
      }
    };
  }

  async streamChat(
    messages: Message[],
    config: AIConfig,
    onUpdate: (chunk: string) => void
  ): Promise<void> {
    if (!config.apiKey) {
      throw new Error("API key is required for Google Gemini");
    }

    const genAI = new GoogleGenerativeAI(config.apiKey);
    const sanitizedModel = config.model.trim().toLowerCase().replace(/\s+/g, '-');
    const model = genAI.getGenerativeModel({ model: sanitizedModel });

    const systemInstruction = messages.find(m => m.role === "system")?.content;
    const history = messages.filter(m => m.role !== "system");
    
    const parseParts = (msg: Message) => {
      const parts: any[] = [{ text: msg.content }];
      if (msg.attachments) {
        for (const att of msg.attachments) {
          if (att.type === "image" && att.url.includes("base64,")) {
            parts.push({
              inlineData: {
                data: att.url.split(",")[1],
                mimeType: att.mimeType
              }
            });
          }
        }
      }
      return parts;
    };

    const formattedHistory = history.slice(0, -1).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: parseParts(msg)
    }));

    const lastMessageObj = history[history.length - 1];
    const lastMessageParts = lastMessageObj ? parseParts(lastMessageObj) : [{ text: "" }];

    const chatSession = model.startChat({
      history: formattedHistory as any,
      systemInstruction,
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens,
      }
    });

    const result = await chatSession.sendMessageStream(lastMessageParts as any);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onUpdate(chunkText);
    }
  }
}
