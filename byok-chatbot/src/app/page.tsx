"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Key, Bot, MessageSquare, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Navbar */}
      <header className="fixed top-0 w-full border-b border-white/5 bg-background/50 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Bot size={18} />
            </div>
            BYOK Space
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/settings">Configure</Link>
            </Button>
            <Button asChild>
              <Link href="/chat">Start Chatting</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Your AI. Your Key. <br /> Your Control.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A simple, private AI workspace where you bring your own API key and chat with powerful AI models on your own terms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/chat">
                Start Chatting <ArrowRight size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <a href="#how-it-works">How It Works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-card/30 border-y border-white/5">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bring Your Own Key</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Three simple steps to unlock a private, personalized AI experience without subscriptions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="relative glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 border border-white/10 text-xl font-bold">
                01
              </div>
              <Key className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Add your API key</h3>
              <p className="text-muted-foreground">Securely provide your own API key. It stays in your browser and is never sent to our servers.</p>
            </div>

            <div className="relative glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 border border-white/10 text-xl font-bold">
                02
              </div>
              <Bot className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Choose your model</h3>
              <p className="text-muted-foreground">Select from top-tier models like GPT-4, Claude, or Gemini depending on your provider.</p>
            </div>

            <div className="relative glass p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6 border border-white/10 text-xl font-bold">
                03
              </div>
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Start chatting</h3>
              <p className="text-muted-foreground">Send messages directly through the configured provider with full privacy and control.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built for experimentation</h2>
            <p className="text-muted-foreground">A clean workspace to test, compare, and build with various AI models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-card hover:border-white/20 transition-colors">
              <ShieldCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Bring Your Own Key</h3>
              <p className="text-muted-foreground text-sm">Use your own provider credentials. You only pay for exactly what you use directly to the AI provider.</p>
            </div>
            
            <div className="p-6 rounded-xl border border-white/10 bg-card hover:border-white/20 transition-colors">
              <Bot className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Model Freedom</h3>
              <p className="text-muted-foreground text-sm">Switch seamlessly between supported AI models without changing your chat interface or workflow.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-card hover:border-white/20 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Simple & Private</h3>
              <p className="text-muted-foreground text-sm">Keep your configuration under your control. All API calls happen directly from your client to the provider.</p>
            </div>
          </div>
          
          <div className="mt-20 text-center">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/settings">
                Start Building with AI <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-white/10 text-center text-muted-foreground text-sm">
        <p>Your AI. Your Key. Your Control.</p>
      </footer>
    </div>
  );
}
