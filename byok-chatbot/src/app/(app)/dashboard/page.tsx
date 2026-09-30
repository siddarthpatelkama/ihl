"use client";

import { useApiConfig } from "@/hooks/use-api-config";
import { MessageSquare, Zap, HardDrive, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatSession } from "@/hooks/use-chat";

export default function DashboardPage() {
  const { config, isLoaded } = useApiConfig();
  const [stats, setStats] = useState({
    conversations: 0,
    messages: 0,
  });

  useEffect(() => {
    try {
      const recentStr = localStorage.getItem("recent_sessions");
      if (recentStr) {
        const sessions: ChatSession[] = JSON.parse(recentStr);
        setStats({
          conversations: sessions.length,
          messages: sessions.reduce((acc, s) => acc + (s.messages?.length || 0), 0)
        });
      }
    } catch (e) {}
  }, []);

  if (!isLoaded) return <div className="p-8">Loading...</div>;

  const isConnected = !!config.apiKey || config.provider === "Custom";

  return (
    <div className="flex-1 overflow-auto bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your AI workspace usage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-xl border border-white/10 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Conversations</h3>
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{stats.conversations}</div>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Messages</h3>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{stats.messages.toLocaleString()}</div>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Current Model</h3>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold truncate" title={config.model}>
              {config.model}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <HardDrive className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <div className="text-lg font-bold">
                {isConnected ? "Connected" : "Not connected"}
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-white/10 mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {stats.conversations === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No conversations yet. Start chatting to see your activity.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Your recent conversations are securely stored in your browser's local storage.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
