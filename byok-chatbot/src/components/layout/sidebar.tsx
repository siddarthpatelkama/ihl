"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, LayoutDashboard, Settings, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ChatSession } from "@/hooks/use-chat";

export function Sidebar() {
  const pathname = usePathname();
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    const loadRecent = () => {
      try {
        const stored = localStorage.getItem("recent_sessions");
        if (stored) {
          setRecentSessions(JSON.parse(stored));
        }
      } catch (e) {}
    };
    
    loadRecent();
    window.addEventListener("storage", loadRecent);
    return () => window.removeEventListener("storage", loadRecent);
  }, []);

  const navItems = [
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col h-full">
      <div className="p-4">
        <Link href="/">
          <div className="font-bold text-lg mb-6 tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
              AI
            </div>
            BYOK Space
          </div>
        </Link>
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/chat">
            <PlusCircle className="w-4 h-4" />
            New Chat
          </Link>
        </Button>
      </div>

      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>

        {recentSessions.length > 0 && (
          <div>
            <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Recent
            </h4>
            <div className="space-y-1">
              {recentSessions.slice(0, 10).map((session) => (
                <Link
                  key={session.id}
                  href={`/chat?id=${session.id}`}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-md truncate transition-colors"
                >
                  {session.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground">
        Prototype Mode
      </div>
    </div>
  );
}
