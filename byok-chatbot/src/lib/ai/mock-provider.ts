import { AIProvider, AIConfig, Message, AIResponse } from "./types";

export class MockAIProvider implements AIProvider {
  async chat(messages: Message[], config: AIConfig): Promise<AIResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lastMessage = messages[messages.length - 1]?.content || "";

    return {
      content: `This is a mock response from ${config.provider} (${config.model}). You said: "${lastMessage}".\n\nTo connect a real API, implement the specific provider class in \`lib/ai\`.`,
      usage: {
        promptTokens: 10,
        completionTokens: 25,
        totalTokens: 35,
      },
    };
  }

  async streamChat(
    messages: Message[],
    config: AIConfig,
    onUpdate: (chunk: string) => void
  ): Promise<void> {
    const lastMessage = messages[messages.length - 1]?.content || "";
    const responseText = `This is a streamed mock response from ${config.provider} (${config.model}).\n\nYou said: "${lastMessage}".\n\nHere is a quick code block:\n\n\`\`\`javascript\nconsole.log("Hello BYOK!");\n\`\`\`\n\nEnd of mock response.`;
    const words = responseText.split(" ");

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      onUpdate(word + " ");
    }
  }
}

// TODO: Connect actual provider API implementations here
// e.g. export class OpenAIProvider implements AIProvider { ... }
