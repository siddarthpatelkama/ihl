"use client";

import { useState, useEffect } from "react";
import { useApiConfig } from "@/hooks/use-api-config";
import { AIConfig } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function SettingsPage() {
  const { config, saveConfig, isLoaded } = useApiConfig();
  const [localConfig, setLocalConfig] = useState<AIConfig>(config);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  // Sync local state once hook loads
  useEffect(() => {
    if (isLoaded) {
      setLocalConfig(config);
    }
  }, [isLoaded, config]);

  const handleChange = (field: keyof AIConfig, value: any) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
    setTestStatus("idle");
  };

  const handleSave = () => {
    saveConfig(localConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    
    // Simulate network delay for testing connection
    setTimeout(() => {
      if (localConfig.provider !== "Custom" && (!localConfig.apiKey || localConfig.apiKey.trim() === "")) {
        setTestStatus("error");
      } else {
        setTestStatus("success");
      }
    }, 1200);
  };

  if (!isLoaded) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">API Configuration</h1>
          <p className="text-muted-foreground">Manage your AI provider credentials and settings.</p>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10 space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">AI Provider</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={localConfig.provider}
                onChange={(e) => handleChange("provider", e.target.value)}
              >
                <option value="OpenAI" className="bg-background">OpenAI</option>
                <option value="Google Gemini" className="bg-background">Google Gemini</option>
                <option value="Anthropic" className="bg-background">Anthropic</option>
                <option value="OpenRouter" className="bg-background">OpenRouter</option>
                <option value="Custom" className="bg-background">Custom / Local</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">API Key</label>
              <div className="relative">
                <Input
                  type={showKey ? "text" : "password"}
                  value={localConfig.apiKey}
                  onChange={(e) => handleChange("apiKey", e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" />
                Your API key stays in your browser for this prototype and is never embedded into the application source code.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Model</label>
              <Input
                value={localConfig.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="e.g. gpt-4-turbo, gemini-1.5-pro"
              />
            </div>

            {localConfig.provider === "Custom" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">Base URL</label>
                <Input
                  value={localConfig.baseUrl || ""}
                  onChange={(e) => handleChange("baseUrl", e.target.value)}
                  placeholder="http://localhost:11434/v1"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleTestConnection} disabled={testStatus === "testing"}>
                {testStatus === "testing" ? "Testing..." : "Test Connection"}
              </Button>
              {testStatus === "success" && <span className="text-green-500 flex items-center gap-1 text-sm"><CheckCircle2 size={16}/> Connected</span>}
              {testStatus === "error" && <span className="text-red-500 flex items-center gap-1 text-sm"><XCircle size={16}/> Invalid Key</span>}
            </div>
            
            <div className="flex items-center gap-3">
              {isSaved && <span className="text-sm text-muted-foreground">Saved successfully</span>}
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
