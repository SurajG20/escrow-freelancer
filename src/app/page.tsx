"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Shield, Lock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-glass-border bg-glass/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">E</div>
            Escrow
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="sm" variant="glass" className="hidden sm:inline-flex">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-background to-background opacity-40" />
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Milestone escrow that <br className="hidden sm:block" />
              <span className="text-accent inline-block">actually feels good</span> to use.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8 leading-relaxed">
              Decentralized payments for freelancers and clients.
              Trustless, minimalist, and built for modern work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-accent/20">
                  Start an Escrow <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="h-12 px-8 text-base rounded-full">
                View Demo Project
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="mt-16 mx-auto max-w-5xl rounded-2xl border border-glass-border bg-glass/40 shadow-2xl backdrop-blur-sm p-4 sm:p-6"
          >
            {/* Mock Dashboard inside hero */}
            <div className="rounded-xl bg-white/50 dark:bg-black/20 overflow-hidden border border-glass-border">
              <div className="flex items-center gap-4 border-b border-glass-border px-4 py-3 bg-white/40 dark:bg-black/40">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div className="h-2 w-32 rounded-full bg-muted/20 mx-auto" />
              </div>
              <div className="p-8 grid gap-8 sm:grid-cols-3 text-left">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-3/4 bg-foreground/10 rounded-md animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-foreground/5 rounded-md" />
                    <div className="h-4 w-5/6 bg-foreground/5 rounded-md" />
                  </div>
                  <div className="mt-8 flex gap-3">
                    <div className="h-20 w-full rounded-xl border border-accent/20 bg-accent/5 p-4 flex flex-col justify-between">
                      <div className="h-2 w-1/3 bg-accent/20 rounded-full" />
                      <div className="h-6 w-1/2 bg-accent/10 rounded-md" />
                    </div>
                    <div className="h-20 w-full rounded-xl border border-border bg-glass p-4 flex flex-col justify-between">
                      <div className="h-2 w-1/3 bg-muted-foreground/20 rounded-full" />
                      <div className="h-6 w-1/2 bg-muted-foreground/10 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-glass-border bg-glass p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">Secure Vault</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-mono">$5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Released</span>
                      <span className="font-mono text-emerald-600">$2,000</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[40%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <Button className="w-full mt-2" size="sm">Approve Milestone</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white/50 border-t border-glass-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Escrow made simple</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">No complex DeFi jargon. Just deposit, work, and get paid.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "1. Deposit Funds", desc: "Client locks the project amount in a smart contract vault." },
              { icon: Zap, title: "2. Complete Milestones", desc: "Freelancer delivers work. Client approves. Funds release instantly." },
              { icon: Shield, title: "3. Dispute Protection", desc: "If things go wrong, neutral arbitrators resolve the dispute fairly." }
            ].map((step, i) => (
              <div key={i} className="relative group p-6 rounded-2xl bg-glass border border-transparent hover:border-glass-border transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Footer */}
      <section className="py-24 border-t border-glass-border">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-12">Trusted by builders on</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Solana', 'Ethereum', 'Base', 'Polygon'].map((chain) => (
              <span key={chain} className="text-xl font-bold flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-foreground" />
                {chain}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-glass-border bg-glass/30">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 Escrow Protocol. Open Source.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">Terms</Link>
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Github</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
