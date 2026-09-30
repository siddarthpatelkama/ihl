"use client";

import { useChat } from "@/hooks/use-chat";
import { useApiConfig } from "@/hooks/use-api-config";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, Bot, User, Square, RefreshCcw, Paperclip, AlertCircle, Settings, ImageIcon, X
} from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MessageAttachment } from "@/lib/ai/types";

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [sessionId, setSessionId] = useState(() => id || "new_session_" + Date.now());

  useEffect(() => {
    if (id) {
      setSessionId(id);
    } else {
      // If we navigate to /chat without an ID (e.g. New Chat)
      setSessionId("new_session_" + Date.now());
    }
  }, [id]);
  
  const { messages, sendMessage, regenerate, isGenerating, stopGeneration, error, clearChat } = useChat(sessionId);
  const { config, isLoaded } = useApiConfig();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!id && messages.length > 0) {
      // Update URL to include the new session ID without reloading
      router.replace(`/chat?id=${sessionId}`);
    }
  }, [id, messages.length, router, sessionId]);

  const handleSend = () => {
    if ((input.trim() || attachments.length > 0) && !isGenerating) {
      sendMessage(input.trim(), attachments.length > 0 ? attachments : undefined);
      setInput("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only images are supported currently.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachments(prev => [...prev, {
        type: "image",
        url: reader.result as string,
        mimeType: file.type
      }]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!isLoaded) return <div className="flex-1 p-8 text-center text-muted-foreground">Loading workspace...</div>;

  const isConfigured = config.provider === "Custom" || !!config.apiKey;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
      {/* Chat Header */}
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-card/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{config.provider}</span>
          <span>•</span>
          <span>{config.model}</span>
        </div>
        
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground">
            Clear Chat
          </Button>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {!isConfigured && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">API Not Configured</h2>
            <p className="text-muted-foreground mb-6">
              Please configure your API provider and key to start chatting.
            </p>
            <Button asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Go to Settings
              </Link>
            </Button>
          </div>
        )}

        {isConfigured && messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">How can I help you today?</h2>
            <p className="text-muted-foreground max-w-sm">
              Your messages will be processed securely using your configured API key.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
              {[
                "Explain neural networks simply",
                "Write a Next.js API route",
                "Help me debug Python code",
                "Brainstorm product names"
              ].map((suggestion) => (
                <button 
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/80 text-left text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-4 max-w-4xl mx-auto w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            
            <div 
              className={`rounded-2xl px-5 py-3.5 max-w-[85%] text-sm leading-relaxed
                ${msg.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border border-border/50 text-foreground"
                }`}
            >
              {/* Attachments rendering */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {msg.attachments.map((att, i) => (
                    att.type === "image" && (
                      <img key={i} src={att.url} alt="Uploaded attachment" className="max-w-[200px] max-h-[200px] rounded-lg border border-border object-cover" />
                    )
                  ))}
                </div>
              )}
              
              {/* Simple text rendering. In production, use react-markdown */}
              <div className="whitespace-pre-wrap font-sans">
                {msg.content || (isGenerating && idx === messages.length - 1 ? "..." : "")}
              </div>
              
              {msg.role === "assistant" && !isGenerating && idx === messages.length - 1 && (
                <div className="mt-4 pt-3 border-t border-border/50 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-muted-foreground px-2"
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                  >
                    Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-muted-foreground px-2 gap-1.5"
                    onClick={() => regenerate()}
                  >
                    <RefreshCcw className="w-3 h-3" /> Regenerate
                  </Button>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-foreground" />
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="max-w-4xl mx-auto w-full p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-background via-background to-transparent pt-10">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors pointer-events-none" />
          
          <div className="relative flex flex-col bg-card border border-border rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all p-2">
            
            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border-b border-border/50 mb-2">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group/att">
                    <img src={att.url} alt="Attachment" className="h-16 w-16 rounded-md object-cover border border-border" />
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover/att:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-muted-foreground rounded-xl flex-shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-5 h-5" />
              </Button>
              
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything or attach an image... (Shift + Enter for new line)"
                className="border-0 focus-visible:ring-0 px-1 py-2.5 resize-none bg-transparent min-h-[44px] max-h-60 overflow-y-auto"
                rows={1}
              />

            <div className="flex flex-col gap-2">
              {isGenerating ? (
                <Button 
                  onClick={stopGeneration} 
                  variant="destructive" 
                  size="icon" 
                  className="h-9 w-9 rounded-xl flex-shrink-0"
                >
                  <Square className="w-4 h-4 fill-current" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() && attachments.length === 0}
                  size="icon" 
                  className="h-9 w-9 rounded-xl flex-shrink-0 transition-all"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          </div>
          <div className="text-center mt-2 text-[11px] text-muted-foreground">
            AI can make mistakes. Check important info.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex-1 p-8 text-center text-muted-foreground">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
